import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function InstallmentPlanLoading() {
  return (
    <Card>
      <CardContent className="flex min-h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Loading installment plans...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}