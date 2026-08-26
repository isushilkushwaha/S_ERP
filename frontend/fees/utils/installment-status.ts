import {
  StudentFeeInstallment,
} from '../types/fee-payment.types';

export function getInstallmentStatus(
  installment: StudentFeeInstallment,
): StudentFeeInstallment['status'] {
  const assigned = Number(
    installment.assignedAmount || 0,
  );

  const paid = Number(
    installment.paidAmount || 0,
  );

  const balance = Math.max(
    0,
    assigned - paid,
  );

  if (balance <= 0) {
    return 'PAID';
  }

  if (paid > 0) {
    return 'PARTIAL';
  }

  if (!installment.dueDate) {
    return 'UPCOMING';
  }

  const today = new Date();
  const dueDate = new Date(
    installment.dueDate,
  );

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'OVERDUE';
  }

  return 'DUE';
}