import { StudentFeeRepository } from '../repositories/student-fee.repository';
import {
  calculateLedgerTotals,
  deriveFeeStatus,
} from '../calculations/fee-summary';

export class StudentFeeService {
  private repository = new StudentFeeRepository();

  async getStudentFeeProfile(enrollmentId: string) {
    const enrollment =
      await this.repository.getEnrollmentFeeDetails(enrollmentId);

    if (!enrollment) {
      throw new Error('Student enrollment profile not found.');
    }

    // ============================================================
    // DISCOUNT
    // ============================================================

    const enrollmentDiscount =
      enrollment.enrollmentDiscounts?.[0] ?? null;

    // ============================================================
    // STUDENT NAME
    // ============================================================

    const studentName = [
      enrollment.student.firstName,
      enrollment.student.middleName,
      enrollment.student.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    // ============================================================
    // OVERALL FEE TOTALS
    // ============================================================

    const ledgerTotals = calculateLedgerTotals(
      enrollment.feeLedgers
    );

    const overallStatus = deriveFeeStatus(
      ledgerTotals.assigned,
      ledgerTotals.due,
      ledgerTotals.paid
    );

    // ============================================================
    // FEE LEDGER
    //
    // One row = one fee component.
    //
    // Example:
    // Tuition Fee       ₹5000
    // Admission Fee     ₹2000
    // Examination Fee   ₹1000
    // ============================================================

    const ledgers = enrollment.feeLedgers.map((ledger) => {
      const assigned = Number(ledger.assignedAmount);
      const paid = Number(ledger.paidAmount);
      const discount = Number(ledger.discountAmount);
      const fine = Number(ledger.fineAmount);

      const due = Math.max(
        0,
        assigned + fine - discount - paid
      );

      const status = deriveFeeStatus(
        assigned,
        due,
        paid
      );

      return {
        ledgerId: ledger.id,

        componentName:
          ledger.feeComponent.name,

        componentCode:
          ledger.feeComponent.code,

        assignedAmount: assigned,
        paidAmount: paid,
        discountAmount: discount,
        fineAmount: fine,
        balanceAmount: due,

        status,

        dueDate: ledger.dueDate,
        lastPaymentDate:
          ledger.lastPaymentDate,
      };
    });

    // ============================================================
    // INSTALLMENT / MILESTONE TRACKING
    //
    // IMPORTANT:
    //
    // FeeInstallment
    //       ↓
    // components[]
    //       ↓
    // FeeInstallmentComponent
    //
    // One milestone can contain multiple fee components.
    // ============================================================

    const installments =
      enrollment.feeInstallments.map((installment) => {
        // --------------------------------------------------------
        // Calculate milestone totals
        // --------------------------------------------------------

        const assignedAmount =
          installment.components.reduce(
            (total, item) =>
              total + Number(item.assignedAmount),
            0
          );

        const paidAmount =
          installment.components.reduce(
            (total, item) =>
              total + Number(item.paidAmount),
            0
          );

        const balanceAmount = Math.max(
          0,
          assignedAmount - paidAmount
        );

        // --------------------------------------------------------
        // Determine milestone status
        // --------------------------------------------------------

        let status:
          | 'PAID'
          | 'PARTIAL'
          | 'OVERDUE'
          | 'DUE'
          | 'UPCOMING';

        if (balanceAmount <= 0) {
          status = 'PAID';
        } else if (paidAmount > 0) {
          status = 'PARTIAL';
        } else {
          const today = new Date();

          today.setHours(
            0,
            0,
            0,
            0
          );

          const dueDate =
            new Date(installment.dueDate);

          dueDate.setHours(
            0,
            0,
            0,
            0
          );

          if (dueDate < today) {
            status = 'OVERDUE';
          } else if (
            dueDate.getTime() ===
            today.getTime()
          ) {
            status = 'DUE';
          } else {
            status = 'UPCOMING';
          }
        }

        // --------------------------------------------------------
        // Components inside this milestone
        // --------------------------------------------------------

        const components =
          installment.components.map((item) => {
            const componentAssigned =
              Number(item.assignedAmount);

            const componentPaid =
              Number(item.paidAmount);

            const componentBalance =
              Math.max(
                0,
                componentAssigned -
                  componentPaid
              );

            let componentStatus:
              | 'PAID'
              | 'PARTIAL'
              | 'DUE';

            if (
              componentBalance <= 0
            ) {
              componentStatus = 'PAID';
            } else if (
              componentPaid > 0
            ) {
              componentStatus = 'PARTIAL';
            } else {
              componentStatus = 'DUE';
            }

            return {
              installmentComponentId:
                item.id,

              ledgerId:
                item.ledgerId,

              componentName:
                item.ledger.feeComponent.name,

              componentCode:
                item.ledger.feeComponent.code,

              assignedAmount:
                componentAssigned,

              paidAmount:
                componentPaid,

              balanceAmount:
                componentBalance,

              status:
                componentStatus,
            };
          });

        return {
          installmentId:
            installment.id,

          sequence:
            installment.sequence,

          name:
            installment.name,

          dueDate:
            installment.dueDate,

          assignedAmount,
          paidAmount,
          balanceAmount,

          status,

          components,
        };
      });

    // ============================================================
    // PAYMENT HISTORY
    // ============================================================

    const paymentHistory =
      enrollment.feePayments.map((payment) => ({
        paymentId: payment.id,

        receiptNumber:
          payment.receiptNumber,

        paymentMethod:
          payment.paymentMethod,

        gateway:
          payment.gateway,

        paymentDate:
          payment.paymentDate,

        amountPaid:
          Number(payment.amountPaid),

        discount:
          Number(payment.discount),

        fine:
          Number(payment.fine),

        transactionId:
          payment.transactionId,

        status:
          payment.status,

        remarks:
          payment.remarks,

        receivedBy:
          payment.receivedBy.fullName,

        allocatedHeads:
          payment.paymentItems.map(
            (item) => ({
              componentName:
                item.ledger
                  .feeComponent
                  .name,

              allocatedAmount:
                Number(
                  item.allocatedAmount
                ),
            })
          ),
      }));

    // ============================================================
    // FINAL RESPONSE
    // ============================================================

    return {
      student: {
        studentId:
          enrollment.student.id,

        enrollmentId:
          enrollment.id,

        studentCode:
          enrollment.student.studentCode,

        admissionNumber:
          enrollment.admissionNumber,

        rollNumber:
          enrollment.rollNumber,

        studentName,

        fatherName:
          enrollment.student.fatherName,

        motherName:
          enrollment.student.motherName,

        mobile:
          enrollment.student.mobile || '',

        photo:
          enrollment.student.photo,

        className:
          enrollment.class.name,

        sectionName:
  enrollment.section?.name ?? 'No Section',

        academicYearName:
          enrollment.academicYear.name,
      },

      summary: {
        totalAssigned:
          ledgerTotals.assigned,

        totalPaid:
          ledgerTotals.paid,

        totalDiscount:
          ledgerTotals.discount,

        totalFine:
          ledgerTotals.fine,

        totalDue:
          ledgerTotals.due,

        status:
          overallStatus,
      },

      // ========================================================
      // ADMISSION DISCOUNT
      // ========================================================

      discount: enrollmentDiscount
        ? {
            id:
              enrollmentDiscount.id,

            name:
              enrollmentDiscount
                .discountType.name,

            code:
              enrollmentDiscount
                .discountType.code,

            originalAmount:
              Number(
                enrollmentDiscount
                  .originalAmount
              ),

            appliedAmount:
              Number(
                enrollmentDiscount
                  .appliedAmount
              ),

            finalAmount:
              Number(
                enrollmentDiscount
                  .finalAmount
              ),

            appliedPercentage:
              enrollmentDiscount
                .appliedPercentage !==
              null
                ? Number(
                    enrollmentDiscount
                      .appliedPercentage
                  )
                : null,

            remarks:
              enrollmentDiscount
                .remarks ?? null,

            approvedBy:
              enrollmentDiscount
                .approvedBy?.fullName ??
              null,
          }
        : null,

      // Fee component ledger
      ledgers,

      // Admission-time milestones
      installments,

      // Payment history
      paymentHistory,
    };
  }
}