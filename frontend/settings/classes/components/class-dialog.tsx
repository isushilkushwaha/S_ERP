// // frontend/settings/classes/components/class-dialog.tsx

// "use client";

// import React, { useEffect } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
// import { Class } from "@/frontend/settings/classes/types/class";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// type ClassFormValues = z.infer<typeof createClassSchema>;

// interface ClassDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialData?: Class | null;
//   nextDisplayOrder?: number;
//   onSubmit: (data: ClassFormValues) => Promise<void>;
//   isSubmitting?: boolean;
// }

// export function ClassDialog({
//   open,
//   onOpenChange,
//   initialData,
//   nextDisplayOrder = 1,
//   onSubmit,
//   isSubmitting,
// }: ClassDialogProps) {
//   const isEditing = Boolean(initialData);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm<z.input<typeof createClassSchema>, undefined, ClassFormValues>({
//     resolver: zodResolver(createClassSchema),
//     defaultValues: {
//       name: "",
//       shortName: "",
//       code: "",
//       description: "",
//       medium: "ENGLISH",
//       displayOrder: nextDisplayOrder,
//       status: "ACTIVE",
//     },
//   });

//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         reset({
//           name: initialData.name,
//           shortName: initialData.shortName || "",
//           code: initialData.code,
//           description: initialData.description || "",
//           medium: initialData.medium,
//           displayOrder: initialData.displayOrder,
//           status: initialData.status,
//         });
//       } else {
//         reset({
//           name: "",
//           shortName: "",
//           code: "",
//           description: "",
//           medium: "ENGLISH",
//           displayOrder: nextDisplayOrder,
//           status: "ACTIVE",
//         });
//       }
//     }
//   }, [initialData, nextDisplayOrder, open, reset]);

//   const handleFormSubmit: SubmitHandler<ClassFormValues> = async (data) => {
//     try {
//       await onSubmit(data);
//       // Dialog closing is handled inside handleSaveClass on success!
//     } catch {
//       // Keep dialog open on validation error so user can adjust the value
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[480px]">
//         <DialogHeader>
//           <DialogTitle>{isEditing ? "Edit Class" : "Create New Class"}</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-2">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label htmlFor="name">Class Name *</Label>
//               <Input id="name" placeholder="e.g. Class 13" {...register("name")} />
//               {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="shortName">Short Name</Label>
//               <Input id="shortName" placeholder="e.g. Std XIII" {...register("shortName")} />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label htmlFor="code">Class Code *</Label>
//               <Input id="code" placeholder="e.g. CLS13-ENG" {...register("code")} />
//               {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="displayOrder">Display Order *</Label>
//               <Input
//                 id="displayOrder"
//                 type="number"
//                 {...register("displayOrder", { valueAsNumber: true })}
//               />
//               {errors.displayOrder && <p className="text-xs text-destructive">{errors.displayOrder.message}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label>Medium</Label>
//               <Select
//                 defaultValue={initialData?.medium || "ENGLISH"}
//                 onValueChange={(val) => setValue("medium", val as "ENGLISH" | "HINDI" | "BOTH")}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Medium" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ENGLISH">ENGLISH</SelectItem>
//                   <SelectItem value="HINDI">HINDI</SelectItem>
//                   <SelectItem value="BOTH">BOTH</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1">
//               <Label>Status</Label>
//               <Select
//                 defaultValue={initialData?.status || "ACTIVE"}
//                 onValueChange={(val) => setValue("status", val as "ACTIVE" | "INACTIVE")}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ACTIVE">ACTIVE</SelectItem>
//                   <SelectItem value="INACTIVE">INACTIVE</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-1">
//             <Label htmlFor="description">Description</Label>
//             <Input id="description" placeholder="Optional notes or remarks" {...register("description")} />
//           </div>

//           <DialogFooter className="mt-4">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : isEditing ? "Update Class" : "Create Class"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// frontend/settings/classes/components/class-dialog.tsx

"use client";

import React, { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
import { Class } from "@/frontend/settings/classes/types/class";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * academicYearId is controlled by the parent page.
 *
 * The dialog only handles class information.
 * The parent adds the selected academicYearId
 * before creating the class.
 */
const classDialogSchema =
  createClassSchema.omit({
    academicYearId: true,
  });

type ClassFormValues =
  z.infer<typeof classDialogSchema>;

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;

  initialData?: Class | null;

  nextDisplayOrder?: number;

  onSubmit: (
    data: ClassFormValues
  ) => Promise<void>;

  isSubmitting?: boolean;
}

