// "use client";

// import { useTransition } from "react";
// import { toast } from "sonner";

// import { Switch } from "@/components/ui/switch";

// import { toggleUserStatus } from "@/features/users/actions/toggle-user-status";

// interface StatusSwitchProps {
//   userId: string;
//   checked: boolean;
  
// }

// export function StatusSwitch({
//   userId,
//   checked,
// }: StatusSwitchProps) {
//   const [pending, startTransition] = useTransition();

//   const handleChange = (value: boolean) => {
//     startTransition(async () => {
//       const result = await toggleUserStatus(
//         userId,
//         value
//       );

//       if (!result.success) {
//         toast.error("Unable to update status.");
//         return;
//       }

//       toast.success(
//         value
//           ? "User activated."
//           : "User deactivated."
//       );
//     });
//   };

//   return (
//     <Switch
//       checked={checked}
//       disabled={pending}
//       onCheckedChange={handleChange}
//     />
//   );
// }

"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

import { toggleUserStatus } from "@/features/users/actions/toggle-user-status";

interface StatusSwitchProps {
  userId: string;
  checked: boolean;
  isPrimaryAdmin: boolean; // This is correctly defined
}

// Add isPrimaryAdmin to the function parameters below:
export function StatusSwitch({
  userId,
  checked,
  isPrimaryAdmin, 
}: StatusSwitchProps) {
  const [pending, startTransition] = useTransition();

  const handleChange = (value: boolean) => {
    startTransition(async () => {
      const result = await toggleUserStatus(
        userId,
        value
      );

      if (!result.success) {
        toast.error("Unable to update status.");
        return;
      }

      toast.success(
        value
          ? "User activated."
          : "User deactivated."
      );
    });
  };

  return (
    <Switch
      checked={checked}
      disabled={pending || isPrimaryAdmin}
      onCheckedChange={handleChange}
    />
  );
}