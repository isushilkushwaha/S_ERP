"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EnrollmentForm } from "@/frontend/student-enrollments/components/form/enrollment-form";
import { useCreateEnrollmentMutation } from "@/frontend/student-enrollments/hooks/use-create-enrollment";

import { useStudents } from "@/frontend/students/hooks/use-students";
import { useAcademicYearsData } from "@/frontend/academic-years/hooks/use-academic-years";
import { useClasses } from "@/frontend/classes/hooks/use-classes";
import { useSections } from "@/frontend/sections/hooks/use-sections";

import type { Section } from "@/frontend/sections/types/section";

export default function CreateEnrollmentPage() {
  const router = useRouter();

  const createMutation = useCreateEnrollmentMutation();

  const [selectedClassId, setSelectedClassId] =
  useState("");

  /**
   * Students
   */
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

  /**
   * Academic Years
   */
  const { data: academicYearsResponse } =
    useAcademicYearsData();

  const academicYears =
    academicYearsResponse?.data?.map((year) => ({
      id: year.id,
      name: year.name,
    })) ?? [];

  /**
   * Classes
   */
  const { data: classesResponse } = useClasses();

  const classes =
    classesResponse?.data?.map((item) => ({
      id: item.id,
      name: item.name,
    })) ?? [];

  /**
   * Sections
   */
  //const { data: sectionsResponse = [] } = useSections();
  const { data: sectionsResponse = [] } =
  useSections(
    selectedClassId
      ? {
          classId: selectedClassId,
        }
      : {}
  );

  // const sections = sectionsResponse.map((item: Section) => ({
  //   id: item.id,
  //   name: item.name,
  // }));
 const sections = sectionsResponse.map(
  (item: Section) => ({
    id: item.id,
    name: item.name,
    classId: item.classId,
  })
);

  


  return (
    // <EnrollmentForm
    //   mode="create"
    //   students={students}
    //   academicYears={academicYears}
    //   classes={classes}
    //   sections={sections}
    //   isSubmitting={createMutation.isPending}
    //   onSubmit={async (data) => {
    //     await createMutation.mutateAsync(data);

    //     router.push("/student-enrollments");
    //   }}
    // />

    <EnrollmentForm
    mode="create"
    students={students}
    academicYears={academicYears}
    classes={classes}
    sections={sections}
    onClassChange={setSelectedClassId}
    isSubmitting={createMutation.isPending}
    onSubmit={async (data) => {
        await createMutation.mutateAsync(data);

        router.push("/student-enrollments");
    }}
/>
  );
}