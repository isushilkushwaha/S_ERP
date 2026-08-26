

// "use client";
// "use no memo";

// import React, { useEffect, useMemo, useRef } from "react";
// import {
//   useForm,
//   SubmitHandler,
//   FieldErrors,
// } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion, AnimatePresence } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import {
//   ArrowLeft,
//   ArrowRight,
//   AlertCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Checkbox } from "@/components/ui/checkbox";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import {
//   step3AcademicAdmissionSchema,
//   Step3AcademicAdmissionInput,
// } from "@/features/admissions/validators/admission.validator";

// import {
//   useFeeStructureQuery,
// } from "@/frontend/admissions/hooks/use-admissions-query";

// import {
//   AssignedFeeStructureDTO,
// } from "@/features/admissions/dto/admission.dto";

// // Settings hooks
// import {
//   useAcademicYears,
// } from "@/frontend/settings/academic-years/hooks/use-academic-years";

// import {
//   useClasses,
// } from "@/frontend/settings/classes/hooks/use-classes";

// import {
//   useConfiguration,
// } from "@/frontend/settings/classes/hooks/use-configuration";

// import {
//   useSections,
// } from "@/frontend/settings/classes/hooks/use-sections";

// interface Step3Props {
//   initialValues:
//     | Partial<Step3AcademicAdmissionInput>
//     | null;

//   onComplete: (
//     data: Step3AcademicAdmissionInput,
//     feeStructure: AssignedFeeStructureDTO
//   ) => void;

//   onBack: () => void;
// }

// interface AcademicYearOption {
//   id: string;
//   name: string;
//   status?: string;
//   isActive?: boolean;
// }

// interface ClassOption {
//   id: string;
//   name: string;
//   status?: string;
//   medium?:
//     | "ENGLISH"
//     | "HINDI"
//     | "BOTH";
// }

// interface SectionOption {
//   id: string;
//   name: string;
//   status?: string;
//   order?: number;
//   capacity?: number;
// }

// export function Step3AcademicAdmission({
//   initialValues,
//   onComplete,
//   onBack,
// }: Step3Props) {
//   // ============================================================
//   // 1. ACADEMIC YEARS
//   // ============================================================

//   const {
//     data: academicYearsData,
//     isLoading: isYearsLoading,
//   } = useAcademicYears();

//   // ============================================================
//   // 2. FORM
//   // ============================================================

//   const form =
//     useForm<Step3AcademicAdmissionInput>({
//       resolver: zodResolver(
//         step3AcademicAdmissionSchema
//       ) as unknown as import("react-hook-form").Resolver<Step3AcademicAdmissionInput>,

//       defaultValues: {
//         academicYearId:
//           initialValues?.academicYearId || "",

//         classId:
//           initialValues?.classId || "",

//         sectionId:
//           initialValues?.sectionId || "",

//         admissionDate:
//           initialValues?.admissionDate
//             ? new Date(
//                 initialValues.admissionDate
//               )
//             : new Date(),

//         admissionNumber:
//           initialValues?.admissionNumber || "",

//         rollNumber:
//           initialValues?.rollNumber || 1,

//         medium:
//           initialValues?.medium ||
//           "ENGLISH",

//         admissionType:
//           initialValues?.admissionType ||
//           "NEW",

//         isHostelRequired:
//           initialValues?.isHostelRequired ||
//           false,

//         isTransportRequired:
//           initialValues?.isTransportRequired ||
//           false,

//         house:
//           initialValues?.house || null,

//         boardRegistrationNumber:
//           initialValues?.boardRegistrationNumber ||
//           null,

//         remarks:
//           initialValues?.remarks || null,
//       },
//     });

//   // ============================================================
//   // 3. WATCH FORM VALUES
//   // ============================================================

//   const selectedYear =
//     form.watch("academicYearId");

//   const selectedClass =
//     form.watch("classId");

//   const selectedSection =
//     form.watch("sectionId");

//   const currentRollNumber =
//     form.watch("rollNumber") || 1;

//   const isHostel =
//     form.watch("isHostelRequired");

//   const isTransport =
//     form.watch("isTransportRequired");

//   // ============================================================
//   // 4. CLASSES
//   //
//   // IMPORTANT:
//   // Classes are now loaded according to the
//   // selected academic year.
//   // ============================================================

//   const {
//     data: classesData,
//     isLoading: isClassesLoading,
//     isFetching: isFetchingClasses,
//   } = useClasses(
//     selectedYear ?? "",
//     "ACTIVE"
//   );

//   // ============================================================
//   // 5. SAFE ACADEMIC YEAR DATA
//   // ============================================================

//   const rawAcademicYears =
//     useMemo(() => {
//       if (Array.isArray(academicYearsData)) {
//         return academicYearsData;
//       }

//       return (
//         (
//           academicYearsData as unknown as {
//             data?: AcademicYearOption[];
//           }
//         )?.data || []
//       );
//     }, [academicYearsData]);

//   const activeAcademicYears =
//     useMemo(() => {
//       return (
//         rawAcademicYears as AcademicYearOption[]
//       ).filter(
//         (year) =>
//           year.status === "ACTIVE" ||
//           year.isActive
//       );
//     }, [rawAcademicYears]);

//   // ============================================================
//   // 6. SAFE CLASS DATA
//   // ============================================================

//   const rawClasses =
//     useMemo(() => {
//       if (Array.isArray(classesData)) {
//         return classesData;
//       }

//       return (
//         (
//           classesData as unknown as {
//             data?: ClassOption[];
//           }
//         )?.data || []
//       );
//     }, [classesData]);

//   const activeClasses =
//     useMemo(() => {
//       return (
//         rawClasses as ClassOption[]
//       ).filter(
//         (cls) => cls.status === "ACTIVE"
//       );
//     }, [rawClasses]);

//   // ============================================================
//   // 7. SELECTED YEAR / CLASS
//   // ============================================================

//   const selectedYearObject =
//     useMemo(() => {
//       return activeAcademicYears.find(
//         (year) =>
//           year.id === selectedYear
//       );
//     }, [
//       activeAcademicYears,
//       selectedYear,
//     ]);

//   const selectedClassObject =
//     useMemo(() => {
//       return activeClasses.find(
//         (cls) =>
//           cls.id === selectedClass
//       );
//     }, [
//       activeClasses,
//       selectedClass,
//     ]);

//   // ============================================================
//   // 8. CONFIGURATION & SECTIONS
//   //
//   // NOTE:
//   // These hooks currently use classId.
//   // We will make them academic-year-specific
//   // in the next step.
//   // ============================================================

//   const {
//     data: configData,
//   } = useConfiguration(
//     selectedClass
//   );

//   const {
//     data: sectionsData,
//     isLoading: isSectionsLoading,
//   } = useSections(
//     selectedClass
//   );

//   // ============================================================
//   // 9. SAFE SECTION DATA
//   // ============================================================

//   const rawSections =
//     useMemo(() => {
//       if (Array.isArray(sectionsData)) {
//         return sectionsData;
//       }

//       return (
//         (
//           sectionsData as unknown as {
//             data?: SectionOption[];
//           }
//         )?.data || []
//       );
//     }, [sectionsData]);

//   const activeSections =
//     useMemo(() => {
//       return (
//         rawSections as SectionOption[]
//       ).filter(
//         (section) =>
//           section.status === "ACTIVE"
//       );
//     }, [rawSections]);

//   // ============================================================
//   // 10. CLASS CONFIGURATION
//   // ============================================================

//   const config = useMemo(() => {
//     const typedConfig =
//       configData as unknown as
//         | {
//             data?: {
//               sectionsEnabled?: boolean;
//             };
//             sectionsEnabled?: boolean;
//           }
//         | undefined;

//     return (
//       typedConfig?.data ??
//       typedConfig ??
//       null
//     );
//   }, [configData]);

//   const sectionsEnabled =
//     config?.sectionsEnabled ?? true;

