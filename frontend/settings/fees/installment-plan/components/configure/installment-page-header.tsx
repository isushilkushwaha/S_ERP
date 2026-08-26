import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface InstallmentPageHeaderProps {
  feeStructure: any;
}

export function InstallmentPageHeader({
  feeStructure,
}: InstallmentPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push('/settings/fees/installment-plans')
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configure Class Installments
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Settings → Fee Management → Fee Structures →
            <span className="font-semibold text-foreground">
              {' '}
              Configure {feeStructure?.class?.name}
            </span>
          </p>
        </div>
      </div>

      <Badge
        variant="outline"
        className="w-fit border-primary/20 bg-primary/5 px-3 py-1 text-primary"
      >
        {feeStructure?.academicYear?.name || 'Academic Year'}
      </Badge>
    </div>
  );
}