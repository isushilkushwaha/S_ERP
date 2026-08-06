"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Plus, RotateCw} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  totalCount: number;
  isRefetching?: boolean;
  onRefresh?: () => void;
}

export function PageHeader({
  totalCount,
  isRefetching = false,
  onRefresh,
}: PageHeaderProps) {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 pb-2">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admission Management
          </h1>
          <Badge
            variant="outline"
            className="text-xs font-mono font-semibold bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 rounded-full px-2.5 py-0.5"
          >
            {totalCount.toLocaleString()} Admissions
          </Badge>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Manage student admissions, enrollments, class allocations, and fee assignments.
        </p>
      </div>

      <div className="flex items-center space-x-2.5 self-start sm:self-center">
        <span className="text-[11px] font-mono text-zinc-400 hidden lg:inline-block">
          Updated Today • {currentTime}
        </span>

        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 shadow-2xs"
          >
            <RotateCw
              className={`w-3.5 h-3.5 mr-1.5 ${
                isRefetching ? "animate-spin text-blue-600" : "text-zinc-400"
              }`}
            />
            <span>Refresh</span>
          </Button>
        )}

        <Link href="/admissions/new">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 h-9 shadow-2xs rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>New Admission</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}