"use client";

import { useEffect } from "react";

import {
  FormProvider,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  studentFormSchema,
  type StudentFormValues,
} from "../schemas/student-form.schema";

import { useStudentForm } from "../hooks/use-student-form";

import { AdmissionInformation } from "./admission-information";
import { PersonalInformation } from "./personal-information";
import { ParentInformation } from "./parent-information";
import { AddressInformation } from "./address-information";
import { FormActions } from "./form-actions";

interface StudentFormProps {
  studentId?: string;
  defaultValues?: Partial<StudentFormValues>;
}

export function StudentForm({
  studentId,
  defaultValues,
}: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),

    mode: "onBlur",

    // defaultValues: {
    //   studentCode: "",
    //   nationality: "Indian",
    //   country: "India",
    //   status: "ACTIVE",
    //   isTransportRequired: false,
    //   isHostelRequired: false,
    //   ...defaultValues,
    // },
        defaultValues: {
  studentCode: "",
  admissionNumber: "",
  admissionDate: "",

  status: "ACTIVE",

  firstName: "",
  middleName: "",
  lastName: "",

  gender: undefined as never, // or a default enum value
  dateOfBirth: "",

  bloodGroup: "",
  religion: "",
  category: "",
  caste: "",

  nationality: "Indian",

  aadhaarNumber: "",
  birthCertificateNo: "",

  email: "",
  mobile: "",

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

  isTransportRequired: false,
  isHostelRequired: false,

  ...defaultValues,
},


  });

  const { handleSubmit, reset } = form;

  const { onSubmit, isSubmitting } =
    useStudentForm({
      studentId,
    });

  useEffect(() => {
    if (defaultValues) {
      reset({
        nationality: "Indian",
        country: "India",
        status: "ACTIVE",
        isTransportRequired: false,
        isHostelRequired: false,
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
        <AdmissionInformation form={form} />

        <PersonalInformation form={form} />

        <ParentInformation />

        <AddressInformation />

        <FormActions
          isSubmitting={isSubmitting}
          isEdit={Boolean(studentId)}
        />
      </form>
    </FormProvider>
  );
}