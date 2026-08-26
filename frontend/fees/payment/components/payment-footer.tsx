'use client';

import { Button } from '@/components/ui/button';

interface PaymentFooterProps {
  loading: boolean;
  disabled: boolean;

  onCancel: () => void;
  onSubmit: () => void;
}

export function PaymentFooter({
  loading,
  disabled,
  onCancel,
  onSubmit,
}: PaymentFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={disabled || loading}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        {loading
          ? 'Processing...'
          : 'Collect Fee'}
      </Button>
    </div>
  );
}