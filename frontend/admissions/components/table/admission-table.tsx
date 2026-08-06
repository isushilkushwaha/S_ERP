// frontend/admissions/components/table/admission-table.tsx

"use client";
"use no memo";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  RotateCw,
  Download,
  X,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getAdmissionColumns, AdmissionTableRow } from "./admission-columns";

export interface AcademicYearOption {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

interface AdmissionTableProps {
  data: AdmissionTableRow[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  academicYears?: AcademicYearOption[];
  selectedAcademicYearId?: string;
  selectedStatus?: string;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onAcademicYearChange?: (yearId: string) => void;
  onStatusChange?: (status: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AdmissionTable({
  data = [],
  isLoading,
  totalCount = 0,
  page,
  academicYears = [],
  selectedAcademicYearId = "ALL",
  selectedStatus = "ALL",
  onPageChange,
  onSearchChange,
  onAcademicYearChange,
  onStatusChange,
  onToggleStatus,
  onRefresh,
  onExport,
}: AdmissionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search typing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, onSearchChange]);

  const columns = getAdmissionColumns({ onToggleStatus });
  const tableData = Array.isArray(data) ? data : [];
  const safeAcademicYears = Array.isArray(academicYears) ? academicYears : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / 10) || 1,
  });

  return (
    <Card className="w-full border border-zinc-200/80 dark:border-zinc-800 shadow-xs rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col justify-between">
      {/* TOOLBAR WITH FILTERS */}
      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search student, admission no..."
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ACADEMIC YEAR FILTER */}
          {onAcademicYearChange && (
            <Select
              value={selectedAcademicYearId || "ALL"}
              onValueChange={(val) => onAcademicYearChange(val ?? "ALL")}
            >
              <SelectTrigger className="h-9 w-full sm:w-56 text-xs rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-1.5 truncate">
                  <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">
                    {selectedAcademicYearId === "ALL" || !selectedAcademicYearId
                      ? "All Academic Years"
                      : safeAcademicYears.find((ay) => ay.id === selectedAcademicYearId)?.name ||
                        "Select Session"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="text-xs rounded-xl z-50">
                <SelectItem value="ALL">All Academic Years</SelectItem>
                {safeAcademicYears.map((ay) => (
                  <SelectItem key={ay.id} value={ay.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{ay.name}</span>
                      {(ay.status === "ACTIVE" || ay.isActive) && (
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          (Active)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* STATUS FILTER */}
          {onStatusChange && (
            <Select
              value={selectedStatus || "ALL"}
              onValueChange={(val) => onStatusChange(val ?? "ALL")}
            >
              <SelectTrigger className="h-9 w-full sm:w-40 text-xs rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="text-xs rounded-xl z-50">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LEFT">Left / Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-9 px-3 text-xs rounded-xl border-zinc-200 dark:border-zinc-800"
            >
              <RotateCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Refresh</span>
            </Button>
          )}
          {onExport && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 px-3 text-xs rounded-xl border-zinc-200 dark:border-zinc-800"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* TABLE BODY (DESKTOP) */}
      <CardContent className="p-0 flex-1 hidden md:block overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-3 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length} className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3.5 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 text-xs transition-colors border-b border-zinc-100 dark:border-zinc-800/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      No Admissions Found
                    </p>
                    <p className="text-[11px] text-zinc-500 max-w-xs">
                      There are no student admission records matching your search criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* MOBILE CARD VIEW */}
      <CardContent className="block md:hidden flex-1 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-auto p-0">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : tableData.length ? (
          tableData.map((record) => (
            <div
              key={record.id}
              className="p-4 space-y-3 bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={record.student?.photo || record.student?.avatarUrl || undefined} alt={record.student?.firstName || "Student"} className="object-cover" />
                    <AvatarFallback className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800">
                      {record.student?.firstName?.[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {record.student?.firstName} {record.student?.lastName}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-mono font-medium">
                      {record.admissionNumber}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    record.status === "ACTIVE"
                      ? "text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "text-[9px] font-mono font-semibold bg-zinc-100 text-zinc-600 border-zinc-200"
                  }
                >
                  {record.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-[10px]">Class:</span>{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Class {record.class?.name}{" "}
                    {record.section?.name ? `(${record.section.name})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px]">Roll No:</span>{" "}
                  <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                    #{record.rollNumber ?? "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <Link href={`/admissions/${record.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] rounded-lg"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(record.id, record.status)}
                  className={`h-7 text-[10px] rounded-lg ${
                    record.status === "ACTIVE"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {record.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-zinc-500">
            No admissions found.
          </div>
        )}
      </CardContent>

      {/* SERVER PAGINATION */}
      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
        <p className="text-zinc-500 font-medium">
          Showing{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {tableData.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalCount}
          </span>{" "}
          admissions
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 px-2">
            Page {page} of {Math.ceil(totalCount / 10) || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 10 >= totalCount || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 10 >= totalCount || isLoading}
            onClick={() => onPageChange(Math.ceil(totalCount / 10))}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}