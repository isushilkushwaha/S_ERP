

import type { Metadata } from "next";

import { auth } from "@/auth";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";

export const metadata: Metadata = {
  title: "School Management System | Dashboard",
  description: "Manage your school operations efficiently.",
};

interface DashboardRouteLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({
  children,
}: DashboardRouteLayoutProps) {
  const session = await auth();

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}