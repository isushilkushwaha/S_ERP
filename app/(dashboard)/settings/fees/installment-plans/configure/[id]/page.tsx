import React from 'react';
import { ConfigureInstallmentWorkspace } from '@/frontend/settings/fees/installment-plan/components/configure-installment-workspace';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConfigureInstallmentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  if (!id) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-muted-foreground">
        Invalid or missing Fee Structure ID.
      </div>
    );
  }

  return <ConfigureInstallmentWorkspace feeStructureId={id} />;
}