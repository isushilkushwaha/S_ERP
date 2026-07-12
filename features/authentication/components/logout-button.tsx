"use client";

import { useTransition } from "react";
import { logout } from "@/features/authentication/actions/logout";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={pending}
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}