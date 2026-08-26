'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFeeDashboard, useAcademicYears } from '@/frontend/fees/hooks/use-fees';
import { DashboardHeader } from '@/frontend/fees/components/dashboard/dashboard-header';
import { SummaryCards } from '@/frontend/fees/components/dashboard/summary-cards';
import { FeeToolbar } from '@/frontend/fees/components/table/fee-toolbar';
import { FeeTable } from '@/frontend/fees/components/table/fee-table';

export default function FeeDashboardPage() {
  const router = useRouter();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Fetch academic years list for the global dropdown
  const { data: academicYearsData } = useAcademicYears();
  
  // Resolve active or selected academic year ID
  const activeYearId =
    selectedAcademicYear ||
    academicYearsData?.find((y: any) => y.status === 'ACTIVE')?.id ||
    academicYearsData?.[0]?.id;

  // Fetch dashboard metrics and student list
  const { data, isLoading, refetch } = useFeeDashboard({
    academicYearId: activeYearId,
    page,
    limit: 20,
    search: searchQuery,
    classId: selectedClass === 'all' ? undefined : selectedClass,
    feeStatus: selectedStatus === 'all' ? undefined : selectedStatus,
  });

  const handleRowClick = (enrollmentId: string) => {
    // Navigate to the standalone student fee profile page
    router.push(`/dashboard/fees/${enrollmentId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header & Academic Year Selection */}
      <DashboardHeader
        academicYears={academicYearsData || []}
        selectedAcademicYear={activeYearId || ''}
        onAcademicYearChange={setSelectedAcademicYear}
        onRefresh={() => refetch()}
      />

      {/* Summary Metrics Cards */}
      {data?.summary && <SummaryCards summary={data.summary} />}

      {/* Filter Toolbar (Search, Class, Status) */}
      <FeeToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        classes={data?.filters?.classes || []}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* High-Performance Student Table */}
      <FeeTable
        data={data?.students || []}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
    </div>
  );
}