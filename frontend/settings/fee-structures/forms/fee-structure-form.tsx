// // frontend/settings/fee-structures/forms/fee-structure-form.tsx

// 'use client';
// "use no memo";

// import React, { useEffect, useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   createFeeStructureSchema,
//   CreateFeeStructureInput,
//   CreateFeeStructureSchema,
// } from '@/features/settings/fee-structures/schemas/create-fee-structure.schema';
// import { FeeStructureDTO } from '@/features/settings/fee-structures/types/fee-structure.types';
// import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';
// import { useAcademicYears } from '@/frontend/settings/academic-years/hooks/use-academic-years';
// import { useClasses } from '@/frontend/settings/classes/hooks/use-classes';

// interface AcademicYearOption {
//   id: string;
//   name: string;
//   status?: string;
//   isActive?: boolean;
//   isCurrent?: boolean;
// }

// interface ClassOption {
//   id: string;
//   name: string;
//   medium?: string;
//   mediumName?: string;
// }

// interface Props {
//   tenantId: string;
//   initialData?: FeeStructureDTO | null;
//   activeComponents: FeeComponentDTO[];
//   onSubmit: (data: CreateFeeStructureSchema) => Promise<void>;
//   onCancel: () => void;
//   isSubmitting: boolean;
// }

// export function FeeStructureForm({
//   initialData,
//   activeComponents,
//   onSubmit,
//   onCancel,
//   isSubmitting,
// }: Props) {
//   // Domain queries
//   const { data: yearsResponse, isLoading: isLoadingYears } = useAcademicYears({ status: 'ACTIVE' });
//   const { data: classesResponse, isLoading: isLoadingClasses } = useClasses('ACTIVE');

//   const rawYearsList = Array.isArray(yearsResponse)
//     ? yearsResponse
//     : (yearsResponse as unknown as { items?: AcademicYearOption[]; data?: AcademicYearOption[] })?.items ||
//       (yearsResponse as unknown as { items?: AcademicYearOption[]; data?: AcademicYearOption[] })?.data ||
//       [];
//   const academicYears = rawYearsList as AcademicYearOption[];

//   const rawClassesList = Array.isArray(classesResponse)
//     ? classesResponse
//     : (classesResponse as unknown as { data?: ClassOption[]; items?: ClassOption[] })?.data ||
//       (classesResponse as unknown as { data?: ClassOption[]; items?: ClassOption[] })?.items ||
//       [];
//   const classes = rawClassesList as ClassOption[];

//   // Track component state
//   const [selectedComponents, setSelectedComponents] = useState<Record<string, { enabled: boolean; amount: number }>>(() => {
//     const initialState: Record<string, { enabled: boolean; amount: number }> = {};
//     activeComponents.forEach((comp) => {
//       const existing = initialData?.items?.find((i) => i.feeComponentId === comp.id);
//       initialState[comp.id] = {
//         enabled: Boolean(existing),
//         amount: existing ? existing.amount : 0,
//       };
//     });
//     return initialState;
//   });

//   // Determine initial academic year default value safely without side effects
//   const defaultYearId = (() => {
//     if (initialData?.academicYearId) return initialData.academicYearId;
//     const activeYear = academicYears.find((y) => y.status === 'ACTIVE' || y.isCurrent || y.isActive);
//     return activeYear?.id || academicYears[0]?.id || '';
//   })();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<CreateFeeStructureInput, unknown, CreateFeeStructureSchema>({
//     resolver: zodResolver(createFeeStructureSchema),
//     defaultValues: {
//       academicYearId: defaultYearId,
//       classId: initialData?.classId ?? '',
//       effectiveFrom: initialData
//         ? new Date(initialData.effectiveFrom).toISOString().split('T')[0]
//         : new Date().toISOString().split('T')[0],
//       status: initialData?.status ?? 'ACTIVE',
//       notes: initialData?.notes ?? '',
//       items: [],
//     },
//   });

//   // Keep react-hook-form 'items' field synced with component selection state
//   useEffect(() => {
//     const activeAllocations = Object.entries(selectedComponents)
//       .filter(([, value]) => value.enabled)
//       .map(([compKey, value]) => ({
//         feeComponentId: compKey,
//         amount: value.amount,
//       }));

