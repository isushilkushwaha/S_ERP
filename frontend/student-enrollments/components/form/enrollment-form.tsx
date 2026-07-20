"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  StudentEnrollment,
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
} from "../../types/enrollment";

import {
  AdmissionType,
  EnrollmentStatus,
  Medium,
  Stream,
} from "@prisma/client";

import {
  createEnrollmentSchema,
  CreateEnrollmentFormValues,
} from "../../schemas/enrollment.schema";

interface Option {
  id: string;
  name: string;
}

interface StudentOption {
  id: string;
  admissionNumber: string;
  fullName: string;
}

interface BaseEnrollmentFormProps {
  students: StudentOption[];
  academicYears: Option[];
  classes: Option[];
  sections: Option[];
  isSubmitting?: boolean;
  onClassChange?: (classId: string) => void
}

interface CreateEnrollmentFormProps extends BaseEnrollmentFormProps {
  mode: "create";
  initialData?: never;
  onSubmit: (data: CreateEnrollmentRequest) => Promise<void>;
}

interface EditEnrollmentFormProps extends BaseEnrollmentFormProps {
  mode: "edit";
  initialData: StudentEnrollment;
  onSubmit: (data: UpdateEnrollmentRequest) => Promise<void>;
}

export type EnrollmentFormProps =
  | CreateEnrollmentFormProps
  | EditEnrollmentFormProps;

const DEFAULT_VALUES: CreateEnrollmentFormValues = {
  studentId: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  rollNumber: 1,
  medium: Medium.ENGLISH,
  stream: null,
  house: "",
  boardRegistrationNumber: "",
  admissionType: AdmissionType.NEW,
  enrollmentStatus: EnrollmentStatus.ACTIVE,
  joinedDate: new Date(),
  leftDate: null,
  remarks: "",
};

export function EnrollmentForm({
  mode,
  initialData,
  students,
  academicYears,
  classes,
  sections,
   onClassChange,
  isSubmitting = false,
  onSubmit,
}: EnrollmentFormProps) {
  // Explicitly passing the type parameters to useForm ensures alignment with the Zod schema constraints
  const form = useForm<CreateEnrollmentFormValues>({
    resolver: zodResolver(createEnrollmentSchema) as unknown as Resolver<CreateEnrollmentFormValues>,
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const resetFormToCurrentState = () => {
    if (mode === "edit" && initialData) {
      form.reset({
        studentId: initialData.studentId,
        academicYearId: initialData.academicYearId,
        classId: initialData.classId,
        sectionId: initialData.sectionId,
        rollNumber: initialData.rollNumber ?? 1,
        medium: initialData.medium ?? Medium.ENGLISH,
        stream: initialData.stream ?? null,
        house: initialData.house ?? "",
        boardRegistrationNumber: initialData.boardRegistrationNumber ?? "",
        admissionType: initialData.admissionType ?? AdmissionType.NEW,
        enrollmentStatus: initialData.enrollmentStatus,
        joinedDate: initialData.joinedDate ? new Date(initialData.joinedDate) : new Date(),
        leftDate: initialData.leftDate ? new Date(initialData.leftDate) : null,
        remarks: initialData.remarks ?? "",
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  };

  useEffect(() => {
    if (!initialData) return;
    resetFormToCurrentState();
  }, [initialData]);

  async function handleSubmit(values: CreateEnrollmentFormValues) {
    await onSubmit(values as unknown as CreateEnrollmentRequest & UpdateEnrollmentRequest);

    if (mode === "create") {
      form.reset(DEFAULT_VALUES);
    }
  }

const selectedClassId = form.watch("classId");

const selectedClass = classes.find(
  (cls) => cls.id === selectedClassId
);

const isStreamEnabled =
  selectedClass?.name === "11" ||
  selectedClass?.name === "12";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Student */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Student <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem
                            key={student.id}
                            value={student.id}
                          >
                            {student.fullName} ({student.admissionNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Academic Year */}
              <FormField
                control={form.control}
                name="academicYearId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Academic Year{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem
                            key={year.id}
                            value={year.id}
                          >
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Class */}
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Class <span className="text-destructive">*</span>
                    </FormLabel>
                    
                    <Select
  value={field.value}
  onValueChange={(value) => {
    field.onChange(value);

    // Clear previously selected section
    form.setValue("sectionId", "");
    // Clear stream whenever class changes
  form.setValue("stream", null);

    // Tell parent page which class is selected
    onClassChange?.(value ?? "");
  }}
>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((classItem) => (
                          <SelectItem
                            key={classItem.id}
                            value={classItem.id}
                          >
                            {classItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section */}
              <FormField
                control={form.control}
                name="sectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Section <span className="text-destructive">*</span>
                    </FormLabel>
                    {/* <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    > */}

                    <Select
  disabled={!form.watch("classId")}
  value={field.value}
  onValueChange={field.onChange}
>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
  placeholder={
    form.watch("classId")
      ? "Select Section"
      : "Select Class First"
  }
/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem
                            key={section.id}
                            value={section.id}
                          >
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Roll Number */}
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Roll Number"
                        value={field.value === undefined || field.value === null ? "" : String(field.value)}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Medium */}
              <FormField
                control={form.control}
                name="medium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Medium <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Medium" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Medium.ENGLISH}>ENGLISH</SelectItem>
                        <SelectItem value={Medium.HINDI}>HINDI</SelectItem>
                        <SelectItem value={Medium.BOTH}>BOTH</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stream */}
              <FormField
  control={form.control}
  name="stream"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Stream</FormLabel>

      <Select
        disabled={!isStreamEnabled}
        value={field.value ?? "none"}
        onValueChange={(value) =>
          field.onChange(value === "none" ? null : value)
        }
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue
              placeholder={
                isStreamEnabled
                  ? "Select Stream"
                  : "Available only for Class 11 & 12"
              }
            />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value={Stream.SCIENCE}>SCIENCE</SelectItem>
          <SelectItem value={Stream.COMMERCE}>COMMERCE</SelectItem>
          <SelectItem value={Stream.ARTS}>ARTS</SelectItem>
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  )}
/>

              {/* Admission Type */}
              <FormField
                control={form.control}
                name="admissionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Admission Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Admission Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AdmissionType.NEW}>NEW</SelectItem>
                        <SelectItem value={AdmissionType.PROMOTION}>PROMOTION</SelectItem>
                        <SelectItem value={AdmissionType.TRANSFER}>TRANSFER</SelectItem>
                        <SelectItem value={AdmissionType.READMISSION}>READMISSION</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* House */}
              <FormField
                control={form.control}
                name="house"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter House"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Board Registration Number */}
              <FormField
                control={form.control}
                name="boardRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Board Registration Number"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Joined Date */}
              <FormField
                control={form.control}
                name="joinedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Joined Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value as string | Date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value ? new Date(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Left Date */}
              <FormField
                control={form.control}
                name="leftDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value as string | Date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value ? new Date(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enrollment Status */}
              <FormField
                control={form.control}
                name="enrollmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enrollment Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EnrollmentStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={EnrollmentStatus.PROMOTED}>Promoted</SelectItem>
                        <SelectItem value={EnrollmentStatus.TRANSFERRED}>Transferred</SelectItem>
                        <SelectItem value={EnrollmentStatus.PASSED_OUT}>PASSED_OUT</SelectItem>
                        <SelectItem value={EnrollmentStatus.LEFT}>Left</SelectItem>
                        
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remarks */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter remarks..."
                          className="min-h-[120px]"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resetFormToCurrentState}
                disabled={isSubmitting}
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Create Enrollment" : "Update Enrollment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}