"use client";

import { useParams, useRouter } from "next/navigation";

import { EnrollmentForm } from "@/frontend/student-enrollments/components/form/enrollment-form";
import { useEnrollment } from "@/frontend/student-enrollments/hooks/use-enrollment";
import { useUpdateEnrollmentMutation } from "@/frontend/student-enrollments/hooks/use-update-enrollment";

import { useStudents } from "@/frontend/students/hooks/use-students";
import { useAcademicYearsData } from "@/frontend/academic-years/hooks/use-academic-years";
import { useClasses } from "@/frontend/classes/hooks/use-classes";
import { useSections } from "@/frontend/sections/hooks/use-sections";

export default function EditEnrollmentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const enrollmentId = params.id;

  const { data: enrollment } = useEnrollment(enrollmentId);

  const updateMutation = useUpdateEnrollmentMutation();

  // Students
  const { data: studentsResponse } = useStudents({
    page: 1,
    limit: 1000,
  });

  const students =
    studentsResponse?.data?.map((student) => ({
      id: student.id,
      admissionNumber: student.admissionNumber,
      fullName: [
        student.firstName,
        student.middleName,
        student.lastName,
      ]
        .filter(Boolean)
        .join(" "),
    })) ?? [];

  // Academic Years
  const { data: academicYearsResponse } = useAcademicYearsData();

  const academicYears =
    academicYearsResponse?.data?.map((year) => ({
      id: year.id,
      name: year.name,
    })) ?? [];

  // Classes
  const { data: classesResponse } = useClasses();

  const classes =
    classesResponse?.data?.map((item) => ({
      id: item.id,
      name: item.name,
    })) ?? [];

  // Sections
  const { data: sectionsResponse = [] } = useSections();

  const sections = sectionsResponse.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  if (!enrollment) {
    return null;
  }

  return (
    <EnrollmentForm
      mode="edit"
      initialData={enrollment}
      students={students}
      academicYears={academicYears}
      classes={classes}
      sections={sections}
      isSubmitting={updateMutation.isPending}
      onSubmit={async (data) => {
        await updateMutation.mutateAsync({
          id: enrollmentId,
          data,
        });

        router.push("/student-enrollments");
      }}
    />
  );
}