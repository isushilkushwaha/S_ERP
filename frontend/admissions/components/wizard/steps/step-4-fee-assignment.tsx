"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Receipt,
  CheckCircle2,
  CreditCard,
  Info,
  BadgeCheck,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignedFeeStructureDTO } from "@/features/admissions/dto/admission.dto";

interface Step4Props {
  feeStructure: AssignedFeeStructureDTO | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step4FeeAssignment({
  feeStructure,
  onNext,
  onBack,
}: Step4Props) {
  // --- EMPTY / NO FEE STRUCTURE STATE ---
  if (!feeStructure) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-2xl mx-auto py-12 px-4"
      >
        <Card className="border border-destructive/20 bg-card rounded-3xl shadow-sm overflow-hidden text-center p-8 sm:p-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              No Fee Structure Selected
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              We could not detect an active fee structure mapping for this selection. Please return to Step 3 and assign a valid Academic Year and Class.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="rounded-xl h-11 px-6 text-xs font-semibold border-border shadow-xs hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Academic Scope</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // --- STATS CALCULATION ---
  const totalComponents = feeStructure.items.length;
  const mandatoryComponentsCount = feeStructure.items.filter(
    (item) => item.isRequired
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* TOP DASHBOARD HERO STICKY HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border/80 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-semibold bg-primary/10 text-primary border-primary/20 rounded-full px-2.5 py-0.5"
            >
              Step 4 of 5
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-2.5 py-0.5 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Fee Allocation Active</span>
            </Badge>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Fee Assignment Breakdown</span>
          </h1>

          <p className="text-xs text-muted-foreground max-w-2xl">
            Review auto-assigned financial commitments derived from active institutional master rules.
          </p>
        </div>

        {/* PROGRESS INDICATOR BLOCK */}
        <div className="flex items-center gap-4 bg-muted/30 border border-border/60 p-3.5 rounded-2xl shrink-0 self-start lg:self-center">
          <div className="space-y-1 text-right min-w-[100px]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              Admission Setup
            </span>
            
          </div>
          
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID (70% CONTENT | 30% STICKY SIDEBAR) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT COLUMN: 70% ITEM LIST & OVERVIEW */}
        <div className="flex-1 w-full space-y-6">
          
          {/* SUCCESS BANNER CARD */}
          <Card className="border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Fee Structure Successfully Mapped
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mapped {totalComponents} fee components from Master Ledger.
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-mono font-semibold bg-background border-border text-foreground px-2.5 py-1 rounded-xl shrink-0 hidden sm:inline-flex"
              >
                ID: {feeStructure.feeStructureId.slice(0, 8)}...
              </Badge>
            </div>
          </Card>

          {/* SCHEDULED FEE LEDGER ITEM CARDS LIST */}
          <Card className="border border-border/80 rounded-3xl shadow-xs overflow-hidden bg-card">
            <CardHeader className="py-4 px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Scheduled Fee Components
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono font-normal">
                {totalComponents} Components
              </Badge>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-3">
              {feeStructure.items.map((item, index) => (
                <motion.div
                  key={item.feeComponentId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 hover:border-border transition-all duration-200 gap-3"
                >
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="p-2 rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary/10 transition-colors">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-foreground tracking-tight">
                          {item.name}
                        </span>
                        {item.isRequired && (
                          <Badge
                            variant="outline"
                            className="text-[9px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-1.5 py-0 rounded-full"
                          >
                            Mandatory
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-mono">
                        <span>Code: {item.code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono self-end sm:self-center">
                    <span className="text-xs text-muted-foreground block text-[10px]">
                      Scheduled Fee
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* INFORMATION ALERT NOTE BOX */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-muted-foreground flex items-start space-x-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">
                Billing Rules & Overrides Notice
              </span>
              <p className="text-[11px] leading-relaxed">
                Fee schedules are automatically bound to candidate profiles per master configuration. Overrides or concessions require supervisor authorization during billing execution.
              </p>
            </div>
          </div>

          {/* DESKTOP/TABLET BOTTOM NAVIGATION BUTTONS */}
          <div className="pt-2 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-xs border-border shadow-2xs hover:bg-muted rounded-xl h-10 px-4"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium h-10 px-5 shadow-2xs rounded-xl transition-all"
            >
              <span>Proceed to Final Review</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

        </div>

        {/* RIGHT COLUMN: 30% STICKY BILLING SUMMARY SIDEBAR */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-4">
          <div className="border border-border/80 rounded-3xl p-5 shadow-xs bg-card space-y-5">
            
            {/* PANEL HEADER */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                <span>Billing Overview</span>
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                FINAL CHECK
              </Badge>
            </div>

            {/* HIGHLIGHTED TOTAL AMOUNT PANEL */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Total Admission Fee
              </span>
              <div className="text-2xl font-extrabold font-mono text-primary tracking-tight">
                ₹{feeStructure.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Inclusive of all assigned ledger components
              </span>
            </div>

            {/* METRICS BREAKDOWN LIST */}
            <div className="space-y-2.5 text-xs">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Structure Details
              </p>
              
              <div className="space-y-2 bg-muted/30 p-3.5 rounded-2xl border border-border/60 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Components:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {totalComponents}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mandatory Items:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    {mandatoryComponentsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Optional Items:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {totalComponents - mandatoryComponentsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-2">
                  <span className="text-muted-foreground">Billing Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                    READY FOR REVIEW
                  </span>
                </div>
              </div>
            </div>

            {/* PRIMARY SIDEBAR ACTION BUTTON */}
            <Button
              type="button"
              onClick={onNext}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium h-10 shadow-2xs rounded-xl transition-all"
            >
              <span>Proceed to Final Review</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>

          </div>
        </aside>

      </div>
    </motion.div>
  );
}