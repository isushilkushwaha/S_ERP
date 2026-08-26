import { InstallmentItemInput } from '../installment-calculator';

export function generateAnnualPlan(componentIds: string[]): InstallmentItemInput[] {
  const defaultCompId = componentIds[0] || '';
  return [
    {
      name: 'Full Annual Fee',
      dueRule: 'ADMISSION_DATE',
      calculationType: 'PERCENTAGE',
      value: 100,
      displayOrder: 1,
      feeComponentId: defaultCompId,
    },
  ];
}