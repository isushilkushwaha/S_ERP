"use client";

import { useEffect } from "react";
import {
  FormProvider,
  useForm,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  studentFormSchema,
  type StudentFormValues,
} from "../schemas/student-form.schema";

import { useStudentForm } from "../hooks/use-student-form";

import { StudentWizard } from "./student-wizard";

interface StudentFormProps {
  studentId?: string;
  defaultValues?: Partial<StudentFormValues>;
}

export function StudentForm({
  studentId,
  defaultValues,
}: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as Resolver<StudentFormValues>,
    mode: "onBlur",

    defaultValues: {
      // Identification
      emisNumber: "",
      apaarId: "",
      penNumber: "",

      // Personal Information
      firstName: "",
      middleName: "",
      lastName: "",

      gender: undefined as never,
      dateOfBirth: "",

      bloodGroup: "",
      religion: "",
      category: undefined,

      caste: "",
      nationality: "Indian",

      aadhaarNumber: "",
      birthCertificateNo: "",

      email: "",
      mobile: "",

      photo: "",

      previousSchool: "",
      remarks: "",

      // Parent Information
      fatherName: "",
      fatherOccupation: "",
      fatherMobile: "",
      fatherEmail: "",

      motherName: "",
      motherOccupation: "",
      motherMobile: "",
      motherEmail: "",

      guardianName: "",
      guardianRelation: "",
      guardianMobile: "",
      guardianEmail: "",

      // Address
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      country: "India",
      postalCode: "",

      ...defaultValues,
    },
  });

  const { handleSubmit, reset } = form;

  const { onSubmit, isSubmitting } = useStudentForm({
    studentId,
    form,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        emisNumber: "",
        apaarId: "",
        penNumber: "",

        firstName: "",
        middleName: "",
        lastName: "",

        gender: undefined as never,
        dateOfBirth: "",

        bloodGroup: "",
        religion: "",
        category: undefined,

        caste: "",
        nationality: "Indian",

        aadhaarNumber: "",
        birthCertificateNo: "",

        email: "",
        mobile: "",

        photo: "",

        previousSchool: "",
        remarks: "",

        fatherName: "",
        fatherOccupation: "",
        fatherMobile: "",
        fatherEmail: "",

        motherName: "",
        motherOccupation: "",
        motherMobile: "",
        motherEmail: "",

        guardianName: "",
        guardianRelation: "",
        guardianMobile: "",
        guardianEmail: "",

        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        state: "",
        country: "India",
        postalCode: "",

        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <StudentWizard
          form={form}
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
  );
}