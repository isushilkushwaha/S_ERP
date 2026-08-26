'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AcademicYearSelectProps {
  academicYears: Array<{ id: string; name: string; status: string }>;
  selectedId: string;
  onValueChange: (value: string) => void;
}

export function AcademicYearSelect({ academicYears, selectedId, onValueChange }: AcademicYearSelectProps) {
  return (
    <Select value={selectedId} onValueChange={(val) => val && onValueChange(val)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Academic Year" />
      </SelectTrigger>
      <SelectContent>
        {academicYears?.map((ay) => (
          <SelectItem key={ay.id} value={ay.id}>
            {ay.name} {ay.status === 'ACTIVE' ? '(Active)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}