//     setValue('items', activeAllocations, { shouldValidate: true });
//   }, [selectedComponents, setValue]);

//   // Dynamic context header badge variables
//   const selectedClassId = watch('classId');
//   const selectedYearId = watch('academicYearId');

//   const selectedClassObj = classes.find((c) => c.id === selectedClassId);
//   const selectedYearObj = academicYears.find((y) => y.id === selectedYearId);

//   const selectedClassMediumDisplay = selectedClassObj
//     ? selectedClassObj.medium || selectedClassObj.mediumName
//       ? `${selectedClassObj.name} (${selectedClassObj.medium || selectedClassObj.mediumName})`
//       : selectedClassObj.name
//     : 'Select Class';

//   const selectedYearDisplay = selectedYearObj?.name || 'Academic Year';

//   const handleToggleComponent = (id: string) => {
//     setSelectedComponents((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         enabled: !prev[id]?.enabled,
//       },
//     }));
//   };

//   const handleAmountChange = (id: string, amount: number) => {
//     setSelectedComponents((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         amount: isNaN(amount) ? 0 : amount,
//       },
//     }));
//   };

//   const totalCalculated = Object.values(selectedComponents)
//     .filter((item) => item.enabled)
//     .reduce((sum, item) => sum + (item.amount || 0), 0);

//   const handleFormSubmit: SubmitHandler<CreateFeeStructureSchema> = async (formData) => {
//     const activeAllocations = Object.entries(selectedComponents)
//       .filter(([, value]) => value.enabled)
//       .map(([compKey, value]) => ({
//         feeComponentId: compKey,
//         amount: value.amount,
//       }));

//     if (activeAllocations.length === 0) {
//       alert('Please select at least one Fee Component.');
//       return;
//     }

//     await onSubmit({
//       ...formData,
//       items: activeAllocations,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Academic Year Select */}
//         <div>
//           <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//             Academic Year
//           </label>
//           <select
//             disabled={Boolean(initialData) || isLoadingYears}
//             {...register('academicYearId')}
//             className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//           >
//             <option value="">
//               {isLoadingYears ? 'Loading academic years...' : 'Select Academic Year'}
//             </option>
//             {academicYears.map((year) => (
//               <option key={year.id} value={year.id}>
//                 {year.name}
//               </option>
//             ))}
//           </select>
//           {errors.academicYearId && (
//             <p className="mt-1 text-xs font-medium text-red-500">{errors.academicYearId.message}</p>
//           )}
//         </div>

//         {/* Class Select */}
//         <div>
//           <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//             Class (Medium)
//           </label>
//           <select
//             disabled={Boolean(initialData) || isLoadingClasses}
//             {...register('classId')}
//             className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//           >
//             <option value="">
//               {isLoadingClasses ? 'Loading active classes...' : 'Select Class (Medium)'}
//             </option>
//             {classes.map((cls) => {
//               const medium = cls.medium || cls.mediumName;
//               const hasMediumInName = cls.name?.toLowerCase().includes(medium?.toLowerCase() || '');
//               const displayName = medium && !hasMediumInName ? `${cls.name} (${medium})` : cls.name;

//               return (
//                 <option key={cls.id} value={cls.id}>
//                   {displayName}
//                 </option>
//               );
//             })}
//           </select>
//           {errors.classId && (
//             <p className="mt-1 text-xs font-medium text-red-500">{errors.classId.message}</p>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//             Effective From
//           </label>
//           <input
//             type="date"
//             {...register('effectiveFrom')}
//             className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//           />
//           {errors.effectiveFrom && (
//             <p className="mt-1 text-xs font-medium text-red-500">{errors.effectiveFrom.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//             Status
//           </label>
//           <select
//             {...register('status')}
//             className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//           >
//             <option value="ACTIVE">Active</option>
//             <option value="DRAFT">Draft</option>
//             <option value="ARCHIVED">Archived</option>
//           </select>
//         </div>
//       </div>

