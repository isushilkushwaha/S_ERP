// "use client";

// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import type { AcademicYear } from "@/frontend/settings/academic-years";
// import { useActivateAcademicYear } from "@/frontend/settings/academic-years/hooks";

// interface ActivateDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   academicYear: AcademicYear;
// }

// export function ActivateAcademicYearDialog({
//   open,
//   onOpenChange,
//   academicYear,
// }: ActivateDialogProps) {
//   const mutation = useActivateAcademicYear();

//   const handleActivate = async () => {
//     try {
//       await mutation.mutateAsync(academicYear.id);

//       toast.success(
//         `"${academicYear.name}" has been activated successfully.`
//       );

//       onOpenChange(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Unable to activate the academic year. Please try again."
//       );
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Activate Academic Year</AlertDialogTitle>

//           <AlertDialogDescription>
//             Are you sure you want to activate{" "}
//             <strong>{academicYear.name}</strong>?
//             <br />
//             <br />
//             <strong>What will happen?</strong>
//             <ul className="mt-2 list-disc space-y-1 pl-5">
//               <li>This academic year will become the active session.</li>
//               <li>
//                 The currently active academic year will be archived
//                 automatically.
//               </li>
//               <li>
//                 New admissions, attendance, fees, examinations, and other
//                 records will use this academic year by default.
//               </li>
//             </ul>
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={mutation.isPending}>
//             Cancel
//           </AlertDialogCancel>

//           <AlertDialogAction
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleActivate();
//             }}
//             disabled={mutation.isPending}
//           >
//             {mutation.isPending ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Activating...
//               </>
//             ) : (
//               "Activate"
//             )}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import type { AcademicYear } from "@/frontend/settings/academic-years";
import { useActivateAcademicYear } from "@/frontend/settings/academic-years/hooks";

interface ActivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear: AcademicYear;
}

export function ActivateAcademicYearDialog({
  open,
  onOpenChange,
  academicYear,
}: ActivateDialogProps) {
  const mutation = useActivateAcademicYear();

  const handleActivate = async () => {
    try {
      await mutation.mutateAsync(academicYear.id);

      toast.success(
        `"${academicYear.name}" has been activated successfully.`
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to activate the academic year. Please try again."
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate Academic Year</AlertDialogTitle>

          {/* Render plain description in text format */}
          <AlertDialogDescription>
            Are you sure you want to activate <strong>{academicYear.name}</strong>?
          </AlertDialogDescription>

          {/* Move block content (ul/div) outside of AlertDialogDescription to fix hydration */}
          <div className="text-sm text-muted-foreground pt-2">
            <span className="font-semibold text-foreground">What will happen?</span>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>This academic year will become the active session.</li>
              <li>
                The currently active academic year will be archived
                automatically.
              </li>
              <li>
                New admissions, attendance, fees, examinations, and other
                records will use this academic year by default.
              </li>
            </ul>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleActivate();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              "Activate"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}