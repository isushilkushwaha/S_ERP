'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LedgerItem {
  ledgerId: string;
  componentName: string;
  assignedAmount: number;
}

interface LedgerTableProps {
  ledgers: LedgerItem[];
}

export function LedgerTable({
  ledgers,
}: LedgerTableProps) {
  const totalAssigned = (ledgers ?? []).reduce(
    (total, item) =>
      total + Number(item.assignedAmount || 0),
    0
  );

  if (!ledgers || ledgers.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">
          No fees assigned
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          No fee components have been assigned to this
          student.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Fee</TableHead>

            <TableHead className="text-right">
              Assigned Amount
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ledgers.map((item) => (
            <TableRow key={item.ledgerId}>
              <TableCell className="font-medium">
                {item.componentName}
              </TableCell>

              <TableCell className="text-right font-medium tabular-nums">
                ₹
                {Number(
                  item.assignedAmount || 0
                ).toLocaleString('en-IN')}
              </TableCell>
            </TableRow>
          ))}

          {/* Total */}
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell className="font-semibold">
              Total Assigned Fee
            </TableCell>

            <TableCell className="text-right text-base font-bold tabular-nums">
              ₹
              {totalAssigned.toLocaleString(
                'en-IN'
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}