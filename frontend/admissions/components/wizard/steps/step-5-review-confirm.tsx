"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  User,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  Phone,
  Calendar,
  Clock,
  Building2,
  Bus,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";


import {
  StudentRegistrationSummaryDTO,
  AssignedFeeStructureDTO,
} from "@/features/admissions/dto/admission.dto";
import { Step3AcademicAdmissionInput } from "@/features/admissions/validators/admission.validator";

interface Step5Props {
  student: StudentRegistrationSummaryDTO;
  academicDetails: Step3AcademicAdmissionInput;
  feeStructure: AssignedFeeStructureDTO;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

export function Step5ReviewConfirm({
  student,
  academicDetails,
  feeStructure,
  isSubmitting,
  errorMessage,
  onConfirm,
  onBack,
}: Step5Props) {
  const totalFeeItems = feeStructure?.items?.length || 0;
  const totalAmount = feeStructure?.totalAmount || 0;

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
              Step 5 of 5
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-2.5 py-0.5 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Ready for Final Commitment</span>
            </Badge>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Review & Confirm Admission</span>
          </h1>

          <p className="text-xs text-muted-foreground max-w-2xl">
            Review all candidate, academic allocation, and fee ledger information before permanently creating the admission record.
          </p>
        </div>

        {/* PROGRESS & EST. TIME BLOCK */}
        <div className="flex items-center gap-4 bg-muted/30 border border-border/60 p-3.5 rounded-2xl shrink-0 self-start lg:self-center">
          <div className="space-y-1 text-right min-w-[100px]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              Admission Progress
            </span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
              100% Completed
            </span>
          </div>
          <div className="w-24">
            <Progress value={100} className="h-2 bg-muted text-emerald-500" />
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground border-l border-border/60 pl-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium">Est. 10s</span>
          </div>
        </div>
      </div>

      {/* ERROR BANNER STATE */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start space-x-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Admission Submission Failed
            </h4>
            <p className="text-xs text-destructive/90 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[10px] text-muted-foreground pt-1">
              Please review your academic scope allocation or fee structure configuration and attempt submission again.
            </p>
          </div>
        </motion.div>
      )}

      {/* COMPACT METRICS HIGHLIGHT BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/80 rounded-2xl bg-card p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Student State
          </span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold text-foreground">Registered</span>
            <Badge variant="secondary" className="text-[9px] font-mono">
              Code Ready
            </Badge>
          </div>
        </Card>

        <Card className="border border-border/80 rounded-2xl bg-card p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Academic Scope
          </span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold text-foreground">Configured</span>
            <Badge variant="secondary" className="text-[9px] font-mono">
              Roll #{academicDetails?.rollNumber || "AUTO"}
            </Badge>
          </div>
        </Card>

        <Card className="border border-border/80 rounded-2xl bg-card p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Assigned Fees
          </span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <Badge variant="secondary" className="text-[9px] font-mono">
              {totalFeeItems} Items
            </Badge>
          </div>
        </Card>

        <Card className="border border-border/80 rounded-2xl bg-card p-4 shadow-xs">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Commitment Status
          </span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold text-primary">Ready</span>
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </Card>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (70% REVIEW CONTENT | 30% STICKY CONFIRMATION SIDEBAR) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT COLUMN: 70% DETAILED AUDIT SECTIONS */}
        <div className="flex-1 w-full space-y-6">
          
