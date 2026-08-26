import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

interface InstallmentPlanFiltersProps {
  academicYears: any[];
  classes: any[];
  selectedAcademicYearId: string;
  setSelectedAcademicYearId: (id: string) => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

export function InstallmentPlanFilters({
  academicYears,
  classes,
  selectedAcademicYearId,
  setSelectedAcademicYearId,
  selectedClassId,
  setSelectedClassId,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onResetFilters,
}: InstallmentPlanFiltersProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold">Filters</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onResetFilters}
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {/* Academic Year */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Academic Year
            </label>
            <Select
              value={selectedAcademicYearId}
              onValueChange={(value) => setSelectedAcademicYearId(value ?? '')}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select academic year">
                  {academicYears.find((ay) => ay.id === selectedAcademicYearId)
                    ?.name || 'Select academic year'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((academicYear: any) => (
                  <SelectItem
                    key={academicYear.id}
                    value={academicYear.id}
                    className="text-xs"
                  >
                    {academicYear.name}
                    {academicYear.status === 'ACTIVE' && ' (Active)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Class
            </label>
            <Select
              value={selectedClassId}
              onValueChange={(value) => setSelectedClassId(value ?? 'ALL')}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Classes">
                  {selectedClassId === 'ALL'
                    ? 'All Classes'
                    : classes.find((c) => c.id === selectedClassId)?.name ||
                      'All Classes'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Classes
                </SelectItem>
                {classes.map((classItem: any) => (
                  <SelectItem
                    key={classItem.id}
                    value={classItem.id}
                    className="text-xs"
                  >
                    {classItem.name}
                    {classItem.code ? ` (${classItem.code})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Configuration Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? 'ALL')}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Statuses
                </SelectItem>
                <SelectItem value="CONFIGURED" className="text-xs">
                  Configured
                </SelectItem>
                <SelectItem value="NOT_CONFIGURED" className="text-xs">
                  Not Configured
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search class or plan..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}