//       {/* Component Allocations */}
//       <div className="pt-2">
//         <div className="mb-2 flex items-center justify-between">
//           <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//             Select & Allocate Fee Components (₹)
//           </label>
//           <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
//             {selectedClassMediumDisplay} • {selectedYearDisplay}
//           </span>
//         </div>

//         <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
//           {activeComponents.map((comp) => {
//             const isChecked = selectedComponents[comp.id]?.enabled ?? false;
//             const currentAmount = selectedComponents[comp.id]?.amount ?? 0;

//             return (
//               <div
//                 key={comp.id}
//                 className={`flex items-center justify-between gap-4 p-2 rounded-md transition-colors ${
//                   isChecked ? 'bg-white shadow-sm dark:bg-zinc-900' : 'opacity-60'
//                 }`}
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <input
//                     type="checkbox"
//                     id={`comp-${comp.id}`}
//                     checked={isChecked}
//                     onChange={() => handleToggleComponent(comp.id)}
//                     className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                   />
//                   <label htmlFor={`comp-${comp.id}`} className="cursor-pointer">
//                     <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
//                       {comp.name}
//                     </p>
//                     <p className="font-mono text-xs text-zinc-500">{comp.code}</p>
//                   </label>
//                 </div>

//                 <div className="w-36">
//                   <div className="relative">
//                     <span className="absolute left-3 top-2 text-xs font-semibold text-zinc-500">
//                       ₹
//                     </span>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       disabled={!isChecked}
//                       value={currentAmount || ''}
//                       placeholder="0.00"
//                       onChange={(e) => handleAmountChange(comp.id, parseFloat(e.target.value))}
//                       className="w-full rounded-md border border-zinc-300 py-1.5 pl-7 pr-3 font-mono text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {errors.items && (
//           <p className="mt-1 text-xs font-medium text-red-500">
//             {typeof errors.items.message === 'string' ? errors.items.message : 'Please select valid fee components.'}
//           </p>
//         )}
//       </div>

//       {/* Total Card */}
//       <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
//         <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
//           Total Structure Amount:
//         </span>
//         <span className="font-mono text-xl font-extrabold text-blue-700 dark:text-blue-400">
//           ₹{totalCalculated.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//         </span>
//       </div>

//       <div>
//         <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
//           Notes / Remarks
//         </label>
//         <textarea
//           {...register('notes')}
//           rows={2}
//           placeholder="Optional notes for school admin reference..."
//           className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
//         />
//       </div>

//       <div className="mt-6 flex justify-end space-x-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isSubmitting ? 'Saving...' : initialData ? 'Update Structure' : 'Create Structure'}
//         </button>
//       </div>
//     </form>
//   );
// }


// frontend/settings/fee-structures/forms/fee-structure-form.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFeeStructureSchema,
  CreateFeeStructureInput,
  CreateFeeStructureSchema,
} from "@/features/settings/fee-structures/schemas/create-fee-structure.schema";

import { FeeStructureDTO } from "@/features/settings/fee-structures/types/fee-structure.types";
import { FeeComponentDTO } from "@/features/settings/fee-components/types/fee-component.types";

import { useAcademicYears } from "@/frontend/settings/academic-years/hooks/use-academic-years";
import { useClasses } from "@/frontend/settings/classes/hooks/use-classes";

interface AcademicYearOption {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
  isCurrent?: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  medium?: string;
  mediumName?: string;
}

