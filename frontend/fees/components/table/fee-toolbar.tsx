'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FeeToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  classes: any[];
  selectedClass: string;
  onClassChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export function FeeToolbar({
  searchQuery,
  onSearchChange,
  classes,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
}: FeeToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search admission no, student..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select value={selectedClass} onValueChange={(val) => val && onClassChange(val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes?.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={(val) => val && onStatusChange(val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Fee Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="DUE">Due</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}