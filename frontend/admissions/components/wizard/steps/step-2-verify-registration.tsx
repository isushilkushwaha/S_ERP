// frontend/admissions/components/wizard/steps/step-2-verify-registration.tsx

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  User,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StudentRegistrationSummaryDTO } from "@/features/admissions/dto/admission.dto";

export interface Step2StudentDTO extends StudentRegistrationSummaryDTO {
  middleName?: string | null;
  mobile?: string | null;
  email?: string | null;
  photo?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
}

interface Step2Props {
  student: Step2StudentDTO;
  onNext: () => void;
  onBack: () => void;
}

export function Step2VerifyRegistration({ student, onNext, onBack }: Step2Props) {
  const [hasImageError, setHasImageError] = useState(false);

  const fullName = [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");

  // Normalize photo path cleanly
  const photoUrl = useMemo(() => {
    if (!student.photo) return null;
    if (student.photo.startsWith("http://") || student.photo.startsWith("https://") || student.photo.startsWith("/")) {
      return student.photo;
    }
    return `/${student.photo}`;
  }, [student.photo]);

  const formattedDob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const fullAddress = [
    student.addressLine1,
    student.addressLine2,
    student.city,
    student.state,
    student.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admissions</span>
            <span>/</span>
            <span>Registration</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Verify Student Registration
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and confirm the student's registration information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/students/${student.id}/edit`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 shadow-2xs hover:bg-muted/60 transition-all rounded-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Edit Profile Details ↗</span>
            </Button>
          </Link>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-md">
            Step 2 of 5
          </span>
        </div>
      </div>

      {/* STUDENT IDENTITY CARD */}
      <div className="space-y-4">
        <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {photoUrl && !hasImageError ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shadow-2xs shrink-0 bg-muted">
                  <Image
                    src={photoUrl}
                    alt={`${fullName} profile photo`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => setHasImageError(true)}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center font-bold text-lg text-muted-foreground shrink-0 shadow-2xs">
                  {student.firstName?.[0] || "S"}
                  {student.lastName?.[0] || ""}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-foreground">
                    {fullName}
                  </h2>
                  <Badge variant="outline" className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500 inline" />
                    Verified
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Student Code: <span className="font-mono font-medium text-foreground">{student.studentCode || "—"}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Registration Status: <span className="font-medium text-foreground">Active</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-xs text-muted-foreground">Registration Review</span>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                ✓ Information available for review
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INFORMATION LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PERSONAL INFORMATION */}
        <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col justify-between">
          <div className="py-3 px-4 bg-muted/30 border-b border-border flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Personal Information
            </h3>
          </div>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Date of Birth</span>
                <span className="text-sm font-medium text-foreground mt-0.5 block">{formattedDob || "—"}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Gender</span>
                <span className="text-sm font-medium text-foreground mt-0.5 block">{student.gender || "—"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Mobile</span>
                <span className="text-sm font-medium font-mono text-foreground mt-0.5 block">{student.mobile || "—"}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Email</span>
                <span className="text-sm font-medium text-foreground mt-0.5 block truncate" title={student.email || ""}>{student.email || "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PARENT / GUARDIAN INFORMATION */}
        <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col justify-between">
          <div className="py-3 px-4 bg-muted/30 border-b border-border flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Parent / Guardian
            </h3>
          </div>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Father</span>
                <span className="text-sm font-medium text-foreground mt-0.5 block">{student.fatherName || "—"}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Mother</span>
                <span className="text-sm font-medium text-foreground mt-0.5 block">{student.motherName || "—"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
              Primary family contact details mapped from registration.
            </div>
          </CardContent>
        </Card>

        {/* ADDRESS */}
        <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden md:col-span-2">
          <div className="py-3 px-4 bg-muted/30 border-b border-border flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Address
            </h3>
          </div>
          <CardContent className="p-4 space-y-2 text-xs">
            <span className="text-xs font-medium text-muted-foreground block">Permanent Address</span>
            <span className="text-sm font-medium text-foreground block leading-relaxed">
              {fullAddress || "—"}
            </span>
          </CardContent>
        </Card>

      </div>

      {/* FOOTER ACTION BAR */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs border-border shadow-2xs hover:bg-muted rounded-md h-9 px-4 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Registration</span>
        </Button>
        
        <Button
          onClick={onNext}
          size="sm"
          className="text-xs font-medium px-5 h-9 shadow-sm rounded-md transition-all gap-1.5"
        >
          <span>Continue to Fees</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}