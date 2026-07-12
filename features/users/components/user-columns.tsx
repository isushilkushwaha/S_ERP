    // "use client";

    // import { ColumnDef } from "@tanstack/react-table";
    // import { Badge } from "@/components/ui/badge";

    // import { formatDateTime } from "@/lib/date";

    // import { UserWithRole } from "../types/user-with-role";
    // import { UserActions } from "./user-actions";

    // export const columns: ColumnDef<UserWithRole>[] = [
    // {
    //     accessorKey: "fullName",
    //     header: "Name",
    // },

    // {
    //     accessorKey: "email",
    //     header: "Email",
    // },

    // {
    //     accessorKey: "username",
    //     header: "Username",
    // },

    // {
    //     accessorKey: "role.name",
    //     header: "Role",
    //     cell: ({ row }) => (
    //     <Badge variant="secondary">
    //         {row.original.role.name}
    //     </Badge>
    //     ),
    // },

    // {
    //     accessorKey: "isActive",
    //     header: "Status",

    //     cell: ({ row }) => (
    //     row.original.isActive ? (
    //         <Badge>Active</Badge>
    //     ) : (
    //         <Badge variant="destructive">
    //         Inactive
    //         </Badge>
    //     )
    //     ),
    // },

    // {
    //     accessorKey: "lastLoginAt",
    //     header: "Last Login",

    //     cell: ({ row }) => (
    //     <span>
    //         {formatDateTime(row.original.lastLoginAt)}
    //     </span>
    //     ),
    // },

    // {
    //     id: "actions",

    //     cell: ({ row }) => (
    //     <UserActions user={row.original} />
    //     ),
    // },
    // ];


    "use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { formatDateTime } from "@/lib/date";

import { UserWithRole } from "../types/user-with-role";
import { StatusSwitch } from "./status-switch";
import { UserActions } from "./user-actions";

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "username",
    header: "Username",
  },

  {
    accessorKey: "role.name",
    header: "Role",

    cell: ({ row }) => {
      const role = row.original.role.name;

      return (
        <Badge
          variant={
            role === "ADMIN"
              ? "default"
              : "secondary"
          }
        >
          {role}
        </Badge>
      );
    },
  },

  {
    accessorKey: "adminType",
    header: "Admin",

    cell: ({ row }) => {
      if (row.original.role.name !== "ADMIN") {
        return (
          <span className="text-muted-foreground">
            —
          </span>
        );
      }

      return (
        <Badge
          variant={
            row.original.adminType === "PRIMARY"
              ? "default"
              : "outline"
          }
        >
          {row.original.adminType}
        </Badge>
      );
    },
  },

  {
    accessorKey: "isActive",
    header: "Status",

    cell: ({ row }) => (
      <StatusSwitch
        userId={row.original.id}
        checked={row.original.isActive}
        isPrimaryAdmin={
          row.original.role.name === "ADMIN" &&
          row.original.adminType === "PRIMARY"
        }
      />
    ),
  },

  {
    accessorKey: "lastLoginAt",
    header: "Last Login",

    cell: ({ row }) => {
      const value = row.original.lastLoginAt;

      if (!value) {
        return (
          <span className="text-muted-foreground">
            Never
          </span>
        );
      }

      return formatDateTime(value);
    },
  },

  {
    id: "actions",
    header: "",

    cell: ({ row }) => (
      <UserActions
        user={row.original}
      />
    ),
  },
];