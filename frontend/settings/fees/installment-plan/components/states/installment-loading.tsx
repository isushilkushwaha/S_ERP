import React from 'react';
import { Loader2 } from 'lucide-react';

export function InstallmentLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading fee structure...
        </p>
      </div>
    </div>
  );
}