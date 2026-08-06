// app/(dashboard)/settings/classes/page.tsx

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

// shadcn UI imports
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type ClassFormValues = z.infer<typeof createClassSchema>;
type ConfigFormValues = z.infer<typeof classConfigurationSchema>;

interface AcademicYear {
  id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

export default function ClassesSettingsPage() {
  const [userSelectedClassId, setUserSelectedClassId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // States for custom Delete Confirmations
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);

  // 1. Fetch Academic Years from settings & default to ACTIVE
  const { data: academicYearsData } = useQuery({
    queryKey: ["academic-years-list"],
    queryFn: async () => {
      const res = await fetch("/api/settings/academic-years");
      if (!res.ok) return [];
      const json = await res.json();
      const list = json.data || json.items || json || [];
      return Array.isArray(list) ? list : [];
    },
  });

  const academicYears = Array.isArray(academicYearsData) ? (academicYearsData as AcademicYear[]) : [];

  // ✅ Derive selected session state immediately from fetched data without any useEffect
  const [userSelectedAcademicYearId, setUserSelectedAcademicYearId] = useState<string | null>(null);

  const activeYear = academicYears.find(
    (ay) => ay.status === "ACTIVE" || ay.isActive === true
  );
  const selectedAcademicYearId = 
    userSelectedAcademicYearId !== null
      ? userSelectedAcademicYearId
      : activeYear?.id || academicYears[0]?.id || "ALL";

  const selectedYearObject = academicYears.find((ay) => ay.id === selectedAcademicYearId);

  // 2. Fetch Master Classes List
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses();

  // ✅ Derive selected class ID cleanly without using an effect + setState
  const selectedClassId = 
    userSelectedClassId !== null 
      ? userSelectedClassId 
      : classes[0]?.id || null;

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;
  const activeClassId = selectedClass?.id || "";

  // 3. Class Mutation Hooks
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();

  // 4. Active Class Configuration & Sections Hooks
  const { data: configuration } = useConfiguration(activeClassId);
  const updateConfigMutation = useUpdateConfiguration();

  const { data: sections = [] } = useSections(activeClassId);
  const createSectionMutation = useCreateSection();
  const deleteSectionMutation = useDeleteSection();

  // 5. Pass selectedAcademicYearId to track session-based occupancy and enrollment seats
  const { data: occupancyReport, isLoading: isLoadingOccupancy } = useOccupancy(
    activeClassId,
    selectedAcademicYearId
  );

  // Selection Handler
  const handleSelectClass = (cls: Class) => {
    setUserSelectedClassId(cls.id);
  };

  // Class Form Dialog
  const handleOpenCreateDialog = () => {
    setEditingClass(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setIsDialogOpen(true);
  };

  const handleSaveClass = async (data: ClassFormValues) => {
    try {
      if (editingClass) {
        await updateClassMutation.mutateAsync({
          id: editingClass.id,
          payload: data,
        });
        toast.success(`Class "${data.name}" updated successfully!`);
      } else {
        await createClassMutation.mutateAsync(data);
        toast.success(`Class "${data.name}" created successfully!`);
      }
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to save class.");
    }
  };

  // CONFIRMATION HANDLERS FOR CLASS DELETION
  const handleTriggerDeleteClass = (id: string) => {
    setDeletingClassId(id);
  };

  const handleConfirmDeleteClass = async () => {
    if (!deletingClassId) return;
    try {
      await deleteClassMutation.mutateAsync(deletingClassId);
      toast.success("Class deleted successfully!");
      if (selectedClassId === deletingClassId) {
        setUserSelectedClassId(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to delete class.");
    } finally {
      setDeletingClassId(null);
    }
  };

  // SAVE CONFIGURATION
  const handleSaveConfiguration = async (payload: ConfigFormValues) => {
    try {
      await updateConfigMutation.mutateAsync({
        classId: payload.classId,
        sectionsEnabled: payload.sectionsEnabled,
        defaultSectionCapacity: payload.defaultSectionCapacity,
        maxStudentsWithoutSection: payload.maxStudentsWithoutSection,
        autoAllocationEnabled: payload.autoAllocationEnabled,
      });
      toast.success("Configuration updated successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to update configuration.");
    }
  };

  // CREATE SECTION
  const handleCreateSection = async (name: string, capacity: number, displayOrder: number) => {
    if (!activeClassId) return;
    try {
      await createSectionMutation.mutateAsync({
        classId: activeClassId,
        name,
        capacity,
        displayOrder,
      });
      toast.success(`Section ${name} created successfully!`);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to create section.");
    }
  };

  // CONFIRMATION HANDLERS FOR SECTION DELETION
  const handleTriggerDeleteSection = async (sectionId: string) => {
    setDeletingSectionId(sectionId);
  };

  const handleConfirmDeleteSection = async () => {
    if (!deletingSectionId || !activeClassId) return;
    try {
      await deleteSectionMutation.mutateAsync({
        id: deletingSectionId,
        classId: activeClassId,
      });
      toast.success("Section deleted successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to delete section.");
    } finally {
      setDeletingSectionId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header & Global Academic Year Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Classes & Sections</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure master school classes, sub-sections, seat capacities, and session-based occupancy.
          </p>
        </div>

        {/* Academic Year Selector Switcher */}
        <div className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Academic Session</p>
            <Select
              value={selectedAcademicYearId}
              onValueChange={(val) => setUserSelectedAcademicYearId(val ?? "")}
            >
              <SelectTrigger className="h-8 w-48 text-xs font-semibold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl">
                <SelectValue placeholder="Select session">
                  {selectedYearObject?.name || "Select Session"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-xs rounded-xl">
                {academicYears.map((ay) => (
                  <SelectItem key={ay.id} value={ay.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{ay.name}</span>
                      {(ay.status === "ACTIVE" || ay.isActive) && (
                        <span className="text-[10px] text-emerald-600 font-semibold">(Active)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Classes Table */}
        <div className="lg:col-span-7">
          <ClassesTable
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            onOpenCreateDialog={handleOpenCreateDialog}
            onOpenEditDialog={handleOpenEditDialog}
            onDeleteClass={handleTriggerDeleteClass}
            isLoading={isLoadingClasses}
          />
        </div>

        {/* Right Column: Selected Class Configuration Workspace */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {selectedClass ? (
            <>
              {/* Dynamic Live Occupancy Filtered by Session */}
              <OccupancyCard report={occupancyReport} isLoading={isLoadingOccupancy} />

              {/* Class Configuration Settings Card */}
              <ConfigurationCard
                classId={selectedClass.id}
                className={selectedClass.name}
                configuration={configuration}
                onSave={handleSaveConfiguration}
                isSaving={updateConfigMutation.isPending}
              />

              {/* Sections Management Card */}
              {configuration?.sectionsEnabled && (
                <SectionsCard
                  sections={sections}
                  classId={selectedClass.id}
                  onCreateSection={handleCreateSection}
                  onDeleteSection={handleTriggerDeleteSection}
                  isCreating={createSectionMutation.isPending}
                />
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Select a class from the table on the left to configure settings and sections.
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Dialog Modal */}
      <ClassDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingClass}
        onSubmit={handleSaveClass}
        isSubmitting={createClassMutation.isPending || updateClassMutation.isPending}
      />

      {/* Modern Section Delete Confirmation Modal */}
      <AlertDialog
        open={Boolean(deletingSectionId)}
        onOpenChange={(open) => !open && setDeletingSectionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You can only delete this section if it has zero active student enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modern Class Delete Confirmation Modal */}
      <AlertDialog
        open={Boolean(deletingClassId)}
        onOpenChange={(open) => !open && setDeletingClassId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this class? This action will fail if active student enrollments exist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteClass}
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