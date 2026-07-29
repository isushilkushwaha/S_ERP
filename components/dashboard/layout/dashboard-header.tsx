// "use client";

// import type { Session } from "next-auth";
// import { SidebarCollapseButton } from "../sidebar/sidebar-collapse-button";
// import { DashboardBreadcrumb } from "../header/breadcrumb";
// import { NotificationMenu } from "../header/notification-menu";
// import { ThemeToggle } from "../header/theme-toggle";
// import { UserMenu } from "../header/user-menu";
// import { MobileMenuButton } from "../header/mobile-menu-button";
// import { SearchBar } from "../header/search";

// interface DashboardHeaderProps {
//   session: Session | null;
// }

// export function DashboardHeader({
//   session,
// }: DashboardHeaderProps) {
//   if (!session?.user) return null;

//   return (
//     <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
//       <div className="flex items-center gap-4">
        
//       <div className="flex items-center gap-2">

//     <MobileMenuButton />

//     <SidebarCollapseButton />

// </div>

//         <DashboardBreadcrumb />
//       </div>

//       <div className="flex items-center gap-3">
//         <SearchBar/>
//         <NotificationMenu />
//         <ThemeToggle />

//         <UserMenu
//           name={session.user.name ?? ""}
//           email={session.user.email ?? ""}
//           role={session.user.role}
//         />
//       </div>
//     </header>
//   );
// }

// "use client";

// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { UserMenu } from "../header/user-menu";

// export function DashboardHeader() {
//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-30
//         flex
//         h-16
//         items-center
//         gap-4
//         border-b
//         bg-background
//         px-6
//       "
//     >
//       <SidebarTrigger />



//       <div className="flex-1">
//         <h1 className="text-lg font-semibold">
//           School ERP
//         </h1>
//       </div>
//       <UserMenu
//          name={session.user.name ?? ""}
//           email={session.user.email ?? ""}
//            role={session.user.role}
//          />

//     </header>
//   );
// }

"use client";

import type { Session } from "next-auth";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { DashboardBreadcrumb } from "../header/breadcrumb";
import { NotificationMenu } from "../header/notification-menu";
import { SearchBar } from "../header/search";
import { ThemeToggle } from "../header/theme-toggle";
import { UserMenu } from "../header/user-menu";

interface DashboardHeaderProps {
  session: Session | null;
}

export function DashboardHeader({
  session,
}: DashboardHeaderProps) {
  if (!session?.user) return null;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          

          <SidebarTrigger />
        </div>

        <DashboardBreadcrumb />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <SearchBar />

        <NotificationMenu />

        <ThemeToggle />

        <UserMenu
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          role={session.user.role}
        />
      </div>
    </header>
  );
}