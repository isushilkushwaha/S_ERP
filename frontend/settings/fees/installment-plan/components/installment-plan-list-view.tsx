// frontend/settings/fees/installment-plan/components/installment-plan-list-view.tsx

'use client';

import React, { useEffect } from 'react';
import { useActiveAcademicYear } from '@/frontend/settings/academic-years';
import { useAcademicYears } from '@/frontend/settings/academic-years/hooks/use-academic-years';
import { useClasses } from '@/frontend/settings/classes/hooks';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hooks
import { useFeeStructures } from '../hooks/use-fee-structure';
import { useInstallmentPlanFilters } from '../hooks/use-installment-plan-filters';
import { useInstallmentPlanSummary } from '../hooks/use-installment-plan-summary';

// Components
import { InstallmentPlanHeader } from './installment-plan-header';
import { InstallmentPlanSummary } from './installment-plan-summary';
import { InstallmentPlanFilters } from './installment-plan-filters';
import { InstallmentPlanTable } from './installment-plan-table';
import { InstallmentPlanLoading } from './installment-plan-loading';
import { InstallmentPlanEmpty } from './installment-plan-empty';
import { InstallmentPlanError } from './installment-plan-error';

export function InstallmentPlanListView() {
  // Academic Years
  const {
    data: activeAcademicYear,
    isLoading: isLoadingActiveAY,
  } = useActiveAcademicYear();

  const { data: academicYearsData } = useAcademicYears();
  const academicYears: any[] = Array.isArray(academicYearsData)
    ? academicYearsData
    : Array.isArray((academicYearsData as any)?.data)
    ? (academicYearsData as any).data
    : [];

  // Classes
  const { data: classesData } = useClasses('ACTIVE' as any);
  const classes: any[] = Array.isArray(classesData)
    ? classesData
    : Array.isArray((classesData as any)?.data)
    ? (classesData as any).data
    : [];

  // Default active academic year syncing on load
  const [selectedAcademicYearIdState, setSelectedAcademicYearIdState] = React.useState('');

  useEffect(() => {
    if (activeAcademicYear?.id && !selectedAcademicYearIdState) {
      setSelectedAcademicYearIdState(activeAcademicYear.id);
    }
  }, [activeAcademicYear, selectedAcademicYearIdState]);

  // Data fetching hook using current selection with active academic year fallback
  const targetAcademicYearId = selectedAcademicYearIdState || activeAcademicYear?.id;
  const {
    feeStructures,
    isLoading: isLoadingStructures,
    error: fetchError,
    refresh,
  } = useFeeStructures(targetAcademicYearId);

  // Filters hook initialized with the actual fetched feeStructures array
  const {
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    selectedClassId,
    setSelectedClassId,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredStructures: activeFilteredStructures,
    handleResetFilters,
  } = useInstallmentPlanFilters(feeStructures, targetAcademicYearId || '');

  // Summary calculations based on fetched structures
  const summary = useInstallmentPlanSummary(feeStructures);

  const isLoading = isLoadingActiveAY || isLoadingStructures;

  return (
    <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-3 p-3 lg:p-4">
      {/* HEADER */}
      <InstallmentPlanHeader activeAcademicYear={activeAcademicYear} />

      {/* SUMMARY CARDS */}
      <InstallmentPlanSummary summary={summary} />

      {/* FILTERS */}
      <InstallmentPlanFilters
        academicYears={academicYears}
        classes={classes}
        selectedAcademicYearId={selectedAcademicYearId}
        setSelectedAcademicYearId={(id) => {
          setSelectedAcademicYearId(id);
          setSelectedAcademicYearIdState(id);
        }}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* ERROR */}
      {fetchError && (
        <InstallmentPlanError error={fetchError} onRefresh={refresh} />
      )}

      {/* TABLE HEADER & REFRESH */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-semibold">Fee Structure Plans</h2>
          <p className="text-[11px] text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {activeFilteredStructures.length}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">
              {feeStructures.length}
            </span>{' '}
            fee structures
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={refresh}
          disabled={isLoadingStructures}
        >
          <RefreshCw
            className={cn(
              'mr-1.5 h-3.5 w-3.5',
              isLoadingStructures && 'animate-spin'
            )}
          />
          Refresh
        </Button>
      </div>

      {/* MAIN CONTENT AREA */}
      {isLoading ? (
        <InstallmentPlanLoading />
      ) : activeFilteredStructures.length === 0 ? (
        <InstallmentPlanEmpty onResetFilters={handleResetFilters} />
      ) : (
        <InstallmentPlanTable
          filteredStructures={activeFilteredStructures}
          activeAcademicYear={activeAcademicYear}
        />
      )}
    </div>
  );
}