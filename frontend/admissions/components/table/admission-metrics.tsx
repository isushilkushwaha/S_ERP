"use client";

import React from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface AdmissionMetrics {
  totalAdmissions: number;
  todayAdmissions: number;
  activeAdmissions: number;
  inactiveAdmissions: number;
}

interface AdmissionMetricsProps {
  metrics?: AdmissionMetrics;
  isLoading?: boolean;
}

export function AdmissionMetricsCards({ metrics, isLoading }: AdmissionMetricsProps) {
  const cards = [
    {
      title: "Total Admissions",
      value: metrics?.totalAdmissions ?? 0,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-900/40",
    },
    {
      title: "Today's Admissions",
      value: metrics?.todayAdmissions ?? 0,
      icon: Clock,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/40",
    },
    {
      title: "Active Admissions",
      value: metrics?.activeAdmissions ?? 0,
      icon: UserCheck,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-100 dark:border-indigo-900/40",
    },
    {
      title: "Inactive Admissions",
      value: metrics?.inactiveAdmissions ?? 0,
      icon: UserX,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/40",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/60 shadow-2xs rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="border border-border/60 shadow-2xs hover:shadow-xs transition-all rounded-2xl bg-card hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <CardContent className="p-4.5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${card.bg} ${card.border}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}