//   // ============================================================
//   // 11. AUTO-SELECT ACTIVE ACADEMIC YEAR
//   //
//   // If there is no selected year, use the
//   // first active academic year.
//   // ============================================================

//   useEffect(() => {
//     if (
//       !selectedYear &&
//       activeAcademicYears.length > 0
//     ) {
//       form.setValue(
//         "academicYearId",
//         activeAcademicYears[0].id,
//         {
//           shouldValidate: true,
//         }
//       );
//     }
//   }, [
//     activeAcademicYears,
//     selectedYear,
//     form,
//   ]);

//   // ============================================================
//   // 12. RESET CLASS/SECTION WHEN ACADEMIC YEAR CHANGES
//   //
//   // This prevents a class from the previous year
//   // remaining selected after switching years.
//   // ============================================================

//   const previousAcademicYearRef =
//     useRef<string | null>(
//       initialValues?.academicYearId ??
//         null
//     );

//   useEffect(() => {
//     if (!selectedYear) {
//       return;
//     }

//     const previousYear =
//       previousAcademicYearRef.current;

//     if (
//       previousYear &&
//       previousYear !== selectedYear
//     ) {
//       form.setValue(
//         "classId",
//         "",
//         {
//           shouldValidate: true,
//         }
//       );

//       form.setValue(
//         "sectionId",
//         "",
//         {
//           shouldValidate: true,
//         }
//       );
//     }

//     previousAcademicYearRef.current =
//       selectedYear;
//   }, [
//     selectedYear,
//     form,
//   ]);

//   // ============================================================
//   // 13. RESET CLASS IF IT DOES NOT EXIST
//   // IN THE SELECTED ACADEMIC YEAR
//   // ============================================================

//   useEffect(() => {
//     if (
//       !selectedClass ||
//       isClassesLoading ||
//       isFetchingClasses
//     ) {
//       return;
//     }

//     const classExists =
//       activeClasses.some(
//         (cls) =>
//           cls.id === selectedClass
//       );

//     if (!classExists) {
//       form.setValue(
//         "classId",
//         "",
//         {
//           shouldValidate: true,
//         }
//       );

//       form.setValue(
//         "sectionId",
//         "",
//         {
//           shouldValidate: true,
//         }
//       );
//     }
//   }, [
//     activeClasses,
//     selectedClass,
//     isClassesLoading,
//     isFetchingClasses,
//     form,
//   ]);

//   // ============================================================
//   // 14. LIVE ADMISSION PREVIEW
//   // ============================================================

//   const {
//     data: previewData,
//   } = useQuery({
//     queryKey: [
//       "admission-preview",
//       selectedYear,
//       selectedClass,
//       selectedSection,
//     ],

//     queryFn: async () => {
//       if (!selectedYear) {
//         return null;
//       }

//       const url = new URL(
//         "/api/admissions/preview-scope",
//         window.location.origin
//       );

//       url.searchParams.set(
//         "academicYearId",
//         selectedYear
//       );

//       if (selectedClass) {
//         url.searchParams.set(
//           "classId",
//           selectedClass
//         );
//       }

//       if (selectedSection) {
//         url.searchParams.set(
//           "sectionId",
//           selectedSection
//         );
//       }

//       const response =
//         await fetch(
//           url.toString()
//         );

//       if (!response.ok) {
//         return null;
//       }

//       const json =
//         await response.json();

//       return json.data as {
//         admissionNumber?: string;
//         rollNumber?: number;
//       };
//     },

//     enabled:
//       Boolean(selectedYear),
//   });

//   // ============================================================
//   // 15. ADMISSION NUMBER PREVIEW
//   // ============================================================

//   const admissionNumberPreview =
//     previewData?.admissionNumber
//       ? previewData.admissionNumber
//       : "Select Academic Session";

//   // ============================================================
//   // 16. AUTOMATIC SECTION ASSIGNMENT
//   //
//   // FIX:
//   // Do not repeatedly set sectionId to ""
//   // when it is already empty.
//   // ============================================================

//   useEffect(() => {
//     if (
//       sectionsEnabled &&
//       activeSections.length > 0 &&
//       currentRollNumber
//     ) {
//       const sortedSections =
//         [...activeSections].sort(
//           (a, b) =>
//             (a.order || 0) -
//             (b.order || 0)
//         );

//       let assignedSectionId =
//         sortedSections[0].id;

//       let cumulativeCapacity = 0;

//       for (const section of sortedSections) {
//         const capacity =
//           section.capacity || 30;

//         cumulativeCapacity +=
//           capacity;

//         if (
//           currentRollNumber <=
//           cumulativeCapacity
//         ) {
//           assignedSectionId =
//             section.id;
//           break;
//         }
//       }

//       if (
//         selectedSection !==
//         assignedSectionId
//       ) {
//         form.setValue(
//           "sectionId",
//           assignedSectionId,
//           {
//             shouldValidate: true,
//           }
//         );
//       }
//     } else if (
//       !sectionsEnabled &&
//       selectedSection !== ""
//     ) {
//       form.setValue(
//         "sectionId",
//         "",
//         {
//           shouldValidate: true,
//         }
//       );
//     }
//   }, [
//     currentRollNumber,
//     activeSections,
//     sectionsEnabled,
//     selectedSection,
//     form,
//   ]);

//   // ============================================================
//   // 17. SYNC BACKEND PREVIEW VALUES
//   // ============================================================

//   useEffect(() => {
//     if (
//       previewData?.admissionNumber &&
//       form.getValues(
//         "admissionNumber"
//       ) !==
//         previewData.admissionNumber
//     ) {
//       form.setValue(
//         "admissionNumber",
//         previewData.admissionNumber,
//         {
//           shouldValidate: true,
//         }
//       );
//     }

//     if (
//       previewData?.rollNumber &&
//       form.getValues(
//         "rollNumber"
//       ) !==
//         previewData.rollNumber
//     ) {
//       form.setValue(
//         "rollNumber",
//         previewData.rollNumber,
//         {
//           shouldValidate: true,
//         }
//       );
//     }
//   }, [
//     previewData,
//     form,
//   ]);

//   // ============================================================
//   // 18. SYNC MEDIUM
//   // ============================================================

//   useEffect(() => {
//     if (
//       selectedClassObject?.medium &&
//       form.getValues("medium") !==
//         selectedClassObject.medium
//     ) {
//       form.setValue(
//         "medium",
//         selectedClassObject.medium,
//         {
//           shouldValidate: true,
//         }
//       );
//     }
//   }, [
//     selectedClassObject,
//     form,
//   ]);

//   // ============================================================
//   // 19. SELECTED SECTION
//   // ============================================================

//   const selectedSectionObject =
//     useMemo(() => {
//       return activeSections.find(
//         (section) =>
//           section.id ===
//           selectedSection
//       );
//     }, [
//       activeSections,
//       selectedSection,
//     ]);

//   // ============================================================
//   // 20. DISPLAY LABELS
//   // ============================================================

//   const selectedClassLabel =
//     selectedClassObject
//       ? `${selectedClassObject.name}${
//           selectedClassObject.medium
//             ? ` — ${
//                 selectedClassObject.medium
//                   .charAt(0)
//                   .toUpperCase() +
//                 selectedClassObject.medium
//                   .slice(1)
//                   .toLowerCase()
//               }`
//             : ""
//         }`
//       : undefined;

//   const selectedYearLabel =
//     selectedYearObject?.name;

//   const selectedSectionLabel =
//     selectedSectionObject?.name;

//   // ============================================================
//   // 21. FEE STRUCTURE
//   // ============================================================

//   const {
//     data: rawFeeStructure,
//     isLoading: isFeeLoading,
//     isError: isFeeError,
//   } = useFeeStructureQuery(
//     selectedYear,
//     selectedClass
//   );

//   const feeStructure =
//     rawFeeStructure as
//       | AssignedFeeStructureDTO
//       | undefined;

