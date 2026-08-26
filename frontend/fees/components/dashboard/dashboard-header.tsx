'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AcademicYearSelect } from './academic-year-select';

interface DashboardHeaderProps {
  academicYears: any[];
  selectedAcademicYear: string;
  onAcademicYearChange: (id: string) => void;
  onRefresh: () => void;
}

export function DashboardHeader({
  academicYears,
  selectedAcademicYear,
  onAcademicYearChange,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Management Dashboard</h1>
        <p className="text-muted-foreground">Monitor collections, student ledger dues, and record payments.</p>
      </div>
      <div className="flex items-center gap-3">
        <AcademicYearSelect
          academicYears={academicYears}
          selectedId={selectedAcademicYear}
          onValueChange={onAcademicYearChange}
        />
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}