export function ClassDialog({
  open,
  onOpenChange,
  initialData,
  nextDisplayOrder = 1,
  onSubmit,
  isSubmitting = false,
}: ClassDialogProps) {
  const isEditing =
    Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof classDialogSchema>,
    undefined,
    ClassFormValues
  >({
    resolver:
      zodResolver(
        classDialogSchema
      ),

    defaultValues: {
      name: "",
      shortName: "",
      code: "",
      description: "",
      medium: "ENGLISH",
      displayOrder:
        nextDisplayOrder,
      status: "ACTIVE",
    },
  });

  /**
   * Reset form whenever the dialog opens
   * or the class being edited changes.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      reset({
        name: initialData.name,

        shortName:
          initialData.shortName ??
          "",

        code: initialData.code,

        description:
          initialData.description ??
          "",

        medium:
          initialData.medium,

        displayOrder:
          initialData.displayOrder,

        status:
          initialData.status,
      });

      return;
    }

    reset({
      name: "",
      shortName: "",
      code: "",
      description: "",
      medium: "ENGLISH",
      displayOrder:
        nextDisplayOrder,
      status: "ACTIVE",
    });
  }, [
    open,
    initialData,
    nextDisplayOrder,
    reset,
  ]);

  /**
   * Submit class form.
   *
   * Academic year is intentionally NOT added here.
   * The parent page adds the selected academicYearId.
   */
  const handleFormSubmit: SubmitHandler<
    ClassFormValues
  > = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(
        "Class form submit error:",
        error
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Class"
              : "Create New Class"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            handleFormSubmit
          )}
          className="grid gap-4 py-2"
        >
          {/* CLASS NAME + SHORT NAME */}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name">
                Class Name *
              </Label>

              <Input
                id="name"
                placeholder="e.g. Class 5"
                disabled={isSubmitting}
                {...register("name")}
              />

              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="shortName">
                Short Name
              </Label>

              <Input
                id="shortName"
                placeholder="e.g. Std V"
                disabled={isSubmitting}
                {...register(
                  "shortName"
                )}
              />

              {errors.shortName && (
                <p className="text-xs text-destructive">
                  {
                    errors.shortName
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* CODE + DISPLAY ORDER */}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="code">
                Class Code *
              </Label>

              <Input
                id="code"
                placeholder="e.g. CLS5-ENG"
                disabled={isSubmitting}
                {...register("code")}
              />

              {errors.code && (
                <p className="text-xs text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="displayOrder">
                Display Order *
              </Label>

              <Input
                id="displayOrder"
                type="number"
                disabled={isSubmitting}
                {...register(
                  "displayOrder",
                  {
                    valueAsNumber:
                      true,
                  }
                )}
              />

              {errors.displayOrder && (
                <p className="text-xs text-destructive">
                  {
                    errors
                      .displayOrder
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* MEDIUM + STATUS */}

          <div className="grid grid-cols-2 gap-3">
            {/* MEDIUM */}

            <div className="space-y-1">
              <Label>
                Medium
              </Label>

              <Select
                value={
                  initialData?.medium ??
                  "ENGLISH"
                }
                onValueChange={(
                  value
                ) => {
                  setValue(
                    "medium",
                    value as
                      | "ENGLISH"
                      | "HINDI"
                      | "BOTH",
                    {
                      shouldValidate:
                        true,
                    }
                  );
                }}
                disabled={
                  isSubmitting
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Medium" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ENGLISH">
                    ENGLISH
                  </SelectItem>

                  <SelectItem value="HINDI">
                    HINDI
                  </SelectItem>

                  <SelectItem value="BOTH">
                    BOTH
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.medium && (
                <p className="text-xs text-destructive">
                  {
                    errors.medium
                      .message
                  }
                </p>
              )}
            </div>

            {/* STATUS */}

            <div className="space-y-1">
              <Label>
                Status
              </Label>

              <Select
                value={
                  initialData?.status ??
                  "ACTIVE"
                }
                onValueChange={(
                  value
                ) => {
                  setValue(
                    "status",
                    value as
                      | "ACTIVE"
                      | "INACTIVE",
                    {
                      shouldValidate:
                        true,
                    }
                  );
                }}
                disabled={
                  isSubmitting
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    ACTIVE
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    INACTIVE
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-xs text-destructive">
                  {
                    errors.status
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="space-y-1">
            <Label htmlFor="description">
              Description
            </Label>

            <Input
              id="description"
              placeholder="Optional notes or remarks"
              disabled={isSubmitting}
              {...register(
                "description"
              )}
            />

            {errors.description && (
              <p className="text-xs text-destructive">
                {
                  errors
                    .description
                    .message
                }
              </p>
            )}
          </div>

          {/* FOOTER */}

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Class"
                  : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}