//   // ============================================================
//   // 22. SUBMIT
//   // ============================================================

//   const onSubmit: SubmitHandler<
//     Step3AcademicAdmissionInput
//   > = (values) => {
//     if (!feeStructure) {
//       return;
//     }

//     onComplete(
//       values,
//       feeStructure
//     );
//   };

//   const onError = (
//     errors: FieldErrors<Step3AcademicAdmissionInput>
//   ) => {
//     console.error(
//       "Form Validation Errors:",
//       errors
//     );
//   };

//   // ============================================================
//   // 23. UI
//   // ============================================================

//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 4,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//       }}
//       transition={{
//         duration: 0.15,
//       }}
//       className="mx-auto max-w-6xl space-y-5"
//     >
//       {/* PAGE HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
//         <div>
//           <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
//             <span>Admissions</span>
//             <span>/</span>
//             <span>New Admission</span>
//           </div>

//           <h1 className="text-xl font-bold tracking-tight text-foreground">
//             Configure Academic Scope
//           </h1>

//           <p className="text-sm text-muted-foreground mt-0.5">
//             Academic year, class, section and
//             service allocation
//           </p>
//         </div>

//         <div className="flex items-center">
//           <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-md">
//             Step 3 of 5
//           </span>
//         </div>
//       </div>

//       {/* MAIN FORM */}
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(
//             onSubmit,
//             onError
//           )}
//         >
//           <div className="flex flex-col lg:flex-row items-start gap-6">
//             {/* LEFT COLUMN */}
//             <div className="flex-1 w-full space-y-5">
//               {/* ACADEMIC PLACEMENT */}
//               <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
//                 <div className="py-3 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
//                   <div>
//                     <h2 className="text-sm font-semibold text-foreground">
//                       Academic Placement
//                     </h2>

//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       Select the academic year, class
//                       and section for this admission.
//                     </p>
//                   </div>

//                   <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
//                     Section 1
//                   </span>
//                 </div>

//                 <CardContent className="p-5 space-y-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     {/* ACADEMIC YEAR */}
//                     <FormField
//                       control={form.control}
//                       name="academicYearId"
//                       render={({ field }) => (
//                         <FormItem className="space-y-1.5">
//                           <FormLabel className="text-sm font-medium text-foreground">
//                             Academic Year{" "}
//                             <span className="text-destructive">
//                               *
//                             </span>
//                           </FormLabel>

//                           {activeAcademicYears.length ===
//                           1 ? (
//                             <div className="h-10 px-3 rounded-md border border-border bg-muted/40 flex items-center justify-between text-sm font-medium text-foreground">
//                               <span>
//                                 {
//                                   activeAcademicYears[0]
//                                     .name
//                                 }
//                               </span>

//                               <Badge
//                                 variant="outline"
//                                 className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
//                               >
//                                 Active
//                               </Badge>
//                             </div>
//                           ) : (
//                             <Select
//                               onValueChange={
//                                 field.onChange
//                               }
//                               value={
//                                 field.value
//                               }
//                               disabled={
//                                 isYearsLoading ||
//                                 activeAcademicYears.length ===
//                                   0
//                               }
//                             >
//                               <FormControl>
//                                 <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
//                                   <SelectValue placeholder="Select session">
//                                     {
//                                       selectedYearLabel
//                                     }
//                                   </SelectValue>
//                                 </SelectTrigger>
//                               </FormControl>

//                               <SelectContent>
//                                 {activeAcademicYears.map(
//                                   (year) => (
//                                     <SelectItem
//                                       key={
//                                         year.id
//                                       }
//                                       value={
//                                         year.id
//                                       }
//                                       className="text-sm"
//                                     >
//                                       {year.name}
//                                     </SelectItem>
//                                   )
//                                 )}
//                               </SelectContent>
//                             </Select>
//                           )}

//                           <FormMessage className="text-xs" />
//                         </FormItem>
//                       )}
//                     />

//                     {/* CLASS */}
//                     <FormField
//                       control={form.control}
//                       name="classId"
//                       render={({ field }) => (
//                         <FormItem className="space-y-1.5">
//                           <FormLabel className="text-sm font-medium text-foreground">
//                             Class{" "}
//                             <span className="text-destructive">
//                               *
//                             </span>
//                           </FormLabel>

//                           <Select
//                             onValueChange={
//                               (value) => {
//                                 field.onChange(
//                                   value
//                                 );

//                                 form.setValue(
//                                   "sectionId",
//                                   "",
//                                   {
//                                     shouldValidate:
//                                       true,
//                                   }
//                                 );
//                               }
//                             }
//                             value={
//                               field.value
//                             }
//                             disabled={
//                               isClassesLoading ||
//                               isFetchingClasses ||
//                               activeClasses.length ===
//                                 0 ||
//                               !selectedYear
//                             }
//                           >
//                             <FormControl>
//                               <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
//                                 <SelectValue placeholder="Select class">
//                                   {
//                                     selectedClassLabel
//                                   }
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>

//                             <SelectContent>
//                               {activeClasses.map(
//                                 (cls) => (
//                                   <SelectItem
//                                     key={
//                                       cls.id
//                                     }
//                                     value={
//                                       cls.id
//                                     }
//                                     className="text-sm"
//                                   >
//                                     <div className="flex items-center justify-between gap-2 w-full">
//                                       <span className="font-medium">
//                                         {
//                                           cls.name
//                                         }
//                                       </span>

//                                       {cls.medium && (
//                                         <span className="text-[10px] font-mono text-muted-foreground uppercase">
//                                           {
//                                             cls.medium
//                                           }
//                                         </span>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 )
//                               )}
//                             </SelectContent>
//                           </Select>

//                           <FormMessage className="text-xs" />
//                         </FormItem>
//                       )}
//                     />

//                     {/* SECTION */}
//                     <FormField
//                       control={form.control}
//                       name="sectionId"
//                       render={({ field }) => (
//                         <FormItem className="space-y-1.5">
//                           <FormLabel className="text-sm font-medium text-foreground">
//                             Section{" "}
//                             {sectionsEnabled && (
//                               <span className="text-destructive">
//                                 *
//                               </span>
//                             )}
//                           </FormLabel>

//                           <Select
//                             onValueChange={
//                               field.onChange
//                             }
//                             value={
//                               field.value
//                             }
//                             disabled={
//                               !sectionsEnabled ||
//                               !selectedClass ||
//                               isSectionsLoading ||
//                               activeSections.length ===
//                                 0
//                             }
//                           >
//                             <FormControl>
//                               <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
//                                 <SelectValue
//                                   placeholder={
//                                     !sectionsEnabled
//                                       ? "Not applicable"
//                                       : "Select section"
//                                   }
//                                 >
//                                   {sectionsEnabled
//                                     ? selectedSectionLabel ||
//                                       "Select section"
//                                     : "Not applicable"}
//                                 </SelectValue>
//                               </SelectTrigger>
//                             </FormControl>

//                             <SelectContent>
//                               {activeSections.map(
//                                 (section) => (
//                                   <SelectItem
//                                     key={
//                                       section.id
//                                     }
//                                     value={
//                                       section.id
//                                     }
//                                     className="text-sm"
//                                   >
//                                     {
//                                       section.name
//                                     }{" "}
//                                     (Cap:{" "}
//                                     {section.capacity ||
//                                       30}
//                                     )
//                                   </SelectItem>
//                                 )
//                               )}
//                             </SelectContent>
//                           </Select>

//                           <FormDescription className="text-xs text-muted-foreground">
//                             {sectionsEnabled
//                               ? "Automatically assigned based on class capacity"
//                               : "Sections are disabled in class settings."}
//                           </FormDescription>

//                           <FormMessage className="text-xs" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* MEDIUM */}
//                   <div className="pt-2">
//                     <FormField
//                       control={form.control}
//                       name="medium"
//                       render={({ field }) => (
//                         <FormItem className="space-y-1.5 max-w-xs">
//                           <FormLabel className="text-sm font-medium text-foreground">
//                             Medium
//                           </FormLabel>

//                           <Input
//                             type="text"
//                             readOnly
//                             disabled
//                             value={
//                               field.value
//                                 ? field.value
//                                     .charAt(0)
//                                     .toUpperCase() +
//                                   field.value
//                                     .slice(1)
//                                     .toLowerCase()
//                                 : "English"
//                             }
//                             className="h-10 text-sm bg-muted/50 border-border rounded-md text-muted-foreground cursor-not-allowed"
//                           />

//                           <FormDescription className="text-xs text-muted-foreground">
//                             Automatically set from
//                             class configuration
//                           </FormDescription>
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* ADDITIONAL SERVICES */}
//                   <div className="border-t border-border pt-4 mt-4 space-y-3">
//                     <div>
//                       <h3 className="text-sm font-medium text-foreground">
//                         Additional Services
//                       </h3>

