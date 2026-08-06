// frontend/admissions/components/wizard/steps/step-2-verify-registration.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck2,
  BadgeCheck,
  Building2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentRegistrationSummaryDTO } from "@/features/admissions/dto/admission.dto";

// Extended DTO interface preserving complete type safety
export interface Step2StudentDTO extends StudentRegistrationSummaryDTO {
  middleName?: string | null;
  mobile?: string | null;
  email?: string | null;
  photo?: string | null;
  aadhaarNumber?: string | null;
  aadhaar?: string | null;
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

// Reusable Enterprise Data Display Field
function DataDisplayField({
  label,
  value,
  icon: Icon,
  isMono = false,
  isFullWidth = false,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ElementType;
  isMono?: boolean;
  isFullWidth?: boolean;
}) {
  const hasValue = value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div
      className={`p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 transition-all duration-200 hover:border-zinc-200 dark:hover:border-zinc-700/80 ${
        isFullWidth ? "col-span-1 sm:col-span-2" : "col-span-1"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-zinc-400 shrink-0" />}
        <span>{label}</span>
      </p>
      {hasValue ? (
        <p
          className={`text-xs font-semibold text-zinc-900 dark:text-zinc-100 ${
            isMono ? "font-mono" : ""
          }`}
        >
          {String(value)}
        </p>
      ) : (
        <p className="text-xs font-mono text-zinc-300 dark:text-zinc-600">—</p>
      )}
    </div>
  );
}

export function Step2VerifyRegistration({ student, onNext, onBack }: Step2Props) {
  // Candidate Name Formatting
  const fullName = [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");

  // Profile Photo Source
  const photoUrl = student.photo;

  // Safe DOB Formatting
  const formattedDob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Safe Address Formatting
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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* 1. TOP HERO DASHBOARD HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60 rounded-full px-2.5 py-0.5"
            >
              Step 2 of 5
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 rounded-full px-2.5 py-0.5"
            >
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
              Verified Registration
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Verify Student Registration</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Review read-only candidate details before configuring academic class scope and fee ledgers.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-400 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium">Est. time: 30 secs</span>
          </div>

          <Link href={`/students/${student.id}/edit`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-2xs hover:bg-zinc-50 rounded-xl"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. MASTER-DETAIL LAYOUT (Sticky Profile Panel 30% | Grouped Surface 70%) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT PROFILE SIDEBAR (30% Width) */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-4">
          <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs bg-white dark:bg-zinc-900 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Candidate Profile</span>
              </span>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Square Format Photo Container */}
              <div className="relative">
                {photoUrl ? (
                  <div className="w-36 h-36 relative aspect-square rounded-2xl overflow-hidden border-2 border-zinc-200/80 dark:border-zinc-700 shadow-xs transition-transform hover:scale-[1.02]">
                    <Image
                      src={photoUrl}
                      alt={`${fullName} profile photo`}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 aspect-square rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border-2 border-blue-500/20 flex flex-col items-center justify-center font-bold text-3xl text-blue-600 dark:text-blue-400 shadow-2xs">
                    <span>{student.firstName?.[0] || "S"}</span>
                    <span className="text-[10px] font-medium text-zinc-400 mt-1">No Photo</span>
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              </div>

              {/* Title & Registration Code */}
              <div className="space-y-1 w-full">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {fullName}
                </h3>
                <p className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  CODE: {student.studentCode}
                </p>
              </div>

              {/* Status Verification Checklist */}
              <div className="w-full space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  System Verification
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Registration Master</span>
                    <span className="font-semibold">VALID</span>
                  </div>
                  <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5" /> Admission Scope</span>
                    <span className="font-semibold">READY</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* RIGHT DETAILS PANEL (70% Width - Clean Grouped Surface) */}
        <main className="flex-1 w-full space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden">
            
            {/* SECTION 1: PERSONAL INFORMATION */}
            <section className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Personal Information</span>
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">Section 01</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <DataDisplayField label="First Name" value={student.firstName} icon={User} />
                <DataDisplayField label="Middle Name" value={student.middleName} />
                <DataDisplayField label="Last Name" value={student.lastName} />
                <DataDisplayField label="Registration Code" value={student.studentCode} isMono />
                <DataDisplayField label="Date of Birth" value={formattedDob} icon={Calendar} />
                <DataDisplayField label="Gender" value={student.gender} />
              </div>
            </section>

            {/* SECTION 2: CONTACT DETAILS */}
            <section className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Contact Information</span>
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">Section 02</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <DataDisplayField label="Student Mobile Number" value={student.mobile} icon={Phone} isMono />
                <DataDisplayField label="Student Email Address" value={student.email} icon={Mail} />
              </div>
            </section>

            {/* SECTION 3: PARENT DETAILS */}
            <section className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Parent & Guardian Details</span>
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">Section 03</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <DataDisplayField label="Father Full Name" value={student.fatherName} icon={User} />
                <DataDisplayField label="Father Mobile Contact" value={student.fatherMobile} icon={Phone} isMono />
                <DataDisplayField label="Mother Full Name" value={student.motherName} icon={Heart} isFullWidth />
              </div>
            </section>

            {/* SECTION 4: GOVERNMENT IDENTITY */}
            <section className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Government Identification</span>
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">Section 04</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <DataDisplayField
                  label="National ID Record"
                  value={student.studentCode}
                  icon={CreditCard}
                  isMono
                  isFullWidth
                />
              </div>
            </section>

            {/* SECTION 5: RESIDENTIAL ADDRESS */}
            <section className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Residential Address</span>
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">Section 05</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <DataDisplayField label="Address Line 1" value={student.addressLine1} icon={MapPin} />
                <DataDisplayField label="Address Line 2" value={student.addressLine2} />
                <DataDisplayField label="City" value={student.city} />
                <DataDisplayField label="State" value={student.state} />
                <DataDisplayField label="Postal Code" value={student.postalCode} isMono />
                <DataDisplayField label="Full Address Summary" value={fullAddress} isFullWidth />
              </div>
            </section>

          </div>

          {/* FOOTER WIZARD NAVIGATION CONTROLS */}
          <div className="pt-2 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-xs border-zinc-200 dark:border-zinc-800 shadow-2xs hover:bg-zinc-50 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Back to Selection</span>
            </Button>
            
            <Button
              onClick={onNext}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 shadow-2xs rounded-xl transition-all"
            >
              <span>Continue to Academic Scope</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

        </main>
      </div>
    </motion.div>
  );
}