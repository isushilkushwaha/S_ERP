'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export const feeColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'admissionNumber',
    header: 'Admission No',
  },
  {
    accessorKey: 'studentName',
    header: 'Student Name',
  },
  {
    accessorKey: 'fatherName',
    header: "Father's Name",
  },
  {
    accessorKey: 'className',
    header: 'Class / Sec',
    cell: ({ row }) => `${row.original.className} - ${row.original.sectionName}`,
  },
  {
    accessorKey: 'assigned',
    header: () => <div className="text-right">Assigned</div>,
    cell: ({ row }) => <div className="text-right">₹{row.original.assigned.toLocaleString('en-IN')}</div>,
  },
  {
    accessorKey: 'paid',
    header: () => <div className="text-right">Paid</div>,
    cell: ({ row }) => <div className="text-right text-emerald-600 font-semibold">₹{row.original.paid.toLocaleString('en-IN')}</div>,
  },
  {
    accessorKey: 'due',
    header: () => <div className="text-right">Due</div>,
    cell: ({ row }) => <div className="text-right text-rose-600 font-semibold">₹{row.original.due.toLocaleString('en-IN')}</div>,
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-center">
          <Badge variant={status === 'PAID' ? 'default' : status === 'PARTIAL' ? 'secondary' : 'destructive'}>
            {status}
          </Badge>
        </div>
      );
    },
  },
];