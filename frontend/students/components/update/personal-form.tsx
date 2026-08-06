// frontend/students/components/update/personal-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  User,
  HeartPulse,
  Globe,
  ShieldCheck,
  School,
  FileText,
  AlertCircle,
  Save,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Student, UpdatePersonalRequest } from "../../types/student";
import {
  personalSchema,
  type PersonalFormValues,
} from "../../schemas/update/personal-schema";
import { useUpdatePersonal } from "../../hooks/update/use-update-personal";

interface PersonalFormProps {
  student: Student;
  onCancel: () => void;
}

export function PersonalForm({ student, onCancel }: PersonalFormProps) {
  const mutation = useUpdatePersonal();

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    values: {
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: student.gender ?? "",
      bloodGroup: (student.bloodGroup as PersonalFormValues["bloodGroup"]) ?? "",
      religion: student.religion ?? "",
      category: (student.category as PersonalFormValues["category"]) ?? "",
      caste: student.caste ?? "",
      nationality: student.nationality ?? "",
      aadhaarNumber: student.aadhaarNumber ?? "",
      birthCertificateNo: student.birthCertificateNo ?? "",
      previousSchool: student.previousSchool ?? "",
      remarks: student.remarks ?? "",
    },
  });

  const genderValue = form.watch("gender");
  const bloodGroupValue = form.watch("bloodGroup");
  const categoryValue = form.watch("category");

  const onSubmit = (values: PersonalFormValues) => {
    const payload: UpdatePersonalRequest = {
      ...values,
      dateOfBirth: values.dateOfBirth || null,
      gender: (values.gender || null) as UpdatePersonalRequest["gender"],
      bloodGroup: (values.bloodGroup || null) as UpdatePersonalRequest["bloodGroup"],
      category: (values.category || null) as UpdatePersonalRequest["category"],
      religion: values.religion || null,
      caste: values.caste || null,
      nationality: values.nationality || null,
      aadhaarNumber: values.aadhaarNumber || null,
      birthCertificateNo: values.birthCertificateNo || null,
      previousSchool: values.previousSchool || null,
      remarks: values.remarks || null,
    };

    mutation.mutate(
      {
        id: student.id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Personal information updated successfully.");
          onCancel();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update personal information."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      {/* SECTION 1: Demographics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Demographics
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date of Birth */}
          <div className="space-y-2">
            <Label
              htmlFor="dateOfBirth"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                type="date"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.dateOfBirth ? "border-destructive" : ""
                }`}
                {...form.register("dateOfBirth")}
              />
            </div>
            {form.formState.errors.dateOfBirth && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label
              htmlFor="gender"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Gender
            </Label>
            <Select
              disabled={mutation.isPending}
              value={genderValue}
              onValueChange={(value) =>
                form.setValue("gender", value as PersonalFormValues["gender"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="gender"
                className={`border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.gender ? "border-destructive" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select Gender" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.gender && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div className="space-y-2">
            <Label
              htmlFor="bloodGroup"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Blood Group
            </Label>
            <Select
              disabled={mutation.isPending}
              value={bloodGroupValue}
              onValueChange={(value) =>
                form.setValue(
                  "bloodGroup",
                  value as PersonalFormValues["bloodGroup"],
                  { shouldValidate: true }
                )
              }
            >
              <SelectTrigger
                id="bloodGroup"
                className={`border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.bloodGroup ? "border-destructive" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-destructive" />
                  <SelectValue placeholder="Select Blood Group" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A_POSITIVE">A+</SelectItem>
                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                <SelectItem value="B_POSITIVE">B+</SelectItem>
                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                <SelectItem value="O_POSITIVE">O+</SelectItem>
                <SelectItem value="O_NEGATIVE">O-</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.bloodGroup && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/* Religion */}
          <div className="space-y-2">
            <Label
              htmlFor="religion"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Religion
            </Label>
            <Input
              id="religion"
              placeholder="e.g. Hinduism, Islam, Christianity"
              disabled={mutation.isPending}
              className={`border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                form.formState.errors.religion ? "border-destructive" : ""
              }`}
              {...form.register("religion")}
            />
            {form.formState.errors.religion && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.religion.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Category
            </Label>
            <Select
              disabled={mutation.isPending}
              value={categoryValue}
              onValueChange={(value) =>
                form.setValue(
                  "category",
                  value as PersonalFormValues["category"],
                  { shouldValidate: true }
                )
              }
            >
              <SelectTrigger
                id="category"
                className={`border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.category ? "border-destructive" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
                <SelectItem value="EWS">EWS</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          {/* Caste */}
          <div className="space-y-2">
            <Label
              htmlFor="caste"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Caste
            </Label>
            <Input
              id="caste"
              placeholder="e.g. Sub-caste / Community"
              disabled={mutation.isPending}
              className={`border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                form.formState.errors.caste ? "border-destructive" : ""
              }`}
              {...form.register("caste")}
            />
            {form.formState.errors.caste && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.caste.message}
              </p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2 lg:col-span-1">
            <Label
              htmlFor="nationality"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Nationality
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="nationality"
                placeholder="e.g. Indian"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.nationality ? "border-destructive" : ""
                }`}
                {...form.register("nationality")}
              />
            </div>
            {form.formState.errors.nationality && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.nationality.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Identity Documents */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Government & Identity Documents
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Aadhaar Number */}
          <div className="space-y-2">
            <Label
              htmlFor="aadhaarNumber"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Aadhaar Number
            </Label>
            <div className="relative">
              <Input
                id="aadhaarNumber"
                placeholder="12-digit Aadhaar Number"
                disabled={mutation.isPending}
                className={`pl-3 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.aadhaarNumber ? "border-destructive" : ""
                }`}
                {...form.register("aadhaarNumber")}
              />
            </div>
            {form.formState.errors.aadhaarNumber && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.aadhaarNumber.message}
              </p>
            )}
          </div>

          {/* Birth Certificate Number */}
          <div className="space-y-2">
            <Label
              htmlFor="birthCertificateNo"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Birth Certificate Number
            </Label>
            <div className="relative">
              <Input
                id="birthCertificateNo"
                placeholder="Birth Certificate Reg. No."
                disabled={mutation.isPending}
                className={`pl-3 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.birthCertificateNo
                    ? "border-destructive"
                    : ""
                }`}
                {...form.register("birthCertificateNo")}
              />
            </div>
            {form.formState.errors.birthCertificateNo && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.birthCertificateNo.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Academic Background & Notes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <School className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Academic Background & Notes
          </span>
        </div>

        <div className="grid gap-4">
          {/* Previous School */}
          <div className="space-y-2">
            <Label
              htmlFor="previousSchool"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Previous School Name
            </Label>
            <div className="relative">
              <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="previousSchool"
                placeholder="e.g. St. Xavier Senior Secondary School"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.previousSchool ? "border-destructive" : ""
                }`}
                {...form.register("previousSchool")}
              />
            </div>
            {form.formState.errors.previousSchool && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.previousSchool.message}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label
              htmlFor="remarks"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Remarks / Internal Notes
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="remarks"
                placeholder="Add internal notes, medical remarks, or administrative history..."
                rows={3}
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.remarks ? "border-destructive" : ""
                }`}
                {...form.register("remarks")}
              />
            </div>
            {form.formState.errors.remarks && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.remarks.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="px-5 font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="gap-2 px-6 font-semibold shadow-xs transition-colors"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 shrink-0" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}