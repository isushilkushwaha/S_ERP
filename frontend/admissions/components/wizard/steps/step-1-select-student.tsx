// frontend/admissions/components/wizard/steps/step-1-select-student.tsx

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  User,
  Heart,
  X,
  Loader2,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileText,
  BadgeCheck,
  RefreshCw,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegisteredStudentsQuery } from "@/frontend/admissions/hooks/use-admissions-query";
import { StudentListItem } from "@/frontend/students/types/student";
import { StudentRegistrationSummaryDTO } from "@/features/admissions/dto/admission.dto";

// ==========================================================
// TYPES & INTERFACES
// ==========================================================

export type ExtendedStudentListItem = Omit<
  Partial<StudentListItem>,
  "fatherName" | "motherName" | "mobile" | "email"
> & {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  mobile?: string | null;
  studentMobile?: string | null;
  email?: string | null;
  studentEmail?: string | null;
  photo?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string | null;
  hasActiveEnrollment?: boolean;
  currentEnrollment?: {
    academicYear?: string;
    academicYearId?: string;
    photo?: string | null;
  } | null;
  enrollments?: {
    id: string;
    academicYearId: string;
    academicYearName?: string;
    academicYear?: string;
    className: string;
    status: string;
  }[];
};

interface Step1Props {
  selectedStudent: StudentRegistrationSummaryDTO | null;
  activeAcademicYearName?: string;
  activeAcademicYearId?: string;
  onSelectStudent: (student: StudentRegistrationSummaryDTO | null) => void;
  onNext: () => void;
}

// ==========================================================
// SUB-COMPONENT: STUDENT AVATAR
// ==========================================================

interface StudentAvatarProps {
  src?: string | null;
  firstName: string;
  lastName?: string | null;
  statusDotColor?: string;
  size?: "sm" | "md" | "lg";
}

function StudentAvatar({ src, firstName, lastName, statusDotColor, size = "md" }: StudentAvatarProps) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-xs",
    lg: "w-20 h-20 text-xl font-bold",
  }[size];

  const dimensionNum = size === "lg" ? 80 : 44;

  return (
    <div className="relative shrink-0">
      {src ? (
        <div className={`${sizeClasses} relative rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xs transition-transform duration-200 group-hover:scale-105`}>
          <Image
            src={src}
            alt={`${firstName} photo`}
            width={dimensionNum}
            height={dimensionNum}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shadow-2xs`}>
          {firstName?.[0] || "S"}
          {lastName?.[0] || ""}
        </div>
      )}
      {statusDotColor && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-zinc-900 ${statusDotColor}`}
        />
      )}
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: STATUS BADGE
// ==========================================================

interface StudentStatusBadgeProps {
  isAdmitted: boolean;
  previousEnrollmentYear?: string;
}

