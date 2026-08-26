import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { InstallmentPlanFormValues } from '../schemas/installment-plan.schema';

interface UseInstallmentMilestonesProps {
  append: UseFieldArrayAppend<InstallmentPlanFormValues, 'items'>;
  remove: UseFieldArrayRemove;
  fieldsLength: number;
  canAddMilestone: boolean;
  setOpenPopovers: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export function useInstallmentMilestones({
  append,
  remove,
  fieldsLength,
  canAddMilestone,
  setOpenPopovers,
}: UseInstallmentMilestonesProps) {
  const handleAddMilestone = () => {
    if (!canAddMilestone) {
      return;
    }

    append({
      name: `Installment ${fieldsLength + 1}`,
      dueRule: 'FIXED_DATE',
      dueDate: '',
      calculationType: 'FIXED_AMOUNT',
      value: 0,
      displayOrder: fieldsLength + 1,
      feeComponentIds: [],
    });
  };

  const handleRemoveMilestone = (index: number) => {
    if (fieldsLength <= 1) {
      return;
    }

    remove(index);

    setOpenPopovers((previous) => {
      const next: Record<number, boolean> = {};

      Object.entries(previous).forEach(([key, value]) => {
        const oldIndex = Number(key);

        if (oldIndex < index) {
          next[oldIndex] = value;
        }

        if (oldIndex > index) {
          next[oldIndex - 1] = value;
        }
      });

      return next;
    });
  };

  return {
    handleAddMilestone,
    handleRemoveMilestone,
  };
}