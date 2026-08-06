// frontend/settings/fee-components/components/fee-component-table.tsx

'use client';

import React, { useState } from 'react';
import { FeeComponentDTO, Status } from '@/features/settings/fee-components/types/fee-component.types';
import { useUpdateFeeComponentMutation } from '../api/fee-component.mutation';
import { useFeeComponentsQuery } from '../api/fee-component.query';
import { CreateFeeComponentDialog } from '@/frontend/settings/fee-components/dialogs/create-fee-component-dialog';
import { EditFeeComponentDialog } from '@/frontend/settings/fee-components/dialogs/edit-fee-component-dialog';
import { DeleteFeeComponentDialog } from '@/frontend/settings/fee-components/dialogs/delete-fee-component-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  tenantId: string;
}

export function FeeComponentTable({ tenantId }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(undefined);

  // Modal dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<FeeComponentDTO | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<FeeComponentDTO | null>(null);

  const { data, isLoading, isError, error } = useFeeComponentsQuery({
    tenantId,
    page,
    limit: 10,
    search,
    status: statusFilter,
  });

  const updateMutation = useUpdateFeeComponentMutation(tenantId);

  // Sort components sequentially by Display Order before rendering
  const rawItems: FeeComponentDTO[] = data?.items || [];
  const sortedComponents = [...rawItems].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const handleStatusToggle = async (item: FeeComponentDTO) => {
    const nextStatus: Status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const toastId = toast.loading(`Updating status for ${item.name}...`);

    try {
      await updateMutation.mutateAsync({
        id: item.id,
        data: { status: nextStatus },
      });
      toast.success(
        `Status changed to ${nextStatus.toLowerCase()} for "${item.name}"`,
        { id: toastId }
      );
    } catch (err: unknown) {
      const errObj = err as Error;
      toast.error(errObj?.message || 'Failed to update status', { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64 rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <select
            value={statusFilter || ''}
            onChange={(e) => {
              setStatusFilter((e.target.value as Status) || undefined);
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
        >
          + Create Component
        </button>
      </div>

      {/* Main Table View */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-zinc-500">Loading Fee Components...</div>
      ) : isError ? (
        <div className="p-8 text-center text-sm text-red-500">{(error as Error).message}</div>
      ) : sortedComponents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
          No Fee Components match your filter criteria.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Mandatory</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sortedComponents.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  {/* Highlighted Order Badge */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 font-mono text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.displayOrder ?? '-'}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {item.code}
                  </td>

                  {/* Description Popover Card Column */}
                  <td className="px-4 py-3">
                    {item.description ? (
                      <Popover>
                        <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer transition-all">
                          <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="max-w-[130px] truncate">{item.description}</span>
                        </PopoverTrigger>
                        
                        <PopoverContent align="start" className="w-80 p-3.5 shadow-xl border border-blue-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 rounded-xl">
                          <div className="space-y-2.5">
                            {/* Popover Header */}
                            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                <Info className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                                Component Details
                              </h4>
                            </div>

                            {/* Description Card */}
                            <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-3 dark:border-zinc-700/60 dark:bg-zinc-800/60">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {item.name}
                                </span>
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                  {item.code}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="inline-flex rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                        No details
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        item.isRequired
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {item.isRequired ? 'Required' : 'Optional'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleStatusToggle(item)}
                      title="Click to toggle status"
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${
                        item.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>

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
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {data?.meta && (
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
          <span>
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
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
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-50 dark:border-zinc-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <CreateFeeComponentDialog
        tenantId={tenantId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditFeeComponentDialog
        tenantId={tenantId}
        component={selectedForEdit}
        open={Boolean(selectedForEdit)}
        onOpenChange={(open) => !open && setSelectedForEdit(null)}
      />

      <DeleteFeeComponentDialog
        tenantId={tenantId}
        component={selectedForDelete}
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
      />
    </div>
  );
}