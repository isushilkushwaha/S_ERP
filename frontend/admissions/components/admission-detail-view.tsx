// frontend/admissions/components/admission-detail-view.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface StudentDocumentItem {
  id: string;
  createdAt: string | Date;
  fileName?: string | null;
  documentType?: string | null;
  fileUrl?: string | null;
}

export interface FeeLedgerItem {
  id: string;
  amount: number | string;
  dueDate?: string | Date | null;
  isPaid: boolean;
  feeComponent?: {
    name?: string | null;
    code?: string | null;
  } | null;
}

export interface AdmissionDetailEnrollment {
  id: string;
  admissionNumber: string;
  rollNumber: number;
  admissionDate: string | Date;
  admissionType: string;
  medium: string;
  status: string;
  isHostelRequired: boolean;
  isTransportRequired: boolean;
  createdAt: string | Date;
  remarks?: string | null;
  student: {
    id: string;
    studentCode: string;
    firstName: string;
    lastName: string;
    gender?: string | null;
    dateOfBirth?: string | Date | null;
    bloodGroup?: string | null;
    category?: string | null;
    religion?: string | null;
    fatherName?: string | null;
    fatherMobile?: string | null;
    motherName?: string | null;
    motherMobile?: string | null;
    photo?: string | null;
    avatarUrl?: string | null;
    email?: string | null;
    mobile?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    
  };
  academicYear: { name: string };
  class: { name: string };
  section?: { name: string } | null;
  feeLedgers?: FeeLedgerItem[];
}

interface AdmissionDetailViewProps {
  enrollment: AdmissionDetailEnrollment;
}

export function AdmissionDetailView({ enrollment }: AdmissionDetailViewProps) {
  const student = enrollment.student;
  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const initials = `${student.firstName[0] || ""}${student.lastName[0] || ""}`.toUpperCase();
  const studentPhoto = student.photo || student.avatarUrl || null;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Active Student
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="text-xs font-mono font-semibold bg-amber-50 text-amber-700 border-amber-200 rounded-full px-3 py-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" /> Pending Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-mono font-semibold bg-zinc-100 text-zinc-600 border-zinc-200 rounded-full px-3 py-1">
            <XCircle className="w-3.5 h-3.5 mr-1 text-zinc-400" /> {status || "Inactive"}
          </Badge>
        );
    }
  };

  const feeLedgers = enrollment.feeLedgers || [];

  const totalFeesAmount = feeLedgers.reduce((sum, item) => {
    const val = Number(item.amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const fullAddress = [
    student.addressLine1,
    student.addressLine2,
    student.city,
    student.state,
    student.postalCode,
  ].filter(Boolean).join(", ");

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-4">
          <Link href="/admissions">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
              <ArrowLeft className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {fullName}
              </h1>
              {getStatusBadge(enrollment.status)}
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              Admission No: <span className="font-bold text-emerald-600">{enrollment.admissionNumber}</span> • Code: <span className="font-semibold text-zinc-700">{student.studentCode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP VERTICAL FLOW (NO CARDS) */}
      <div className="space-y-10">

        {/* STEP 1: STUDENT PROFILE & IDENTIFICATION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              1. Student Profile & Personal Information
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* SQUARE PHOTO BOX (NO UPLOAD TRIGGER) */}
            <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-xs relative">
              {studentPhoto ? (
                <Image src={studentPhoto} alt={fullName} fill className="object-cover" />
              ) : (
                <span className="text-lg font-bold text-zinc-400">{initials}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 text-xs">
              <div>
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Full Name</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{fullName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Student Code</p>
                <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{student.studentCode}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Gender & DOB</p>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {student.gender || "N/A"} / {
  student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A"
}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Blood Group</p>
                <p className="font-mono font-bold text-red-600 mt-0.5">{student.bloodGroup || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Category & Religion</p>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{student.category || "GENERAL"} • {student.religion || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
              <p className="text-[10px] font-bold uppercase text-blue-600">Father&apos;s Details</p>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{student.fatherName || "N/A"}</p>
              {student.fatherMobile && <p className="font-mono text-zinc-500">Phone: {student.fatherMobile}</p>}
            </div>
            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
              <p className="text-[10px] font-bold uppercase text-purple-600">Mother&apos;s Details</p>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{student.motherName || "N/A"}</p>
              {student.motherMobile && <p className="font-mono text-zinc-500">Phone: {student.motherMobile}</p>}
            </div>
          </div>

          {fullAddress && (
            <div className="text-xs pt-1 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span className="text-zinc-600 dark:text-zinc-300">{fullAddress}</span>
            </div>
          )}
        </section>

        <Separator />

        {/* STEP 2: ALL ADMISSION DETAILS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              2. Academic Allocation & Admission Details
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Admission Number</p>
              <p className="font-mono font-bold text-emerald-600 mt-0.5">{enrollment.admissionNumber}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Academic Session</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">{enrollment.academicYear.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Class & Section</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {enrollment.class.name} {enrollment.section ? `(${enrollment.section.name})` : ""}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Roll Number</p>
              <p className="font-mono font-bold text-blue-600 mt-0.5">#{enrollment.rollNumber}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Medium / Type</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{enrollment.medium} • {enrollment.admissionType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Admission Date</p>
              <p className="font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
  {enrollment.admissionDate
    ? new Date(enrollment.admissionDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A"}
</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Hostel Facility</p>
              <p className="font-medium mt-0.5">{enrollment.isHostelRequired ? "✔ Enabled" : "✖ Disabled"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">Transport Facility</p>
              <p className="font-medium mt-0.5">{enrollment.isTransportRequired ? "✔ Enabled" : "✖ Disabled"}</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* STEP 3: ASSIGNED FEES DETAILS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                3. Assigned Fee Details ({feeLedgers.length}) — Total: ₹{totalFeesAmount.toLocaleString()}
              </h2>
            </div>
            <Link href={`/finance/fees/assign?studentId=${student.id}`}>
              <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-lg">
                Assign / Update Fees
              </Button>
            </Link>
          </div>

          {feeLedgers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {feeLedgers.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.feeComponent?.name || "Fee Component"}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">Code: {item.feeComponent?.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{Number(item.amount).toLocaleString()}</p>
                    <Badge variant="outline" className={item.isPaid ? "text-[9px] bg-emerald-50 text-emerald-700" : "text-[9px] bg-amber-50 text-amber-700"}>
                      {item.isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-2">No fee structure components assigned to this enrollment.</p>
          )}
        </section>

      </div>
    </div>
  );
}