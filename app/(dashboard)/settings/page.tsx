import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/permissions";

export default async function SettingsPage() {
  const session = await auth();

  if (!hasPermission(session, PERMISSIONS.SETTINGS)) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
}