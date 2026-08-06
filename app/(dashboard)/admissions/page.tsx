// app/(dashboard)/admissions/page.tsx

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/frontend/admissions/components/page-header";
import { AdmissionTable } from "@/frontend/admissions/components/table/admission-table";

interface AcademicYear {
  id: string;
  status?: string;
  isActive?: boolean;
}

export default function AdmissionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // 1. Fetch academic years from settings
  const { data: academicYearsData } = useQuery({
    queryKey: ["academic-years-list"],
    queryFn: async () => {
      const res = await fetch("/api/settings/academic-years");
      if (!res.ok) return [];
      const json = await res.json();
      const list = json.data || json.items || json || [];
      return Array.isArray(list) ? list : [];
    },
  });

  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : [];

  // ✅ Derive initial selected academic year directly without using useEffect + setState
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("ALL");
  const [isInitialized, setIsInitialized] = useState(false);

  // Safely seed the initial selection once data resolves without triggering effect cascading
  if (academicYears.length > 0 && !isInitialized) {
    const activeYear = academicYears.find(
      (ay: AcademicYear) => ay.status === "ACTIVE" || ay.isActive === true
    );
    const defaultId = activeYear ? activeYear.id : academicYears[0]?.id || "ALL";
    setSelectedAcademicYearId(defaultId);
    setIsInitialized(true);
  }

  // 2. Fetch admissions filtered by selected academic year and status
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admissions-list", page, search, selectedAcademicYearId, selectedStatus],
    queryFn: async () => {
      const url = new URL("/api/admissions", window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "10");
      if (search) url.searchParams.set("search", search);
      
      if (selectedAcademicYearId && selectedAcademicYearId !== "ALL") {
        url.searchParams.set("academicYearId", selectedAcademicYearId);
      }
      if (selectedStatus && selectedStatus !== "ALL") {
        url.searchParams.set("status", selectedStatus);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch admissions list.");
      return res.json();
    },
    enabled: Boolean(selectedAcademicYearId),
  });

  // ✅ Toggle Status Mutation (ACTIVE <-> LEFT)
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const nextStatus = currentStatus === "ACTIVE" ? "LEFT" : "ACTIVE";
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions-list"] });
    },
  });

  const admissionsList = data?.data || data?.items || [];
  const totalCount = data?.pagination?.total || data?.meta?.total || 0;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col space-y-6 p-4 md:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <PageHeader
        totalCount={totalCount}
        isRefetching={isRefetching}
        onRefresh={() => refetch()}
      />

      <div className="flex-1 w-full">
        <AdmissionTable
          data={admissionsList}
          isLoading={isLoading}
          totalCount={totalCount}
          page={page}
          academicYears={academicYears}
          selectedAcademicYearId={selectedAcademicYearId}
          selectedStatus={selectedStatus}
          onPageChange={(newPage) => setPage(newPage)}
          onSearchChange={(query) => {
            setSearch(query);
            setPage(1);
          }}
          onAcademicYearChange={(yearId) => {
            setSelectedAcademicYearId(yearId);
            setPage(1);
          }}
          onStatusChange={(status) => {
            setSelectedStatus(status);
            setPage(1);
          }}
          onToggleStatus={(id, currentStatus) => {
            toggleStatusMutation.mutate({ id, currentStatus });
          }}
          onRefresh={() => refetch()}
        />
      </div>
    </div>
  );
}