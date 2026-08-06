import { PrismaClient, Prisma, EnrollmentStatus, StudentEnrollment } from "@prisma/client";
import { CreateAdmissionPayloadDTO, AssignedFeeStructureDTO } from "../dto/admission.dto";

export class AdmissionRepository {
  findActiveEnrollmentsForStudents(studentIds: string[]) {
    throw new Error("Method not implemented.");
  }
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Search registered students eligible for enrollment.
   */
  async findEligibleStudents(tenantId: string, query?: string) {
    const searchFilter: Prisma.StudentWhereInput = query
      ? {
          OR: [
            { studentCode: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { fatherName: { contains: query, mode: "insensitive" } },
            { motherName: { contains: query, mode: "insensitive" } },
            { fatherMobile: { contains: query, mode: "insensitive" } },
            { mobile: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    return this.prisma.student.findMany({
      where: {
        deletedAt: null,
        ...searchFilter,
      },
      include: {
        enrollments: {
          select: {
            id: true,
            academicYearId: true,
            status: true,
          },
        },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Fetch active Fee Structure for the selected Class & Academic Year.
   */
  async findActiveFeeStructure(
    tenantId: string,
    academicYearId: string,
    classId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AssignedFeeStructureDTO | null> {
    const client = tx || this.prisma;
    const feeStructure = await client.feeStructure.findFirst({
      where: {
        tenantId,
        academicYearId,
        classId,
        status: "ACTIVE",
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            feeComponent: true,
          },
        },
      },
    });

    if (!feeStructure) return null;

    const items = feeStructure.items.map((item) => ({
      feeComponentId: item.feeComponentId,
      name: item.feeComponent.name,
      code: item.feeComponent.code,
      amount: Number(item.amount),
      isRequired: item.feeComponent.isRequired,
    }));

    const totalAmount = items.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      feeStructureId: feeStructure.id,
      academicYearId: feeStructure.academicYearId,
      classId: feeStructure.classId,
      totalAmount,
      items,
    };
  }

  /**
   * Check if roll number is already claimed within Academic Year, Class, and Section scope.
   */
  async isRollNumberOccupied(
    academicYearId: string,
    classId: string,
    sectionId: string,
    rollNumber?: number,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    if (!rollNumber) return false;
    const client = tx || this.prisma;

    const existing = await client.studentEnrollment.findFirst({
      where: {
        academicYearId,
        classId,
        sectionId,
        rollNumber,
        status: EnrollmentStatus.ACTIVE,
      },
      select: { id: true },
    });

    return !!existing;
  }

  /**
   * Check if Student is already enrolled in the targeted Academic Year.
   */
  async isStudentEnrolledInYear(
    studentId: string,
    academicYearId: string,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    const client = tx || this.prisma;
    const existing = await client.studentEnrollment.findUnique({
      where: {
        unique_student_academic_year: {
          studentId,
          academicYearId,
        },
      },
      select: { id: true },
    });

    return !!existing;
  }

  /**
   * Executes atomic creation of StudentEnrollment and Fee Ledger records.
   * Accepts optional `outerTx` to execute seamlessly inside parent transaction context.
   */
  async executeAtomicAdmission(
    payload: CreateAdmissionPayloadDTO,
    feeItems: { feeComponentId: string; amount: number }[],
    outerTx?: Prisma.TransactionClient
  ): Promise<StudentEnrollment> {
    const execute = async (tx: Prisma.TransactionClient) => {
      // 1. Double-check enrollment uniqueness inside transaction lock
      const alreadyEnrolled = await this.isStudentEnrolledInYear(
        payload.studentId,
        payload.academicYearId,
        tx
      );

      if (alreadyEnrolled) {
        throw new Error("STUDENT_ALREADY_ENROLLED_IN_ACADEMIC_YEAR");
      }

      // 2. Validate roll number collision
      const rollOccupied = await this.isRollNumberOccupied(
        payload.academicYearId,
        payload.classId,
        payload.sectionId,
        payload.rollNumber,
        tx
      );

      if (rollOccupied) {
        throw new Error("ROLL_NUMBER_ALREADY_EXISTS_IN_SECTION");
      }

      // 3. Create StudentEnrollment
      const enrollment = await tx.studentEnrollment.create({
        data: {
          studentId: payload.studentId,
          academicYearId: payload.academicYearId,
          classId: payload.classId,
          sectionId: payload.sectionId,
          admissionNumber: payload.admissionNumber,
          rollNumber: payload.rollNumber,
          admissionDate: payload.admissionDate,
          medium: payload.medium,
          stream: payload.stream ?? null,
          admissionType: payload.admissionType,
          house: payload.house ?? null,
          boardRegistrationNumber: payload.boardRegistrationNumber ?? null,
          isHostelRequired: payload.isHostelRequired ?? false,
          isTransportRequired: payload.isTransportRequired ?? false,
          remarks: payload.remarks ?? null,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      // 4. Generate Fee Ledger items
      if (feeItems.length > 0) {
        await tx.studentFeeLedger.createMany({
          data: feeItems.map((item) => ({
            enrollmentId: enrollment.id,
            feeComponentId: item.feeComponentId,
            amount: new Prisma.Decimal(item.amount),
            isPaid: false,
          })),
        });
      }

      return enrollment;
    };

    if (outerTx) {
      return execute(outerTx);
    }

    return this.prisma.$transaction(execute, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      timeout: 10000,
    });
  }
}