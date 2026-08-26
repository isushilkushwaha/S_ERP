import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';

interface InstallmentPlanEmptyProps {
  onResetFilters: () => void;
}

export function InstallmentPlanEmpty({
  onResetFilters,
}: InstallmentPlanEmptyProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[200px] flex-col items-center justify-center text-center p-4">
        <div className="rounded-full bg-muted p-3">
          <ListChecks className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mt-3 text-xs font-semibold">
          No fee structures found
        </h3>
        <p className="mt-0.5 max-w-sm text-[11px] text-muted-foreground">
          No fee structures match the selected academic year, class, status, or search criteria.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 h-7 px-2.5 text-xs"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}