import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleAlert, RefreshCw } from 'lucide-react';

interface InstallmentPlanErrorProps {
  error: string;
  onRefresh: () => void;
}

export function InstallmentPlanError({
  error,
  onRefresh,
}: InstallmentPlanErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-start gap-2.5">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-xs font-semibold">
              Unable to load fee structures
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={onRefresh}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}