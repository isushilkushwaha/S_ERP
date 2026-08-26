import { prisma } from '@/lib/prisma';
import { PaymentStatus, AuditAction, AuditEntity, FeeInstallmentStatus, RoleName } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface VoidPaymentParams {
  paymentId: string;
  userId: string;
  reason: string;
  ipAddress?: string;
}

export class VoidPaymentTransaction {
  async execute({ paymentId, userId, reason, ipAddress }: VoidPaymentParams) {
    return prisma.$transaction(async (tx) => {
      // 1. RBAC SECURITY CHECK
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
      });

      const hasVoidPerm = user?.role.name === RoleName.ADMIN || 
        user?.role.rolePermissions.some(rp => rp.permission.name === 'FEE_VOID_OVERRIDE');

      if (!hasVoidPerm) {
        throw new Error("Unauthorized: You do not have permission to void fee payments.");
      }

      // 2. FETCH PAYMENT WITH LOCK
      const payment = await tx.feePayment.findUnique({
        where: { id: paymentId },
        include: { paymentItems: true, receipt: true }
      });

      if (!payment) throw new Error("Payment record not found.");
      if (payment.status === PaymentStatus.CANCELLED || payment.status === PaymentStatus.REFUNDED) {
        throw new Error("This payment has already been voided or refunded.");
      }

      // 3. ATOMIC DECREMENTS ON LEDGERS & INSTALLMENTS
      for (const item of payment.paymentItems) {
        // Decrement ledger paid amount
        await tx.studentFeeLedger.update({
          where: { id: item.ledgerId },
          data: { 
            paidAmount: { decrement: item.allocatedAmount }
          },
        });

        // Decrement installment and recalculate status
        if (item.installmentId) {
          const updatedInst = await tx.feeInstallment.update({
            where: { id: item.installmentId },
            data: { paidAmount: { decrement: item.allocatedAmount } }
          });

          const instAssigned = new Decimal(updatedInst.assignedAmount);
          const instPaid = new Decimal(updatedInst.paidAmount);

          let newStatus: FeeInstallmentStatus = FeeInstallmentStatus.DUE;
          if (instPaid.equals(instAssigned)) {
            newStatus = FeeInstallmentStatus.PAID;
          } else if (instPaid.gt(0)) {
            newStatus = FeeInstallmentStatus.PARTIAL;
          }

          if (updatedInst.status !== newStatus) {
            await tx.feeInstallment.update({
              where: { id: item.installmentId },
              data: { status: newStatus },
            });
          }
        }
      }

      // 4. VOID THE PAYMENT RECORD
      const voidedPayment = await tx.feePayment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.CANCELLED,
          voidedAt: new Date(),
          voidedById: userId,
          voidReason: reason,
        }
      });

      // 5. CANCEL THE RECEIPT
      if (payment.receipt) {
        await tx.feeReceipt.update({
          where: { id: payment.receipt.id },
          data: {
            isCancelled: true,
            cancelledAt: new Date(),
            cancelledById: userId,
            cancellationReason: reason
          }
        });
      }

      // 6. AUDIT LOG
      await tx.auditLog.create({
        data: {
          userId,
          action: AuditAction.PAYMENT_CANCELLED,
          entity: AuditEntity.FEE_PAYMENT,
          entityId: payment.id,
          details: { receiptNumber: payment.receiptNumber, amountVoided: payment.amountPaid, reason },
          ipAddress,
        },
      });

      return voidedPayment;
    }, { maxWait: 5000, timeout: 10000 });
  }
}