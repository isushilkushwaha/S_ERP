"use client";

import { useTransition } from "react";
import { LogOut, User } from "lucide-react";

import { logout } from "@/features/authentication/actions/logout";

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
}

export function UserMenu({
  name,
  email,
  role,
}: UserMenuProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-semibold">{name}</p>

        <p className="text-sm text-gray-500">
          {email}
        </p>

        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {role}
        </span>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
        <User className="h-5 w-5" />
      </div>

      <button
        onClick={() => startTransition(() => logout())}
        disabled={pending}
        className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        <LogOut className="h-4 w-4" />

        {pending ? "Signing Out..." : "Logout"}
      </button>
    </div>
  );
}