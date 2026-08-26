import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Calendar,
  IndianRupee,
  CircleCheck,
  CircleAlert,
  Eye,
  Settings,
} from 'lucide-react';
import { FeeStructure } from '../types/installment-plan.types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { cn } from '@/lib/utils';

interface InstallmentPlanTableRowProps {
  structure: FeeStructure;
  activeAcademicYear?: { name?: string } | null;
}

export function InstallmentPlanTableRow({
  structure,
  activeAcademicYear,
}: InstallmentPlanTableRowProps) {
  const router = useRouter();

  // =========================================================================
  // SENIOR ENGINEER REFACTOR: 
  // 1. Foolproof Plan Extraction (Bypassing utility limitations)
  // =========================================================================
  const defaultPlan = useMemo(() => {
    return (
      structure.installmentPlan ||
      structure.feeStructureInstallmentPlans?.[0]?.installmentPlan ||
      (structure as any).installmentPlans?.[0] ||
      null
    );
  }, [structure]);

  const isConfigured = Boolean(defaultPlan);

  // =========================================================================
  // 2. Aggressive Deep-Data Extraction & Memoization
  // =========================================================================
  const { milestoneCount, componentCount, structureTotal, allocatedAmount } = useMemo(() => {
    const milestones = defaultPlan?.items || [];
    const structItems = structure.items || [];

    // Safely calculate the total expected fee
    const total = structItems.reduce(
      (sum: number, item: any) => sum + Number(item.amount || item.feeComponent?.amount || 0),
      0
    );

    const assignedCompIds = new Set<string>();
    let allocated = 0;

    milestones.forEach((mItem: any) => {
      // Aggressively capture components from any known Prisma relation name
      const comps = mItem.components || mItem.installmentPlanItemComponents || mItem.feeComponentIds || [];
      const compArray = Array.isArray(comps) ? comps : [];

      compArray.forEach((c: any) => {
        // Hunt down the ID no matter how the backend nested it
        const compId = c.feeComponentId || c.feeComponent?.id || c.id || (typeof c === 'string' ? c : null);
        
        if (compId) {
          assignedCompIds.add(compId);
          
          // Cross-reference with the original fee structure to get the exact amount
          const matchingStructItem = structItems.find(
            (si: any) => 
              si.feeComponentId === compId || 
              si.feeComponent?.id === compId || 
              si.id === compId
          );
          
          if (matchingStructItem) {
             allocated += Number(matchingStructItem.amount || matchingStructItem.feeComponent?.amount || 0);
          }
        }
      });
    });

    return {
      milestoneCount: milestones.length,
      componentCount: assignedCompIds.size,
      structureTotal: total,
      allocatedAmount: allocated,
    };
  }, [structure, defaultPlan]);

  // Determine if financial math balances out perfectly
  const allocationComplete =
    isConfigured &&
    structureTotal > 0 &&
    Math.abs(structureTotal - allocatedAmount) < 0.01;

  // Extract medium safely from class or structure properties
  const structureMedium =
  structure.class?.medium === "HINDI"
    ? "Hindi"
    : structure.class?.medium === "BOTH"
      ? "English + Hindi"
      : "English";
      

  return (
    <TableRow className="group text-xs transition-colors hover:bg-muted/30">
      {/* CLASS & MEDIUM */}
      <TableCell className="py-2.5">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 rounded bg-primary/15 p-1">
            <Layers className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">
                {structure.class?.name || 'Class Structure'}
              </p>
              <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase text-muted-foreground font-normal">
                {structureMedium}
              </Badge>
            </div>
            {structure.class?.code && (
              <p className="font-mono text-[9px] uppercase text-muted-foreground">
                {structure.class.code}
              </p>
            )}
            <p className="text-[9px] text-muted-foreground mt-0.5">
              Eff: {formatDate(structure.effectiveFrom)}
            </p>
          </div>
        </div>
      </TableCell>

      {/* ACADEMIC YEAR */}
      <TableCell className="py-2.5">
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {structure.academicYear?.name || activeAcademicYear?.name || 'N/A'}
          </span>
        </div>
      </TableCell>

      {/* FEE STRUCTURE */}
      <TableCell className="py-2.5">
        <div>
          <p className="font-medium text-foreground">
            {structure.name || 'Standard Fee Structure'}
          </p>
          <p className="mt-0.5 flex items-center gap-0.5 text-[11px] font-mono text-muted-foreground">
            <IndianRupee className="h-3 w-3" />
            {formatCurrency(structureTotal)}
          </p>
        </div>
      </TableCell>

      {/* DEFAULT PLAN DETAILS */}
      <TableCell className="py-2.5">
        {isConfigured ? (
          <div>
            <p className="font-medium text-foreground">
              {defaultPlan?.name || 'Default Plan'}
            </p>
            {defaultPlan?.code && (
              <p className="font-mono text-[9px] uppercase text-muted-foreground">
                {defaultPlan.code}
              </p>
            )}
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                {defaultPlan?.planType || 'CUSTOM'}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <CircleAlert className="h-3.5 w-3.5 text-amber-600" />
            <span className="font-medium text-amber-600">No Plan Assigned</span>
          </div>
        )}
      </TableCell>

      {/* FINANCIAL ALLOCATION */}
      <TableCell className="py-2.5">
        {isConfigured ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              {allocationComplete ? (
                <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <CircleAlert className="h-3.5 w-3.5 text-amber-600" />
              )}
              <span
                className={cn(
                  'font-medium text-[11px]',
                  allocationComplete ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-500'
                )}
              >
                {allocationComplete ? '100% Allocated' : 'Needs Review'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">
              {formatCurrency(allocatedAmount)} / {formatCurrency(structureTotal)}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* STATUS */}
      <TableCell className="py-2.5">
        <Badge
          variant={isConfigured ? 'default' : 'secondary'}
          className={cn(
            'px-2 py-0.5 text-[10px] font-semibold shadow-sm',
            isConfigured && 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
          )}
        >
          {isConfigured ? 'Configured' : 'Not Configured'}
        </Badge>
      </TableCell>

      {/* ACTIONS */}
      <TableCell className="py-2.5 text-right">
        <div className="flex justify-end gap-2">
          {isConfigured && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs shadow-sm hover:bg-primary/5 hover:text-primary border-primary/20"
              onClick={() => router.push(`/settings/fees/installment-plans/${defaultPlan?.id}`)}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="h-7 px-3 text-xs shadow-sm transition-all active:scale-95"
            onClick={() => router.push(`/settings/fees/installment-plans/configure/${structure.id}`)}
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            {isConfigured ? 'Edit Plan' : 'Configure'}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}