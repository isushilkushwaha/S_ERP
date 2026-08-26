import { prisma } from '@/lib/prisma';

export class ReceiptService {
  async getReceiptByPaymentId(paymentId: string) {
    const payment = await prisma.feePayment.findUnique({
      where: { id: paymentId },
      include: {
        receipt: true,
        receivedBy: { select: { fullName: true } },
        enrollment: {
          include: {
            student: true,
            class: true,
            section: true,
            academicYear: true,
          }
        },
        paymentItems: {
          include: {
            ledger: {
              include: { feeComponent: true }
            }
          }
        }
      }
    });

    if (!payment || !payment.receipt) {
      throw new Error('Receipt not found for this transaction.');
    }

    // Fetch dynamic school profile if available, else fallback
    const school = await prisma.schoolProfile.findFirst({
      where: { isActive: true }
    });

    return {
      school: {
        name: school?.schoolName || 'School Management System',
        address: school?.addressLine1 ? `${school.addressLine1}, ${school.city}` : 'Main Campus, City',
        phone: school?.phone || '+91 9876543210',
        email: school?.email || 'support@school.edu',
        logo: school?.logoUrl || undefined,
      },
      receipt: {
        receiptNumber: payment.receipt.receiptNumber,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId || undefined,
        amountPaid: Number(payment.amountPaid),
        discount: Number(payment.discount),
        fine: Number(payment.fine),
        remarks: payment.remarks || undefined,
        receivedBy: payment.receivedBy.fullName,
      },
      student: {
        admissionNumber: payment.enrollment.admissionNumber,
        studentName: `${payment.enrollment.student.firstName} ${payment.enrollment.student.lastName || ''}`.trim(),
        fatherName: payment.enrollment.student.fatherName,
        className: payment.enrollment.class.name,
        sectionName: payment.enrollment.section?.name ?? 'No Section',
        academicYearName: payment.enrollment.academicYear.name,
      },
      items: payment.paymentItems.map(item => ({
        componentName: item.ledger.feeComponent.name,
        allocatedAmount: Number(item.allocatedAmount),
      }))
    };
  }
}