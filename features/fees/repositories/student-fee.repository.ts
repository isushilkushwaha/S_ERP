import { prisma } from '@/lib/prisma';

export class StudentFeeRepository {
  async getEnrollmentFeeDetails(enrollmentId: string) {
    return prisma.studentEnrollment.findUnique({
      where: {
        id: enrollmentId,
      },

      include: {
        // ============================================================
        // STUDENT
        // ============================================================
        student: {
          select: {
            id: true,
            studentCode: true,
            firstName: true,
            middleName: true,
            lastName: true,
            fatherName: true,
            motherName: true,
            mobile: true,
            photo: true,
          },
        },

        // ============================================================
        // ACADEMIC INFORMATION
        // ============================================================
        class: {
          select: {
            id: true,
            name: true,
          },
        },

        section: {
          select: {
            id: true,
            name: true,
          },
        },

        academicYear: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        // ============================================================
        // FEE STRUCTURE
        // ============================================================
        feeStructure: {
          select: {
            id: true,
            notes: true,
          },
        },

        // ============================================================
        // ADMISSION DISCOUNT
        // ============================================================
        enrollmentDiscounts: {
          include: {
            discountType: {
              select: {
                id: true,
                name: true,
                code: true,
                percentage: true,
                fixedAmount: true,
                maxLimit: true,
              },
            },

            approvedBy: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },

        // ============================================================
        // FEE LEDGER
        //
        // One row = one fee component.
        //
        // Example:
        // Tuition Fee
        // Admission Fee
        // Examination Fee
        // Transport Fee
        // ============================================================
        feeLedgers: {
          include: {
            feeComponent: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },

        // ============================================================
        // INSTALLMENT / MILESTONES
        //
        // One milestone can contain multiple fee components.
        //
        // FeeInstallment.components is the correct relation name.
        // ============================================================
        feeInstallments: {
          orderBy: [
            {
              sequence: 'asc',
            },
            {
              dueDate: 'asc',
            },
          ],

          include: {
            components: {
              include: {
                ledger: {
                  include: {
                    feeComponent: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                  },
                },
              },
            },

            paymentItems: true,
          },
        },

        // ============================================================
        // PAYMENT HISTORY
        // ============================================================
        feePayments: {
          include: {
            receivedBy: {
              select: {
                fullName: true,
              },
            },

            paymentItems: {
              include: {
                ledger: {
                  include: {
                    feeComponent: {
                      select: {
                        name: true,
                        code: true,
                      },
                    },
                  },
                },

                installment: {
                  select: {
                    id: true,
                    name: true,
                    sequence: true,
                  },
                },
              },
            },
          },

          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });
  }
}