import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { installmentPlanSchema, InstallmentPlanFormValues } from '../schemas/installment-plan.schema';

export function useInstallmentForm() {
  const form = useForm<InstallmentPlanFormValues>({
    resolver: zodResolver(installmentPlanSchema) as any,
    defaultValues: {
      academicYearId: '',
      classId: '',
      name: '',
      code: '',
      planType: 'CUSTOM',
      effectiveFrom: '',
      effectiveTo: '',
      items: [],
    },
    mode: 'onChange',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return {
    ...form,
    ...fieldArray,
  };
}