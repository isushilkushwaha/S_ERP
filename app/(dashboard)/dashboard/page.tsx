import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/AdminDashboard";
import { TeacherDashboard } from "@/components/TeacherDashboard";

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