          {/* SECTION 1: STUDENT MASTER DETAILS */}
          <Card className="border border-border/80 rounded-3xl shadow-xs overflow-hidden bg-card">
            <CardHeader className="py-4 px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Student Master Details</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Section 01
              </Badge>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Full Name</span>
                  <span className="font-bold text-sm text-foreground block">
                    {student?.firstName} {student?.lastName || ""}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Student Identifier</span>
                  <span className="font-mono font-semibold text-foreground block">
                    {student?.studentCode || "N/A"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Father / Guardian Contact</span>
                  <span className="font-medium text-foreground block flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    {student?.fatherName ? `${student.fatherName} (${student.fatherMobile || "N/A"})` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: ACADEMIC & FACILITY SCOPE */}
          <Card className="border border-border/80 rounded-3xl shadow-xs overflow-hidden bg-card">
            <CardHeader className="py-4 px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>Academic & Facility Allocation</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Section 02
              </Badge>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Assigned Roll Number</span>
                  <span className="font-bold font-mono text-sm text-primary block">
                    #{academicDetails?.rollNumber || "AUTO"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Admission Type & Medium</span>
                  <span className="font-medium text-foreground block">
                    {academicDetails?.admissionType} / {academicDetails?.medium}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Effective Admission Date</span>
                  <span className="font-medium text-foreground block flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {academicDetails?.admissionDate
                      ? new Date(academicDetails.admissionDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="space-y-1 border-t border-border/60 pt-3">
                  <span className="text-muted-foreground text-[11px] block">Hostel Service</span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    {academicDetails?.isHostelRequired ? "Requested / Required" : "Not Required"}
                  </span>
                </div>

                <div className="space-y-1 border-t border-border/60 pt-3">
                  <span className="text-muted-foreground text-[11px] block">Transport Service</span>
                  <span className="font-medium text-foreground flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-amber-500" />
                    {academicDetails?.isTransportRequired ? "Requested / Required" : "Not Required"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: ITEMISED FEE LEDGER SUMMARY */}
          <Card className="border border-border/80 rounded-3xl shadow-xs overflow-hidden bg-card">
            <CardHeader className="py-4 px-6 bg-muted/20 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <span>Financial Commitment Breakdown</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Section 03
              </Badge>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                {feeStructure?.items?.map((item) => (
                  <div
                    key={item.feeComponentId}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-muted/20 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-medium text-foreground">{item.name}</span>
                      {item.isRequired && (
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-1.5 py-0"
                        >
                          Mandatory
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-foreground">
                      ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Total Assigned Admission Fees
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Auto-derived from institutional fee master
                  </span>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* FINAL TRANSACTIONAL CONFIRMATION CARD */}
          <Card className="border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Automated Actions Executed Upon Confirmation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Create Student Enrollment Record</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Assign Class Sequence Roll Number</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Generate Student Ledger Fee Items</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Persist Academic Scope & History</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-muted-foreground font-medium">
              ⚠️ <strong className="text-foreground">Note:</strong> Confirming this transaction creates official institutional ledger records.
            </div>
          </Card>

          {/* DESKTOP/TABLET BOTTOM NAVIGATION BUTTONS */}
          <div className="pt-2 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              className="text-xs border-border shadow-2xs hover:bg-muted rounded-xl h-10 px-4"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back to Fees</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-10 px-6 shadow-2xs rounded-xl transition-all min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  <span>Creating Admission...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>Confirm & Admit Student</span>
                </>
              )}
            </Button>
          </div>

        </div>

        {/* RIGHT COLUMN: 30% STICKY ADMISSION SUMMARY SIDEBAR */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-4">
          <div className="border border-border/80 rounded-3xl p-5 shadow-xs bg-card space-y-5">
            
            {/* PANEL HEADER */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Admission Overview</span>
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                SUMMARY
              </Badge>
            </div>

            {/* CANDIDATE QUICK SNAPSHOT */}
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Candidate Snapshot
              </span>
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold text-foreground truncate max-w-[130px]">
                    {student?.firstName} {student?.lastName || ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reg Code:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {student?.studentCode || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Roll Number:</span>
                  <span className="font-mono font-bold text-primary">
                    #{academicDetails?.rollNumber || "AUTO"}
                  </span>
                </div>
              </div>
            </div>

            {/* FINANCIAL SNAPSHOT */}
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Financial Summary
              </span>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-1">
                <span className="text-[10px] text-muted-foreground block">
                  Total Ledger Amount
                </span>
                <div className="text-xl font-extrabold font-mono text-primary">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  {totalFeeItems} Fee Component(s) Included
                </span>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Admission Ready
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Click below to complete registration
              </span>
            </div>

            {/* PRIMARY SIDEBAR CONFIRMATION BUTTON */}
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-11 shadow-2xs rounded-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  <span>Creating Admission...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>Confirm & Admit Student</span>
                </>
              )}
            </Button>

          </div>
        </aside>

      </div>
    </motion.div>
  );
}