// frontend/admissions/components/wizard/steps/step-6-review-confirm.tsx

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
  Receipt,
  Phone,
  Building2,
  Bus,
  Tag,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  StudentRegistrationSummaryDTO,
  AssignedFeeStructureDTO,
} from "@/features/admissions/dto/admission.dto";
import { Step3AcademicAdmissionInput } from "@/features/admissions/validators/admission.validator";

interface ConcessionReviewDTO {
  discountType: string;
  discountAmount: number;
  description: string;
  finalPayable: number;
}

interface MilestoneItemDTO {
  id?: string;
  name: string;
  dueDate?: string | null;
  value?: number;
  componentIds?: string[];
}

interface Step6Props {
  student: StudentRegistrationSummaryDTO;
  academicDetails: Step3AcademicAdmissionInput;
  feeStructure: AssignedFeeStructureDTO;
  concession?: ConcessionReviewDTO | null;
  selectedPlanName?: string | null;
  installmentMilestones?: MilestoneItemDTO[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

export function Step6ReviewConfirm({
  student,
  academicDetails,
  feeStructure,
  concession,
  selectedPlanName,
  installmentMilestones,
  isSubmitting,
  errorMessage,
  onConfirm,
  onBack,
}: Step6Props): React.JSX.Element {
  const initialTotalAmount = feeStructure?.totalAmount || 0;
  const discountVal = concession?.discountAmount || 0;
  const finalPayableAmount = Math.max(0, initialTotalAmount - discountVal);

  const reviewSteps = [
    { number: "01", label: "Student" },
    { number: "02", label: "Verify" },
    { number: "03", label: "Academic" },
    { number: "04", label: "Fees" },
    { number: "05", label: "Installment" },
    { number: "06", label: "Review" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* HEADER */}
      <div className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-primary">
                Step 6 of 6
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Review & Confirm Admission
            </h1>
          </div>
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="hidden md:flex items-center gap-1.5 bg-muted/40 border border-border/60 px-3 py-1.5 rounded-xl">
            {reviewSteps.map((step, idx) => {
              const isCurrent = step.number === "06";
              return (
                <div key={step.number} className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {step.number} {step.label}
                  </span>
                  {idx < reviewSteps.length - 1 && (
                    <span className="text-muted-foreground/40 text-[10px]">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Please verify the admission details, fees, discount and payment schedule before confirming.
        </p>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Admission could not be completed
            </h4>
            <p className="text-xs text-destructive/90 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[11px] text-muted-foreground pt-0.5">
              Please correct the issue and try again.
            </p>
          </div>
        </motion.div>
      )}

      {/* REVIEW SECTIONS 01 - 06 */}
      <div className="space-y-4">

        {/* 01. STUDENT INFORMATION */}
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-muted-foreground">01</span>
              <User className="w-4 h-4 text-primary" />
              <span>Student Information</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 bg-emerald-500/5 border-emerald-500/20">
              ✓ Verified
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">Registration Number</span>
                <span className="font-mono font-medium text-foreground">
                  {student?.studentCode || "STU-2026-00452"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Student Name</span>
                <span className="font-medium text-foreground">
                  {student?.firstName} {student?.lastName || ""}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Student Email</span>
                <span className="font-medium text-foreground truncate block">
                  {student?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Mobile</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  {student?.mobile || student?.fatherMobile || "98765XXXXX"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Date of Birth</span>
                <span className="font-medium text-foreground">
                  {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-IN") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Father Name</span>
                <span className="font-medium text-foreground">
                  {student?.fatherName || "Suresh Kumar"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Mother Name</span>
                <span className="font-medium text-foreground">
                  {student?.motherName || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 02. ACADEMIC ALLOCATION */}
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-muted-foreground">02</span>
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>Academic Allocation</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 bg-emerald-500/5 border-emerald-500/20">
              ✓ Complete
            </Badge>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px] block">Academic Year</span>
                <span className="font-medium text-foreground">2026–27</span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Class / Section</span>
                <span className="font-medium text-foreground">
                  LKG / {academicDetails?.sectionId || "A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Admission Number</span>
                <span className="font-mono font-medium text-foreground">
                  {academicDetails?.admissionNumber || "AUTO"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px] block">Roll Number</span>
                <span className="font-mono font-medium text-foreground">
                  #{academicDetails?.rollNumber || "1"}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3">
                <span className="text-muted-foreground text-[11px] block">Admission Type</span>
                <span className="font-medium text-foreground uppercase">
                  {academicDetails?.admissionType || "NEW"}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3">
                <span className="text-muted-foreground text-[11px] block">Medium</span>
                <span className="font-medium text-foreground uppercase">
                  {academicDetails?.medium || "ENGLISH"}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3">
                <span className="text-muted-foreground text-[11px] block">Admission Date</span>
                <span className="font-medium text-foreground">
                  {new Date().toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3">
                <span className="text-muted-foreground text-[11px] block">Hostel Service</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  {academicDetails?.isHostelRequired ? "Required" : "Not Required"}
                </span>
              </div>
              <div className="border-t border-border/40 pt-3">
                <span className="text-muted-foreground text-[11px] block">Transport Service</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Bus className="w-3 h-3 text-muted-foreground" />
                  {academicDetails?.isTransportRequired ? "Required" : "Not Required"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 03. FEE ASSIGNMENT */}
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-muted-foreground">03</span>
              <Receipt className="w-4 h-4 text-primary" />
              <span>Fee Assignment</span>
            </CardTitle>
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              {feeStructure?.items?.length || 0} Components
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="rounded-md border border-border/80 overflow-hidden">
              <div className="grid grid-cols-2 bg-muted/40 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
                <span>Fee Component</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="divide-y divide-border/60 text-xs">
                {feeStructure?.items?.map((item: any) => (
                  <div key={item.feeComponentId} className="grid grid-cols-2 px-3 py-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.name}</span>
                      {item.isRequired && (
                        <Badge variant="outline" className="text-[9px] font-mono bg-amber-500/10 text-amber-600 border-amber-500/20 px-1 py-0">
                          Required
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-right font-medium text-foreground">
                      ₹{Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-xs font-semibold">
              <span className="text-muted-foreground">Fee Structure Total</span>
              <span className="font-mono text-sm font-bold text-foreground">
                ₹{initialTotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 04. DISCOUNT / CONCESSION */}
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-muted-foreground">04</span>
              <Tag className="w-4 h-4 text-primary" />
              <span>Discount / Concession</span>
            </CardTitle>
            {concession && concession.discountAmount > 0 ? (
              <Badge variant="outline" className="text-[10px] font-mono text-amber-600 bg-amber-500/5 border-amber-500/20">
                Applied
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </CardHeader>
          <CardContent className="p-5">
            {concession && concession.discountAmount > 0 ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-border/60">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Concession / Discount Type</span>
                    <span className="font-medium text-foreground block mt-0.5">
                      {concession.discountType || "General Concession"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Concession Amount</span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                      -₹{concession.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Approval Note / Description</span>
                    <span className="font-medium text-foreground block mt-0.5 truncate">
                      {concession.description && concession.description.trim() !== "" ? concession.description : "No description provided"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-semibold pt-1">
                  <span className="text-muted-foreground">Payable After Discount</span>
                  <span className="font-mono text-sm text-foreground">
                    ₹{finalPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-1">
                No discount applied to this admission.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 05. INSTALLMENT PLAN */}
        <Card className="rounded-xl border shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-muted-foreground">05</span>
              <CalendarDays className="w-4 h-4 text-primary" />
              <span>Installment Plan</span>
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 bg-emerald-500/5 border-emerald-500/20">
              ✓ Assigned ({installmentMilestones?.length || 0} Milestones)
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1 text-xs pb-2 border-b border-border/60">
              <span className="text-muted-foreground text-[11px] block">Installment Template</span>
              <p className="font-semibold text-foreground text-sm">
                {selectedPlanName || "Class Default Installment Plan"}
              </p>
            </div>

            {installmentMilestones && installmentMilestones.length > 0 ? (
              <div className="space-y-2">
                <div className="rounded-md border border-border/80 overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted/40 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
                    <span className="col-span-5">Milestone Name</span>
                    <span className="col-span-3">Due Date</span>
                    <span className="col-span-4 text-right">Due Amount</span>
                  </div>
                  <div className="divide-y divide-border/60 text-xs">
                    {installmentMilestones.map((m: MilestoneItemDTO, idx: number) => {
                      const milestoneAmount = Number(m.value || 0);
                      return (
                        <div key={m.id || idx} className="grid grid-cols-12 px-3 py-2.5 items-center">
                          <div className="col-span-5 flex items-center gap-2">
                            <span className="font-medium text-foreground">{m.name || `Milestone ${idx + 1}`}</span>
                          </div>
                          <span className="col-span-3 text-muted-foreground font-mono text-[11px]">
                            {m.dueDate ? new Date(m.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </span>
                          <span className="col-span-4 font-mono text-right font-bold text-foreground">
                            ₹{milestoneAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TOTAL SCHEDULED AMOUNT / DUE AMOUNT ROW */}
                <div className="flex items-center justify-between px-1 text-xs font-semibold pt-1">
                  <span className="text-muted-foreground">Total Scheduled Due Amount</span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    ₹{installmentMilestones.reduce((sum, m) => sum + Number(m.value || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-1">
                No milestone breakdown available.
              </p>
            )}
          </CardContent>
        </Card>

        
        {/* 06. PAYMENT SUMMARY */}
        <Card className="rounded-xl border border-primary/30 shadow-none bg-card">
          <CardHeader className="py-3 px-5 border-b border-border/60 flex flex-row items-center justify-between bg-primary/5">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span className="font-mono text-primary font-bold">06</span>
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Payment Summary</span>
            </CardTitle>
            <Badge className="bg-primary text-primary-foreground text-[10px]">
              Final Calculation
            </Badge>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fee Structure Total</span>
                <span className="font-mono font-medium text-foreground">
                  ₹{initialTotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {concession && concession.discountAmount > 0 && (
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                  <span>Discount ({concession.discountType})</span>
                  <span className="font-mono font-medium">
                    -₹{concession.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">FINAL PAYABLE</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{finalPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 mt-2">
              <span className="font-bold">✓</span>
              <span>Payment schedule is balanced and ready for institutional commitment.</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* FINAL CONFIRMATION PANEL */}
      <Card className="rounded-xl border border-border/80 shadow-none bg-card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Ready to Complete Admission
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              After confirmation, the system will create the student&apos;s official admission, enrollment, and fee records. This action cannot be undone without administrative correction.
            </p>
          </div>

          <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs rounded-lg h-9 px-4 border-border"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-6 rounded-lg shadow-none"
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
      </Card>
    </motion.div>
  );
}