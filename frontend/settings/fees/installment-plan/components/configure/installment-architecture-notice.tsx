import React from 'react';
import { AlertCircle } from 'lucide-react';

export function InstallmentArchitectureNotice() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="font-semibold text-amber-900 dark:text-amber-200">
          Default Plan Architecture
        </p>
        <p className="mt-1 text-amber-800/80 dark:text-amber-200/80">
          This schedule is the default template for this class fee structure. During admission, the administrator can customize the student's installment schedule without changing this default plan.
        </p>
      </div>
    </div>
  );
}