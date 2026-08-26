// frontend/settings/fee-structures/components/fee-structure-table.tsx

'use client';

import React, { useState } from 'react';
import { FeeStructureDTO, FeeStructureStatus } from '@/features/settings/fee-structures/types/fee-structure.types';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';
import { useFeeStructuresQuery } from '../api/fee-structure.query';
import { useFeeComponentsQuery } from '@/frontend/settings/fee-components/api/fee-component.query';
import { useAcademicYears } from '@/frontend/settings/academic-years/hooks/use-academic-years';
import { useActiveAcademicYear } from '@/frontend/settings/academic-years/hooks/use-active-academic-year';
import { useClasses } from '@/frontend/settings/classes/hooks/use-classes';
import { CreateFeeStructureDialog } from '../dialogs/create-fee-structure-dialog';
import { EditFeeStructureDialog } from '../dialogs/edit-fee-structure-dialog';
import { DeleteFeeStructureDialog } from '../dialogs/delete-fee-structure-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye } from 'lucide-react';

interface Props {
  tenantId: string;
}

interface AcademicYearOption {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  medium?: string;
  mediumName?: string;
}

export function FeeStructureTable({ tenantId }: Props) {
  const [page, setPage] = useState(1);
  const [userSelectedYear, setUserSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<FeeStructureStatus | undefined>(undefined);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<FeeStructureDTO | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<FeeStructureDTO | null>(null);

  // 1. Fetch Active Academic Year
  const { data: activeYearData } = useActiveAcademicYear();

  // 2. Fetch dropdown filter options
  const { data: yearsResponse } = useAcademicYears();
  const { data: classesResponse } = useClasses('ACTIVE');

  const rawYearsList = Array.isArray(yearsResponse)
    ? yearsResponse
    : (yearsResponse as unknown as { data?: AcademicYearOption[]; items?: AcademicYearOption[] })?.data ||
      (yearsResponse as unknown as { data?: AcademicYearOption[]; items?: AcademicYearOption[] })?.items || [];
  const academicYears = rawYearsList as AcademicYearOption[];

  const rawClassesList = Array.isArray(classesResponse)
    ? classesResponse
    : (classesResponse as unknown as { data?: ClassOption[]; items?: ClassOption[] })?.data ||
      (classesResponse as unknown as { data?: ClassOption[]; items?: ClassOption[] })?.items || [];
  const classes = rawClassesList as ClassOption[];

  // ✅ Derive selected year directly without useEffect to prevent state-in-effect warning
  const selectedYear =
    userSelectedYear !== null
      ? userSelectedYear
      : activeYearData?.id || '';

  // 3. Query Fee Structures
  const { data, isLoading, isError, error } = useFeeStructuresQuery({
    tenantId,
    page,
    limit: 100,
    academicYearId: selectedYear || undefined,
    classId: selectedClass || undefined,
    status: selectedStatus,
  });

  const feeStructuresList: FeeStructureDTO[] = Array.isArray(data)
    ? data
    : (data as unknown as { items?: FeeStructureDTO[]; data?: FeeStructureDTO[] })?.items ||
      (data as unknown as { items?: FeeStructureDTO[]; data?: FeeStructureDTO[] })?.data ||
      [];

  const { data: componentsData } = useFeeComponentsQuery({
    tenantId,
    status: 'ACTIVE',
    limit: 100,
  });

  const activeComponents: FeeComponentDTO[] = (
    (componentsData as unknown as { items?: FeeComponentDTO[]; data?: FeeComponentDTO[] })?.items ||
    (componentsData as unknown as { items?: FeeComponentDTO[]; data?: FeeComponentDTO[] })?.data ||
    []
  ) as FeeComponentDTO[];

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Academic Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setUserSelectedYear(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Academic Years</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id}>
                {ay.name} {ay.id === activeYearData?.id ? '(Active)' : ''}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Classes</option>
            {classes.map((c) => {
              const medium = c.medium || c.mediumName;
              const hasMediumInName = c.name?.toLowerCase().includes(medium?.toLowerCase() || '');
              const displayName = medium && !hasMediumInName ? `${c.name} (${medium})` : c.name;

              return (
                <option key={c.id} value={c.id}>
                  {displayName}
                </option>
              );
            })}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus || ''}
            onChange={(e) => {
              setSelectedStatus((e.target.value as FeeStructureStatus) || undefined);
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Structure
        </button>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-zinc-500">Loading Fee Structures...</div>
      ) : isError ? (
        <div className="p-8 text-center text-sm text-red-500">{(error as Error).message}</div>
      ) : feeStructuresList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
          No Fee Structures configured for the selected filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Academic Year</th>
                <th className="px-4 py-3">Class (Medium)</th>
                <th className="px-4 py-3">Component Breakdown</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {feeStructuresList.map((item) => {
                const className = item.class?.name || '-';

                // Look up matching class record from loaded `classes` array as a fallback
                const matchedClass = classes.find(
                  (c) => c.id === item.classId || c.id === item.class?.id
                );

                const itemClass = item.class as { medium?: string; mediumName?: string } | undefined;
                const medium =
                  itemClass?.medium ||
                  itemClass?.mediumName ||
                  matchedClass?.medium ||
                  matchedClass?.mediumName;

                const hasMediumInName = className.toLowerCase().includes(medium?.toLowerCase() || '');
                const formattedClassWithMedium =
                  medium && !hasMediumInName ? `${className} (${medium})` : className;

                const lineItems = item.items || [];

                return (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.academicYear?.name || '-'}
                    </td>
                    
                    {/* Class with Medium */}
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {formattedClassWithMedium}
                    </td>

                    {/* Component Breakdown with Popover List */}
                    <td className="px-4 py-3">
                      <Popover>
                        <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer">
                          <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{lineItems.length} {lineItems.length === 1 ? 'Component' : 'Components'}</span>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-72 p-3 shadow-lg border border-zinc-200 dark:border-zinc-800">
                          <div className="space-y-2">
                            <div className="border-b border-zinc-100 pb-1.5 dark:border-zinc-800">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                Fee Breakdown — {formattedClassWithMedium}
                              </h4>
                            </div>

                            {/* Component Breakdown List */}
                            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                              {lineItems.length > 0 ? (
                                lineItems.map((line) => (
                                  <div
                                    key={line.id}
                                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                  >
                                    <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                                      {line.feeComponent?.name || 'Fee Component'}
                                    </span>
                                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                                      ₹{(line.amount ?? 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-zinc-500 py-2 text-center">No component allocations added.</p>
                              )}
                            </div>

                            {/* Notes / Remarks Section inside Popover */}
                            {item.notes && (
                              <div className="rounded-md border border-amber-200 bg-amber-50/70 p-2.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                                    Notes / Remarks
                                  </p>
                                </div>
                                <p className="text-xs font-normal text-amber-950 dark:text-amber-200 leading-relaxed whitespace-pre-wrap pl-3">
                                  {item.notes}
                                </p>
                              </div>
                            )}

                            {/* Total Amount */}
                            <div className="border-t border-zinc-100 pt-1.5 flex items-center justify-between font-bold text-xs text-blue-700 dark:text-blue-400 dark:border-zinc-800">
                              <span>Total Amount:</span>
                              <span className="font-mono">
                                ₹{(item.totalAmount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      ₹{(item.totalAmount ?? 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : item.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => setSelectedForEdit(item)}
                        className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedForDelete(item)}
                        className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {(data as unknown as { meta?: { page: number; totalPages: number; total: number } })?.meta && (
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
          <span>
            Page {(data as unknown as { meta: { page: number; totalPages: number; total: number } }).meta.page} of{' '}
            {(data as unknown as { meta: { page: number; totalPages: number; total: number } }).meta.totalPages} ({' '}
            {(data as unknown as { meta: { page: number; totalPages: number; total: number } }).meta.total} total)
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-50 dark:border-zinc-700"
            >
              Previous
            </button>
            <button
              disabled={
                page >=
                (data as unknown as { meta: { totalPages: number } }).meta.totalPages
              }
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-50 dark:border-zinc-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <CreateFeeStructureDialog
        tenantId={tenantId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        activeComponents={activeComponents}
      />

      <EditFeeStructureDialog
        tenantId={tenantId}
        structure={selectedForEdit}
        open={Boolean(selectedForEdit)}
        onOpenChange={(open) => !open && setSelectedForEdit(null)}
        activeComponents={activeComponents}
      />

      <DeleteFeeStructureDialog
        tenantId={tenantId}
        structure={selectedForDelete}
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
      />
    </div>
  );
}