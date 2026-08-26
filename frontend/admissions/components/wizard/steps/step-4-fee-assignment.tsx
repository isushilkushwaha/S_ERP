// frontend/admissions/components/wizard/steps/step-4-fee-assignment.tsx

"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Receipt,
  Tag,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AssignedFeeStructureDTO } from "@/features/admissions/dto/admission.dto";

interface ConcessionDTO {
  discountType: string;
  discountAmount: number;
  description: string;
  finalPayable: number;
}

interface Step4Props {
  feeStructure: AssignedFeeStructureDTO | null;
  initialConcession?: ConcessionDTO | null;
  onNext: (concessionData: ConcessionDTO) => void;
  onBack: () => void;
}

export function Step4FeeAssignment({
  feeStructure,
  initialConcession,
  onNext,
  onBack,
}: Step4Props) {
  // --- MANUAL CONCESSION STATE INITIALIZED WITH PERSISTED VALUES ---
  const [discountType, setDiscountType] = useState(initialConcession?.discountType || "");
  const [discountAmountStr, setDiscountAmountStr] = useState(
    initialConcession?.discountAmount ? String(initialConcession.discountAmount) : ""
  );
  const [description, setDescription] = useState(initialConcession?.description || "");
  const [error, setError] = useState<string | null>(null);

  // --- EMPTY / NO FEE STRUCTURE STATE ---
  if (!feeStructure) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="border border-destructive/20 bg-card rounded-lg shadow-sm overflow-hidden text-center p-6 sm:p-8 space-y-4">
          <div className="mx-auto w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Fee Structure Unavailable
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              No fee structure is assigned for the selected academic year and class.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-md h-9 px-4 text-xs font-medium border-border shadow-2xs hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Return to Academic Allocation</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- CALCULATIONS ---
  const totalFee = feeStructure.totalAmount;
  const parsedDiscount = parseFloat(discountAmountStr) || 0;
  const finalPayable = Math.max(0, totalFee - parsedDiscount);

  const handleDiscountChange = (val: string) => {
    setDiscountAmountStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > totalFee) {
      setError("Discount cannot exceed the total fee.");
    } else {
      setError(null);
    }
  };

  const handleProceed = () => {
    if (parsedDiscount > totalFee) {
      setError("Discount cannot exceed the total fee.");
      return;
    }
    onNext({
      discountType: discountType.trim() || "General Concession",
      discountAmount: parsedDiscount,
      description: description.trim(),
      finalPayable,
    });
  };

  const totalComponents = feeStructure.items.length;
  const mandatoryComponentsCount = feeStructure.items.filter(
    (item) => item.isRequired
  ).length;
  const optionalComponentsCount = totalComponents - mandatoryComponentsCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admissions</span>
            <span>/</span>
            <span>New Admission</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Fee Assignment & Concession
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Step 4 of 6 · Review complete fee components and optionally apply an approved concession.
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-md">
            Step 4 of 6
          </span>
        </div>
      </div>

      {/* STEP 1: FULL PAGE FEE STRUCTURE */}
      <Card className="border border-border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="py-3.5 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Fee Structure: {feeStructure.className || "Assigned Class Structure"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Complete breakdown of applicable ledger components for this student session.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-medium bg-card text-foreground">
            {totalComponents} Components ({mandatoryComponentsCount} Mandatory, {optionalComponentsCount} Optional)
          </Badge>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-7">Fee Component</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          <div className="divide-y divide-border/60">
            {feeStructure.items.map((item) => (
              <div
                key={item.feeComponentId}
                className="grid grid-cols-12 gap-2 py-3 items-center text-xs"
              >
                <div className="col-span-7 min-w-0 pr-2">
                  <p className="font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Code: {item.code}
                  </p>
                </div>

                <div className="col-span-3">
                  {item.isRequired ? (
                    <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground border-border">
                      Mandatory
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border">
                      Optional
                    </Badge>
                  )}
                </div>

                <div className="col-span-2 text-right font-mono font-medium text-foreground tabular-nums">
                  ₹{Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-sm font-semibold">
            <span className="text-foreground">Total Assigned Fee</span>
            <span className="font-mono text-base text-foreground tabular-nums">
              ₹{totalFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* STEP 2: OPTIONAL CONCESSION FORM */}
      <Card className="border border-border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="py-3.5 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Concession & Scholarship (Optional)
              </h2>
              <p className="text-xs text-muted-foreground">
                Provide discount details below if an approved concession applies to this student.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] font-medium bg-card text-muted-foreground">
            Optional
          </Badge>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground block">
                Concession / Discount Type
              </label>
              <Input
                placeholder="e.g. Sibling discount, Staff ward"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="h-9 text-xs rounded-md bg-background border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground block">
                Concession Amount (₹)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1500"
                value={discountAmountStr}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className={`h-9 text-xs rounded-md bg-background border-border font-mono tabular-nums ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-1.5 text-xs text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Approval Note / Description
            </label>
            <Textarea
              placeholder="Reference number or approval remarks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs rounded-md bg-background border-border resize-none h-16"
            />
          </div>
        </CardContent>
      </Card>

      {/* STEP 3: FINANCIAL SUMMARY */}
      <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
        <div className="py-3.5 px-5 bg-muted/30 border-b border-border flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Payment Calculation Summary
          </h3>
        </div>

        <CardContent className="p-6 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Total Assigned Fee</span>
              <span className="font-mono font-medium text-foreground tabular-nums">
                ₹{totalFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {parsedDiscount > 0 && (
              <div className="flex items-center justify-between py-1 text-amber-700 dark:text-amber-400">
                <span className="text-muted-foreground">Applied Concession ({discountType || "General"})</span>
                <span className="font-mono font-medium tabular-nums">
                  − ₹{parsedDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-3 mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Final Payable Amount</span>
              <span className="text-2xl font-bold font-mono text-primary tabular-nums">
                ₹{finalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NAVIGATION ACTION BAR */}
      <div className="pt-2 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs border-border shadow-2xs hover:bg-muted rounded-md h-9 px-4 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleProceed}
          disabled={Boolean(error)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-5 h-9 shadow-sm rounded-md transition-all gap-1.5"
        >
          <span>Continue to Installments</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}