// frontend/admissions/components/wizard/steps/step-5-installment-template.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Layers,
  CheckCircle2,
  IndianRupee,
  ListChecks,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// --- HELPERS ---
function formatCurrency(amount: number | string | undefined | null): string {
  const numericAmount = Number(amount || 0);
  return `₹${numericAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
// ---------------

interface FeeComponentItem {
  feeComponentId: string;
  name: string;
  code: string;
  amount: number;
}

interface InstallmentMilestoneDTO {
  id?: string;
  name: string;
  dueDate?: string | null;
  componentIds: string[];
  displayOrder: number;
}

interface Step5Props {
  feeStructureId: string;
  finalPayable: number;
  initialMilestones?: InstallmentMilestoneDTO[];
  onSaveMilestones: (
    planId: string,
    planName: string,
    milestones: Array<{
      id?: string;
      name: string;
      dueDate?: string | null;
      value: number;
      displayOrder: number;
      components?: Array<{ name: string; code: string }>;
    }>
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5InstallmentTemplate({
  feeStructureId,
  finalPayable: _finalPayable,
  initialMilestones,
  onSaveMilestones,
  onNext,
  onBack,
}: Step5Props) {
  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState<string>("");
  const [planName, setPlanName] = useState<string>("Regular Structure");
  const [planCode, setPlanCode] = useState<string>("");
  const [className, setClassName] = useState<string>("Class");
  const [academicYearName, setAcademicYearName] = useState<string>("Academic Year");

  const [availableComponents, setAvailableComponents] = useState<FeeComponentItem[]>([]);
  const [milestones, setMilestones] = useState<InstallmentMilestoneDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [customizingIndex, setCustomizingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFeeStructureAndTemplate() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/settings/fee-structures/${feeStructureId}`);
        if (!res.ok) throw new Error("Failed to fetch fee structure details.");

        const json = await res.json();
        const data = json.data || json;

        // DEBUG LOG: Open your browser console (F12) to check if components are arriving!
        console.log("📥 API DATA RECEIVED:", data);

        if (data.class?.name) setClassName(data.class.name);
        if (data.academicYear?.name) setAcademicYearName(data.academicYear.name);
        if (data.notes) setPlanName(data.notes);

        // 1. EXTRACT AVAILABLE COMPONENTS SAFELY
        const rawItems = data.items || [];
        const feeComps: FeeComponentItem[] = rawItems.map((item: any) => ({
          // Prefer nested feeComponent.id, fallback to feeComponentId
          feeComponentId: item.feeComponent?.id || item.feeComponentId || item.id,
          name: item.feeComponent?.name || item.name || "Fee Component",
          code: item.feeComponent?.code || item.code || "",
          amount: Number(item.amount || item.feeComponent?.amount || 0),
        }));
        
        setAvailableComponents(feeComps);

        // 2. EXTRACT THE ASSIGNED PLAN
        const assignedPlan = data.installmentPlan || data.feeStructureInstallmentPlans?.[0]?.installmentPlan;

        if (initialMilestones && initialMilestones.length > 0) {
          setMilestones(initialMilestones);
        } else if (assignedPlan && assignedPlan.items && assignedPlan.items.length > 0) {
          if (assignedPlan.id) setPlanId(assignedPlan.id);
          if (assignedPlan.name) setPlanName(assignedPlan.name);
          if (assignedPlan.code) setPlanCode(assignedPlan.code);

          // const templateMilestones: InstallmentMilestoneDTO[] = assignedPlan.items.map((item: any, index: number) => {
          //   let extractedIds: string[] = [];

          //   // 3. HYPER-AGGRESSIVE MILESTONE COMPONENT MAPPING
          //   if (Array.isArray(item.components)) {
          //     item.components.forEach((c: any) => {
          //       const targetId = c.feeComponent?.id || c.feeComponentId;
          //       if (targetId) {
          //         extractedIds.push(targetId);
          //       } else if (typeof c === 'string') {
          //         extractedIds.push(c);
          //       }
          //     });
          //   }

          //   if (Array.isArray(item.feeComponentIds)) {
          //     item.feeComponentIds.forEach((id: any) => {
          //       if (typeof id === 'string') extractedIds.push(id);
          //     });
          //   }

          //   // Deduplicate valid IDs only
          //   const compIds = Array.from(new Set(extractedIds.filter(id => Boolean(id))));

          //   return {
          //     id: item.id || `ms-${index + 1}`,
          //     name: item.name || `Installment ${index + 1}`,
          //     dueDate: item.dueDate ? item.dueDate.split("T")[0] : "",
          //     componentIds: compIds,
          //     displayOrder: item.displayOrder ?? index + 1,
          //   };
          // });
          const templateMilestones: InstallmentMilestoneDTO[] = assignedPlan.items.map((item: any, index: number) => {
            let extractedIds: string[] = [];

            const compsList = item.components || item.installmentPlanItemComponents || [];
            if (Array.isArray(compsList)) {
              compsList.forEach((c: any) => {
                const targetId = c.feeComponentId || c.feeComponent?.id || c.id;
                if (targetId) {
                  extractedIds.push(targetId);
                } else if (typeof c === 'string') {
                  extractedIds.push(c);
                }
              });
            }

            if (Array.isArray(item.feeComponentIds)) {
              item.feeComponentIds.forEach((id: any) => {
                if (typeof id === 'string') extractedIds.push(id);
              });
            }

            const compIds = Array.from(new Set(extractedIds.filter(id => Boolean(id))));

            return {
              id: item.id || `ms-${index + 1}`,
              name: item.name || `Installment ${index + 1}`,
              dueDate: item.dueDate ? item.dueDate.split("T")[0] : "",
              componentIds: compIds,
              // 👇 CALCULATE VALUE IMMEDIATELY FROM FEE COMPS
              value: compIds.reduce((sum, id) => {
                const comp = feeComps.find((c) => c.feeComponentId === id);
                return sum + (comp ? comp.amount : 0);
              }, 0),
              displayOrder: item.displayOrder ?? index + 1,
            };
          });
          


          const hasIncompleteMilestone = templateMilestones.some((m) => m.componentIds.length === 0);
          setMilestones(templateMilestones);

          if (hasIncompleteMilestone) {
            setError("⚠ Some milestones in this template are missing fee components. Please click 'Customize' below to assign them before continuing.");
          }
        } else {
          setMilestones([]);
          setError("No default installment plan is configured for this fee structure. Please configure it in Settings first.");
        }
      } catch (err: any) {
        setError(err.message || "Unable to load installment schedule settings.");
      } finally {
        setLoading(false);
      }
    }

    if (feeStructureId) {
      fetchFeeStructureAndTemplate();
    }
  }, [feeStructureId, initialMilestones]);

  const totalFeeStructureAmount = useMemo(() => {
    return availableComponents.reduce((sum, c) => sum + c.amount, 0);
  }, [availableComponents]);

  const getMilestoneAmount = (componentIds?: string[]) => {
    // 🛡️ Safety check: ensure componentIds is always a valid array
    if (!Array.isArray(componentIds)) {
      return 0;
    }
    
    return componentIds.reduce((sum, id) => {
      const comp = availableComponents.find((c) => c.feeComponentId === id);
      return sum + (comp ? comp.amount : 0);
    }, 0);
  };

  const totalScheduledAmount = useMemo(() => {
    return milestones.reduce((sum, m) => sum + getMilestoneAmount(m.componentIds), 0);
  }, [milestones, availableComponents]);

  const remainingBalance = totalFeeStructureAmount - totalScheduledAmount;

  const getAssignedComponentIdsMap = (currentMilestoneIndex: number) => {
    const assignedSet = new Set<string>();
    milestones.forEach((m, idx) => {
      if (idx !== currentMilestoneIndex) {
        m.componentIds.forEach((id) => assignedSet.add(id));
      }
    });
    return assignedSet;
  };

  const handleMilestoneFieldChange = (index: number, field: keyof InstallmentMilestoneDTO, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleToggleComponent = (milestoneIndex: number, componentId: string) => {
    const updated = [...milestones];
    const currentComps = new Set(updated[milestoneIndex].componentIds);
    if (currentComps.has(componentId)) {
      currentComps.delete(componentId);
    } else {
      currentComps.add(componentId);
    }
    updated[milestoneIndex].componentIds = Array.from(currentComps);
    setMilestones(updated);
  };

  const handleAddMilestone = () => {
    const nextOrder = milestones.length + 1;
    const newIndex = milestones.length;
    setMilestones([
      ...milestones,
      {
        id: `custom-${Date.now()}`,
        name: `Installment ${nextOrder}`,
        dueDate: "",
        componentIds: [],
        displayOrder: nextOrder,
      },
    ]);
    setCustomizingIndex(newIndex);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    const updated = milestones.filter((_, idx) => idx !== index);
    setMilestones(updated);
    if (customizingIndex === index) setCustomizingIndex(null);
  };

  const assignedComponentIdsGlobal = useMemo(() => {
    const set = new Set<string>();
    
    // 🛡️ Safely guard against undefined milestones or missing componentIds arrays
    const safeMilestones = Array.isArray(milestones) ? milestones : [];

    safeMilestones.forEach((m) => {
      const ids = m?.componentIds;
      if (Array.isArray(ids)) {
        ids.forEach((id) => set.add(id));
      }
    });

    return set;
  }, [milestones]);

  const allComponentsAssigned =
    availableComponents.length > 0 &&
    availableComponents.every((c) => assignedComponentIdsGlobal.has(c.feeComponentId));

  const hasEmptyMilestone = Array.isArray(milestones) && milestones.some((m) => !Array.isArray(m?.componentIds) || m.componentIds.length === 0);
  const isFullyBalanced =
    milestones.length > 0 && Math.abs(remainingBalance) < 0.01 && allComponentsAssigned && !hasEmptyMilestone;

  
const handleProceed = () => {
    if (!isFullyBalanced) return;
    setError(null);
    const formattedMilestones = milestones.map((m, idx) => ({
      id: m.id || `ms-${idx + 1}`,
      name: m.name,
      dueDate: m.dueDate,
      value: getMilestoneAmount(m.componentIds),
      displayOrder: m.displayOrder || idx + 1,
      componentIds: Array.isArray(m.componentIds) ? m.componentIds : [], // 👈 CRITICAL: Pass raw IDs back up!
      components: (Array.isArray(m.componentIds) ? m.componentIds : []).map((id) => {
        const found = availableComponents.find((c) => c.feeComponentId === id);
        return { name: found?.name || "Fee Component", code: found?.code || "" };
      }),
    }));
    onSaveMilestones(planId, planName, formattedMilestones);
    onNext();
  };


  if (!loading && milestones.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="border border-destructive/20 bg-card rounded-lg shadow-sm overflow-hidden text-center p-6 sm:p-8 space-y-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">No Plan Configured</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              The selected fee structure does not have a valid default installment template. Please configure it in Settings first.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={onBack} className="rounded-md h-9 px-4 text-xs font-medium border-border">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      
      {/* WIZARD BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admissions</span>
            <span>/</span>
            <span>New Admission</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Installment Schedule
          </h1>
        </div>
        <Badge variant="outline" className="text-xs font-medium bg-muted/50 border-border px-3 py-1.5">
          Step 5 of 6
        </Badge>
      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                {planName}
              </h2>
              {planCode && (
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{planCode}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Default installment schedule mapped for this admission. You can customize milestones and component assignments below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Customizable Template</Badge>
        </div>
      </div>

      {/* ERROR / SOFT WARNING DISPLAY */}
      {error && (
        <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* SUMMARY GRIDS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Academic Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-base font-bold">{academicYearName}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Assigned Class</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-base font-bold">{className}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Fee Structure</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-base font-bold text-foreground">
              {formatCurrency(totalFeeStructureAmount)}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {availableComponents.length} fee components
            </p>
          </CardContent>
        </Card>

        <Card className={`shadow-sm border-2 ${isFullyBalanced ? "border-emerald-500/50" : "border-destructive/40"}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Scheduled Amount</CardTitle>
            <IndianRupee className={`h-4 w-4 ${isFullyBalanced ? "text-emerald-600" : "text-destructive"}`} />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-base font-bold ${isFullyBalanced ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}>
              {formatCurrency(totalScheduledAmount)}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              {isFullyBalanced ? "Balance Matched ✓" : `Remaining: ${formatCurrency(Math.abs(remainingBalance))}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* INSTALLMENT TIMELINE BUILDER */}
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Installment Milestones</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Payment schedule and assigned fee components.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[10px]">
                {milestones.length} Milestone{milestones.length !== 1 ? "s" : ""}
              </Badge>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMilestone} className="h-7 text-xs px-2 gap-1 shadow-2xs">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {loading ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, idx) => {
                const currentMilestoneAmount = getMilestoneAmount(milestone.componentIds);
                const assignedInOtherMilestones = getAssignedComponentIdsMap(idx);
                const isCustomizing = customizingIndex === idx;

                if (isCustomizing) {
                  // --- CUSTOMIZE/EDIT MODE ---
                  return (
                    <div key={milestone.id || idx} className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 shadow-sm transition-all">
                      <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Customize Milestone {idx + 1}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setCustomizingIndex(null)} className="h-7 text-xs font-medium">
                          Done Editing
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground block">Milestone Name</label>
                          <Input
                            value={milestone.name}
                            onChange={(e) => handleMilestoneFieldChange(idx, "name", e.target.value)}
                            placeholder="e.g., April Tuition"
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground block">Due Date</label>
                          <Input
                            type="date"
                            value={milestone.dueDate || ""}
                            onChange={(e) => handleMilestoneFieldChange(idx, "dueDate", e.target.value)}
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                      </div>

                      <div className="mt-4 border-t border-border/40 pt-3 space-y-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Select Fee Components</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {availableComponents.map((comp) => {
                            const isSelectedHere = milestone.componentIds.includes(comp.feeComponentId);
                            const isAssignedElsewhere = assignedInOtherMilestones.has(comp.feeComponentId);

                            return (
                              <div
                                key={comp.feeComponentId}
                                onClick={() => { if (!isAssignedElsewhere || isSelectedHere) handleToggleComponent(idx, comp.feeComponentId); }}
                                className={`flex items-center justify-between rounded-md border p-2 text-xs transition-colors ${
                                  isAssignedElsewhere && !isSelectedHere ? "opacity-50 bg-muted/40 cursor-not-allowed" : "cursor-pointer bg-background shadow-2xs hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Checkbox
                                    checked={isSelectedHere}
                                    disabled={isAssignedElsewhere && !isSelectedHere}
                                    onCheckedChange={() => { if (!isAssignedElsewhere || isSelectedHere) handleToggleComponent(idx, comp.feeComponentId); }}
                                  />
                                  <span className="truncate font-medium">{comp.name}</span>
                                </div>
                                <span className="font-mono font-medium shrink-0 ml-2">₹{comp.amount}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/40">
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMilestone(idx)} disabled={milestones.length <= 1} className="text-xs text-destructive hover:bg-destructive/10 -ml-2 h-8 px-2">
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
                        </Button>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Calculated Amount</p>
                          <p className="font-mono text-lg font-bold text-primary tabular-nums">{formatCurrency(currentMilestoneAmount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // --- READ-ONLY / NORMAL VIEW ---
                return (
                  <div key={milestone.id || idx} className="rounded-lg border bg-muted/10 p-4 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{milestone.name || `Milestone ${idx + 1}`}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              Due: <span className="font-medium text-foreground">{formatDate(milestone.dueDate)}</span>
                            </span>
                            <Badge variant="outline" className="text-[9px] bg-background">Fixed Amount</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
                        <div className="text-right">
                          <p className="font-mono text-lg font-bold text-primary tabular-nums">{formatCurrency(currentMilestoneAmount)}</p>
                          <p className="text-[10px] text-muted-foreground">Payment Amount</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setCustomizingIndex(idx)} className="h-7 text-xs px-3 shadow-2xs bg-background">
                          Customize
                        </Button>
                      </div>
                    </div>

                    {/* Components */}
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Fee Components</p>
                        <span className="text-[10px] text-muted-foreground">
                          {milestone.componentIds.length} component{milestone.componentIds.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {milestone.componentIds.length === 0 ? (
                        <div className="rounded-md border border-dashed border-destructive/30 p-3 bg-destructive/5 text-destructive text-xs italic">
                          ⚠ No fee components assigned to this milestone. Click 'Customize' to assign components.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {milestone.componentIds.map((id) => {
                            const comp = availableComponents.find((c) => c.feeComponentId === id);
                            if (!comp) return null;
                            return (
                              <div key={id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-foreground">{comp.name}</p>
                                    <p className="font-mono text-[9px] text-muted-foreground uppercase">{comp.code}</p>
                                  </div>
                                </div>
                                <span className="ml-2 shrink-0 font-mono text-[10px] font-medium">
                                  {formatCurrency(comp.amount)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* VALIDATION & FOOTER */}
      <div className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm ${isFullyBalanced ? "bg-emerald-500/5 border-emerald-500/20" : "bg-destructive/5 border-destructive/20"}`}>
        {isFullyBalanced ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        )}
        <div className="flex-1 space-y-1">
          <p className={`text-xs font-semibold ${isFullyBalanced ? "text-emerald-800 dark:text-emerald-400" : "text-destructive"}`}>
            {isFullyBalanced ? "Schedule is Ready" : "Schedule Needs Correction"}
          </p>
          <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
            <li className={allComponentsAssigned ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-destructive"}>
              {allComponentsAssigned ? "All fee components assigned exactly once." : "Every fee component must be assigned."}
            </li>
            <li className={!hasEmptyMilestone ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-destructive"}>
              {!hasEmptyMilestone ? "Every milestone has components." : "A milestone is missing components."}
            </li>
            <li className={Math.abs(remainingBalance) < 0.01 ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-destructive"}>
              {Math.abs(remainingBalance) < 0.01 ? "Total scheduled amount matches total fee." : `Remaining unallocated balance: ${formatCurrency(remainingBalance)}`}
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={onBack} className="text-xs h-9 px-5">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleProceed}
          disabled={!isFullyBalanced || loading}
          className="text-xs font-medium h-9 px-6 transition-all"
        >
          Review & Confirm <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </Button>
      </div>

    </div>
  );
}
