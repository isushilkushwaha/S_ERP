// frontend/admissions/components/wizard/steps/step-1-select-student.tsx

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Phone,
  User,
  X,
  Loader2,
  ChevronRight,
  RefreshCw,
  GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
// SUB-COMPONENT: STUDENT AVATAR (ROBUST FALLBACK)
// ==========================================================

interface StudentAvatarProps {
  src?: string | null;
  firstName: string;
  lastName?: string | null;
  size?: "sm" | "md" | "lg";
}

function StudentAvatar({ src, firstName, lastName, size = "md" }: StudentAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-xs",
    lg: "w-16 h-16 text-lg font-semibold",
  }[size];

  const dimensionNum = size === "lg" ? 64 : 40;

  // Normalize image URL path (supports absolute URLs, relative uploads, and public storage)
  const resolvedSrc = useMemo(() => {
    if (!src) return null;
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
    return `/${src}`;
  }, [src]);

  return (
    <div className="relative shrink-0">
      {resolvedSrc && !hasError ? (
        <div className={`${sizeClasses} relative rounded-full overflow-hidden border border-border bg-muted shrink-0`}>
          <Image
            src={resolvedSrc}
            alt={`${firstName} profile photo`}
            width={dimensionNum}
            height={dimensionNum}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            unoptimized
          />
        </div>
      ) : (
        <div className={`${sizeClasses} rounded-full bg-muted border border-border flex items-center justify-center font-semibold text-muted-foreground shrink-0`}>
          {firstName?.[0] || "S"}
          {lastName?.[0] || ""}
        </div>
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
      <Badge variant="outline" className="text-[11px] font-medium bg-muted text-muted-foreground border-border">
        Already Admitted
      </Badge>
    );
  }

  if (previousEnrollmentYear) {
    return (
      <Badge variant="outline" className="text-[11px] font-medium bg-blue-50/50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900">
        Previous Enrollment ({previousEnrollmentYear})
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-[11px] font-medium text-emerald-700 bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900">
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
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Search by name, student code, mobile number or email..."
        className="pl-10 pr-20 bg-background border-border rounded-md text-sm h-10 shadow-2xs focus-visible:ring-1 focus-visible:ring-ring"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute right-3 flex items-center space-x-1.5">
        {isLoading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted border border-border rounded">
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
    <div className="space-y-2 pr-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-3 bg-card shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-20 rounded" />
        </div>
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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-lg bg-card/50">
      <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center text-muted-foreground mb-3 shadow-2xs">
        <Search className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        No students found
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1">
        No registered students match <span className="font-medium text-foreground">&quot;{searchTerm}&quot;</span>.
      </p>
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Try searching by:</p>
        <p>Student name • Student code • Mobile number • Email</p>
      </div>
      {searchTerm && (
        <Button onClick={onClear} variant="outline" size="sm" className="mt-4 text-xs h-8">
          Clear Search
        </Button>
      )}
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: ERROR STATE
// ==========================================================

function ErrorState() {
  return (
    <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center space-y-3">
      <div className="w-9 h-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">
          Unable to load registered students
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          We couldn&apos;t retrieve student records. Please try again.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
        className="text-xs h-8 border-border"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        Retry
      </Button>
    </div>
  );
}

// ==========================================================
// SUB-COMPONENT: STUDENT CARD ROW ITEM
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
  const studentPhone = student.mobile || student.studentMobile || "—";
  const fatherName = student.fatherName || "—";

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

  return (
    <div
      tabIndex={isAdmittedInCurrentYear ? -1 : 0}
      aria-selected={isSelected}
      className={`group relative transition-all duration-150 border rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
        isSelected
          ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/20"
          : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20 cursor-pointer"
      } ${isAdmittedInCurrentYear ? "opacity-60 cursor-not-allowed bg-muted/40" : ""}`}
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
      <div className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <StudentAvatar
            src={avatarSrc}
            firstName={student.firstName}
            lastName={student.lastName}
            size="md"
          />

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {student.firstName} {student.middleName ? `${student.middleName} ` : ""}
                {student.lastName || ""}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-mono">{student.studentCode}</span>
              <span>•</span>
              <span>Father: {fatherName}</span>
              <span>•</span>
              <span>{studentPhone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StudentStatusBadge
            isAdmitted={isAdmittedInCurrentYear}
            previousEnrollmentYear={prevYearLabel}
          />

          <div className="w-5 flex justify-center">
            {isSelected ? (
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            )}
          </div>
        </div>
      </div>
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
    <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 bg-card border border-border rounded-lg p-4 shadow-sm space-y-4">
      <div className="pb-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Selected Student
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review before continuing
        </p>
      </div>

      {selectedStudent ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/30 border border-border">
            <StudentAvatar
              src={selectedStudent.photo}
              firstName={selectedStudent.firstName}
              lastName={selectedStudent.lastName}
              size="lg"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate">
                {selectedStudent.firstName} {selectedStudent.lastName || ""}
              </h4>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                {selectedStudent.studentCode}
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Academic Year</span>
              <span className="font-medium text-foreground">{activeAcademicYearName}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-emerald-700 dark:text-emerald-400">Eligible</span>
            </div>
          </div>

          <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Admission Eligibility</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
              Student selected • Available for {activeAcademicYearName} • Registration information available
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 px-4 border border-dashed border-border rounded-md text-center space-y-2">
          <GraduationCap className="w-8 h-8 text-muted-foreground/60 mx-auto" />
          <p className="text-xs font-medium text-foreground">No student selected</p>
          <p className="text-xs text-muted-foreground">
            Select a student from the list to review their admission details.
          </p>
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={onNext}
          disabled={!selectedStudent}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium h-9 shadow-sm rounded-md transition-all gap-1.5"
        >
          <span>Continue to Admission</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
    <div className="mx-auto max-w-6xl space-y-5">
      {/* 3. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admissions</span>
            <span>/</span>
            <span>New Admission</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Select Registered Student
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Find a registered student to start admission or re-enrollment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/50 border border-border px-3 py-1.5 rounded-md text-xs">
            <span className="text-muted-foreground font-medium">Academic Year</span>
            <span className="font-semibold text-foreground">{activeAcademicYearName}</span>
            <Badge variant="outline" className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
              Active
            </Badge>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-md">
            Step 1 of 5
          </span>
        </div>
      </div>

      {/* MAIN LAYOUT: TWO COLUMNS (SEARCH & LIST / PREVIEW PANEL) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT COLUMN: SEARCH & STUDENT LIST */}
        <div className="flex-1 w-full min-w-0 space-y-3">
          
          {/* SEARCH & COUNTS TOOLBAR */}
          <div className="space-y-2">
            <SearchToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoading={isLoading}
              inputRef={inputRef}
            />

            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Registered Students</span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>{stats.total} Total</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{stats.eligible} Eligible</span>
                <span>•</span>
                <span className="text-muted-foreground">{stats.admitted} Already Admitted</span>
              </div>
            </div>
          </div>

          {/* STUDENT LIST CONTAINER */}
          {isLoading ? (
            <SkeletonCardList />
          ) : isError ? (
            <ErrorState />
          ) : studentList?.length === 0 ? (
            <EmptyState searchTerm={searchTerm} onClear={() => setSearchTerm("")} />
          ) : (
            <div className="h-[620px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
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

        {/* RIGHT COLUMN: PREVIEW PANEL */}
        <StudentPreviewPanel
          selectedStudent={selectedStudent}
          activeAcademicYearName={activeAcademicYearName}
          onNext={onNext}
        />

      </div>
    </div>
  );
}