//                       <p className="text-xs text-muted-foreground">
//                         Optional services for this
//                         student
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       {/* HOSTEL */}
//                       <FormField
//                         control={form.control}
//                         name="isHostelRequired"
//                         render={({ field }) => (
//                           <FormItem
//                             className={`flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 transition-all ${
//                               field.value
//                                 ? "border-primary bg-primary/5 shadow-2xs"
//                                 : "border-border bg-card hover:bg-muted/30"
//                             }`}
//                           >
//                             <FormControl>
//                               <Checkbox
//                                 checked={
//                                   field.value
//                                 }
//                                 onCheckedChange={
//                                   field.onChange
//                                 }
//                                 className="mt-0.5 rounded"
//                               />
//                             </FormControl>

//                             <div
//                               className="space-y-0.5 leading-none cursor-pointer"
//                               onClick={() =>
//                                 field.onChange(
//                                   !field.value
//                                 )
//                               }
//                             >
//                               <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
//                                 {field.value
//                                   ? "✓ Hostel"
//                                   : "Hostel"}
//                               </FormLabel>

//                               <FormDescription className="text-xs text-muted-foreground">
//                                 Residential
//                                 facility
//                               </FormDescription>
//                             </div>
//                           </FormItem>
//                         )}
//                       />

//                       {/* TRANSPORT */}
//                       <FormField
//                         control={form.control}
//                         name="isTransportRequired"
//                         render={({ field }) => (
//                           <FormItem
//                             className={`flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 transition-all ${
//                               field.value
//                                 ? "border-primary bg-primary/5 shadow-2xs"
//                                 : "border-border bg-card hover:bg-muted/30"
//                             }`}
//                           >
//                             <FormControl>
//                               <Checkbox
//                                 checked={
//                                   field.value
//                                 }
//                                 onCheckedChange={
//                                   field.onChange
//                                 }
//                                 className="mt-0.5 rounded"
//                               />
//                             </FormControl>

//                             <div
//                               className="space-y-0.5 leading-none cursor-pointer"
//                               onClick={() =>
//                                 field.onChange(
//                                   !field.value
//                                 )
//                               }
//                             >
//                               <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
//                                 {field.value
//                                   ? "✓ Transport"
//                                   : "Transport"}
//                               </FormLabel>

//                               <FormDescription className="text-xs text-muted-foreground">
//                                 School bus
//                                 service
//                               </FormDescription>
//                             </div>
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* SYSTEM GENERATED INFORMATION */}
//               <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
//                 <div className="py-3 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
//                   <div>
//                     <h2 className="text-sm font-semibold text-foreground">
//                       System-Generated Information
//                     </h2>

//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       These values are generated or
//                       assigned by the school system.
//                     </p>
//                   </div>

//                   <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
//                     Section 2
//                   </span>
//                 </div>

//                 <CardContent className="p-5 space-y-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {/* ADMISSION NUMBER */}
//                     <div className="space-y-1.5">
//                       <div className="flex items-center justify-between">
//                         <label className="text-sm font-medium text-foreground">
//                           Admission Number
//                         </label>

//                         <span className="text-[11px] text-muted-foreground flex items-center gap-1">
//                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
//                           Live
//                         </span>
//                       </div>

//                       <div className="h-10 px-3 rounded-md border border-border bg-muted/50 flex items-center text-sm font-mono font-semibold text-foreground select-none">
//                         {
//                           admissionNumberPreview
//                         }
//                       </div>

//                       <p className="text-xs text-muted-foreground">
//                         Generated automatically
//                       </p>
//                     </div>

//                     {/* ROLL NUMBER */}
//                     <div className="space-y-1.5">
//                       <div className="flex items-center justify-between">
//                         <label className="text-sm font-medium text-foreground">
//                           Roll Number
//                         </label>

//                         <span className="text-[11px] text-muted-foreground flex items-center gap-1">
//                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
//                           Auto-Assigned
//                         </span>
//                       </div>

//                       <div className="h-10 px-3 rounded-md border border-border bg-muted/50 flex items-center text-sm font-mono font-semibold text-foreground select-none">
//                         {previewData?.rollNumber
//                           ? `#${previewData.rollNumber}`
//                           : "Loading..."}
//                       </div>

//                       <p className="text-xs text-muted-foreground">
//                         Generated automatically per
//                         section scope
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* DESKTOP FOOTER */}
//               <div className="hidden sm:flex items-center justify-between pt-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={onBack}
//                   className="text-xs border-border shadow-2xs hover:bg-muted rounded-md h-9 px-4"
//                 >
//                   <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
//                   <span>Back</span>
//                 </Button>

//                 <Button
//                   type="submit"
//                   size="sm"
//                   disabled={!feeStructure}
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-5 h-9 shadow-2xs rounded-md transition-all gap-1.5"
//                 >
//                   <span>
//                     Continue to Fee Assignment
//                   </span>

//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </Button>
//               </div>
//             </div>

//             {/* RIGHT COLUMN */}
//             <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4">
//               {/* ADMISSION SUMMARY */}
//               <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
//                 <div className="py-3 px-4 bg-muted/30 border-b border-border">
//                   <h3 className="text-sm font-semibold text-foreground">
//                     Admission Summary
//                   </h3>

//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     Review before continuing
//                   </p>
//                 </div>

