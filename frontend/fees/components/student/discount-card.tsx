'use client';

import {
  BadgePercent,
  CheckCircle2,
  Tag,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface DiscountCardProps {
  discount: {
    id: string;
    name: string;
    code: string;
    originalAmount: number;
    appliedAmount: number;
    finalAmount: number;
    appliedPercentage: number | null;
    remarks: string | null;
    approvedBy: string | null;
  };
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function DiscountCard({
  discount,
}: DiscountCardProps) {
  return (
    <Card className="rounded-xl border shadow-none">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BadgePercent className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="text-base font-semibold">
                Admission Discount
              </h3>

              <p className="text-sm text-muted-foreground">
                Discount assigned during admission
              </p>
            </div>
          </div>

          <Badge variant="secondary">
            {discount.appliedPercentage !== null
              ? `${discount.appliedPercentage}%`
              : 'Applied'}
          </Badge>
        </div>

        <Separator className="my-5" />

        {/* Main information */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Discount Type
            </p>

            <p className="mt-1 font-medium">
              {discount.name}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {discount.code}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Original Amount
            </p>

            <p className="mt-1 font-semibold">
              {formatCurrency(
                discount.originalAmount
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Discount Applied
            </p>

            <p className="mt-1 font-semibold text-emerald-600">
              -{formatCurrency(
                discount.appliedAmount
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Final Amount
            </p>

            <p className="mt-1 font-semibold">
              {formatCurrency(
                discount.finalAmount
              )}
            </p>
          </div>
        </div>

        {/* Remarks */}
        {discount.remarks && (
          <div className="mt-5 rounded-lg bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Remarks
                </p>

                <p className="mt-1 text-sm">
                  {discount.remarks}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Approval */}
        {discount.approvedBy && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            <span>
              Approved by{' '}
              <span className="font-medium text-foreground">
                {discount.approvedBy}
              </span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}