"use client";

import { useState } from "react";

import {
  AcademicYearTable,
  CreateAcademicYearDialog,
  useAcademicYears,
  type AcademicYearStatus,
} from "@/frontend/settings/academic-years";

export default function AcademicYearsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    AcademicYearStatus | undefined
  >(undefined);

  const [createDialogOpen, setCreateDialogOpen] =
    useState(false);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useAcademicYears({
    page,
    limit,
    search,
    status,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Academic Years
        </h1>

        <p className="text-muted-foreground">
          Create, activate and manage academic years
          for your school.
        </p>
      </div>

      {/* Table */}
      <AcademicYearTable
        data={data?.data ?? []}
        loading={isLoading || isFetching}
        page={data?.meta.page ?? page}
        limit={data?.meta.limit ?? limit}
        total={data?.meta.total ?? 0}
        search={search}
        status={status ?? ""}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(
            value
              ? (value as AcademicYearStatus)
              : undefined
          );
          setPage(1);
        }}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        onCreate={() =>
          setCreateDialogOpen(true)
        }
      />

      {/* Create Dialog */}
      <CreateAcademicYearDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}