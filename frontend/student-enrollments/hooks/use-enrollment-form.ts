"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createEnrollmentSchema,
  type CreateEnrollmentFormValues,
} from "../schemas/enrollment.schema";

import {
  EnrollmentStatus,
  type StudentEnrollment,
} from "../types/enrollment";

interface UseEnrollmentFormProps {
  enrollment?: StudentEnrollment;
}

export function useEnrollmentForm({
  enrollment,
}: UseEnrollmentFormProps = {}) {
  const form = useForm<CreateEnrollmentFormValues>({
    resolver: zodResolver(createEnrollmentSchema),

    defaultValues: {
      studentId: "",
      academicYearId: "",
      classId: "",
      sectionId: "",
      rollNumber: 0,

      // Date because z.output<typeof schema>
      joinedDate: "",

      medium: undefined,
      stream: null, 
      house: null,
      boardRegistrationNumber: null,

      admissionType: undefined,

      enrollmentStatus: EnrollmentStatus.ACTIVE,

      leftDate: null,

      remarks: null,
    },
  });

  useEffect(() => {
    if (!enrollment) return;

    // form.reset({
    //   studentId: enrollment.studentId,
    //   academicYearId: enrollment.academicYearId,
    //   classId: enrollment.classId,
    //   sectionId: enrollment.sectionId,

    //   rollNumber: enrollment.rollNumber,

    //   joinedDate: new Date(enrollment.joinedDate),

    //   medium: enrollment.medium,
    //   stream: enrollment.stream,
    //   house: enrollment.house,
    //   boardRegistrationNumber:
    //     enrollment.boardRegistrationNumber,

    //   admissionType: enrollment.admissionType,

    //   enrollmentStatus:
    //     enrollment.enrollmentStatus,

    //   leftDate: enrollment.leftDate
    //     ? new Date(enrollment.leftDate)
    //     : null,

    //   remarks: enrollment.remarks,
    // });
    form.reset({
  studentId: enrollment.studentId,
  academicYearId: enrollment.academicYearId,
  classId: enrollment.classId,
  sectionId: enrollment.sectionId,

  rollNumber: enrollment.rollNumber,

  medium: enrollment.medium,
  stream: enrollment.stream,
  house: enrollment.house,
  boardRegistrationNumber:
    enrollment.boardRegistrationNumber,

  admissionType: enrollment.admissionType,

  joinedDate: enrollment.joinedDate
    ? enrollment.joinedDate.slice(0, 10)
    : "",

  enrollmentStatus:
    enrollment.enrollmentStatus,

  leftDate: enrollment.leftDate
    ? enrollment.leftDate.slice(0, 10)
    : null,

  remarks: enrollment.remarks,
});



  }, [enrollment, form]);

  return form;
}