"use client";

import { useStudent } from "../hooks";
import { StudentForm } from "../form/student-form";
import { mapStudentToFormValues } from "../mappers/student.mapper";

interface EditStudentPageProps {
  studentId: string;
}

export function EditStudentPage({
  studentId,
}: EditStudentPageProps) {
  const { data, isPending } = useStudent(studentId);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <StudentForm
      studentId={studentId}
      defaultValues={
        data?.data
          ? mapStudentToFormValues(data.data)
          : undefined
      }
    />
  );
}