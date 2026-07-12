"use client";

import { useMemo, useState } from "react";

import { UserWithRole } from "../types/user-with-role";

import { UserToolbar } from "./user-toolbar";
import { UserTable } from "./user-table";
import { AddUserDialog } from "./add-user-dialog";

interface UsersClientProps {
  users: UserWithRole[];
}

export function UsersClient({
  users,
}: UsersClientProps) {
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.role.name.toLowerCase().includes(query)
    );
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-muted-foreground">
          Manage administrators and teachers.
        </p>
      </div>

      <UserToolbar
        search={search}
        onSearchChange={setSearch}
        onAddUser={() => setOpen(true)}
      />

      <UserTable
        data={filteredUsers}
      />

      <AddUserDialog
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}