interface Props {
  tenantId: string;
  initialData?: FeeStructureDTO | null;
  activeComponents: FeeComponentDTO[];
  onSubmit: (
    data: CreateFeeStructureSchema
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FeeStructureForm({
  initialData,
  activeComponents,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) {
  // ============================================================
  // ACADEMIC YEARS
  // ============================================================

  const {
    data: yearsResponse,
    isLoading: isLoadingYears,
  } = useAcademicYears({
    status: "ACTIVE",
  });

  const rawYearsList = Array.isArray(yearsResponse)
    ? yearsResponse
    : (
        yearsResponse as unknown as {
          items?: AcademicYearOption[];
          data?: AcademicYearOption[];
        }
      )?.items ||
      (
        yearsResponse as unknown as {
          items?: AcademicYearOption[];
          data?: AcademicYearOption[];
        }
      )?.data ||
      [];

  const academicYears =
    rawYearsList as AcademicYearOption[];

  // ============================================================
  // FORM
  // ============================================================

  const getDefaultAcademicYearId = (): string => {
    if (initialData?.academicYearId) {
      return initialData.academicYearId;
    }

    const activeYear = academicYears.find(
      (year) =>
        year.status === "ACTIVE" ||
        year.isCurrent === true ||
        year.isActive === true
    );

    return (
      activeYear?.id ||
      academicYears[0]?.id ||
      ""
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<
    CreateFeeStructureInput,
    unknown,
    CreateFeeStructureSchema
  >({
    resolver: zodResolver(
      createFeeStructureSchema
    ),

    defaultValues: {
      academicYearId:
        initialData?.academicYearId ?? "",

      classId:
        initialData?.classId ?? "",

      effectiveFrom: initialData
        ? new Date(
            initialData.effectiveFrom
          )
            .toISOString()
            .split("T")[0]
        : new Date()
            .toISOString()
            .split("T")[0],

      status:
        initialData?.status ?? "ACTIVE",

      notes:
        initialData?.notes ?? "",

      items: [],
    },
  });

  // ============================================================
  // FORM VALUES
  // ============================================================

  const selectedYearId =
    watch("academicYearId");

  const selectedClassId =
    watch("classId");

  // ============================================================
  // SET DEFAULT ACADEMIC YEAR AFTER API LOAD
  // ============================================================

  useEffect(() => {
    if (
      !initialData &&
      !selectedYearId &&
      academicYears.length > 0
    ) {
      const defaultYearId =
        getDefaultAcademicYearId();

      if (defaultYearId) {
        setValue(
          "academicYearId",
          defaultYearId,
          {
            shouldValidate: true,
            shouldDirty: false,
          }
        );
      }
    }
  }, [
    academicYears,
    initialData,
    selectedYearId,
    setValue,
  ]);

  // ============================================================
  // CLASSES
  //
  // IMPORTANT:
  // Classes are loaded for the selected academic year.
  // ============================================================

  const {
    data: classesResponse,
    isLoading: isLoadingClasses,
  } = useClasses(
    selectedYearId,
    "ACTIVE"
  );

  const rawClassesList = Array.isArray(
    classesResponse
  )
    ? classesResponse
    : (
        classesResponse as unknown as {
          data?: ClassOption[];
          items?: ClassOption[];
        }
      )?.data ||
      (
        classesResponse as unknown as {
          data?: ClassOption[];
          items?: ClassOption[];
        }
      )?.items ||
      [];

  const classes =
    rawClassesList as ClassOption[];

  // ============================================================
  // RESET CLASS WHEN ACADEMIC YEAR CHANGES
  // ============================================================

  useEffect(() => {
    if (
      !selectedYearId ||
      initialData
    ) {
      return;
    }

    setValue("classId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [
    selectedYearId,
    initialData,
    setValue,
  ]);

  // ============================================================
  // MAKE SURE EXISTING CLASS IS STILL AVAILABLE
  // ============================================================

  useEffect(() => {
    if (
      !selectedClassId ||
      classes.length === 0
    ) {
      return;
    }

    const classExists = classes.some(
      (cls) =>
        cls.id === selectedClassId
    );

    if (!classExists && !initialData) {
      setValue("classId", "", {
        shouldValidate: true,
      });
    }
  }, [
    classes,
    selectedClassId,
    initialData,
    setValue,
  ]);

  // ============================================================
  // SELECTED OBJECTS
  // ============================================================

  const selectedClassObj =
    classes.find(
      (cls) =>
        cls.id === selectedClassId
    );

  const selectedYearObj =
    academicYears.find(
      (year) =>
        year.id === selectedYearId
    );

  // ============================================================
  // FEE COMPONENT STATE
  // ============================================================

  const [
    selectedComponents,
    setSelectedComponents,
  ] = useState<
    Record<
      string,
      {
        enabled: boolean;
        amount: number;
      }
    >
  >(() => {
    const initialState: Record<
      string,
      {
        enabled: boolean;
        amount: number;
      }
    > = {};

    activeComponents.forEach(
      (component) => {
        const existing =
          initialData?.items?.find(
            (item) =>
              item.feeComponentId ===
              component.id
          );

        initialState[component.id] = {
          enabled: Boolean(existing),
          amount: existing
            ? existing.amount
            : 0,
        };
      }
    );

    return initialState;
  });

  // ============================================================
  // SYNC COMPONENTS WITH FORM
  // ============================================================

  useEffect(() => {
    const activeAllocations =
      Object.entries(
        selectedComponents
      )
        .filter(
          ([, value]) =>
            value.enabled
        )
        .map(
          ([componentId, value]) => ({
            feeComponentId:
              componentId,
            amount: value.amount,
          })
        );

    setValue(
      "items",
      activeAllocations,
      {
        shouldValidate: true,
      }
    );
  }, [
    selectedComponents,
    setValue,
  ]);

  // ============================================================
  // COMPONENT HANDLERS
  // ============================================================

  const handleToggleComponent = (
    id: string
  ) => {
    setSelectedComponents(
      (previous) => ({
        ...previous,
        [id]: {
          ...previous[id],
          enabled:
            !previous[id]?.enabled,
        },
      })
    );
  };

  const handleAmountChange = (
    id: string,
    amount: number
  ) => {
    setSelectedComponents(
      (previous) => ({
        ...previous,
        [id]: {
          ...previous[id],
          amount: Number.isNaN(
            amount
          )
            ? 0
            : amount,
        },
      })
    );
  };

  // ============================================================
  // TOTAL
  // ============================================================

  const totalCalculated =
    Object.values(
      selectedComponents
    )
      .filter(
        (item) => item.enabled
      )
      .reduce(
        (sum, item) =>
          sum + (item.amount || 0),
        0
      );

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleFormSubmit: SubmitHandler<
    CreateFeeStructureSchema
  > = async (formData) => {
    const activeAllocations =
      Object.entries(
        selectedComponents
      )
        .filter(
          ([, value]) =>
            value.enabled
        )
        .map(
          ([componentId, value]) => ({
            feeComponentId:
              componentId,
            amount: value.amount,
          })
        );

    if (
      activeAllocations.length === 0
    ) {
      alert(
        "Please select at least one Fee Component."
      );
      return;
    }

    if (!formData.academicYearId) {
      alert(
        "Please select an Academic Year."
      );
      return;
    }

    if (!formData.classId) {
      alert(
        "Please select a Class."
      );
      return;
    }

    await onSubmit({
      ...formData,
      items: activeAllocations,
    });
  };

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const selectedClassMediumDisplay =
    selectedClassObj
      ? selectedClassObj.medium ||
        selectedClassObj.mediumName
        ? `${selectedClassObj.name} (${
            selectedClassObj.medium ||
            selectedClassObj.mediumName
          })`
        : selectedClassObj.name
      : "Select Class";

  const selectedYearDisplay =
    selectedYearObj?.name ||
    "Academic Year";

  // ============================================================
  // UI
  // ============================================================

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit
      )}
      className="space-y-4"
    >
      {/* ======================================================
          ACADEMIC YEAR + CLASS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4">
        {/* Academic Year */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Academic Year
          </label>

          <select
            disabled={
              Boolean(initialData) ||
              isLoadingYears
            }
            {...register(
              "academicYearId"
            )}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">
              {isLoadingYears
                ? "Loading academic years..."
                : "Select Academic Year"}
            </option>

            {academicYears.map(
              (year) => (
                <option
                  key={year.id}
                  value={year.id}
                >
                  {year.name}
                </option>
              )
            )}
          </select>

          {errors.academicYearId && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {
                errors
                  .academicYearId
                  .message
              }
            </p>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Assign Class
          </label>

          <select
            disabled={
              Boolean(initialData) ||
              !selectedYearId ||
              isLoadingClasses
            }
            {...register("classId")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">
              {!selectedYearId
                ? "Select Academic Year First"
                : isLoadingClasses
                ? "Loading assigned classes..."
                : classes.length === 0
                ? "No classes assigned"
                : "Select Class (Medium)"}
            </option>

            {classes.map(
              (cls) => {
                const medium =
                  cls.medium ||
                  cls.mediumName;

                const hasMediumInName =
                  Boolean(
                    medium &&
                      cls.name
                        ?.toLowerCase()
                        .includes(
                          medium.toLowerCase()
                        )
                  );

                const displayName =
                  medium &&
                  !hasMediumInName
                    ? `${cls.name} (${medium})`
                    : cls.name;

                return (
                  <option
                    key={cls.id}
                    value={cls.id}
                  >
                    {displayName}
                  </option>
                );
              }
            )}
          </select>

          {errors.classId && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {
                errors.classId.message
              }
            </p>
          )}

          {selectedYearId &&
            !isLoadingClasses &&
            classes.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No classes are assigned
                to this academic year.
              </p>
            )}
        </div>
      </div>

      {/* ======================================================
          EFFECTIVE DATE + STATUS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4">
        {/* Effective From */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Effective From
          </label>

          <input
            type="date"
            {...register(
              "effectiveFrom"
            )}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />

          {errors.effectiveFrom && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {
                errors
                  .effectiveFrom
                  .message
              }
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Status
          </label>

          <select
            {...register("status")}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="ACTIVE">
              Active
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </div>
      </div>

      {/* ======================================================
          COMPONENT ALLOCATIONS
      ======================================================= */}

      <div className="pt-2">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Select & Allocate Fee
            Components (₹)
          </label>

          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {selectedClassMediumDisplay}
            {" • "}
            {selectedYearDisplay}
          </span>
        </div>

        <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
          {activeComponents.map(
            (comp) => {
              const isChecked =
                selectedComponents[
                  comp.id
                ]?.enabled ??
                false;

              const currentAmount =
                selectedComponents[
                  comp.id
                ]?.amount ?? 0;

              return (
                <div
                  key={comp.id}
                  className={`flex items-center justify-between gap-4 rounded-md p-2 transition-colors ${
                    isChecked
                      ? "bg-white shadow-sm dark:bg-zinc-900"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <input
                      type="checkbox"
                      id={`comp-${comp.id}`}
                      checked={
                        isChecked
                      }
                      onChange={() =>
                        handleToggleComponent(
                          comp.id
                        )
                      }
                      className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />

                    <label
                      htmlFor={`comp-${comp.id}`}
                      className="cursor-pointer"
                    >
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {comp.name}
                      </p>

                      <p className="font-mono text-xs text-zinc-500">
                        {comp.code}
                      </p>
                    </label>
                  </div>

                  <div className="w-36">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-semibold text-zinc-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={
                          !isChecked
                        }
                        value={
                          currentAmount ||
                          ""
                        }
                        placeholder="0.00"
                        onChange={(event) =>
                          handleAmountChange(
                            comp.id,
                            parseFloat(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        className="w-full rounded-md border border-zinc-300 py-1.5 pl-7 pr-3 font-mono text-sm text-zinc-900 focus:border-blue-500 focus:outline-none disabled:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {errors.items && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {typeof errors.items
              .message === "string"
              ? errors.items.message
              : "Please select valid fee components."}
          </p>
        )}
      </div>

      {/* ======================================================
          TOTAL
      ======================================================= */}

      <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
          Total Structure Amount:
        </span>

        <span className="font-mono text-xl font-extrabold text-blue-700 dark:text-blue-400">
          ₹
          {totalCalculated.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </span>
      </div>

      {/* ======================================================
          NOTES
      ======================================================= */}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Notes / Remarks
        </label>

        <textarea
          {...register("notes")}
          rows={2}
          placeholder="Optional notes for school admin reference..."
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* ======================================================
          ACTIONS
      ======================================================= */}

      <div className="mt-6 flex justify-end space-x-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !selectedYearId ||
            !selectedClassId
          }
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Structure"
            : "Create Structure"}
        </button>
      </div>
    </form>
  );
}