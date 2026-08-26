import { prisma } from '@/lib/prisma';
import { Msg91SmsService } from '@/features/notifications/sms/msg91.service';
import { AuditAction, AuditEntity } from '@prisma/client';

export class PaymentNotificationService {
  /**
   * Dispatches SMS receipt. Designed to be called as a background promise.
   * Will never throw an error that crashes the parent thread.
   */
  static async sendPaymentReceipt(
    paymentId: string, 
    enrollmentId: string, 
    receiptNumber: string, 
    amountPaid: number, 
    userId: string
  ): Promise<void> {
    try {
      const enrollment = await prisma.studentEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          student: { select: { firstName: true, lastName: true, mobile: true } },
          feeLedgers: { select: { assignedAmount: true, paidAmount: true, discountAmount: true, fineAmount: true } },
        },
      });

      if (!enrollment || !enrollment.student.mobile) {
        console.warn(`[SMS] Skipped: No valid mobile number for enrollment ${enrollmentId}`);
        return;
      }

      const studentName = `${enrollment.student.firstName} ${enrollment.student.lastName || ''}`.trim();
      
      // Calculate true remaining balance after this payment
      const balanceDue = enrollment.feeLedgers.reduce((acc, l) => {
        const assigned = Number(l.assignedAmount);
        const paid = Number(l.paidAmount);
        const discount = Number(l.discountAmount);
        const fine = Number(l.fineAmount);
        return acc + Math.max(0, assigned + fine - discount - paid);
      }, 0);

      const success = await Msg91SmsService.sendFeePaymentConfirmation({
        mobile: enrollment.student.mobile,
        studentName,
        receiptNumber,
        amountPaid,
        balanceDue,
      });

      if (!success) {
        throw new Error("MSG91 API rejected the request or returned a failure state.");
      }

    } catch (error: any) {
      console.error(`[SMS] Dispatch failed for Receipt ${receiptNumber}:`, error.message);
      
      // Record failure in Audit Log for future retry mechanism
      await prisma.auditLog.create({
        data: {
          userId,
          action: AuditAction.PAYMENT_UPDATED, 
          entity: AuditEntity.FEE_PAYMENT,
          entityId: paymentId,
          details: {
            event: 'SMS_DELIVERY_FAILED',
            receiptNumber,
            error: error.message || 'Unknown Network Error'
          },
        }
      }).catch(e => console.error("[SMS] Failed to write audit log for SMS failure", e));
    }
  }
}