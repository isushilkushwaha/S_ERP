// features/fees/transactions/collect-fee.transaction.ts

import { prisma } from "@/lib/prisma";

import {
  PaymentMethod,
  PaymentGateway,
  PaymentStatus,
  AuditAction,
  AuditEntity,
  FeeInstallmentStatus,
  RoleName,
} from "@prisma/client";

import { Decimal } from "@prisma/client/runtime/library";

interface AllocationInput {
  installmentComponentId: string;
  installmentId: string;
  ledgerId: string;
  allocatedAmount: number;
  discountApplied?: number;
  fineApplied?: number;
}

interface CollectFeeParams {
  data: {
    enrollmentId: string;

    paymentMethod: PaymentMethod;

    gateway?: PaymentGateway;

    amountPaid: number;

    discount?: number;
    fine?: number;

    transactionId?: string;

    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;

    chequeNumber?: string;
    bankName?: string;
    chequeDate?: string;
    cardType?: string;

    remarks?: string;

    allocations: AllocationInput[];
  };

  userId: string;

  ipAddress?: string;
}

export class CollectFeeTransaction {
  async execute({
    data,
    userId,
    ipAddress,
  }: CollectFeeParams) {
    return prisma.$transaction(
      async (tx) => {
        /* ========================================================
           1. VERIFY USER
        ======================================================== */

        const user =
          await tx.user.findUnique({
            where: {
              id: userId,
            },

            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          });

        if (
          !user ||
          user.deletedAt
        ) {
          throw new Error(
            "Authenticated user not found or inactive.",
          );
        }

        /* ========================================================
           2. DISCOUNT PERMISSION
        ======================================================== */

        const totalDiscount =
          new Decimal(
            data.discount ?? 0,
          );

        if (
          totalDiscount.gt(0)
        ) {
          const hasDiscountPermission =
            user.role.name ===
              RoleName.ADMIN ||
            user.role.rolePermissions.some(
              (rolePermission) =>
                rolePermission.permission
                  .name ===
                "FEE_DISCOUNT_OVERRIDE",
            );

          if (
            !hasDiscountPermission
          ) {
            throw new Error(
              "Unauthorized: You do not have permission to apply fee discounts.",
            );
          }
        }

        /* ========================================================
           3. BASIC PAYMENT VALIDATION
        ======================================================== */

        const amountPaid =
          new Decimal(
            data.amountPaid,
          );

        if (
          amountPaid.lte(0)
        ) {
          throw new Error(
            "Payment amount must be greater than zero.",
          );
        }

        if (
          !data.allocations ||
          data.allocations.length ===
            0
        ) {
          throw new Error(
            "At least one fee component allocation is required.",
          );
        }

        /* ========================================================
           4. VERIFY ALLOCATION TOTAL
        ======================================================== */

        const allocatedTotal =
          data.allocations.reduce(
            (
              total,
              allocation,
            ) =>
              total.add(
                new Decimal(
                  allocation.allocatedAmount,
                ),
              ),
            new Decimal(0),
          );

        if (
          !allocatedTotal.eq(
            amountPaid,
          )
        ) {
          throw new Error(
            `Payment allocation total ₹${allocatedTotal.toFixed(
              2,
            )} does not match amount received ₹${amountPaid.toFixed(
              2,
            )}.`,
          );
        }

        /* ========================================================
           5. VERIFY ENROLLMENT
        ======================================================== */

        const enrollment =
          await tx.studentEnrollment.findUnique(
            {
              where: {
                id: data.enrollmentId,
              },

              include: {
                academicYear: true,
              },
            },
          );

        if (!enrollment) {
          throw new Error(
            "Student enrollment not found.",
          );
        }

        /* ========================================================
           6. GET ALL INSTALLMENTS USED BY PAYMENT
           
           IMPORTANT:
           
           A single payment can now cross:
           
           M1 → M2 → M3 → M4
        ======================================================== */

        const installmentIds = [
          ...new Set(
            data.allocations.map(
              (allocation) =>
                allocation.installmentId,
            ),
          ),
        ];

        const installments =
          await tx.feeInstallment.findMany(
            {
              where: {
                id: {
                  in: installmentIds,
                },

                enrollmentId:
                  data.enrollmentId,
              },

              include: {
                components: true,
              },
            },
          );

        /* ========================================================
           7. VERIFY ALL INSTALLMENTS EXIST
        ======================================================== */

        if (
          installments.length !==
          installmentIds.length
        ) {
          throw new Error(
            "One or more fee installments are invalid or do not belong to this student.",
          );
        }

        const installmentMap =
          new Map(
            installments.map(
              (installment) => [
                installment.id,
                installment,
              ],
            ),
          );

        /* ========================================================
           8. VERIFY INSTALLMENTS ARE PAYABLE
        ======================================================== */

        for (const installment of installments) {
          if (
            installment.status ===
            FeeInstallmentStatus.PAID
          ) {
            const hasAllocation =
              data.allocations.some(
                (allocation) =>
                  allocation.installmentId ===
                  installment.id &&
                  allocation.allocatedAmount >
                    0,
              );

            if (hasAllocation) {
              throw new Error(
                `Installment ${installment.id} is already fully paid.`,
              );
            }
          }
        }

        /* ========================================================
           9. FETCH LEDGERS
           
           Every ledger must belong to this enrollment.
        ======================================================== */

        const ledgerIds = [
          ...new Set(
            data.allocations.map(
              (allocation) =>
                allocation.ledgerId,
            ),
          ),
        ];

        const ledgers =
          await tx.studentFeeLedger.findMany(
            {
              where: {
                id: {
                  in: ledgerIds,
                },

                enrollmentId:
                  data.enrollmentId,
              },
            },
          );

        if (
          ledgers.length !==
          ledgerIds.length
        ) {
          throw new Error(
            "Security violation: One or more fee ledgers do not belong to this student.",
          );
        }

        const ledgerMap =
          new Map(
            ledgers.map(
              (ledger) => [
                ledger.id,
                ledger,
              ],
            ),
          );

        /* ========================================================
           10. SERVER-SIDE ALLOCATION VALIDATION
           
           Validate every allocation against
           its own installment/component.
        ======================================================== */

        const allocationComponentIds =
          new Set<string>();

        for (const allocation of data.allocations) {
          /* ------------------------------------------------------
             Amount
          ------------------------------------------------------ */

          if (
            allocation.allocatedAmount <=
            0
          ) {
            throw new Error(
              "Allocation amount must be greater than zero.",
            );
          }

          /* ------------------------------------------------------
             Duplicate component
          ------------------------------------------------------ */

          if (
            allocationComponentIds.has(
              allocation.installmentComponentId,
            )
          ) {
            throw new Error(
              "Duplicate fee component allocation is not allowed.",
            );
          }

          allocationComponentIds.add(
            allocation.installmentComponentId,
          );

          /* ------------------------------------------------------
             Installment
          ------------------------------------------------------ */

          const installment =
            installmentMap.get(
              allocation.installmentId,
            );

          if (!installment) {
            throw new Error(
              "Security violation: Invalid installment.",
            );
          }

          /* ------------------------------------------------------
             Component
          ------------------------------------------------------ */

          const component =
            installment.components.find(
              (item) =>
                item.id ===
                allocation.installmentComponentId,
            );

          if (!component) {
            throw new Error(
              "Security violation: Fee component does not belong to the specified installment.",
            );
          }

          /* ------------------------------------------------------
             Ledger
          ------------------------------------------------------ */

          const ledger =
            ledgerMap.get(
              allocation.ledgerId,
            );

          if (!ledger) {
            throw new Error(
              "Security violation: Fee ledger not found.",
            );
          }

          /* ------------------------------------------------------
             Component → Ledger
          ------------------------------------------------------ */

          if (
            component.ledgerId !==
            ledger.id
          ) {
            throw new Error(
              "Security violation: Fee component and ledger do not match.",
            );
          }

          /* ------------------------------------------------------
             Component balance
          ------------------------------------------------------ */

          const assignedAmount =
            new Decimal(
              component.assignedAmount,
            );

          const paidAmount =
            new Decimal(
              component.paidAmount,
            );

          const discountApplied =
            new Decimal(
              allocation.discountApplied ??
                0,
            );

          const fineApplied =
            new Decimal(
              allocation.fineApplied ??
                0,
            );

          const balance =
            assignedAmount
              .add(fineApplied)
              .sub(discountApplied)
              .sub(paidAmount);

          const allocationAmount =
            new Decimal(
              allocation.allocatedAmount,
            );

          if (
            allocationAmount.gt(
              balance,
            )
          ) {
            throw new Error(
              `Payment ₹${allocationAmount.toFixed(
                2,
              )} exceeds remaining balance ₹${balance.toFixed(
                2,
              )} for fee component ${component.id}.`,
            );
          }
        }

        /* ========================================================
           11. GENERATE RECEIPT NUMBER
        ======================================================== */

        const sequenceRows =
          await tx.$queryRaw<
            Array<{
              id: string;
              last_sequence: number;
              format: string;
              prefix: string;
            }>
          >`
            SELECT
              id,
              last_sequence,
              format,
              prefix
            FROM receipt_sequences
            WHERE academic_year_id =
              ${enrollment.academicYearId}
            FOR UPDATE
          `;

        let nextSequence: number;
        let formatString: string;

        if (
          sequenceRows.length ===
          0
        ) {
          nextSequence = 1;

          formatString =
            `RCP/${enrollment.academicYear.code}/{NUMBER}`;

          await tx.receiptSequence.create(
            {
              data: {
                academicYearId:
                  enrollment.academicYearId,

                prefix: "RCP",

                format:
                  formatString,

                lastSequence:
                  nextSequence,
              },
            },
          );
        } else {
          const sequence =
            sequenceRows[0];

          nextSequence =
            sequence.last_sequence +
            1;

          formatString =
            sequence.format ||
            `RCP/${enrollment.academicYear.code}/{NUMBER}`;

          await tx.receiptSequence.update(
            {
              where: {
                id: sequence.id,
              },

              data: {
                lastSequence:
                  nextSequence,
              },
            },
          );
        }

        const paddedNumber =
          String(
            nextSequence,
          ).padStart(
            5,
            "0",
          );

        const receiptNumber =
          formatString
            .replace(
              "{YEAR}",
              enrollment.academicYear.code,
            )
            .replace(
              "{NUMBER}",
              paddedNumber,
            );

        /* ========================================================
           12. CREATE PAYMENT MASTER
        ======================================================== */

        const payment =
          await tx.feePayment.create({
            data: {
              enrollmentId:
                data.enrollmentId,

              receiptNumber,

              paymentMethod:
                data.paymentMethod,

              gateway:
                data.gateway ??
                PaymentGateway.MANUAL,

              amountPaid,

              discount:
                totalDiscount,

              fine:
                data.fine ?? 0,

              transactionId:
                data.transactionId,

              gatewayOrderId:
                data.gatewayOrderId,

              gatewayPaymentId:
                data.gatewayPaymentId,

              gatewaySignature:
                data.gatewaySignature,

              status:
                PaymentStatus.SUCCESS,

              remarks:
                data.remarks,

              receivedById:
                userId,
            },
          });

        /* ========================================================
           13. PROCESS ALL COMPONENT ALLOCATIONS
           
           This is the major change.
           
           We process:
           
           M1 component
           M2 component
           M3 component
           M4 component
           
           within the SAME transaction.
        ======================================================== */

        for (const allocation of data.allocations) {
          const installment =
            installmentMap.get(
              allocation.installmentId,
            );

          if (!installment) {
            throw new Error(
              "Installment not found while processing allocation.",
            );
          }

          const component =
            installment.components.find(
              (item) =>
                item.id ===
                allocation.installmentComponentId,
            );

          if (!component) {
            throw new Error(
              "Installment component not found while processing allocation.",
            );
          }

          const ledger =
            ledgerMap.get(
              allocation.ledgerId,
            );

          if (!ledger) {
            throw new Error(
              "Ledger not found while processing allocation.",
            );
          }

          const allocatedAmount =
            new Decimal(
              allocation.allocatedAmount,
            );

          const discountApplied =
            new Decimal(
              allocation.discountApplied ??
                0,
            );

          const fineApplied =
            new Decimal(
              allocation.fineApplied ??
                0,
            );

          /* ======================================================
             CREATE PAYMENT ITEM
          ====================================================== */

          await tx.feePaymentItem.create({
            data: {
              paymentId:
                payment.id,

              ledgerId:
                ledger.id,

              installmentId:
                installment.id,

              allocatedAmount,
            },
          });

          /* ======================================================
             UPDATE INSTALLMENT COMPONENT
          ====================================================== */

          await tx.feeInstallmentComponent.update(
            {
              where: {
                id:
                  component.id,
              },

              data: {
                paidAmount: {
                  increment:
                    allocatedAmount,
                },
              },
            },
          );

          /* ======================================================
             UPDATE STUDENT LEDGER
          ====================================================== */

          await tx.studentFeeLedger.update(
            {
              where: {
                id:
                  ledger.id,
              },

              data: {
                paidAmount: {
                  increment:
                    allocatedAmount,
                },

                discountAmount: {
                  increment:
                    discountApplied,
                },

                fineAmount: {
                  increment:
                    fineApplied,
                },

                lastPaymentDate:
                  new Date(),
              },
            },
          );
        }

        /* ========================================================
           14. UPDATE EVERY AFFECTED INSTALLMENT
           
           We cannot update only one installment anymore.
        ======================================================== */

        const updatedInstallments: Array<{
          id: string;
          balanceAmount: Decimal;
          status: FeeInstallmentStatus;
        }> = [];

        for (const installment of installments) {
          /* ------------------------------------------------------
             Reload components
          ------------------------------------------------------ */

          const updatedComponents =
            await tx.feeInstallmentComponent.findMany(
              {
                where: {
                  installmentId:
                    installment.id,
                },
              },
            );

          /* ------------------------------------------------------
             Assigned amount NEVER changes
          ------------------------------------------------------ */

          const assignedAmount =
            new Decimal(
              installment.assignedAmount,
            );

          /* ------------------------------------------------------
             Total paid
          ------------------------------------------------------ */

          const paidAmount =
            updatedComponents.reduce(
              (
                total,
                component,
              ) =>
                total.add(
                  new Decimal(
                    component.paidAmount,
                  ),
                ),
              new Decimal(0),
            );

          const balanceAmount =
            assignedAmount.sub(
              paidAmount,
            );

          /* ------------------------------------------------------
             Determine status
          ------------------------------------------------------ */

          let status:
            FeeInstallmentStatus;

          if (
            balanceAmount.lte(0)
          ) {
            status =
              FeeInstallmentStatus.PAID;
          } else if (
            paidAmount.gt(0)
          ) {
            status =
              FeeInstallmentStatus.PARTIAL;
          } else {
            const today =
              new Date();

            today.setHours(
              0,
              0,
              0,
              0,
            );

            const dueDate =
              new Date(
                installment.dueDate,
              );

            dueDate.setHours(
              0,
              0,
              0,
              0,
            );

            status =
              dueDate < today
                ? FeeInstallmentStatus.OVERDUE
                : FeeInstallmentStatus.DUE;
          }

          /* ------------------------------------------------------
             Update installment
          ------------------------------------------------------ */

          await tx.feeInstallment.update(
            {
              where: {
                id:
                  installment.id,
              },

              data: {
                paidAmount,

                status,
              },
            },
          );

          updatedInstallments.push(
            {
              id:
                installment.id,

              balanceAmount,

              status,
            },
          );
        }

        /* ========================================================
           15. CREATE RECEIPT
        ======================================================== */

        const receipt =
          await tx.feeReceipt.create({
            data: {
              paymentId:
                payment.id,

              receiptNumber,

              generatedById:
                userId,
            },
          });

        /* ========================================================
           16. AUDIT LOG
        ======================================================== */

        await tx.auditLog.create({
          data: {
            userId,

            action:
              AuditAction.PAYMENT_CREATED,

            entity:
              AuditEntity.FEE_PAYMENT,

            entityId:
              payment.id,

            details: {
              receiptNumber,

              amountPaid:
                data.amountPaid,

              paymentMethod:
                data.paymentMethod,

              enrollmentId:
                data.enrollmentId,

              installmentIds,

              allocationCount:
                data.allocations.length,

              allocations:
                data.allocations.map(
                  (
                    allocation,
                  ) => ({
                    installmentId:
                      allocation.installmentId,

                    installmentComponentId:
                      allocation.installmentComponentId,

                    ledgerId:
                      allocation.ledgerId,

                    allocatedAmount:
                      allocation.allocatedAmount,
                  }),
                ),
            },

            ipAddress,
          },
        });

        /* ========================================================
           17. RETURN RESULT
        ======================================================== */

        return {
          payment,

          receipt,

          installments:
            updatedInstallments,

          allocations:
            data.allocations,
        };
      },

      {
        maxWait: 5000,
        timeout: 15000,
      },
    );
  }
}