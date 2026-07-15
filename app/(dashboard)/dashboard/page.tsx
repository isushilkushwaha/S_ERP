import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    return <AdminDashboard  />;
  }

  return <TeacherDashboard  />;
}