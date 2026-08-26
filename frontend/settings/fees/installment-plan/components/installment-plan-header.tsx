import React from 'react';
import { Layers, Calendar } from 'lucide-react';

interface InstallmentPlanHeaderProps {
  activeAcademicYear?: { name?: string } | null;
}

export function InstallmentPlanHeader({
  activeAcademicYear,
}: InstallmentPlanHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            Installment Plans
          </h1>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Configure default payment schedules for class fee structures.
        </p>
      </div>

      {activeAcademicYear && (
        <div className="flex w-fit items-center gap-2 rounded-lg border bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary">
          <Calendar className="h-3.5 w-3.5" />
          <div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Active Academic Year
            </p>
            <p className="font-semibold">{activeAcademicYear.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}