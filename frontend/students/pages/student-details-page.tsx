"use client";

interface StudentDetailsPageProps {
  studentId: string;
}

export function StudentDetailsPage({
  studentId,
}: StudentDetailsPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Student Details
      </h1>

      <p className="text-muted-foreground">
        Student ID: {studentId}
      </p>
    </div>
  );
}