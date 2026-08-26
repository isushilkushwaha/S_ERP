"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useConfiguration,
  useUpdateConfiguration,
  useSections,
  useCreateSection,
  useDeleteSection,
  useOccupancy,
} from "@/frontend/settings/classes/hooks";

import {
  ClassesTable,
  ClassDialog,
  ConfigurationCard,
  SectionsCard,
  OccupancyCard,
} from "@/frontend/settings/classes/components";

import { Class } from "@/frontend/settings/classes/types/class";

import { z } from "zod";
import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
import { classConfigurationSchema } from "@/features/settings/classes/schema/class-configuration.schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * ClassDialog does not ask the user for academicYearId.
 * The page automatically supplies the selected academic year.
 */
const classDialogSchema = createClassSchema.omit({
  academicYearId: true,
});

type ClassFormValues = z.infer<typeof classDialogSchema>;

type ConfigFormValues = z.infer<
  typeof classConfigurationSchema
>;

interface AcademicYear {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

export default function ClassesSettingsPage() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [
    userSelectedClassId,
    setUserSelectedClassId,
  ] = useState<string | null>(null);

  const [
    userSelectedAcademicYearId,
    setUserSelectedAcademicYearId,
  ] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  const [editingClass, setEditingClass] =
    useState<Class | null>(null);

  const [deletingClassId, setDeletingClassId] =
    useState<string | null>(null);

  const [
    deletingSectionId,
    setDeletingSectionId,
  ] = useState<string | null>(null);

  // ==========================================================
  // ACADEMIC YEARS
  // ==========================================================

