// frontend/admissions/components/wizard/steps/step-3-academic-admission.tsx

"use client";
"use no memo";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Calendar,
  Layers,
  Hash,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Receipt,
  BookOpen,
  BadgeCheck,
  Building2,
  Bus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  step3AcademicAdmissionSchema,
  Step3AcademicAdmissionInput,
} from "@/features/admissions/validators/admission.validator";
import { useFeeStructureQuery } from "@/frontend/admissions/hooks/use-admissions-query";
import { AssignedFeeStructureDTO } from "@/features/admissions/dto/admission.dto";

// --- Settings Hooks & Utilities ---
import { useAcademicYears } from "@/frontend/settings/academic-years/hooks/use-academic-years";
import { useClasses } from "@/frontend/settings/classes/hooks/use-classes";
import { useConfiguration } from "@/frontend/settings/classes/hooks/use-configuration";
import { useSections } from "@/frontend/settings/classes/hooks/use-sections";

interface Step3Props {
  initialValues: Partial<Step3AcademicAdmissionInput> | null;
  onComplete: (data: Step3AcademicAdmissionInput, feeStructure: AssignedFeeStructureDTO) => void;
  onBack: () => void;
}

interface AcademicYearOption {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  status?: string;
  medium?: "ENGLISH" | "HINDI" | "BOTH";
}

interface SectionOption {
  id: string;
  name: string;
  status?: string;
  order?: number;
  capacity?: number;
}

