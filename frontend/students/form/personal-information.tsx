"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { StudentFormValues } from "../schemas/student-form.schema";

export interface PersonalInformationProps {
  form: UseFormReturn<StudentFormValues>;
}

const GENDERS = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
  {
    label: "Other",
    value: "OTHER",
  },
] as const;

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const CATEGORIES = [
  "GENERAL",
  "OBC",
  "SC",
  "ST",
  "EWS",
] as const;

export function PersonalInformation({
  form,
}: PersonalInformationProps) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Personal Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Enter the student's personal details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* First Name */}

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Rahul"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Middle Name */}

        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Middle Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Kumar"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Sharma"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Gender
              </FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem
                      key={gender.value}
                      value={gender.value}
                    >
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Of Birth */}

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date of Birth
              </FormLabel>

              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Blood Group */}

        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Blood Group
              </FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem
                      key={group}
                      value={group}
                    >
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Religion */}

        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Religion
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Religion"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category
              </FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Caste */}

        <FormField
          control={form.control}
          name="caste"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Caste
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Caste"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nationality
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Indian"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Aadhaar */}

        <FormField
          control={form.control}
          name="aadhaarNumber"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>
                Aadhaar Number
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="123456789012"
                  maxLength={12}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
  control={form.control}
  name="birthCertificateNo"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Birth Certificate No.</FormLabel>

      <FormControl>
        <Input
          placeholder="Birth Certificate Number"
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="mobile"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Mobile Number</FormLabel>

      <FormControl>
        <Input
          type="tel"
          placeholder="9876543210"
          maxLength={10}
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>

      <FormControl>
        <Input
          type="email"
          placeholder="student@example.com"
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="previousSchool"
  render={({ field }) => (
    <FormItem className="lg:col-span-2">
      <FormLabel>Previous School</FormLabel>

      <FormControl>
        <Input
          placeholder="Previous School Name"
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="remarks"
  render={({ field }) => (
    <FormItem className="lg:col-span-3">
      <FormLabel>Remarks</FormLabel>

      <FormControl>
        <Textarea
          rows={4}
          placeholder="Additional remarks..."
          {...field}
          value={field.value ?? ""}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>


      </div>
    </section>
  );
}