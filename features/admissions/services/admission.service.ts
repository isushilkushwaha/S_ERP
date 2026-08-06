// features/admissions/services/admission.service.ts

import { PrismaClient, Prisma, StudentStatus } from "@prisma/client";
import { AdmissionRepository } from "../repositories/admission.repository";
import { AdmissionNumberService } from "./admission-number.service";
import { RollNumberService } from "./roll-number.service";
import { 
  CreateAdmissionPayloadDTO, 
  AdmissionResponseDTO,
  StudentRegistrationSummaryDTO 
} from "../dto/admission.dto";
import {
  StudentNotFoundError,
  AlreadyEnrolledError,
  RollNumberConflictError,
  MissingFeeStructureError,
  AdmissionDomainError
} from "../errors/admission.errors";

export class AdmissionService {
  private repository: AdmissionRepository;
  private admissionNumberService: AdmissionNumberService;
  private rollNumberService: RollNumberService;

  constructor(private readonly prisma: PrismaClient) {
    this.repository = new AdmissionRepository(prisma);
    this.admissionNumberService = new AdmissionNumberService();
    this.rollNumberService = new RollNumberService();
  }

  /**
   * Search registered students eligible for enrollment along with their active academic status.
   */
  async searchRegisteredStudents(
    tenantId: string, 
    query?: string
  ): Promise<StudentRegistrationSummaryDTO[]> {
    const students = await this.prisma.student.findMany({
      where: {
        deletedAt: null,
        ...(query && {
          OR: [
            { studentCode: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { fatherName: { contains: query, mode: "insensitive" } },
            { motherName: { contains: query, mode: "insensitive" } },
            { fatherMobile: { contains: query, mode: "insensitive" } },
            { mobile: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { aadhaarNumber: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        studentCode: true,
        firstName: true,
        middleName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        fatherName: true,
        motherName: true,
        fatherMobile: true,
        mobile: true,
        email: true,
        photo: true,
        aadhaarNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        registrationDate: true,
        enrollments: {
          where: {
            status: "ACTIVE",
          },
          include: {
            academicYear: {
              select: {
                id: true,
                name: true,
              },
            },
            class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    return students.map((s) => ({
      id: s.id,
      studentCode: s.studentCode,
      firstName: s.firstName,
      middleName: s.middleName ?? null,
      lastName: s.lastName ?? null,
      dateOfBirth: s.dateOfBirth ?? null,
      gender: s.gender ?? null,
      fatherName: s.fatherName,
      motherName: s.motherName ?? null,
      fatherMobile: s.fatherMobile ?? null,
      mobile: s.mobile ?? null,
      email: s.email ?? null,
      photo: s.photo ?? null,
      aadhaarNumber: s.aadhaarNumber ?? null,
      addressLine1: s.addressLine1 ?? null,
      addressLine2: s.addressLine2 ?? null,
      city: s.city ?? null,
      state: s.state ?? null,
      postalCode: s.postalCode ?? null,
      registrationDate: s.registrationDate ?? null,
      hasActiveEnrollment: s.enrollments.length > 0,
      enrollments: s.enrollments.map((e) => ({
        id: e.id,
        academicYearId: e.academicYearId,
        academicYearName: e.academicYear.name,
        className: e.class.name,
        status: e.status,
      })),
    }));
  }

  /**
   * Load active Fee Structure mapping for auto-assignment.
   */
  async getFeeStructureForClass(
    tenantId: string,
    academicYearId: string,
    classId: string
  ) {
    const structure = await this.repository.findActiveFeeStructure(
      tenantId,
      academicYearId,
      classId
    );

    if (!structure) {
      throw new MissingFeeStructureError();
    }

    return structure;
  }

  /**
   * Executes full admission workflow in an atomic Prisma transaction with retry handling.
   */
  async processAdmission(
    payload: CreateAdmissionPayloadDTO
  ): Promise<AdmissionResponseDTO> {
    // 1. Pre-validation: Verify Student Existence
    const student = await this.prisma.student.findUnique({
      where: { id: payload.studentId, deletedAt: null },
      select: { id: true, studentCode: true, firstName: true, lastName: true },
    });

    if (!student) {
      throw new StudentNotFoundError(payload.studentId);
    }

    // 2. Pre-validation: Active Fee Structure
    const feeStructure = await this.repository.findActiveFeeStructure(
      payload.tenantId,
      payload.academicYearId,
      payload.classId
    );

    if (!feeStructure) {
      throw new MissingFeeStructureError();
    }

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const result = await this.prisma.$transaction(
          async (tx) => {
            // A. Verify student is not already enrolled in this Academic Year
            const isEnrolled = await this.repository.isStudentEnrolledInYear(
              payload.studentId,
              payload.academicYearId,
              tx
            );

            if (isEnrolled) {
              throw new AlreadyEnrolledError();
            }

            // B. Resolve Section ID (Fallback to default section if omitted)
            let resolvedSectionId = payload.sectionId;

            if (!resolvedSectionId) {
              const defaultSection = await tx.section.findFirstOrThrow({
                where: { classId: payload.classId, deletedAt: null },
                orderBy: { displayOrder: "asc" },
                select: { id: true },
              });
              resolvedSectionId = defaultSection.id;
            }

            // C. Generate Atomic Admission Number
            const finalAdmissionNum =
              await this.admissionNumberService.generateAdmissionNumber(
                tx,
                payload.academicYearId
              );

            // D. Generate Atomic Roll Number
            const finalRollNumber =
              await this.rollNumberService.generateRollNumber(
                tx,
                payload.academicYearId,
                payload.classId,
                resolvedSectionId
              );

            // E. Verify Roll Number Uniqueness within target scope
            const rollConflict = await this.repository.isRollNumberOccupied(
              payload.academicYearId,
              payload.classId,
              resolvedSectionId,
              finalRollNumber,
              tx
            );

            if (rollConflict) {
              throw new RollNumberConflictError(finalRollNumber);
            }

            // F. Create Enrollment & Fee Ledgers inside current transaction
            const feeItems = feeStructure.items.map((item) => ({
              feeComponentId: item.feeComponentId,
              amount: item.amount,
            }));

            const enrollment = await this.repository.executeAtomicAdmission(
              {
                ...payload,
                sectionId: resolvedSectionId,
                admissionNumber: finalAdmissionNum,
                rollNumber: finalRollNumber,
              },
              feeItems,
              tx
            );

            // G. Fetch metadata for response formatting
            const academicYear = await tx.academicYear.findUnique({
              where: { id: payload.academicYearId },
              select: { name: true },
            });

            const cls = await tx.class.findUnique({
              where: { id: payload.classId },
              select: { name: true },
            });

            const sec = await tx.section.findUnique({
              where: { id: resolvedSectionId },
              select: { name: true },
            });

            return {
              enrollmentId: enrollment.id,
              studentId: student.id,
              studentCode: student.studentCode,
              studentName: `${student.firstName} ${student.lastName ?? ""}`.trim(),
              academicYear: academicYear?.name ?? "",
              className: cls?.name ?? "",
              sectionName: sec?.name ?? "",
              admissionNumber: finalAdmissionNum,
              rollNumber: enrollment.rollNumber,
              admissionDate: enrollment.admissionDate,
              status: enrollment.status as unknown as StudentStatus,
              totalFeesAssigned: feeStructure.totalAmount,
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            timeout: 10000,
          }
        );

        return result;
      } catch (error: unknown) {
        const err = error as Error & { code?: string };
        attempt++;
        
        // Retry transaction on Prisma transaction lock/serialization conflicts (P2034)
        if (
          (err.code === "P2034" || err.code === "40001") &&
          attempt < MAX_RETRIES
        ) {
          continue;
        }

        if (error instanceof AdmissionDomainError) {
          throw error;
        }
        throw new Error(`ADMISSION_PROCESSING_FAILED: ${err.message}`);
      }
    }

    throw new Error("ADMISSION_PROCESSING_FAILED: Transaction max retries exceeded.");
  }
}