  const {
    data: academicYearsData,
    isLoading: isLoadingAcademicYears,
  } = useQuery({
    queryKey: ["academic-years-list"],

    queryFn: async () => {
      const response = await fetch(
        "/api/settings/academic-years"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load academic years."
        );
      }

      const json = await response.json();

      const list =
        json.data ??
        json.items ??
        json ??
        [];

      return Array.isArray(list)
        ? list
        : [];
    },

    staleTime: 1000 * 60 * 5,
  });

  const academicYears: AcademicYear[] =
    Array.isArray(academicYearsData)
      ? academicYearsData
      : [];

  // ==========================================================
  // ACTIVE ACADEMIC YEAR
  // ==========================================================

  const activeYear = academicYears.find(
    (academicYear) =>
      academicYear.status === "ACTIVE" ||
      academicYear.isActive === true
  );

  // ==========================================================
  // SELECTED ACADEMIC YEAR
  // ==========================================================

  /**
   * Always return a string.
   *
   * This keeps the Base UI Select controlled
   * from the first render.
   */
  const selectedAcademicYearId =
    userSelectedAcademicYearId ??
    activeYear?.id ??
    "";

  const selectedYearObject =
    academicYears.find(
      (academicYear) =>
        academicYear.id ===
        selectedAcademicYearId
    );

  // ==========================================================
  // CLASSES
  // ==========================================================

  const {
    data: classesData,
    isLoading: isClassesLoading,
    isFetching: isFetchingClasses,
  } = useClasses(
    selectedAcademicYearId,
    "ACTIVE"
  );

  const classes: Class[] =
    Array.isArray(classesData)
      ? classesData
      : [];

  // ==========================================================
  // SELECTED CLASS
  // ==========================================================

  const selectedClassId =
    userSelectedClassId &&
    classes.some(
      (classItem) =>
        classItem.id ===
        userSelectedClassId
    )
      ? userSelectedClassId
      : classes[0]?.id ?? null;

  const selectedClass =
    classes.find(
      (classItem) =>
        classItem.id === selectedClassId
    ) ?? null;

  const activeClassId =
    selectedClass?.id ?? "";

  // ==========================================================
  // CLASS MUTATIONS
  // ==========================================================

  const createClassMutation =
    useCreateClass();

  const updateClassMutation =
    useUpdateClass();

  const deleteClassMutation =
    useDeleteClass();

  // ==========================================================
  // CONFIGURATION
  // ==========================================================

  const {
    data: configuration,
    isLoading: isLoadingConfiguration,
  } = useConfiguration(
    selectedAcademicYearId,
    activeClassId
  );

  const updateConfigMutation =
    useUpdateConfiguration();

  // ==========================================================
  // SECTIONS
  // ==========================================================

  const {
    data: sections = [],
  } = useSections(activeClassId);

  const createSectionMutation =
    useCreateSection();

  const deleteSectionMutation =
    useDeleteSection();

  // ==========================================================
  // OCCUPANCY
  // ==========================================================

  const {
    data: occupancyReport,
    isLoading: isLoadingOccupancy,
  } = useOccupancy(
    activeClassId,
    selectedAcademicYearId
  );

  // ==========================================================
  // SELECT CLASS
  // ==========================================================

  const handleSelectClass = (
    cls: Class
  ) => {
    setUserSelectedClassId(cls.id);
  };

  // ==========================================================
  // CHANGE ACADEMIC YEAR
  // ==========================================================

  /**
   * IMPORTANT:
   *
   * Base UI Select returns:
   *
   * string | null
   *
   * Therefore this handler MUST accept
   * string | null, not only string.
   */
  const handleAcademicYearChange = (
    academicYearId: string | null
  ) => {
    if (academicYearId === null) {
      return;
    }

    setUserSelectedAcademicYearId(
      academicYearId
    );

    // The selected class belongs to
    // the previous academic year.
    // Clear it when session changes.
    setUserSelectedClassId(null);
  };

  // ==========================================================
  // CREATE CLASS DIALOG
  // ==========================================================

  const handleOpenCreateDialog = () => {
    setEditingClass(null);
    setIsDialogOpen(true);
  };

  // ==========================================================
  // EDIT CLASS DIALOG
  // ==========================================================

  const handleOpenEditDialog = (
    cls: Class
  ) => {
    setEditingClass(cls);
    setIsDialogOpen(true);
  };

  // ==========================================================
  // SAVE CLASS
  // ==========================================================

  const handleSaveClass = async (
    data: ClassFormValues
  ) => {
    try {
      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------

      if (editingClass) {
        await updateClassMutation.mutateAsync({
          id: editingClass.id,
          payload: data,
        });

        toast.success(
          `Class "${data.name}" updated successfully!`
        );
      }

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      else {
        if (!selectedAcademicYearId) {
          toast.error(
            "Please select an academic year first."
          );

          return;
        }

        await createClassMutation.mutateAsync({
          ...data,
          academicYearId:
            selectedAcademicYearId,
        });

        toast.success(
          `Class "${data.name}" created and assigned to ${
            selectedYearObject?.name ??
            "the selected academic year"
          }.`
        );
      }

      setIsDialogOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save class.";

      toast.error(message);
    }
  };

  // ==========================================================
  // DELETE CLASS
  // ==========================================================

  const handleTriggerDeleteClass = (
    id: string
  ) => {
    setDeletingClassId(id);
  };

  const handleConfirmDeleteClass =
    async () => {
      if (!deletingClassId) {
        return;
      }

      try {
        await deleteClassMutation.mutateAsync(
          deletingClassId
        );

        toast.success(
          "Class deleted successfully!"
        );

        if (
          selectedClassId ===
          deletingClassId
        ) {
          setUserSelectedClassId(null);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete class.";

        toast.error(message);
      } finally {
        setDeletingClassId(null);
      }
    };

  // ==========================================================
  // SAVE CONFIGURATION
  // ==========================================================

  const handleSaveConfiguration = async (
    payload: ConfigFormValues
  ) => {
    if (!selectedAcademicYearId) {
      toast.error(
        "Please select an academic year first."
      );

      return;
    }

    if (!activeClassId) {
      toast.error(
        "Please select a class first."
      );

      return;
    }

    try {
      await updateConfigMutation.mutateAsync({
        academicYearId:
          selectedAcademicYearId,

        classId: activeClassId,

        sectionsEnabled:
          payload.sectionsEnabled,

        defaultSectionCapacity:
          payload.defaultSectionCapacity,

        maxStudentsWithoutSection:
          payload.maxStudentsWithoutSection,

        autoAllocationEnabled:
          payload.autoAllocationEnabled,
      });

      toast.success(
        "Configuration updated successfully!"
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update configuration.";

      toast.error(message);
    }
  };

  // ==========================================================
  // CREATE SECTION
  // ==========================================================

  const handleCreateSection = async (
    name: string,
    capacity: number,
    displayOrder: number
  ) => {
    if (!activeClassId) {
      return;
    }

    try {
      await createSectionMutation.mutateAsync({
        classId: activeClassId,
        name,
        capacity,
        displayOrder,
      });

      toast.success(
        `Section ${name} created successfully!`
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create section.";

      toast.error(message);
    }
  };

  // ==========================================================
  // TRIGGER SECTION DELETE
  // ==========================================================

  const handleTriggerDeleteSection = async (
    sectionId: string
  ): Promise<void> => {
    setDeletingSectionId(sectionId);
  };

  // ==========================================================
  // CONFIRM SECTION DELETE
  // ==========================================================

  const handleConfirmDeleteSection =
    async () => {
      if (
        !deletingSectionId ||
        !activeClassId
      ) {
        return;
      }

      try {
        await deleteSectionMutation.mutateAsync({
          id: deletingSectionId,
          classId: activeClassId,
        });

        toast.success(
          "Section deleted successfully!"
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete section.";

        toast.error(message);
      } finally {
        setDeletingSectionId(null);
      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Classes & Sections
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5">
            Configure master school classes,
            sub-sections, seat capacities, and
            session-based occupancy.
          </p>
        </div>

        {/* ====================================================
            ACADEMIC YEAR SELECTOR
        ==================================================== */}

        <div className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">

          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />

          <div className="space-y-0.5">

            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Academic Session
            </p>

            <Select
              value={selectedAcademicYearId}
              onValueChange={
                handleAcademicYearChange
              }
              disabled={
                isLoadingAcademicYears ||
                academicYears.length === 0
              }
            >
              <SelectTrigger className="h-8 w-48 text-xs font-semibold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>

              <SelectContent className="text-xs rounded-xl">
                {academicYears.map(
                  (academicYear) => (
                    <SelectItem
                      key={
                        academicYear.id
                      }
                      value={
                        academicYear.id
                      }
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>
                          {
                            academicYear.name
                          }
                        </span>

                        {(academicYear.status ===
                          "ACTIVE" ||
                          academicYear.isActive ===
                            true) && (
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            (Active)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

          </div>
        </div>
      </div>

      {/* ======================================================
          NO ACTIVE ACADEMIC YEAR
      ====================================================== */}

      {!isLoadingAcademicYears &&
        !activeYear && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 text-sm text-amber-800 dark:text-amber-300">
            No active academic year is
            configured. Please activate an
            academic year before configuring
            classes and sections.
          </div>
        )}

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* ====================================================
            CLASSES
        ==================================================== */}

        <div className="lg:col-span-7">

          <ClassesTable
            classes={classes}
            selectedClassId={
              selectedClassId
            }
            onSelectClass={
              handleSelectClass
            }
            onOpenCreateDialog={
              handleOpenCreateDialog
            }
            onOpenEditDialog={
              handleOpenEditDialog
            }
            onDeleteClass={
              handleTriggerDeleteClass
            }
            isLoading={
              isClassesLoading ||
              isFetchingClasses
            }
          />

        </div>

        {/* ====================================================
            CONFIGURATION / SECTIONS
        ==================================================== */}

        <div className="flex flex-col gap-6 lg:col-span-5">

          {selectedClass ? (
            <>

              {/* OCCUPANCY */}

              <OccupancyCard
                report={occupancyReport}
                isLoading={
                  isLoadingOccupancy
                }
              />

              {/* CONFIGURATION */}

              <ConfigurationCard
                academicYearId={
                  selectedAcademicYearId
                }
                classId={
                  selectedClass.id
                }
                className={
                  selectedClass.name
                }
                configuration={
                  configuration
                }
                onSave={
                  handleSaveConfiguration
                }
                isSaving={
                  updateConfigMutation.isPending
                }
              />

              {/* SECTIONS */}

              {configuration?.sectionsEnabled && (
                <SectionsCard
                  sections={sections}
                  classId={
                    selectedClass.id
                  }
                  onCreateSection={
                    handleCreateSection
                  }
                  onDeleteSection={
                    handleTriggerDeleteSection
                  }
                  isCreating={
                    createSectionMutation.isPending
                  }
                />
              )}

            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">

              {selectedAcademicYearId
                ? "No classes are assigned to this academic year yet."
                : "Select an academic year first."}

            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          CREATE / EDIT CLASS DIALOG
      ====================================================== */}

      <ClassDialog
        open={isDialogOpen}
        onOpenChange={
          setIsDialogOpen
        }
        initialData={
          editingClass
        }
        onSubmit={
          handleSaveClass
        }
        isSubmitting={
          createClassMutation.isPending ||
          updateClassMutation.isPending
        }
      />

      {/* ======================================================
          DELETE SECTION DIALOG
      ====================================================== */}

      <AlertDialog
        open={Boolean(
          deletingSectionId
        )}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSectionId(null);
          }
        }}
      >
        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Section?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
              You can only delete this
              section if it has zero active
              student enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={
                handleConfirmDeleteSection
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Section
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

      {/* ======================================================
          DELETE CLASS DIALOG
      ====================================================== */}

      <AlertDialog
        open={Boolean(
          deletingClassId
        )}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingClassId(null);
          }
        }}
      >
        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Class?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete
              this class? This action will
              fail if active student
              enrollments exist.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={
                handleConfirmDeleteClass
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Class
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}