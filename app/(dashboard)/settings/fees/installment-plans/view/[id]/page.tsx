import React from 'react';
import { InstallmentPlanDetail } from '@/frontend/settings/fees/installment-plan/components/installment-plan-detail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewInstallmentPlanPage({ params }: PageProps) {
  const resolvedParams = await params;
  const planId = resolvedParams?.id;

  if (!planId) {
    return <div className="p-6 text-muted-foreground">Invalid Plan ID.</div>;
  }

  // Fetch plan data directly on the server or via API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings/installment-plans/${planId}`, {
    cache: 'no-store',
  });
  const json = await res.json();

  if (!json.success) {
    return <div className="p-6 text-destructive">Failed to load installment plan details.</div>;
  }

  return <InstallmentPlanDetail plan={json.data} />;
}