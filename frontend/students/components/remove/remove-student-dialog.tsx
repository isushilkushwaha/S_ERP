"use client";

import { useState } from "react";
import { UserX, AlertCircle, Search, ShieldAlert, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { StudentSearch } from "./student-search";
import { StudentInfoCard } from "./student-info-card";
import { RemoveStudentForm } from "./remove-student-form";
import { useStudentSearch } from "../../hooks/use-student-search";
import type { Student } from "../../types";

interface RemoveStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveStudentDialog({
  open,
  onOpenChange,
}: RemoveStudentDialogProps) {
  const [searchCode, setSearchCode] = useState("");
  const [student, setStudent] = useState<Student | null>(null);

  const searchStudent = useStudentSearch();

  const handleSearch = () => {
    if (!searchCode.trim()) {
      return;
    }

    searchStudent.mutate(searchCode, {
      onSuccess: (studentData) => {
        setStudent(studentData);
      },
      onError: () => {
        setStudent(null);
      },
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchCode(value);
    // Reset found student state if search input changes
    if (student) {
      setStudent(null);
      searchStudent.reset();
    }
  };

  const handleDialogChange = (value: boolean) => {
    if (!value) {
      setSearchCode("");
      setStudent(null);
      searchStudent.reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
        {/* Header Section */}
        <DialogHeader className="relative border-b border-border/80 bg-gradient-to-b from-destructive/10 via-destructive/5 to-transparent px-6 pb-5 pt-6 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm ring-4 ring-destructive/5">
                <UserX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                  Remove Student Record
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground">
                  Lookup by student code, verify identity, and authorize removal.
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Stepper Badge */}
          <div className="mt-4 flex items-center gap-2 pt-1">
            <Badge
              variant={student ? "outline" : "default"}
              className="h-6 gap-1 text-[11px] font-medium"
            >
              <Search className="h-3 w-3" />
              Step 1: Search Student
            </Badge>

            <Badge
              variant={student ? "destructive" : "secondary"}
              className="h-6 gap-1 text-[11px] font-medium"
            >
              <ShieldAlert className="h-3 w-3" />
              Step 2: Confirm Removal
            </Badge>
          </div>
        </DialogHeader>

        {/* Content Section */}
        <div className="space-y-5 px-6 pb-6 pt-4">
          {/* Step 1: Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Student Identification Code
            </label>
            <StudentSearch
              value={searchCode}
              onValueChange={handleSearchChange}
              onSearch={handleSearch}
              loading={searchStudent.isPending}
            />
          </div>

          {/* Error / Not Found Alert */}
          {searchStudent.isSuccess && !student && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Student Not Found</p>
                <p className="text-xs text-muted-foreground">
                  No active student account matches code{" "}
                  <span className="font-mono font-bold text-foreground">
                    "{searchCode}"
                  </span>
                  . Please verify the code and try again.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Student Found & Confirmation Form */}
          {student && (
            <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4 pt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Student Record Found</span>
              </div>

              {/* Student Summary Card */}
              <StudentInfoCard student={student} />

              {/* Removal Confirmation Form */}
              <div className="border-t border-border/60 pt-4">
                <RemoveStudentForm
                  student={student}
                  onClose={() => handleDialogChange(false)}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}