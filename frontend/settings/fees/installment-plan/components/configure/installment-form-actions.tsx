import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';

interface InstallmentFormActionsProps {
  isBalanced: boolean;
  feeComponentsCount: number;
  usedComponentIdsSize: number;
  isSaving: boolean;
  hasDuplicateComponents: boolean;
}

export function InstallmentFormActions({
  isBalanced,
  feeComponentsCount,
  usedComponentIdsSize,
  isSaving,
  hasDuplicateComponents,
}: InstallmentFormActionsProps) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        {isBalanced ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            All components are fully allocated.
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <AlertCircle className="h-4 w-4" />
            {feeComponentsCount - usedComponentIdsSize} component
            {feeComponentsCount - usedComponentIdsSize !== 1 ? 's' : ''} remaining.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push('/settings/fees/installment-plans')
          }
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSaving ||
            !isBalanced ||
            hasDuplicateComponents
          }
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Default Plan'}
        </Button>
      </div>
    </div>
  );
}