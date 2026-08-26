import {
  PrismaClient,
  Prisma,
  StudentStatus,
} from "@prisma/client";

import { AdmissionRepository } from "../repositories/admission.repository";
import { AdmissionNumberService } from "./admission-number.service";
import { RollNumberService } from "./roll-number.service";

import {
  CreateAdmissionPayloadDTO,
  AdmissionResponseDTO,
  StudentRegistrationSummaryDTO,
} from "../dto/admission.dto";

import {
  StudentNotFoundError,
  AlreadyEnrolledError,
  RollNumberConflictError,
  MissingFeeStructureError,
  AdmissionDomainError,
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
   * Search registered students eligible for enrollment
   * along with their active academic status.
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
            {
              studentCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              fatherName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              motherName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              fatherMobile: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              mobile: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
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

    return students.map((student) => ({
      id: student.id,
      studentCode: student.studentCode,

      firstName: student.firstName,
      middleName: student.middleName ?? null,
      lastName: student.lastName ?? null,

      dateOfBirth: student.dateOfBirth ?? null,
      gender: student.gender ?? null,

      fatherName: student.fatherName,
      motherName: student.motherName ?? null,

      fatherMobile: student.fatherMobile ?? null,
      mobile: student.mobile ?? null,
      email: student.email ?? null,

      photo: student.photo ?? null,

      addressLine1: student.addressLine1 ?? null,
      addressLine2: student.addressLine2 ?? null,
      city: student.city ?? null,
      state: student.state ?? null,
      postalCode: student.postalCode ?? null,

      registrationDate: student.registrationDate ?? null,

      hasActiveEnrollment:
        student.enrollments.length > 0,

      enrollments: student.enrollments.map(
        (enrollment) => ({
          id: enrollment.id,
          academicYearId:
            enrollment.academicYearId,
          academicYearName:
            enrollment.academicYear.name,
          className:
            enrollment.class.name,
          status: enrollment.status,
        })
      ),
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
    const structure =
      await this.repository.findActiveFeeStructure(
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
   * Executes full admission workflow in an atomic Prisma transaction.
   */
  async processAdmission(
    payload: CreateAdmissionPayloadDTO & {
      installmentPlanId?: string | null;

      installments?: Array<{
        name: string;
        dueDate?: string | null;
        value: number;
        componentIds: string[];
      }>;
    }
  ): Promise<AdmissionResponseDTO> {
    // ================================================================
    // 1. PRE-VALIDATION: STUDENT
    // ================================================================

    const student =
      await this.prisma.student.findUnique({
        where: {
          id: payload.studentId,
          deletedAt: null,
        },

        select: {
          id: true,
          studentCode: true,
          firstName: true,
          lastName: true,
        },
      });

    if (!student) {
      throw new StudentNotFoundError(
        payload.studentId
      );
    }

    // ================================================================
    // 2. PRE-VALIDATION: FEE STRUCTURE
    // ================================================================

    const feeStructure =
      await this.repository.findActiveFeeStructure(
        payload.tenantId,
        payload.academicYearId,
        payload.classId
      );

    if (!feeStructure) {
      throw new MissingFeeStructureError();
    }

    // ================================================================
    // 3. RETRY CONFIGURATION
    // ================================================================

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const result =
          await this.prisma.$transaction(
            async (tx) => {
              // ========================================================
              // A. CHECK EXISTING ENROLLMENT
              // ========================================================

              const isEnrolled =
                await this.repository.isStudentEnrolledInYear(
                  payload.studentId,
                  payload.academicYearId,
                  tx
                );

              if (isEnrolled) {
                throw new AlreadyEnrolledError();
              }

              // ========================================================
              // B. LOAD CLASS CONFIGURATION
              // ========================================================

              const classConfiguration =
                await tx.classConfiguration.findUnique({
                  where: {
                    classId:
                      payload.classId,
                  },
                });

              const sectionsEnabled =
                classConfiguration?.sectionsEnabled ??
                false;

              const autoAllocationEnabled =
                classConfiguration?.autoAllocationEnabled ??
                false;

              // ========================================================
              // C. RESOLVE SECTION
              // ========================================================

              let resolvedSectionId:
                | string
                | null = null;

              // ========================================================
              // CASE 1: SECTIONS ENABLED
              // ========================================================

              if (sectionsEnabled) {
                // ------------------------------------------------------
                // User selected a section
                // ------------------------------------------------------

                if (payload.sectionId) {
                  const selectedSection =
                    await tx.section.findFirst({
                      where: {
                        id:
                          payload.sectionId,

                        classId:
                          payload.classId,

                        status:
                          "ACTIVE",

                        deletedAt:
                          null,
                      },

                      select: {
                        id: true,
                        capacity: true,
                        name: true,
                      },
                    });

                  if (!selectedSection) {
                    throw new AdmissionDomainError(
                      "The selected section does not belong to the selected class or is not active.",
                      "INVALID_SECTION"
                    );
                  }

                  const studentCount =
                    await tx.studentEnrollment.count({
                      where: {
                        sectionId:
                          selectedSection.id,

                        academicYearId:
                          payload.academicYearId,

                        status:
                          "ACTIVE",
                      },
                    });

                  if (
                    studentCount >=
                    selectedSection.capacity
                  ) {
                    throw new AdmissionDomainError(
                      `Section ${selectedSection.name} is full. Maximum capacity is ${selectedSection.capacity} students.`,
                      "SECTION_CAPACITY_EXCEEDED"
                    );
                  }

                  resolvedSectionId =
                    selectedSection.id;
                }

                // ------------------------------------------------------
                // No section selected -> automatic allocation
                // ------------------------------------------------------

                else if (
                  autoAllocationEnabled
                ) {
                  const activeSections =
                    await tx.section.findMany({
                      where: {
                        classId:
                          payload.classId,

                        status:
                          "ACTIVE",

                        deletedAt:
                          null,
                      },

                      orderBy: {
                        displayOrder:
                          "asc",
                      },

                      select: {
                        id: true,
                        capacity: true,
                        name: true,
                      },
                    });

                  if (
                    activeSections.length ===
                    0
                  ) {
                    throw new AdmissionDomainError(
                      "No active section is available for the selected class. Please create a section before completing admission.",
                      "NO_SECTION_AVAILABLE"
                    );
                  }

                  for (
                    const section of
                      activeSections
                  ) {
                    const studentCount =
                      await tx.studentEnrollment.count({
                        where: {
                          sectionId:
                            section.id,

                          academicYearId:
                            payload.academicYearId,

                          status:
                            "ACTIVE",
                        },
                      });

                    if (
                      studentCount <
                      section.capacity
                    ) {
                      resolvedSectionId =
                        section.id;

                      break;
                    }
                  }

                  if (
                    !resolvedSectionId
                  ) {
                    throw new AdmissionDomainError(
                      "No seats are available in any active section of this class.",
                      "NO_SECTION_CAPACITY"
                    );
                  }
                }

                // ------------------------------------------------------
                // Sections enabled but manual selection required
                // ------------------------------------------------------

                else {
                  throw new AdmissionDomainError(
                    "Please select a section for this class.",
                    "SECTION_REQUIRED"
                  );
                }
              }

              // ========================================================
              // CASE 2: SECTIONS DISABLED
              // ========================================================

              else {
                /*
                 * IMPORTANT:
                 *
                 * No section is required for this class.
                 *
                 * sectionId remains NULL.
                 */

                resolvedSectionId = null;

                const maxStudentsWithoutSection =
                  classConfiguration?.maxStudentsWithoutSection ??
                  null;

                if (
                  maxStudentsWithoutSection !==
                  null
                ) {
                  const currentClassEnrollmentCount =
                    await tx.studentEnrollment.count({
                      where: {
                        classId:
                          payload.classId,

                        academicYearId:
                          payload.academicYearId,

                        status:
                          "ACTIVE",
                      },
                    });

                  if (
                    currentClassEnrollmentCount >=
                    maxStudentsWithoutSection
                  ) {
                    throw new AdmissionDomainError(
                      `No seats are available in this class. Maximum capacity is ${maxStudentsWithoutSection} students.`,
                      "CLASS_CAPACITY_EXCEEDED"
                    );
                  }
                }
              }

              // ========================================================
              // D. GENERATE ADMISSION NUMBER
              // ========================================================

              const finalAdmissionNum =
                await this.admissionNumberService.generateAdmissionNumber(
                  tx,
                  payload.academicYearId
                );

              // ========================================================
              // E. GENERATE ROLL NUMBER
              // ========================================================

              /*
               * sectionId may be NULL when sections are disabled.
               *
               * Therefore use resolvedSectionId directly.
               */

              const activeEnrollmentsCount =
                await tx.studentEnrollment.count({
                  where: {
                    academicYearId:
                      payload.academicYearId,

                    classId:
                      payload.classId,

                    sectionId:
                      resolvedSectionId,

                    status:
                      "ACTIVE",
                  },
                });

              const finalRollNumber =
                activeEnrollmentsCount + 1;

              // ========================================================
              // F. VERIFY ROLL NUMBER
              // ========================================================

              const rollConflict =
                await tx.studentEnrollment.findFirst({
                  where: {
                    academicYearId:
                      payload.academicYearId,

                    classId:
                      payload.classId,

                    sectionId:
                      resolvedSectionId,

                    rollNumber:
                      finalRollNumber,

                    status:
                      "ACTIVE",
                  },

                  select: {
                    id: true,
                  },
                });

              if (rollConflict) {
                throw new RollNumberConflictError(
                  finalRollNumber
                );
              }

              // ========================================================
              // G. VALIDATE INSTALLMENT DATA
              // ========================================================

              const rawInstallments =
                payload.installments ?? [];

              for (
                const installment of
                  rawInstallments
              ) {
                const milestoneName =
                  installment.name?.trim();

                if (!milestoneName) {
                  throw new AdmissionDomainError(
                    "Installment milestone name is required.",
                    "INVALID_INSTALLMENT_NAME"
                  );
                }

                const milestoneAmount =
                  Number(
                    installment.value
                  );

                if (
                  !Number.isFinite(
                    milestoneAmount
                  ) ||
                  milestoneAmount <= 0
                ) {
                  throw new AdmissionDomainError(
                    `Invalid amount for installment "${milestoneName}".`,
                    "INVALID_INSTALLMENT_AMOUNT"
                  );
                }

                if (
                  !Array.isArray(
                    installment.componentIds
                  ) ||
                  installment.componentIds
                    .length === 0
                ) {
                  throw new AdmissionDomainError(
                    `At least one fee component must be assigned to "${milestoneName}".`,
                    "INSTALLMENT_COMPONENTS_REQUIRED"
                  );
                }

                if (
                  installment.dueDate
                ) {
                  const dueDate =
                    new Date(
                      installment.dueDate
                    );

                  if (
                    Number.isNaN(
                      dueDate.getTime()
                    )
                  ) {
                    throw new AdmissionDomainError(
                      `Invalid due date for installment "${milestoneName}".`,
                      "INVALID_INSTALLMENT_DUE_DATE"
                    );
                  }
                }
              }

              // ========================================================
              // H. PREPARE FEE LEDGERS
              // ========================================================

              const feeItems =
                feeStructure.items.map(
                  (item) => ({
                    feeComponentId:
                      item.feeComponentId,

                    feeStructureItemId:
                      item.id,

                    amount:
                      Number(
                        item.amount
                      ),
                  })
                );

              // ========================================================
              // I. CREATE STUDENT ENROLLMENT
              // ========================================================

              const enrollment =
                await tx.studentEnrollment.create({
                  data: {
                    studentId:
                      payload.studentId,

                    academicYearId:
                      payload.academicYearId,

                    classId:
                      payload.classId,

                    sectionId:
                      resolvedSectionId,

                    admissionNumber:
                      finalAdmissionNum,

                    rollNumber:
                      finalRollNumber,

                    medium:
                      payload.medium,

                    stream:
                      payload.stream ||
                      null,

                    admissionType:
                      payload.admissionType,

                    admissionDate:
                      new Date(
                        payload.admissionDate
                      ),

                    isHostelRequired:
                      payload.isHostelRequired ??
                      false,

                    isTransportRequired:
                      payload.isTransportRequired ??
                      false,

                    feeStructureId:
                      feeStructure.feeStructureId,

                    installmentPlanId:
                      payload.installmentPlanId ||
                      null,

                    feeLedgers: {
                      create:
                        feeItems.map(
                          (item) => ({
                            feeComponentId:
                              item.feeComponentId,

                            assignedAmount:
                              item.amount,
                          })
                        ),
                    },
                  },

                  include: {
                    feeLedgers: {
                      select: {
                        id: true,
                        feeComponentId:
                          true,
                        assignedAmount:
                          true,
                      },
                    },
                  },
                });

              // ========================================================
              // J. BUILD UNIQUE MILESTONES
              // ========================================================

              type MilestoneData = {
                name: string;
                dueDate: Date;
                value: number;
                componentIds: string[];
                firstIndex: number;
              };

              const milestoneMap =
                new Map<
                  string,
                  MilestoneData
                >();

              rawInstallments.forEach(
                (
                  installment,
                  index
                ) => {
                  const name =
                    installment.name.trim();

                  const dueDate =
                    installment.dueDate
                      ? new Date(
                          installment.dueDate
                        )
                      : new Date(
                          payload.admissionDate
                        );

                  const normalizedComponentIds =
                    Array.from(
                      new Set(
                        installment.componentIds
                      )
                    );

                  const key =
                    `${name.toLowerCase()}__${dueDate.toISOString()}`;

                  const existing =
                    milestoneMap.get(
                      key
                    );

                  if (existing) {
                    existing.value +=
                      Number(
                        installment.value
                      );

                    for (
                      const componentId of
                        normalizedComponentIds
                    ) {
                      if (
                        !existing.componentIds.includes(
                          componentId
                        )
                      ) {
                        existing.componentIds.push(
                          componentId
                        );
                      }
                    }
                  } else {
                    milestoneMap.set(
                      key,
                      {
                        name,
                        dueDate,
                        value:
                          Number(
                            installment.value
                          ),
                        componentIds:
                          normalizedComponentIds,
                        firstIndex:
                          index,
                      }
                    );
                  }
                }
              );

              // ========================================================
              // K. SORT MILESTONES
              // ========================================================

              const milestones =
                Array.from(
                  milestoneMap.values()
                ).sort(
                  (a, b) =>
                    a.firstIndex -
                    b.firstIndex
                );

              // ========================================================
              // L. CREATE MILESTONES
              // ========================================================

              for (
                let milestoneIndex = 0;
                milestoneIndex <
                milestones.length;
                milestoneIndex++
              ) {
                const milestone =
                  milestones[
                    milestoneIndex
                  ];

                const availableComponentIds =
                  new Set(
                    enrollment.feeLedgers.map(
                      (ledger) =>
                        ledger.feeComponentId
                    )
                  );

                for (
                  const componentId of
                    milestone.componentIds
                ) {
                  if (
                    !availableComponentIds.has(
                      componentId
                    )
                  ) {
                    throw new AdmissionDomainError(
                      `Fee component ${componentId} assigned to milestone "${milestone.name}" does not belong to the selected fee structure.`,
                      "INVALID_MILESTONE_COMPONENT"
                    );
                  }
                }

                const milestoneLedgers =
                  enrollment.feeLedgers.filter(
                    (ledger) =>
                      milestone.componentIds.includes(
                        ledger.feeComponentId
                      )
                  );

                if (
                  milestoneLedgers.length ===
                  0
                ) {
                  throw new AdmissionDomainError(
                    `No valid fee components found for milestone "${milestone.name}".`,
                    "INVALID_MILESTONE_COMPONENTS"
                  );
                }

                const installment =
                  await tx.feeInstallment.create({
                    data: {
                      enrollmentId:
                        enrollment.id,

                      name:
                        milestone.name,

                      sequence:
                        milestoneIndex + 1,

                      dueDate:
                        milestone.dueDate,

                      assignedAmount:
                        Number(
                          milestone.value.toFixed(
                            2
                          )
                        ),

                      paidAmount: 0,

                      status: "DUE",
                    },
                  });

                const totalComponentAmount =
                  milestoneLedgers.reduce(
                    (
                      total: number,
                      ledger
                    ) =>
                      total +
                      Number(
                        ledger.assignedAmount
                      ),
                    0
                  );

                if (
                  totalComponentAmount <=
                  0
                ) {
                  throw new AdmissionDomainError(
                    `Milestone "${milestone.name}" has no assignable fee amount.`,
                    "INVALID_MILESTONE_AMOUNT"
                  );
                }

                let allocatedSoFar =
                  0;

                for (
                  let i = 0;
                  i <
                  milestoneLedgers.length;
                  i++
                ) {
                  const ledger =
                    milestoneLedgers[i];

                  let componentAmount:
                    number;

                  if (
                    i ===
                    milestoneLedgers.length -
                      1
                  ) {
                    componentAmount =
                      Number(
                        (
                          Number(
                            milestone.value
                          ) -
                          allocatedSoFar
                        ).toFixed(2)
                      );
                  } else {
                    const proportion =
                      Number(
                        ledger.assignedAmount
                      ) /
                      totalComponentAmount;

                    componentAmount =
                      Number(
                        (
                          Number(
                            milestone.value
                          ) *
                          proportion
                        ).toFixed(2)
                      );
                  }

                  if (
                    componentAmount <=
                    0
                  ) {
                    continue;
                  }

                  allocatedSoFar +=
                    componentAmount;

                  await tx.feeInstallmentComponent.create(
                    {
                      data: {
                        installmentId:
                          installment.id,

                        ledgerId:
                          ledger.id,

                        assignedAmount:
                          componentAmount,

                        paidAmount:
                          0,
                      },
                    }
                  );
                }
              }

              // ========================================================
              // M. HANDLE CONCESSION / DISCOUNT
              // ========================================================

              let appliedDiscountAmt =
                0;

              if (
                payload.concession &&
                payload.concession
                  .discountAmount > 0
              ) {
                appliedDiscountAmt =
                  Number(
                    payload.concession
                      .discountAmount
                  );

                let discountType =
                  await tx.discountType.findFirst({
                    where: {
                      tenantId:
                        payload.tenantId,

                      name:
                        payload.concession
                          .discountType,
                    },
                  });

                if (!discountType) {
                  discountType =
                    await tx.discountType.create({
                      data: {
                        tenantId:
                          payload.tenantId,

                        name:
                          payload.concession
                            .discountType,

                        code:
                          payload.concession
                            .discountType
                            .toUpperCase()
                            .replace(
                              /\s+/g,
                              "_"
                            ),

                        fixedAmount:
                          appliedDiscountAmt,
                      },
                    });
                }

                await tx.enrollmentDiscount.create({
                  data: {
                    enrollmentId:
                      enrollment.id,

                    discountTypeId:
                      discountType.id,

                    originalAmount:
                      feeStructure.totalAmount,

                    appliedAmount:
                      appliedDiscountAmt,

                    finalAmount:
                      Math.max(
                        0,
                        Number(
                          feeStructure.totalAmount
                        ) -
                          appliedDiscountAmt
                      ),

                    remarks:
                      payload.concession
                        .description ||
                      null,
                  },
                });
              }

              // ========================================================
              // N. FETCH RESPONSE METADATA
              // ========================================================

              const academicYear =
                await tx.academicYear.findUnique({
                  where: {
                    id:
                      payload.academicYearId,
                  },

                  select: {
                    name: true,
                  },
                });

              const cls =
                await tx.class.findUnique({
                  where: {
                    id:
                      payload.classId,
                  },

                  select: {
                    name: true,
                  },
                });

              const sec =
                resolvedSectionId
                  ? await tx.section.findUnique({
                      where: {
                        id:
                          resolvedSectionId,
                      },

                      select: {
                        name: true,
                      },
                    })
                  : null;

              // ========================================================
              // O. FINAL PAYABLE AMOUNT
              // ========================================================

              const finalCalculatedPayable =
                Math.max(
                  0,
                  Number(
                    feeStructure.totalAmount
                  ) -
                    appliedDiscountAmt
                );

              // ========================================================
              // P. RETURN ADMISSION RESULT
              // ========================================================

              return {
                enrollmentId:
                  enrollment.id,

                studentId:
                  student.id,

                studentCode:
                  student.studentCode,

                studentName:
                  `${student.firstName} ${
                    student.lastName ??
                    ""
                  }`.trim(),

                academicYear:
                  academicYear?.name ??
                  "",

                className:
                  cls?.name ?? "",

                sectionName:
                  sec?.name ?? "",

                admissionNumber:
                  finalAdmissionNum,

                rollNumber:
                  enrollment.rollNumber,

                admissionDate:
                  enrollment.admissionDate,

                status:
                  enrollment.status as unknown as StudentStatus,

                totalFeesAssigned:
                  Number(
                    feeStructure.totalAmount
                  ),

                finalPayableAmount:
                  Number(
                    finalCalculatedPayable
                  ),
              };
            },
            {
              isolationLevel:
                Prisma.TransactionIsolationLevel
                  .ReadCommitted,

              timeout: 10000,
            }
          );

        return result;
      } catch (error: unknown) {
        const err =
          error as Error & {
            code?: string;
          };

        attempt++;

        // ==============================================================
        // RETRY SERIALIZATION / TRANSACTION CONFLICT
        // ==============================================================

        if (
          (err.code === "P2034" ||
            err.code === "40001") &&
          attempt < MAX_RETRIES
        ) {
          continue;
        }

        // ==============================================================
        // PRESERVE DOMAIN ERRORS
        // ==============================================================

        if (
          error instanceof
          AdmissionDomainError
        ) {
          throw error;
        }

        // ==============================================================
        // GENERIC ADMISSION ERROR
        // ==============================================================

        throw new Error(
          `ADMISSION_PROCESSING_FAILED: ${
            err.message
          }`
        );
      }
    }

    throw new Error(
      "ADMISSION_PROCESSING_FAILED: Transaction max retries exceeded."
    );
  }
}