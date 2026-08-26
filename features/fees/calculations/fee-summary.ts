export interface LedgerTotals {
  assigned: number;
  paid: number;
  discount: number;
  fine: number;
  due: number;
}

export function calculateLedgerTotals(ledgers: Array<{
  assignedAmount: any;
  paidAmount: any;
  discountAmount: any;
  fineAmount: any;
}>): LedgerTotals {
  let assigned = 0;
  let paid = 0;
  let discount = 0;
  let fine = 0;

  for (const item of ledgers) {
    assigned += Number(item.assignedAmount || 0);
    paid += Number(item.paidAmount || 0);
    discount += Number(item.discountAmount || 0);
    fine += Number(item.fineAmount || 0);
  }

  // Formula: Due = Assigned + Fine - Discount - Paid
  const due = Math.max(0, assigned + fine - discount - paid);

  return { assigned, paid, discount, fine, due };
}

export function deriveFeeStatus(assigned: number, due: number, paid: number): 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE' {
  if (due <= 0 && paid > 0) return 'PAID';
  if (paid === 0) return 'DUE';
  if (paid > 0 && due > 0) return 'PARTIAL';
  return 'DUE';
}