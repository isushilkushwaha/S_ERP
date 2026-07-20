"use client";

import { AlertCircle } from "lucide-react";

import { useStudent } from "../hooks";
import { StudentHeader } from "../components/student-header";

import { AdmissionCard } from "../components/admission-card";
 import { PersonalCard } from "../components/personal-card";
 import { ParentCard } from "../components/parent-card";
 import { AddressCard } from "../components/address-card";
 //import { EnrollmentCard } from "../components/enrollment-card";
 //import { DocumentsCard } from "../components/documents-card";

interface ViewStudentPageProps {
  studentId: string;
}

export function ViewStudentPage({
  studentId,
}: ViewStudentPageProps) {
  const query = useStudent(studentId);

  
  const { data, isPending, error } = query;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading student details...
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <AlertCircle className="h-10 w-10 text-destructive" />

        <h2 className="text-lg font-semibold">
          Failed to load student
        </h2>

        <p className="text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  const student = data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <StudentHeader student={student} />

      {/* Admission */}
      <AdmissionCard student={student} />

      {/* Personal */}
      <PersonalCard student={student} />

      {/* Parent */}
      <ParentCard student={student} />

      {/* Address */}
      <AddressCard student={student} />

      {/* Enrollment */}
      {/* <EnrollmentCard studentId={student.id} /> */}

      {/* Documents */}
      {/* <DocumentsCard studentId={student.id} /> */}
    </div>
  );
}