//                 <CardContent className="p-4 space-y-3 text-xs">
//                   <div className="divide-y divide-border/60">
//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Academic Year
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {selectedYearLabel ||
//                           "—"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Class
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {selectedClassObject?.name ||
//                           "—"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Medium
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {selectedClassObject?.medium
//                           ? selectedClassObject.medium
//                               .charAt(0)
//                               .toUpperCase() +
//                             selectedClassObject.medium
//                               .slice(1)
//                               .toLowerCase()
//                           : "English"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Section
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {sectionsEnabled
//                           ? selectedSectionLabel ||
//                             "—"
//                           : "Not applicable"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Admission Number
//                       </span>

//                       <span className="font-mono font-medium text-foreground">
//                         {previewData?.admissionNumber ||
//                           "Pending"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Roll Number
//                       </span>

//                       <span className="font-mono font-medium text-foreground">
//                         {previewData?.rollNumber
//                           ? `#${previewData.rollNumber}`
//                           : "Pending"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Hostel
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {isHostel
//                           ? "Yes"
//                           : "No"}
//                       </span>
//                     </div>

//                     <div className="py-2 flex items-center justify-between">
//                       <span className="text-muted-foreground">
//                         Transport
//                       </span>

//                       <span className="font-medium text-foreground">
//                         {isTransport
//                           ? "Yes"
//                           : "No"}
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* FEE SUMMARY */}
//               <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
//                 <div className="py-3 px-4 bg-muted/30 border-b border-border">
//                   <h3 className="text-sm font-semibold text-foreground">
//                     Fee Structure
//                   </h3>

//                   <p className="text-xs text-muted-foreground mt-0.5">
//                     Applicable ledger charges
//                   </p>
//                 </div>

//                 <CardContent className="p-4 space-y-3">
//                   <AnimatePresence mode="wait">
//                     {isFeeLoading && (
//                       <motion.div
//                         key="loading"
//                         initial={{
//                           opacity: 0,
//                         }}
//                         animate={{
//                           opacity: 1,
//                         }}
//                         exit={{
//                           opacity: 0,
//                         }}
//                         className="space-y-3"
//                       >
//                         <div className="flex items-center justify-between">
//                           <Skeleton className="h-4 w-16" />
//                           <Skeleton className="h-4 w-12" />
//                         </div>

//                         <Skeleton className="h-7 w-28" />

//                         <div className="space-y-2 pt-2 border-t border-border">
//                           <Skeleton className="h-3 w-full" />
//                           <Skeleton className="h-3 w-full" />
//                         </div>
//                       </motion.div>
//                     )}

//                     {feeStructure &&
//                       !isFeeLoading && (
//                         <motion.div
//                           key="success"
//                           initial={{
//                             opacity: 0,
//                           }}
//                           animate={{
//                             opacity: 1,
//                           }}
//                           exit={{
//                             opacity: 0,
//                           }}
//                           className="space-y-3"
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
//                               Active
//                             </span>

//                             <span className="text-xs text-muted-foreground">
//                               {feeStructure
//                                 .items
//                                 ?.length ||
//                                 0}{" "}
//                               components
//                             </span>
//                           </div>

//                           <div>
//                             <p className="text-[11px] text-muted-foreground">
//                               Total Applicable Fee
//                             </p>

//                             <p className="text-lg font-bold font-mono text-foreground tracking-tight mt-0.5">
//                               ₹
//                               {Number(
//                                 feeStructure.totalAmount ||
//                                   0
//                               ).toLocaleString(
//                                 "en-IN",
//                                 {
//                                   minimumFractionDigits:
//                                     2,
//                                 }
//                               )}
//                             </p>
//                           </div>

//                           <div className="space-y-1.5 pt-2 border-t border-border text-xs">
//                             {feeStructure.items
//                               ?.slice(
//                                 0,
//                                 4
//                               )
//                               .map(
//                                 (
//                                   item
//                                 ) => (
//                                   <div
//                                     key={
//                                       item.feeComponentId ||
//                                       item.code
//                                     }
//                                     className="flex items-center justify-between text-muted-foreground"
//                                   >
//                                     <span className="truncate pr-2">
//                                       {
//                                         item.name
//                                       }
//                                     </span>

//                                     <span className="font-mono font-medium text-foreground shrink-0">
//                                       ₹
//                                       {Number(
//                                         item.amount ||
//                                           0
//                                       ).toLocaleString(
//                                         "en-IN"
//                                       )}
//                                     </span>
//                                   </div>
//                                 )
//                               )}

//                             {(feeStructure.items
//                               ?.length ||
//                               0) >
//                               4 && (
//                               <p className="text-[11px] text-muted-foreground font-medium pt-1 text-center">
//                                 +{" "}
//                                 {(feeStructure
//                                   .items
//                                   ?.length ||
//                                   0) -
//                                   4}{" "}
//                                 more components
//                               </p>
//                             )}
//                           </div>
//                         </motion.div>
//                       )}

//                     {isFeeError &&
//                       !isFeeLoading && (
//                         <motion.div
//                           key="error"
//                           initial={{
//                             opacity: 0,
//                           }}
//                           animate={{
//                             opacity: 1,
//                           }}
//                           exit={{
//                             opacity: 0,
//                           }}
//                           className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive space-y-2"
//                         >
//                           <div className="flex items-center space-x-1.5 text-xs font-semibold">
//                             <AlertCircle className="w-4 h-4 shrink-0" />

//                             <span>
//                               Fee structure
//                               unavailable
//                             </span>
//                           </div>

//                           <p className="text-xs leading-relaxed text-destructive/90">
//                             No active fee structure
//                             is configured for this
//                             class. Configure the
//                             class fee structure before
//                             continuing with admission.
//                           </p>
//                         </motion.div>
//                       )}
//                   </AnimatePresence>
//                 </CardContent>
//               </Card>

//               {/* MOBILE CONTINUE */}
//               <div className="block sm:hidden pt-2">
//                 <Button
//                   type="submit"
//                   size="default"
//                   disabled={!feeStructure}
//                   className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium h-10 shadow-sm rounded-md transition-all gap-2"
//                 >
//                   <span>
//                     Continue to Fee Assignment
//                   </span>

//                   <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </aside>
//           </div>
//         </form>
//       </Form>
//     </motion.div>
//   );
// }

"use client";
"use no memo";

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useForm,
  SubmitHandler,
  FieldErrors,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

import {
  useFeeStructureQuery,
} from "@/frontend/admissions/hooks/use-admissions-query";

import {
  AssignedFeeStructureDTO,
} from "@/features/admissions/dto/admission.dto";

// Settings hooks
import {
  useAcademicYears,
} from "@/frontend/settings/academic-years/hooks/use-academic-years";

import {
  useClasses,
} from "@/frontend/settings/classes/hooks/use-classes";

import {
  useConfiguration,
} from "@/frontend/settings/classes/hooks/use-configuration";

import {
  useSections,
} from "@/frontend/settings/classes/hooks/use-sections";

interface Step3Props {
  initialValues:
    | Partial<Step3AcademicAdmissionInput>
    | null;

  onComplete: (
    data: Step3AcademicAdmissionInput,
    feeStructure: AssignedFeeStructureDTO
  ) => void;

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
  medium?:
    | "ENGLISH"
    | "HINDI"
    | "BOTH";
}

interface SectionOption {
  id: string;
  name: string;
  status?: string;
  order?: number;
  capacity?: number;
}

export function Step3AcademicAdmission({
  initialValues,
  onComplete,
  onBack,
}: Step3Props) {
  // ============================================================
  // 1. ACADEMIC YEARS
  // ============================================================

  const {
    data: academicYearsData,
    isLoading: isYearsLoading,
  } = useAcademicYears();

  // ============================================================
  // 2. FORM
  // ============================================================

  const form =
    useForm<Step3AcademicAdmissionInput>({
      resolver: zodResolver(
        step3AcademicAdmissionSchema
      ) as unknown as import("react-hook-form").Resolver<Step3AcademicAdmissionInput>,

      defaultValues: {
        academicYearId:
          initialValues?.academicYearId || "",

        classId:
          initialValues?.classId || "",

        sectionId:
          initialValues?.sectionId || "",

        admissionDate:
          initialValues?.admissionDate
            ? new Date(
                initialValues.admissionDate
              )
            : new Date(),

        admissionNumber:
          initialValues?.admissionNumber || "",

        rollNumber:
          initialValues?.rollNumber || 1,

        medium:
          initialValues?.medium ||
          "ENGLISH",

        admissionType:
          initialValues?.admissionType ||
          "NEW",

        isHostelRequired:
          initialValues?.isHostelRequired ||
          false,

        isTransportRequired:
          initialValues?.isTransportRequired ||
          false,

        house:
          initialValues?.house || null,

        boardRegistrationNumber:
          initialValues?.boardRegistrationNumber ||
          null,

        remarks:
          initialValues?.remarks || null,
      },
    });

  // ============================================================
  // 3. WATCH FORM VALUES
  // ============================================================

  const selectedYear =
    form.watch("academicYearId");

  const selectedClass =
    form.watch("classId");

  const selectedSection =
    form.watch("sectionId");

  const currentRollNumber =
    form.watch("rollNumber") || 1;

  const isHostel =
    form.watch("isHostelRequired");

  const isTransport =
    form.watch("isTransportRequired");

  // ============================================================
  // 4. CLASSES
  // ============================================================

  const {
    data: classesData,
    isLoading: isClassesLoading,
    isFetching: isFetchingClasses,
  } = useClasses(
    selectedYear ?? "",
    "ACTIVE"
  );

  // ============================================================
  // 5. SAFE ACADEMIC YEAR DATA
  // ============================================================

  const rawAcademicYears =
    useMemo(() => {
      if (Array.isArray(academicYearsData)) {
        return academicYearsData;
      }

      return (
        (
          academicYearsData as unknown as {
            data?: AcademicYearOption[];
          }
        )?.data || []
      );
    }, [academicYearsData]);

  const activeAcademicYears =
    useMemo(() => {
      return (
        rawAcademicYears as AcademicYearOption[]
      ).filter(
        (year) =>
          year.status === "ACTIVE" ||
          year.isActive
      );
    }, [rawAcademicYears]);

  // ============================================================
  // 6. SAFE CLASS DATA
  // ============================================================

  const rawClasses =
    useMemo(() => {
      if (Array.isArray(classesData)) {
        return classesData;
      }

      return (
        (
          classesData as unknown as {
            data?: ClassOption[];
          }
        )?.data || []
      );
    }, [classesData]);

  const activeClasses =
    useMemo(() => {
      return (
        rawClasses as ClassOption[]
      ).filter(
        (cls) => cls.status === "ACTIVE"
      );
    }, [rawClasses]);

  // ============================================================
  // 7. SELECTED YEAR / CLASS
  // ============================================================

  const selectedYearObject =
    useMemo(() => {
      return activeAcademicYears.find(
        (year) =>
          year.id === selectedYear
      );
    }, [
      activeAcademicYears,
      selectedYear,
    ]);

  const selectedClassObject =
    useMemo(() => {
      return activeClasses.find(
        (cls) =>
          cls.id === selectedClass
      );
    }, [
      activeClasses,
      selectedClass,
    ]);

  // ============================================================
  // 8. CONFIGURATION & SECTIONS
  //
  // IMPORTANT:
  // Configuration is now academic-year-specific.
  // Therefore BOTH academicYearId and classId
  // must be passed.
  // ============================================================

  const {
    data: configData,
  } = useConfiguration(
    selectedYear ?? "",
    selectedClass ?? ""
  );

  const {
    data: sectionsData,
    isLoading: isSectionsLoading,
  } = useSections(
    selectedClass ?? ""
  );

  // ============================================================
  // 9. SAFE SECTION DATA
  // ============================================================

  const rawSections =
    useMemo(() => {
      if (Array.isArray(sectionsData)) {
        return sectionsData;
      }

      return (
        (
          sectionsData as unknown as {
            data?: SectionOption[];
          }
        )?.data || []
      );
    }, [sectionsData]);

  const activeSections =
    useMemo(() => {
      return (
        rawSections as SectionOption[]
      ).filter(
        (section) =>
          section.status === "ACTIVE"
      );
    }, [rawSections]);

  // ============================================================
  // 10. CLASS CONFIGURATION
  // ============================================================

  const config = useMemo(() => {
    const typedConfig =
      configData as unknown as
        | {
            data?: {
              sectionsEnabled?: boolean;
            };
            sectionsEnabled?: boolean;
          }
        | undefined;

    return (
      typedConfig?.data ??
      typedConfig ??
      null
    );
  }, [configData]);

  const sectionsEnabled =
    config?.sectionsEnabled ?? true;

  // ============================================================
  // 11. AUTO-SELECT ACTIVE ACADEMIC YEAR
  // ============================================================

  useEffect(() => {
    if (
      !selectedYear &&
      activeAcademicYears.length > 0
    ) {
      form.setValue(
        "academicYearId",
        activeAcademicYears[0].id,
        {
          shouldValidate: true,
        }
      );
    }
  }, [
    activeAcademicYears,
    selectedYear,
    form,
  ]);

  // ============================================================
  // 12. RESET CLASS/SECTION WHEN ACADEMIC YEAR CHANGES
  // ============================================================

  const previousAcademicYearRef =
    useRef<string | null>(
      initialValues?.academicYearId ??
        null
    );

  useEffect(() => {
    if (!selectedYear) {
      return;
    }

    const previousYear =
      previousAcademicYearRef.current;

    if (
      previousYear &&
      previousYear !== selectedYear
    ) {
      form.setValue(
        "classId",
        "",
        {
          shouldValidate: true,
        }
      );

      form.setValue(
        "sectionId",
        "",
        {
          shouldValidate: true,
        }
      );
    }

    previousAcademicYearRef.current =
      selectedYear;
  }, [
    selectedYear,
    form,
  ]);

  // ============================================================
  // 13. RESET CLASS IF IT DOES NOT EXIST
  // IN THE SELECTED ACADEMIC YEAR
  // ============================================================

  useEffect(() => {
    if (
      !selectedClass ||
      isClassesLoading ||
      isFetchingClasses
    ) {
      return;
    }

    const classExists =
      activeClasses.some(
        (cls) =>
          cls.id === selectedClass
      );

    if (!classExists) {
      form.setValue(
        "classId",
        "",
        {
          shouldValidate: true,
        }
      );

      form.setValue(
        "sectionId",
        "",
        {
          shouldValidate: true,
        }
      );
    }
  }, [
    activeClasses,
    selectedClass,
    isClassesLoading,
    isFetchingClasses,
    form,
  ]);

  // ============================================================
  // 14. LIVE ADMISSION PREVIEW
  // ============================================================

  const {
    data: previewData,
  } = useQuery({
    queryKey: [
      "admission-preview",
      selectedYear,
      selectedClass,
      selectedSection,
    ],

    queryFn: async () => {
      if (!selectedYear) {
        return null;
      }

      const url = new URL(
        "/api/admissions/preview-scope",
        window.location.origin
      );

      url.searchParams.set(
        "academicYearId",
        selectedYear
      );

      if (selectedClass) {
        url.searchParams.set(
          "classId",
          selectedClass
        );
      }

      if (selectedSection) {
        url.searchParams.set(
          "sectionId",
          selectedSection
        );
      }

      const response =
        await fetch(
          url.toString()
        );

      if (!response.ok) {
        return null;
      }

      const json =
        await response.json();

      return json.data as {
        admissionNumber?: string;
        rollNumber?: number;
      };
    },

    enabled:
      Boolean(selectedYear),
  });

  // ============================================================
  // 15. ADMISSION NUMBER PREVIEW
  // ============================================================

  const admissionNumberPreview =
    previewData?.admissionNumber
      ? previewData.admissionNumber
      : "Select Academic Session";

  // ============================================================
  // 16. AUTOMATIC SECTION ASSIGNMENT
  // ============================================================

  useEffect(() => {
    if (
      sectionsEnabled &&
      activeSections.length > 0 &&
      currentRollNumber
    ) {
      const sortedSections =
        [...activeSections].sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        );

      let assignedSectionId =
        sortedSections[0].id;

      let cumulativeCapacity = 0;

      for (const section of sortedSections) {
        const capacity =
          section.capacity || 30;

        cumulativeCapacity +=
          capacity;

        if (
          currentRollNumber <=
          cumulativeCapacity
        ) {
          assignedSectionId =
            section.id;
          break;
        }
      }

      if (
        selectedSection !==
        assignedSectionId
      ) {
        form.setValue(
          "sectionId",
          assignedSectionId,
          {
            shouldValidate: true,
          }
        );
      }
    } else if (
      !sectionsEnabled &&
      selectedSection !== ""
    ) {
      form.setValue(
        "sectionId",
        "",
        {
          shouldValidate: true,
        }
      );
    }
  }, [
    currentRollNumber,
    activeSections,
    sectionsEnabled,
    selectedSection,
    form,
  ]);

  // ============================================================
  // 17. SYNC BACKEND PREVIEW VALUES
  // ============================================================

  useEffect(() => {
    if (
      previewData?.admissionNumber &&
      form.getValues(
        "admissionNumber"
      ) !==
        previewData.admissionNumber
    ) {
      form.setValue(
        "admissionNumber",
        previewData.admissionNumber,
        {
          shouldValidate: true,
        }
      );
    }

    if (
      previewData?.rollNumber &&
      form.getValues(
        "rollNumber"
      ) !==
        previewData.rollNumber
    ) {
      form.setValue(
        "rollNumber",
        previewData.rollNumber,
        {
          shouldValidate: true,
        }
      );
    }
  }, [
    previewData,
    form,
  ]);

  // ============================================================
  // 18. SYNC MEDIUM
  // ============================================================

  useEffect(() => {
    if (
      selectedClassObject?.medium &&
      form.getValues("medium") !==
        selectedClassObject.medium
    ) {
      form.setValue(
        "medium",
        selectedClassObject.medium,
        {
          shouldValidate: true,
        }
      );
    }
  }, [
    selectedClassObject,
    form,
  ]);

  // ============================================================
  // 19. SELECTED SECTION
  // ============================================================

  const selectedSectionObject =
    useMemo(() => {
      return activeSections.find(
        (section) =>
          section.id ===
          selectedSection
      );
    }, [
      activeSections,
      selectedSection,
    ]);

  // ============================================================
  // 20. DISPLAY LABELS
  // ============================================================

  const selectedClassLabel =
    selectedClassObject
      ? `${selectedClassObject.name}${
          selectedClassObject.medium
            ? ` — ${
                selectedClassObject.medium
                  .charAt(0)
                  .toUpperCase() +
                selectedClassObject.medium
                  .slice(1)
                  .toLowerCase()
              }`
            : ""
        }`
      : undefined;

  const selectedYearLabel =
    selectedYearObject?.name;

  const selectedSectionLabel =
    selectedSectionObject?.name;

  // ============================================================
  // 21. FEE STRUCTURE
  // ============================================================

  const {
    data: rawFeeStructure,
    isLoading: isFeeLoading,
    isError: isFeeError,
  } = useFeeStructureQuery(
    selectedYear,
    selectedClass
  );

  const feeStructure =
    rawFeeStructure as
      | AssignedFeeStructureDTO
      | undefined;

  // ============================================================
  // 22. SUBMIT
  // ============================================================

  const onSubmit: SubmitHandler<
    Step3AcademicAdmissionInput
  > = (values) => {
    if (!feeStructure) {
      return;
    }

    onComplete(
      values,
      feeStructure
    );
  };

  const onError = (
    errors: FieldErrors<Step3AcademicAdmissionInput>
  ) => {
    console.error(
      "Form Validation Errors:",
      errors
    );
  };

  // ============================================================
  // 23. UI
  // ============================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 4,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.15,
      }}
      className="mx-auto max-w-6xl space-y-5"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Admissions</span>
            <span>/</span>
            <span>New Admission</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Configure Academic Scope
          </h1>

          <p className="text-sm text-muted-foreground mt-0.5">
            Academic year, class, section and
            service allocation
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-md">
            Step 3 of 5
          </span>
        </div>
      </div>

      {/* MAIN FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmit,
            onError
          )}
        >
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* LEFT COLUMN */}
            <div className="flex-1 w-full space-y-5">
              {/* ACADEMIC PLACEMENT */}
              <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
                <div className="py-3 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Academic Placement
                    </h2>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select the academic year, class
                      and section for this admission.
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Section 1
                  </span>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* ACADEMIC YEAR */}
                    <FormField
                      control={form.control}
                      name="academicYearId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-foreground">
                            Academic Year{" "}
                            <span className="text-destructive">
                              *
                            </span>
                          </FormLabel>

                          {activeAcademicYears.length ===
                          1 ? (
                            <div className="h-10 px-3 rounded-md border border-border bg-muted/40 flex items-center justify-between text-sm font-medium text-foreground">
                              <span>
                                {
                                  activeAcademicYears[0]
                                    .name
                                }
                              </span>

                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              >
                                Active
                              </Badge>
                            </div>
                          ) : (
                            <Select
                              onValueChange={
                                (value) => {
                                  if (
                                    value === null
                                  ) {
                                    field.onChange(
                                      ""
                                    );
                                    return;
                                  }

                                  field.onChange(
                                    value
                                  );
                                }
                              }
                              value={
                                field.value || ""
                              }
                              disabled={
                                isYearsLoading ||
                                activeAcademicYears.length ===
                                  0
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
                                  <SelectValue placeholder="Select session">
                                    {
                                      selectedYearLabel
                                    }
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {activeAcademicYears.map(
                                  (year) => (
                                    <SelectItem
                                      key={
                                        year.id
                                      }
                                      value={
                                        year.id
                                      }
                                      className="text-sm"
                                    >
                                      {year.name}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}

                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* CLASS */}
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-foreground">
                            Class{" "}
                            <span className="text-destructive">
                              *
                            </span>
                          </FormLabel>

                          <Select
                            onValueChange={
                              (value) => {
                                if (
                                  value === null
                                ) {
                                  field.onChange(
                                    ""
                                  );

                                  form.setValue(
                                    "sectionId",
                                    "",
                                    {
                                      shouldValidate:
                                        true,
                                    }
                                  );

                                  return;
                                }

                                field.onChange(
                                  value
                                );

                                form.setValue(
                                  "sectionId",
                                  "",
                                  {
                                    shouldValidate:
                                      true,
                                  }
                                );
                              }
                            }
                            value={
                              field.value || ""
                            }
                            disabled={
                              isClassesLoading ||
                              isFetchingClasses ||
                              activeClasses.length ===
                                0 ||
                              !selectedYear
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
                                <SelectValue placeholder="Select class">
                                  {
                                    selectedClassLabel
                                  }
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {activeClasses.map(
                                (cls) => (
                                  <SelectItem
                                    key={
                                      cls.id
                                    }
                                    value={
                                      cls.id
                                    }
                                    className="text-sm"
                                  >
                                    <div className="flex items-center justify-between gap-2 w-full">
                                      <span className="font-medium">
                                        {
                                          cls.name
                                        }
                                      </span>

                                      {cls.medium && (
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                          {
                                            cls.medium
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* SECTION */}
                    <FormField
                      control={form.control}
                      name="sectionId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-foreground">
                            Section{" "}
                            {sectionsEnabled && (
                              <span className="text-destructive">
                                *
                              </span>
                            )}
                          </FormLabel>

                          <Select
                            onValueChange={
                              (value) => {
                                if (
                                  value === null
                                ) {
                                  field.onChange(
                                    ""
                                  );
                                  return;
                                }

                                field.onChange(
                                  value
                                );
                              }
                            }
                            value={
                              field.value || ""
                            }
                            disabled={
                              !sectionsEnabled ||
                              !selectedClass ||
                              isSectionsLoading ||
                              activeSections.length ===
                                0
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 text-sm rounded-md bg-background border-border">
                                <SelectValue
                                  placeholder={
                                    !sectionsEnabled
                                      ? "Not applicable"
                                      : "Select section"
                                  }
                                >
                                  {sectionsEnabled
                                    ? selectedSectionLabel ||
                                      "Select section"
                                    : "Not applicable"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {activeSections.map(
                                (section) => (
                                  <SelectItem
                                    key={
                                      section.id
                                    }
                                    value={
                                      section.id
                                    }
                                    className="text-sm"
                                  >
                                    {
                                      section.name
                                    }{" "}
                                    (Cap:{" "}
                                    {section.capacity ||
                                      30}
                                    )
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <FormDescription className="text-xs text-muted-foreground">
                            {sectionsEnabled
                              ? "Automatically assigned based on class capacity"
                              : "Sections are disabled in class settings."}
                          </FormDescription>

                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* MEDIUM */}
                  <div className="pt-2">
                    <FormField
                      control={form.control}
                      name="medium"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5 max-w-xs">
                          <FormLabel className="text-sm font-medium text-foreground">
                            Medium
                          </FormLabel>

                          <Input
                            type="text"
                            readOnly
                            disabled
                            value={
                              field.value
                                ? field.value
                                    .charAt(0)
                                    .toUpperCase() +
                                  field.value
                                    .slice(1)
                                    .toLowerCase()
                                : "English"
                            }
                            className="h-10 text-sm bg-muted/50 border-border rounded-md text-muted-foreground cursor-not-allowed"
                          />

                          <FormDescription className="text-xs text-muted-foreground">
                            Automatically set from
                            class configuration
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ADDITIONAL SERVICES */}
                  <div className="border-t border-border pt-4 mt-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        Additional Services
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        Optional services for this
                        student
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* HOSTEL */}
                      <FormField
                        control={form.control}
                        name="isHostelRequired"
                        render={({ field }) => (
                          <FormItem
                            className={`flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 transition-all ${
                              field.value
                                ? "border-primary bg-primary/5 shadow-2xs"
                                : "border-border bg-card hover:bg-muted/30"
                            }`}
                          >
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value
                                }
                                onCheckedChange={
                                  field.onChange
                                }
                                className="mt-0.5 rounded"
                              />
                            </FormControl>

                            <div
                              className="space-y-0.5 leading-none cursor-pointer"
                              onClick={() =>
                                field.onChange(
                                  !field.value
                                )
                              }
                            >
                              <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                                {field.value
                                  ? "✓ Hostel"
                                  : "Hostel"}
                              </FormLabel>

                              <FormDescription className="text-xs text-muted-foreground">
                                Residential
                                facility
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* TRANSPORT */}
                      <FormField
                        control={form.control}
                        name="isTransportRequired"
                        render={({ field }) => (
                          <FormItem
                            className={`flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 transition-all ${
                              field.value
                                ? "border-primary bg-primary/5 shadow-2xs"
                                : "border-border bg-card hover:bg-muted/30"
                            }`}
                          >
                            <FormControl>
                              <Checkbox
                                checked={
                                  field.value
                                }
                                onCheckedChange={
                                  field.onChange
                                }
                                className="mt-0.5 rounded"
                              />
                            </FormControl>

                            <div
                              className="space-y-0.5 leading-none cursor-pointer"
                              onClick={() =>
                                field.onChange(
                                  !field.value
                                )
                              }
                            >
                              <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                                {field.value
                                  ? "✓ Transport"
                                  : "Transport"}
                              </FormLabel>

                              <FormDescription className="text-xs text-muted-foreground">
                                School bus
                                service
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SYSTEM GENERATED INFORMATION */}
              <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
                <div className="py-3 px-5 bg-muted/30 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      System-Generated Information
                    </h2>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      These values are generated or
                      assigned by the school system.
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                    Section 2
                  </span>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ADMISSION NUMBER */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Admission Number
                        </label>

                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          Live
                        </span>
                      </div>

                      <div className="h-10 px-3 rounded-md border border-border bg-muted/50 flex items-center text-sm font-mono font-semibold text-foreground select-none">
                        {
                          admissionNumberPreview
                        }
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Generated automatically
                      </p>
                    </div>

                    {/* ROLL NUMBER */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Roll Number
                        </label>

                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          Auto-Assigned
                        </span>
                      </div>

                      <div className="h-10 px-3 rounded-md border border-border bg-muted/50 flex items-center text-sm font-mono font-semibold text-foreground select-none">
                        {previewData?.rollNumber
                          ? `#${previewData.rollNumber}`
                          : "Loading..."}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Generated automatically per
                        section scope
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DESKTOP FOOTER */}
              <div className="hidden sm:flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="text-xs border-border shadow-2xs hover:bg-muted rounded-md h-9 px-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Back</span>
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!feeStructure}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-5 h-9 shadow-2xs rounded-md transition-all gap-1.5"
                >
                  <span>
                    Continue to Fee Assignment
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4">
              {/* ADMISSION SUMMARY */}
              <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
                <div className="py-3 px-4 bg-muted/30 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">
                    Admission Summary
                  </h3>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review before continuing
                  </p>
                </div>

                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="divide-y divide-border/60">
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Academic Year
                      </span>

                      <span className="font-medium text-foreground">
                        {selectedYearLabel ||
                          "—"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Class
                      </span>

                      <span className="font-medium text-foreground">
                        {selectedClassObject?.name ||
                          "—"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Medium
                      </span>

                      <span className="font-medium text-foreground">
                        {selectedClassObject?.medium
                          ? selectedClassObject.medium
                              .charAt(0)
                              .toUpperCase() +
                            selectedClassObject.medium
                              .slice(1)
                              .toLowerCase()
                          : "English"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Section
                      </span>

                      <span className="font-medium text-foreground">
                        {sectionsEnabled
                          ? selectedSectionLabel ||
                            "—"
                          : "Not applicable"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Admission Number
                      </span>

                      <span className="font-mono font-medium text-foreground">
                        {previewData?.admissionNumber ||
                          "Pending"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Roll Number
                      </span>

                      <span className="font-mono font-medium text-foreground">
                        {previewData?.rollNumber
                          ? `#${previewData.rollNumber}`
                          : "Pending"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Hostel
                      </span>

                      <span className="font-medium text-foreground">
                        {isHostel
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Transport
                      </span>

                      <span className="font-medium text-foreground">
                        {isTransport
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FEE SUMMARY */}
              <Card className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
                <div className="py-3 px-4 bg-muted/30 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">
                    Fee Structure
                  </h3>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    Applicable ledger charges
                  </p>
                </div>

                <CardContent className="p-4 space-y-3">
                  <AnimatePresence mode="wait">
                    {isFeeLoading && (
                      <motion.div
                        key="loading"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-12" />
                        </div>

                        <Skeleton className="h-7 w-28" />

                        <div className="space-y-2 pt-2 border-t border-border">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </motion.div>
                    )}

                    {feeStructure &&
                      !isFeeLoading && (
                        <motion.div
                          key="success"
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              Active
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {feeStructure
                                .items
                                ?.length ||
                                0}{" "}
                              components
                            </span>
                          </div>

                          <div>
                            <p className="text-[11px] text-muted-foreground">
                              Total Applicable Fee
                            </p>

                            <p className="text-lg font-bold font-mono text-foreground tracking-tight mt-0.5">
                              ₹
                              {Number(
                                feeStructure.totalAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits:
                                    2,
                                }
                              )}
                            </p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                            {feeStructure.items
                              ?.slice(
                                0,
                                4
                              )
                              .map(
                                (
                                  item
                                ) => (
                                  <div
                                    key={
                                      item.feeComponentId ||
                                      item.code
                                    }
                                    className="flex items-center justify-between text-muted-foreground"
                                  >
                                    <span className="truncate pr-2">
                                      {
                                        item.name
                                      }
                                    </span>

                                    <span className="font-mono font-medium text-foreground shrink-0">
                                      ₹
                                      {Number(
                                        item.amount ||
                                          0
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>
                                  </div>
                                )
                              )}

                            {(feeStructure.items
                              ?.length ||
                              0) >
                              4 && (
                              <p className="text-[11px] text-muted-foreground font-medium pt-1 text-center">
                                +{" "}
                                {(feeStructure
                                  .items
                                  ?.length ||
                                  0) -
                                  4}{" "}
                                more components
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                    {isFeeError &&
                      !isFeeLoading && (
                        <motion.div
                          key="error"
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive space-y-2"
                        >
                          <div className="flex items-center space-x-1.5 text-xs font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />

                            <span>
                              Fee structure
                              unavailable
                            </span>
                          </div>

                          <p className="text-xs leading-relaxed text-destructive/90">
                            No active fee structure
                            is configured for this
                            class. Configure the
                            class fee structure before
                            continuing with admission.
                          </p>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* MOBILE CONTINUE */}
              <div className="block sm:hidden pt-2">
                <Button
                  type="submit"
                  size="default"
                  disabled={!feeStructure}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium h-10 shadow-sm rounded-md transition-all gap-2"
                >
                  <span>
                    Continue to Fee Assignment
                  </span>

                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </aside>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}