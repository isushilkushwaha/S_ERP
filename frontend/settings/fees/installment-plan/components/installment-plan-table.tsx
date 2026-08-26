import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { FeeStructure } from '../types/installment-plan.types';
import { InstallmentPlanTableRow } from './installment-plan-table-row';

interface InstallmentPlanTableProps {
  filteredStructures: FeeStructure[];
  activeAcademicYear?: { name?: string } | null;
}

export function InstallmentPlanTable({
  filteredStructures,
  activeAcademicYear,
}: InstallmentPlanTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="max-h-[520px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="py-2.5 text-xs">Class</TableHead>
              <TableHead className="py-2.5 text-xs">Academic Year</TableHead>
              <TableHead className="py-2.5 text-xs">Fee Structure</TableHead>
              <TableHead className="py-2.5 text-xs">Default Plan</TableHead>
              <TableHead className="py-2.5 text-xs">Allocation</TableHead>
              <TableHead className="py-2.5 text-xs">Status</TableHead>
              <TableHead className="py-2.5 text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStructures.map((structure) => (
              <InstallmentPlanTableRow
                key={structure.id}
                structure={structure}
                activeAcademicYear={activeAcademicYear}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}