function StudentStatusBadge({ isAdmitted, previousEnrollmentYear }: StudentStatusBadgeProps) {
  if (isAdmitted) {
    return (
      <Badge variant="secondary" className="text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 shrink-0 px-2 py-0.5">
        Already Admitted
      </Badge>
    );
  }

  if (previousEnrollmentYear) {
    return (
      <Badge variant="outline" className="text-[10px] font-medium bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/60 shrink-0 px-2 py-0.5">
        Prev: {previousEnrollmentYear}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-[10px] font-medium text-emerald-700 bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60 shrink-0 px-2 py-0.5">
      New Registration
    </Badge>
  );
}

// ==========================================================
// SUB-COMPONENT: SEARCH TOOLBAR
// ==========================================================

interface SearchToolbarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function SearchToolbar({ searchTerm, setSearchTerm, isLoading, inputRef }: SearchToolbarProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Search by Name, Student Code, Mobile, or Email... (⌘K)"
        className="pl-10 pr-20 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 rounded-xl text-xs h-10 shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-3 flex items-center space-x-1.5">
        {isLoading && <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: SKELETON CARDS LOADING STATE
// ==========================================================

function SkeletonCardList() {
  return (
    <div className="space-y-3 pr-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <Skeleton className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: EMPTY STATE
// ==========================================================

interface EmptyStateProps {
  searchTerm: string;
  onClear: () => void;
}

function EmptyState({ searchTerm, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-2xs">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        No candidate records found
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
        We couldn&apos;t find any registered students matching <span className="font-medium text-zinc-700 dark:text-zinc-300">&quot;{searchTerm}&quot;</span>.
      </p>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400">
        <span>Try searching by:</span>
        <Badge variant="outline" className="text-[10px]">Student Code</Badge>
        <Badge variant="outline" className="text-[10px]">Full Name</Badge>
        <Badge variant="outline" className="text-[10px]">Mobile</Badge>
      </div>
      {searchTerm && (
        <Button onClick={onClear} variant="ghost" size="sm" className="mt-4 text-xs text-blue-600 hover:text-blue-700">
          Clear Filter
        </Button>
      )}
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: ENTERPRISE ERROR STATE
// ==========================================================

function ErrorState() {
  return (
    <div className="p-6 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to retrieve registered students
        </h4>
        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
          An unexpected network issue occurred while querying the server database.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
        className="text-xs border-red-200 text-red-700 hover:bg-red-100/50"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        Retry Connection
      </Button>
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: STUDENT CARD ITEM
// ==========================================================

interface StudentCardItemProps {
  student: ExtendedStudentListItem;
  isSelected: boolean;
  activeAcademicYearName: string;
  activeAcademicYearId?: string;
  onSelectStudent: (student: StudentRegistrationSummaryDTO) => void;
}

function StudentCardItem({
  student,
  isSelected,
  activeAcademicYearName,
  activeAcademicYearId,
  onSelectStudent,
}: StudentCardItemProps) {
  const avatarSrc = student.photo || student.currentEnrollment?.photo;
  const studentPhone = student.mobile || student.studentMobile || "N/A";
  const studentEmail = student.email || student.studentEmail || "N/A";
  const motherName = student.motherName || "N/A";

  const currentYearEnrollment =
    student.currentEnrollment?.academicYear === activeAcademicYearName ||
    student.currentEnrollment?.academicYearId === activeAcademicYearId
      ? student.currentEnrollment
      : null;

  const activeYearEnrollment =
    currentYearEnrollment ||
    student.enrollments?.find(
      (e) =>
        e.academicYearId === activeAcademicYearId ||
        e.academicYearName === activeAcademicYearName ||
        e.academicYear === activeAcademicYearName
    );

  const previousEnrollment =
    student.currentEnrollment && !currentYearEnrollment
      ? student.currentEnrollment
      : student.enrollments?.find(
          (e) =>
            e.academicYearName !== activeAcademicYearName &&
            e.academicYear !== activeAcademicYearName
        );

  const isAdmittedInCurrentYear = Boolean(activeYearEnrollment);
  const prevYearLabel = previousEnrollment
    ? "academicYear" in previousEnrollment
      ? previousEnrollment.academicYear
      : previousEnrollment.academicYearName
    : undefined;

  const statusDotColor = isAdmittedInCurrentYear
    ? "bg-zinc-400"
    : previousEnrollment
    ? "bg-blue-500"
    : "bg-emerald-500";

  return (
    <div
      tabIndex={isAdmittedInCurrentYear ? -1 : 0}
      aria-selected={isSelected}
      className={`group relative transition-all duration-200 border rounded-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? "border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs border-l-4 border-l-blue-600"
          : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md cursor-pointer"
      } ${isAdmittedInCurrentYear ? "opacity-60 cursor-not-allowed bg-zinc-50/80 dark:bg-zinc-900/50" : ""}`}
      onClick={() => {
        if (!isAdmittedInCurrentYear) {
          onSelectStudent(student as unknown as StudentRegistrationSummaryDTO);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isAdmittedInCurrentYear) {
          e.preventDefault();
          onSelectStudent(student as unknown as StudentRegistrationSummaryDTO);
        }
      }}
    >
      <CardContent className="p-4 flex items-start space-x-3.5">
        <StudentAvatar
          src={avatarSrc}
          firstName={student.firstName}
          lastName={student.lastName}
          statusDotColor={statusDotColor}
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 transition-colors">
                {student.firstName} {student.middleName ? `${student.middleName} ` : ""}
                {student.lastName || ""}
              </h4>
              <p className="text-[10px] font-mono text-zinc-400 tracking-tight">
                CODE: {student.studentCode}
              </p>
            </div>

            <StudentStatusBadge
              isAdmitted={isAdmittedInCurrentYear}
              previousEnrollmentYear={prevYearLabel}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-2 text-[11px] text-zinc-600 dark:text-zinc-400 pt-0.5">
            <div className="flex items-center gap-1 truncate">
              <User className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">Father: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{student.fatherName || "N/A"}</strong></span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Heart className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">Mother: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{motherName}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 pt-1.5 mt-1">
            <div className="flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">{studentPhone}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">{studentEmail}</span>
            </div>
          </div>

          <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
            {student.gender && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-normal">
                {student.gender}
              </Badge>
            )}
            {student.bloodGroup && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-normal">
                {student.bloodGroup}
              </Badge>
            )}
            {!isAdmittedInCurrentYear && previousEnrollment && (
              <span className="inline-flex items-center text-[10px] font-medium text-blue-600 dark:text-blue-400 gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                Eligible
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 self-center pl-1">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </CardContent>
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: RIGHT SIDEBAR PREVIEW PANEL
// ==========================================================

interface StudentPreviewPanelProps {
  selectedStudent: StudentRegistrationSummaryDTO | null;
  activeAcademicYearName: string;
  onNext: () => void;
}

function StudentPreviewPanel({ selectedStudent, activeAcademicYearName, onNext }: StudentPreviewPanelProps) {
  return (
    <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-32 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Admission Preview</span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono">
          Step 1 of 5
        </Badge>
      </div>

      {selectedStudent ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/50 text-center space-y-2">
            <StudentAvatar
              src={selectedStudent.photo}
              firstName={selectedStudent.firstName}
              lastName={selectedStudent.lastName}
              size="lg"
            />
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedStudent.firstName} {selectedStudent.lastName || ""}
              </h3>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                {selectedStudent.studentCode}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              System Verification
            </p>
            <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-[11px]">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Student Selected</span>
                <span className="font-semibold">PASSED</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Target Session Valid</span>
                <span className="font-semibold">{activeAcademicYearName}</span>
              </div>
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Profile Master Data</span>
                <span className="font-semibold">READY</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-2">
          <GraduationCap className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">No Candidate Selected</p>
          <p className="text-[10px] text-zinc-400 max-w-[180px] mx-auto">
            Choose a registered student profile from the list to preview details.
          </p>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          onClick={onNext}
          disabled={!selectedStudent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xs rounded-xl text-xs h-10 font-medium transition-all"
        >
          <span>Continue Admission</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-zinc-400 hover:text-zinc-600 h-8"
          onClick={() => window.history.back()}
        >
          Cancel Wizard
        </Button>
      </div>
    </div>
  );
}

// ==========================================================
// MAIN COMPONENT: STEP 1 SELECT STUDENT
// ==========================================================

export function Step1SelectStudent({
  selectedStudent,
  activeAcademicYearName = "2026-27",
  activeAcademicYearId,
  onSelectStudent,
  onNext,
}: Step1Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: students, isLoading, isError } = useRegisteredStudentsQuery(searchTerm);

  const studentList = (students as unknown) as ExtendedStudentListItem[] | undefined;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const stats = useMemo(() => {
    if (!studentList) return { total: 0, eligible: 0, admitted: 0 };

    let admitted = 0;
    let eligible = 0;

    studentList.forEach((s) => {
      const isAdmitted = s.enrollments?.some(
        (e) =>
          e.academicYearId === activeAcademicYearId ||
          e.academicYearName === activeAcademicYearName ||
          e.academicYear === activeAcademicYearName
      );
      if (isAdmitted) admitted++;
      else eligible++;
    });

    return { total: studentList.length, eligible, admitted };
  }, [studentList, activeAcademicYearId, activeAcademicYearName]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md pb-4 pt-1 space-y-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Step 1: Select Registered Student</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Search candidate records to initiate admission or re-enrollment for active session.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-2xs shrink-0">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Session:</span>
            <Badge className="text-xs font-semibold bg-blue-600 text-white border-none px-2 py-0.5">
              {activeAcademicYearName}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="md:col-span-2">
            <SearchToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoading={isLoading}
              inputRef={inputRef}
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-zinc-500 px-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.total}</span>
              <span className="text-[11px] text-zinc-400">Total</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="font-semibold">{stats.eligible}</span>
              <span className="text-[11px]">Eligible</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="font-semibold">{stats.admitted}</span>
              <span className="text-[11px]">Admitted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-5">
        <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            <SkeletonCardList />
          ) : isError ? (
            <ErrorState />
          ) : studentList?.length === 0 ? (
            <EmptyState searchTerm={searchTerm} onClear={() => setSearchTerm("")} />
          ) : (
            <div className="h-[620px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {studentList?.map((student) => (
                <StudentCardItem
                  key={student.id}
                  student={student}
                  isSelected={selectedStudent?.id === student.id}
                  activeAcademicYearName={activeAcademicYearName}
                  activeAcademicYearId={activeAcademicYearId}
                  onSelectStudent={onSelectStudent}
                />
              ))}
            </div>
          )}
        </div>

        <StudentPreviewPanel
          selectedStudent={selectedStudent}
          activeAcademicYearName={activeAcademicYearName}
          onNext={onNext}
        />
      </div>
    </div>
  );
}