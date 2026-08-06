"use client";

import React from "react";
import { ClassOccupancyReport } from "@/frontend/settings/classes/types/occupancy";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OccupancyCardProps {
  report?: ClassOccupancyReport | null;
  isLoading?: boolean;
}

export function OccupancyCard({ report, isLoading }: OccupancyCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-xs text-muted-foreground">
          Loading occupancy metrics...
        </CardContent>
      </Card>
    );
  }

  if (!report) return null;

  const totalOccupancyPct =
    report.totalCapacity > 0
      ? Number(((report.totalEnrolledStudents / report.totalCapacity) * 100).toFixed(1))
      : 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Live Occupancy & Seats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Level Summary */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span>Overall Class Seats</span>
            <span>
              {report.totalEnrolledStudents} / {report.totalCapacity} Enrolled ({report.totalSeatsLeft} left)
            </span>
          </div>
          <Progress value={totalOccupancyPct} className="h-2" />
        </div>

        {/* Section Breakdown if enabled */}
        {report.sectionsEnabled && report.sections.length > 0 && (
          <div className="mt-3 space-y-3 pt-2 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Section Breakdown
            </h4>
            {report.sections.map((sec) => (
              <div key={sec.sectionId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Section {sec.sectionName}</span>
                  <span className="text-muted-foreground">
                    {sec.currentStudents} / {sec.capacity} ({sec.seatsLeft} left)
                  </span>
                </div>
                <Progress value={sec.occupancyPercentage} className="h-1.5" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}