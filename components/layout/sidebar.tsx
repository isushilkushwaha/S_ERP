import Link from "next/link";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/rbac";
import { sidebarItems } from "@/config/sidebar";

export async function Sidebar() {
  const session = await auth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">
          School ERP
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {session?.user.role}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems
          .filter((item) =>
            hasPermission(session, item.permission)
          )
          .map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-100"
              >
                <Icon className="h-5 w-5" />

                <span>{item.title}</span>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}