export function Step3AcademicAdmission({ initialValues, onComplete, onBack }: Step3Props) {
  // 1. Fetch Academic Years, Active Classes, & School Settings
  const { data: academicYearsData, isLoading: isYearsLoading } = useAcademicYears();
  const { data: classesData, isLoading: isClassesLoading } = useClasses();

  const form = useForm<Step3AcademicAdmissionInput>({
    resolver: zodResolver(step3AcademicAdmissionSchema) as unknown as import("react-hook-form").Resolver<Step3AcademicAdmissionInput>,
    defaultValues: {
      academicYearId: initialValues?.academicYearId || "",
      classId: initialValues?.classId || "",
      sectionId: initialValues?.sectionId || "",
      admissionDate: initialValues?.admissionDate ? new Date(initialValues.admissionDate) : new Date(),
      admissionNumber: initialValues?.admissionNumber || "",
      rollNumber: initialValues?.rollNumber || 1,
      medium: initialValues?.medium || "ENGLISH",
      admissionType: initialValues?.admissionType || "NEW",
      isHostelRequired: initialValues?.isHostelRequired || false,
      isTransportRequired: initialValues?.isTransportRequired || false,
      house: initialValues?.house || null,
      boardRegistrationNumber: initialValues?.boardRegistrationNumber || null,
      remarks: initialValues?.remarks || null,
    },
  });

  const selectedYear = form.watch("academicYearId");
  const selectedClass = form.watch("classId");
  const selectedSection = form.watch("sectionId");
  const currentRollNumber = form.watch("rollNumber") || 1;
  const isHostel = form.watch("isHostelRequired");
  const isTransport = form.watch("isTransportRequired");

  // Safe Data Extraction
  const rawAcademicYears = Array.isArray(academicYearsData)
    ? academicYearsData
    : (academicYearsData as unknown as { data?: AcademicYearOption[] })?.data || [];

  const rawClasses = Array.isArray(classesData)
    ? classesData
    : (classesData as unknown as { data?: ClassOption[] })?.data || [];

  const activeAcademicYears = (rawAcademicYears as AcademicYearOption[]).filter((y) => y.status === "ACTIVE" || y.isActive);
  const activeClasses = (rawClasses as ClassOption[]).filter((c) => c.status === "ACTIVE");

  const selectedYearObject = activeAcademicYears.find((y) => y.id === selectedYear);
  const selectedClassObject = activeClasses.find((c) => c.id === selectedClass);

  // Fetch Class Configuration & Sections
  const { data: configData } = useConfiguration(selectedClass);
  const { data: sectionsData, isLoading: isSectionsLoading } = useSections(selectedClass);

  const rawSections = Array.isArray(sectionsData)
    ? sectionsData
    : (sectionsData as unknown as { data?: SectionOption[] })?.data || [];

  const config = (configData as unknown as { data?: { sectionsEnabled?: boolean }; sectionsEnabled?: boolean })?.data || configData;
  const activeSections = (rawSections as SectionOption[]).filter((s) => s.status === "ACTIVE");
  
  // Check if sections are enabled in settings configuration
  const sectionsEnabled = config?.sectionsEnabled ?? true;

  // 🔄 FETCH LIVE BACKEND PREVIEW COUNTERS (Admission Number & Roll Number)
  const { data: previewData } = useQuery({
    queryKey: ["admission-preview", selectedYear, selectedClass, selectedSection],
    queryFn: async () => {
      if (!selectedYear) return null;
      const url = new URL("/api/admissions/preview-scope", window.location.origin);
      url.searchParams.set("academicYearId", selectedYear);
      if (selectedClass) url.searchParams.set("classId", selectedClass);
      if (selectedSection) url.searchParams.set("sectionId", selectedSection);

      const res = await fetch(url.toString());
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as { admissionNumber?: string; rollNumber?: number };
    },
    enabled: Boolean(selectedYear),
  });

  // Dynamic Admission Number Live Preview
  const admissionNumberPreview = previewData?.admissionNumber 
    ? `${previewData.admissionNumber} (Live)` 
    : "Select Academic Session";

  // 🔄 AUTOMATIC SECTION ASSIGNMENT BY CAPACITY & ROLL NUMBER
  useEffect(() => {
    if (sectionsEnabled && activeSections.length > 0 && currentRollNumber) {
      const sortedSections = [...activeSections].sort((a, b) => (a.order || 0) - (b.order || 0));
      
      let assignedSectionId = sortedSections[0].id;
      let cumulativeCapacity = 0;

      for (const sec of sortedSections) {
        const capacity = sec.capacity || 30;
        cumulativeCapacity += capacity;
        if (currentRollNumber <= cumulativeCapacity) {
          assignedSectionId = sec.id;
          break;
        }
      }

      if (selectedSection !== assignedSectionId) {
        form.setValue("sectionId", assignedSectionId, { shouldValidate: true });
      }
    } else if (!sectionsEnabled) {
      form.setValue("sectionId", "", { shouldValidate: true });
    }
  }, [currentRollNumber, activeSections, sectionsEnabled, selectedSection, form]);

  // Sync backend-generated preview numbers into form values
  useEffect(() => {
    if (previewData?.admissionNumber) {
      form.setValue("admissionNumber", previewData.admissionNumber, { shouldValidate: true });
    }
    if (previewData?.rollNumber && sectionsEnabled && !initialValues?.rollNumber) {
      form.setValue("rollNumber", previewData.rollNumber, { shouldValidate: true });
    }
  }, [previewData, sectionsEnabled, initialValues, form]);

  // Sync Medium
  useEffect(() => {
    if (selectedClassObject?.medium) {
      form.setValue("medium", selectedClassObject.medium as "ENGLISH" | "HINDI" | "BOTH", { shouldValidate: true });
    }
  }, [selectedClassObject, form]);

  // Auto-select initial active academic year if not set
  useEffect(() => {
    if (!selectedYear && activeAcademicYears.length > 0) {
      form.setValue("academicYearId", activeAcademicYears[0].id, { shouldValidate: true });
    }
  }, [activeAcademicYears, selectedYear, form]);

  const selectedSectionObject = activeSections.find((s) => s.id === selectedSection);

  const selectedClassLabel = selectedClassObject
    ? `${selectedClassObject.name}${selectedClassObject.medium ? ` (${selectedClassObject.medium})` : ""}`
    : undefined;

  const selectedYearLabel = selectedYearObject?.name;
  const selectedSectionLabel = selectedSectionObject?.name;

  // Query Fee Structure for selected Academic Year and Class
  const {
    data: feeStructure,
    isLoading: isFeeLoading,
    isError: isFeeError,
  } = useFeeStructureQuery(selectedYear, selectedClass);

  const onSubmit: SubmitHandler<Step3AcademicAdmissionInput> = (values) => {
    if (!feeStructure) return;
    onComplete(values, feeStructure);
  };

  const onError = (errors: FieldErrors<Step3AcademicAdmissionInput>) => {
    console.error("Form Validation Errors:", errors);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* HEADER HERO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60 rounded-full px-2.5 py-0.5"
            >
              Step 3 of 5
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 rounded-full px-2.5 py-0.5"
            >
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
              Academic Allocation
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Configure Academic Scope</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Assign target academic session, class, section, hostel, and transport preferences for the candidate.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-zinc-400 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 shrink-0 self-start lg:self-center">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-medium">Est. time: 1 min</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN FORM LAYOUT */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            
            {/* LEFT COLUMN */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: SESSION SCOPE & FACILITY SELECTION */}
              <Card className="border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden bg-white dark:bg-zinc-900">
                <CardHeader className="py-4 px-6 bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Academic Session & Facility Preferences</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] font-normal">Section 01</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  {/* Class, Session & Section Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Academic Year */}
                    <FormField
                      control={form.control}
                      name="academicYearId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Academic Year *</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isYearsLoading || activeAcademicYears.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs rounded-xl bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Select session">
                                  {selectedYearLabel}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeAcademicYears.map((year) => (
                                <SelectItem key={year.id} value={year.id} className="text-xs">
                                  {year.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    {/* Class & Medium */}
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Class & Medium *</span>
                          </FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(val)}
                            value={field.value}
                            disabled={isClassesLoading || activeClasses.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs rounded-xl bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Select Class">
                                  {selectedClassLabel}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeClasses.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id} className="text-xs">
                                  <div className="flex items-center justify-between gap-2 w-full">
                                    <span className="font-medium">{cls.name}</span>
                                    {cls.medium && (
                                      <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                        {cls.medium}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    {/* Section Select (Disabled if sectionsEnabled is false in settings) */}
                    <FormField
                      control={form.control}
                      name="sectionId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Section {sectionsEnabled ? "*" : "(Disabled)"}</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!sectionsEnabled || !selectedClass || isSectionsLoading || activeSections.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs rounded-xl bg-zinc-50/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500">
                                <SelectValue
                                  placeholder={
                                    !sectionsEnabled
                                      ? "Disabled in settings"
                                      : !selectedClass
                                      ? "Select class first"
                                      : "Select Section"
                                  }
                                >
                                  {sectionsEnabled ? selectedSectionLabel : "N/A (Disabled)"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeSections.map((sec) => (
                                <SelectItem key={sec.id} value={sec.id} className="text-xs">
                                  {sec.name} (Cap: {sec.capacity || 30})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                  </div>

                  {/* HOSTEL & TRANSPORT OPTION CHECKBOXES */}
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-3">
                    <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      Additional Services & Facilities
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Hostel Service Checkbox */}
                      <FormField
                        control={form.control}
                        name="isHostelRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-2xs bg-zinc-50/40 dark:bg-zinc-900/40 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 rounded-md"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 cursor-pointer">
                                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Hostel Facility Required</span>
                              </FormLabel>
                              <FormDescription className="text-[10px] text-zinc-400">
                                Allocate residential room and hostel boarding scope for student.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Transport Service Checkbox */}
                      <FormField
                        control={form.control}
                        name="isTransportRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-2xs bg-zinc-50/40 dark:bg-zinc-900/40 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 rounded-md"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 cursor-pointer">
                                <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Transport Service Required</span>
                              </FormLabel>
                              <FormDescription className="text-[10px] text-zinc-400">
                                Assign campus bus pickup route and transit management scope.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* CARD 2: BACKEND NUMBER GENERATION PREVIEWS */}
              <Card className="border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden bg-white dark:bg-zinc-900">
                <CardHeader className="py-4 px-6 bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>System Identifier Allocations</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] font-normal">Section 02</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Admission Number Live Preview Indicator */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Admission Number (Live)</span>
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 px-2 py-0.5 rounded-full"
                        >
                          LIVE PREVIEW
                        </Badge>
                      </div>
                      <Input
                        type="text"
                        readOnly
                        disabled
                        value={admissionNumberPreview}
                        className="h-10 text-xs font-mono font-bold bg-zinc-100/70 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/80 rounded-xl text-emerald-600 dark:text-emerald-400 cursor-not-allowed select-none focus-visible:ring-0"
                      />
                      <p className="text-[10px] text-zinc-400">
                        Generated atomically by counter rules upon final submission.
                      </p>
                    </div>

                    {/* Roll Number Live Preview / Input */}
                    <FormField
                      control={form.control}
                      name="rollNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer">
                              <Hash className="w-3.5 h-3.5 text-blue-500" />
                              <span>Roll Number *</span>
                            </FormLabel>
                            <Badge
                              variant="outline"
                              className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 px-2 py-0.5 rounded-full"
                            >
                              AUTO CAPACITY ALLOCATED
                            </Badge>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              className="h-10 text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                  </div>
                </CardContent>
              </Card>

              {/* FOOTER NAVIGATION */}
              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="text-xs border-zinc-200 dark:border-zinc-800 shadow-2xs hover:bg-zinc-50 rounded-xl"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Back</span>
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!feeStructure}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 shadow-2xs rounded-xl transition-all"
                >
                  <span>Continue to Fee Assignment</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28 space-y-4">
              <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs bg-white dark:bg-zinc-900 space-y-5">
                
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Admission Overview</span>
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    SCOPE CONFIRMATION
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Allocated Scope
                  </p>
                  <div className="space-y-2 bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Academic Year:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedYearLabel || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Admission No:</span>
                      <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                        {previewData?.admissionNumber || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Target Class:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedClassObject?.name || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Medium:</span>
                      <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">
                        {selectedClassObject?.medium || "ENGLISH"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Assigned Section:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {sectionsEnabled ? (selectedSectionLabel || "Auto-calculated") : "Disabled"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-700/60 pt-2 mt-2">
                      <span className="text-zinc-500">Hostel Required:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {isHostel ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Transport Required:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {isTransport ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-700/60 pt-2 mt-2">
                      <span className="text-zinc-500">Roll Number:</span>
                      <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                        {selectedClass ? `#${currentRollNumber}` : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FEE SUMMARY */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Fee Structure Summary</span>
                    <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                  </p>

                  <AnimatePresence mode="wait">
                    {isFeeLoading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800 space-y-2.5"
                      >
                        <div className="flex items-center space-x-2">
                          <Skeleton className="w-4 h-4 rounded-full" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                        <div className="space-y-1.5 pt-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </motion.div>
                    )}

                    {feeStructure && !isFeeLoading && (
                      <motion.div
                        key="fee-success"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-zinc-900 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                          <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Fee Structure Active
                          </span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-100/60 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                            {feeStructure.items?.length || 0} Items
                          </Badge>
                        </div>

                        <div>
                          <p className="text-[10px] text-zinc-400">Total Applicable Ledger Fee</p>
                          <p className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
                            ₹{Number(feeStructure.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40 text-[11px]">
                          {feeStructure.items?.slice(0, 4).map((item) => (
                            <div
                              key={item.feeComponentId || item.code}
                              className="flex items-center justify-between text-zinc-600 dark:text-zinc-300"
                            >
                              <span className="truncate pr-2">{item.name}</span>
                              <span className="font-mono font-medium shrink-0">
                                ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                          {(feeStructure.items?.length || 0) > 4 && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-1 text-center">
                              + {(feeStructure.items?.length || 0) - 4} more components
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {isFeeError && !isFeeLoading && (
                      <motion.div
                        key="fee-error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2 text-red-700 dark:text-red-400"
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-semibold">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                          <span>No Fee Structure Found</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-red-600/80 dark:text-red-400/80">
                          No active fee structure is mapped for this class in Settings. Please configure the class fee structure before continuing.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  type="submit"
                  disabled={!feeStructure}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-10 shadow-2xs rounded-xl transition-all"
                >
                  <span>Continue to Fee Assignment</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>

              </div>
            </aside>

          </div>
        </form>
      </Form>
    </motion.div>
  );
}