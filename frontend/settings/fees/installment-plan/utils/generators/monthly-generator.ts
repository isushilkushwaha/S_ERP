import { InstallmentItemInput } from '../installment-calculator';

export function generateMonthlyPlan(startDate: Date, endDate: Date, componentIds: string[]): InstallmentItemInput[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const months: Date[] = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  const count = months.length || 1;
  const basePercentage = Number((100 / count).toFixed(2));
  const defaultCompId = componentIds[0] || null;

  return months.map((date, idx) => ({
    name: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
    dueRule: 'FIXED_DATE',
    dueDay: 10,
    dueMonth: date.getMonth() + 1,
    calculationType: 'PERCENTAGE',
    value: idx === count - 1 ? Number((100 - basePercentage * (count - 1)).toFixed(2)) : basePercentage,
    displayOrder: idx + 1,
    feeComponentId: defaultCompId,
  }));
}