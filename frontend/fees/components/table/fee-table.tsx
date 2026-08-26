'use client';

import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { feeColumns } from './fee-columns';

interface FeeTableProps {
  data: any[];
  isLoading: boolean;
  onRowClick?: (enrollmentId: string) => void;
}

export function FeeTable({ data, isLoading }: FeeTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {feeColumns.map((col, index) => (
              <TableHead key={index}>
                {typeof col.header === 'function' ? col.header({} as any) : col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={feeColumns.length} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading student records...
                </div>
              </TableCell>
            </TableRow>
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={feeColumns.length} className="h-24 text-center text-muted-foreground">
                No student fee records found.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((student) => (
              <TableRow
                key={student.enrollmentId}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  const targetPath = window.location.pathname.startsWith('/dashboard')
                    ? `/dashboard/fees/${student.enrollmentId}`
                    : `/fees/${student.enrollmentId}`;
                  router.push(targetPath);
                }}
              >
                <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.fatherName}</TableCell>
                <TableCell>{student.className} - {student.sectionName}</TableCell>
                <TableCell className="text-right">₹{student.assigned.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right text-emerald-600 font-semibold">₹{student.paid.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right text-rose-600 font-semibold">₹{student.due.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={student.status === 'PAID' ? 'default' : student.status === 'PARTIAL' ? 'secondary' : 'destructive'}>
                    {student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}