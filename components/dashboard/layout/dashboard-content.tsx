import type { ReactNode } from "react";

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({
  children,
}: DashboardContentProps) {
  return (
    <main className="mx-auto w-full max-w-screen-2xl flex-1 p-6 lg:p-8">
      {children}
    </main>
  );
}