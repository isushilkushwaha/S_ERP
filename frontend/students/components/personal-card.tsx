"use client";

import { useState } from "react";
import { User, ShieldCheck, School, HeartPulse, Pencil, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Student } from "../types/student";
import { PersonalForm } from "./update/personal-form";

interface PersonalCardProps {
  student: Student;
}

export function PersonalCard({ student }: PersonalCardProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="relative overflow-hidden border border-border bg-card text-card-foreground shadow-md transition-all">
      {/* Top Primary Accent Bar */}
      

      {/* Top Right Action: Pencil Icon Button with Tooltip */}
      <div className="absolute right-3 top-4 z-10 sm:right-5 sm:top-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border bg-background shadow-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpen(true)}
                  aria-label="Edit Information"
                >
                  <Pencil className="h-4 w-4 shrink-0 text-foreground" />
                </Button>
              }
            />
            <TooltipContent side="left" className="text-xs font-medium">
              Edit Information
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Card Header */}
      <CardHeader className="border-b border-border/80 bg-muted/20 pb-5 pr-14">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30 shadow-xs">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Personal Information
            </CardTitle>
            <p className="text-xs font-medium text-muted-foreground">
              Demographic details, contact info, and legal identification
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* SECTION 1: Demographics */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Demographics
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <HighlightField
              label="Date of Birth"
              value={formatDate(student.dateOfBirth)}
            />

            <HighlightField
              label="Gender"
              value={student.gender ? <span className="capitalize">{student.gender}</span> : "-"}
            />

            <HighlightField
              label="Blood Group"
              value={
                student.bloodGroup ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 font-bold text-destructive border-destructive/40 bg-destructive/10 px-2.5 py-0.5"
                  >
                    <HeartPulse className="h-3.5 w-3.5" />
                    {student.bloodGroup}
                  </Badge>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField label="Religion" value={student.religion || "-"} />
            <HighlightField label="Category" value={student.category || "-"} />
            <HighlightField label="Caste" value={student.caste || "-"} />
            <HighlightField label="Nationality" value={student.nationality || "-"} />
          </div>
        </section>

        {/* SECTION 2: Identity & Legal Documents */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Government & Identity Documents
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <HighlightField
              label="Aadhaar Number"
              value={
                student.aadhaarNumber ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1 font-mono text-xs font-bold tracking-wider text-foreground border border-border shadow-2xs">
                    
                    {student.aadhaarNumber}
                  </span>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField
              label="Birth Certificate No."
              value={
                student.birthCertificateNo ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1 font-mono text-xs font-bold tracking-wider text-foreground border border-border shadow-2xs">
                  
                    {student.birthCertificateNo}
                  </span>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </section>

        {/* SECTION 3: Academic Background & Notes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
            <School className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Academic Background & Notes
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <HighlightField
              label="Previous School"
              value={student.previousSchool || "-"}
            />

            <HighlightField
              label="Remarks / Internal Notes"
              value={student.remarks || "-"}
            />
          </div>
        </section>
      </CardContent>

      {/* Edit Personal Information Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="relative overflow-hidden border-b border-border/80 bg-muted/20 px-6 pb-5 pt-6 text-left">
  

  <div className="flex items-center gap-3.5">
    {/* Icon Badge */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-xs">
      <User className="h-5.5 w-5.5" />
    </div>

    {/* Header Content */}
    <div className="space-y-1">
      <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
        Edit Personal Information
      </DialogTitle>
      <DialogDescription className="text-xs font-medium text-muted-foreground">
        Update demographic details and statutory government identity documents.
      </DialogDescription>
    </div>
  </div>
</DialogHeader>

          <PersonalForm
            student={student}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/**
 * Reusable High-Visibility Detail Box Component
 */
function HighlightField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border/70 bg-muted/30 p-3 shadow-2xs transition-all hover:border-border hover:bg-muted/50">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">
        {label}
      </span>
      <div className="mt-1 text-sm font-bold text-foreground">
        {value}
      </div>
    </div>
  );
}