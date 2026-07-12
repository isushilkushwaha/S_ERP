"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { UserWithRole } from "../types/user-with-role";

import { toggleUserStatus } from "../actions/toggle-user-status";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditUserDialog } from "./edit-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";

interface UserActionsProps {
  user: UserWithRole;
}

export function UserActions({ user }: UserActionsProps) {
  const isPrimaryAdmin =
  user.role.name === "ADMIN" &&
  user.adminType === "PRIMARY";

  const [pending, startTransition] = useTransition();

  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleToggleStatus() {
    startTransition(async () => {
      const result = await toggleUserStatus(
        user.id,
        !user.isActive
      );

      if (result.success) {
        toast.success(
          user.isActive
            ? "User deactivated"
            : "User activated"
        );
      } else {
        toast.error("Failed to update status");
      }
    });
  }

  // async function handleDelete() {
  //   // We'll connect deleteUser() in the next step
  //   toast.info("Delete action coming next.");
  // }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
  render={
    <Button
      variant="ghost"
      size="icon"
      aria-label="User Actions"
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  }
/>

        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem
            onClick={() => setEditOpen(true)}
          >
            Edit
          </DropdownMenuItem> */}

         {!isPrimaryAdmin && (
  <DropdownMenuItem
    onClick={() => setEditOpen(true)}
  >
    Edit
  </DropdownMenuItem>
)}


         <DropdownMenuItem onClick={() => setResetOpen(true)}>
      Reset Password
    </DropdownMenuItem>

          <DropdownMenuItem
            disabled={pending}
            onClick={handleToggleStatus}
          >
            {user.isActive
              ? "Deactivate"
              : "Activate"}
          </DropdownMenuItem>

          

          {!isPrimaryAdmin && (
  <DropdownMenuItem
    className="text-red-600"
    onClick={() => setDeleteOpen(true)}
  >
    Delete
  </DropdownMenuItem>
)}

        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ResetPasswordDialog
  userId={user.id}
  userName={user.fullName}
  open={resetOpen}
  onOpenChange={setResetOpen}
/>
      <DeleteUserDialog
    userId={user.id}
    userName={user.fullName}
    open={deleteOpen}
    onOpenChange={setDeleteOpen}
/>
    </>
  );
}