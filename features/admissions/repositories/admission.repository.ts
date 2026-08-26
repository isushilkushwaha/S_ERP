// features/admissions/repositories/admission.repository.ts

import {
  PrismaClient,
  Prisma,
  EnrollmentStatus,
  StudentEnrollment,
} from "@prisma/client";

import {
  CreateAdmissionPayloadDTO,
  AssignedFeeStructureDTO,
} from "../dto/admission.dto";

export class AdmissionRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  // ============================================================
  // FIND ACTIVE ENROLLMENTS FOR STUDENTS
  // ============================================================

  /**
   * Find active enrollments for the supplied student IDs.
   *
   * Used when checking whether students already have
   * active academic enrollments.
   */
  async findActiveEnrollmentsForStudents(
    studentIds: string[],
    tx?: Prisma.TransactionClient
  ) {
    if (studentIds.length === 0) {
      return [];
    }

    const client =
      tx ?? this.prisma;

    return client.studentEnrollment.findMany(
      {
        where: {
          studentId: {
            in: studentIds,
          },

          status:
            EnrollmentStatus.ACTIVE,
        },

        select: {
          id: true,

          studentId: true,

          academicYearId: true,

          classId: true,

          sectionId: true,

          admissionNumber: true,

          rollNumber: true,

          status: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      }
    );
  }

  // ============================================================
  // FIND ELIGIBLE STUDENTS
  // ============================================================

  /**
   * Search registered students eligible for enrollment.
   */
  async findEligibleStudents(
    tenantId: string,
    query?: string
  ) {
    const searchFilter:
      Prisma.StudentWhereInput =
      query
        ? {
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
          }
        : {};

    return this.prisma.student.findMany(
      {
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

        orderBy: {
          createdAt: "desc",
        },
      }
    );
  }

  // ============================================================
  // FIND ACTIVE FEE STRUCTURE
  // ============================================================

  /**
   * Fetch the active Fee Structure for the selected
   * Academic Year + Class.
   *
   * IMPORTANT:
   *
   * This returns the Settings/default fee amounts.
   *
   * It does NOT contain admission-specific installment
   * customization.
   *
   * Admission-specific amounts are saved later in:
   *
   * FeeInstallmentComponent.assignedAmount
   */
  async findActiveFeeStructure(
    tenantId: string,
    academicYearId: string,
    classId: string,
    tx?: Prisma.TransactionClient
  ): Promise<
    AssignedFeeStructureDTO | null
  > {
    const client =
      tx ?? this.prisma;

    const feeStructure =
      await client.feeStructure.findFirst(
        {
          where: {
            tenantId,

            academicYearId,

            classId,

            status: "ACTIVE",

            deletedAt: null,
          },

          include: {
            // ----------------------------------------------------
            // Fee structure items
            // ----------------------------------------------------

            items: {
              include: {
                feeComponent: true,
              },
            },

            // ----------------------------------------------------
            // Class name
            // ----------------------------------------------------

            class: {
              select: {
                name: true,
              },
            },
          },
        }
      );

    if (!feeStructure) {
      return null;
    }

    // ==========================================================
    // MAP FEE COMPONENTS
    // ==========================================================

    const items =
      feeStructure.items.map(
        (item) => ({
          /**
           * FeeStructureItem ID
           */
          id: item.id,

          /**
           * FeeComponent ID
           */
          feeComponentId:
            item.feeComponentId,

          /**
           * Default component name
           */
          name:
            item.feeComponent.name,

          /**
           * Component code
           */
          code:
            item.feeComponent.code,

          /**
           * Settings/default amount
           */
          amount:
            Number(item.amount),

          /**
           * Required flag
           */
          isRequired:
            item.feeComponent
              .isRequired,
        })
      );

    // ==========================================================
    // CALCULATE DEFAULT TOTAL
    // ==========================================================

    const totalAmount =
      items.reduce(
        (
          total,
          item
        ) =>
          total +
          item.amount,
        0
      );

    // ==========================================================
    // RETURN ASSIGNED FEE STRUCTURE
    // ==========================================================

    return {
      feeStructureId:
        feeStructure.id,

      academicYearId:
        feeStructure.academicYearId,

      classId:
        feeStructure.classId,

      /**
       * Required by AssignedFeeStructureDTO.
       */
      className:
        feeStructure.class.name,

      totalAmount,

      items,
    };
  }

  // ============================================================
  // CHECK ROLL NUMBER
  // ============================================================

  /**
   * Check whether a roll number is already claimed
   * within Academic Year + Class + Section.
   */
  async isRollNumberOccupied(
    academicYearId: string,
    classId: string,
    sectionId: string,
    rollNumber?: number,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    if (
      rollNumber === undefined ||
      rollNumber === null
    ) {
      return false;
    }

    const client =
      tx ?? this.prisma;

    const existing =
      await client.studentEnrollment.findFirst(
        {
          where: {
            academicYearId,

            classId,

            sectionId,

            rollNumber,

            status:
              EnrollmentStatus.ACTIVE,
          },

          select: {
            id: true,
          },
        }
      );

    return Boolean(existing);
  }

  // ============================================================
  // CHECK STUDENT ENROLLMENT
  // ============================================================

  /**
   * Check whether a student is already enrolled
   * in the selected Academic Year.
   */
  async isStudentEnrolledInYear(
    studentId: string,
    academicYearId: string,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    const client =
      tx ?? this.prisma;

    const existing =
      await client.studentEnrollment.findUnique(
        {
          where: {
            unique_student_academic_year: {
              studentId,

              academicYearId,
            },
          },

          select: {
            id: true,
          },
        }
      );

    return Boolean(existing);
  }

  // ============================================================
  // EXECUTE ATOMIC ADMISSION
  // ============================================================

  /**
   * Executes atomic creation of:
   *
   * StudentEnrollment
   * +
   * StudentFeeLedger
   *
   * IMPORTANT:
   *
   * Fee ledger always receives the normal/default
   * Fee Structure amount.
   *
   * Admission-specific installment customization is NOT
   * written to StudentFeeLedger here.
   *
   * It is handled by AdmissionService through:
   *
   * FeeInstallmentComponent.assignedAmount
   */
  async executeAtomicAdmission(
    payload: CreateAdmissionPayloadDTO,
    feeItems: {
      feeComponentId: string;
      amount: number;
    }[],
    outerTx?: Prisma.TransactionClient
  ): Promise<StudentEnrollment> {
    const execute = async (
      tx: Prisma.TransactionClient
    ) => {
      // ========================================================
      // 1. DOUBLE-CHECK STUDENT ENROLLMENT
      // ========================================================

      const alreadyEnrolled =
        await this.isStudentEnrolledInYear(
          payload.studentId,
          payload.academicYearId,
          tx
        );

      if (alreadyEnrolled) {
        throw new Error(
          "STUDENT_ALREADY_ENROLLED_IN_ACADEMIC_YEAR"
        );
      }

      // ========================================================
      // 2. VALIDATE ROLL NUMBER
      // ========================================================

      const rollOccupied =
        await this.isRollNumberOccupied(
          payload.academicYearId,
          payload.classId,
          payload.sectionId,
          payload.rollNumber,
          tx
        );

      if (rollOccupied) {
        throw new Error(
          "ROLL_NUMBER_ALREADY_EXISTS_IN_SECTION"
        );
      }

      // ========================================================
      // 3. CREATE STUDENT ENROLLMENT
      // ========================================================

      const enrollment =
        await tx.studentEnrollment.create(
          {
            data: {
              studentId:
                payload.studentId,

              academicYearId:
                payload.academicYearId,

              classId:
                payload.classId,

              sectionId:
                payload.sectionId,

              admissionNumber:
                payload.admissionNumber,

              rollNumber:
                payload.rollNumber,

              admissionDate:
                payload.admissionDate,

              medium:
                payload.medium,

              stream:
                payload.stream ??
                null,

              admissionType:
                payload.admissionType,

              house:
                payload.house ??
                null,

              boardRegistrationNumber:
                payload.boardRegistrationNumber ??
                null,

              isHostelRequired:
                payload.isHostelRequired ??
                false,

              isTransportRequired:
                payload.isTransportRequired ??
                false,

              remarks:
                payload.remarks ??
                null,

              status:
                EnrollmentStatus.ACTIVE,
            },
          }
        );

      // ========================================================
      // 4. CREATE STUDENT FEE LEDGER
      // ========================================================

      /**
       * IMPORTANT:
       *
       * These amounts are the normal/default fee amounts.
       *
       * Example:
       *
       * Settings:
       * Tuition = 2000
       *
       * Ledger:
       * Tuition = 2000
       *
       * Even if Admission Step 5 changes the installment
       * amount to 0, the ledger remains 2000.
       *
       * Step 5 customization is stored separately in:
       *
       * FeeInstallmentComponent.assignedAmount
       */
      if (feeItems.length > 0) {
        await tx.studentFeeLedger.createMany(
          {
            data: feeItems.map(
              (item) => ({
                enrollmentId:
                  enrollment.id,

                feeComponentId:
                  item.feeComponentId,

                assignedAmount:
                  item.amount,
              })
            ),
          }
        );
      }

      // ========================================================
      // 5. RETURN ENROLLMENT
      // ========================================================

      return enrollment;
    };

    // ==========================================================
    // USE EXISTING TRANSACTION
    // ==========================================================

    if (outerTx) {
      return execute(
        outerTx
      );
    }

    // ==========================================================
    // CREATE NEW TRANSACTION
    // ==========================================================

    return this.prisma.$transaction(
      execute,
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel
            .ReadCommitted,

        timeout: 10000,
      }
    );
  }
}