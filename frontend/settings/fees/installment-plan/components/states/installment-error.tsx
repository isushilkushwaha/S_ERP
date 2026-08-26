import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';

interface InstallmentErrorProps {
  error: string;
}

export function InstallmentError({ error }: InstallmentErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <XCircle className="h-10 w-10 text-destructive" />
          <div>
            <h2 className="font-semibold">Unable to load fee structure</h2>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              router.push('/settings/fees/installment-plans')
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Installment Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}