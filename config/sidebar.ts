import { LayoutDashboard, Users, CreditCard, CalendarCheck, FileText, MessageSquare, Settings, UserCog, ShieldCheck, User } from "lucide-react";
import { PERMISSIONS } from "@/lib/permissions";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: PERMISSIONS.DASHBOARD,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    permission: PERMISSIONS.STUDENTS_VIEW,
  },
  {
    title: "Fees",
    href: "/fees",
    icon: CreditCard,
    permission: PERMISSIONS.FEES,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    permission: PERMISSIONS.ATTENDANCE,
  },
  {
    title: "Examination",
    href: "/examination",
    icon: FileText,
    permission: PERMISSIONS.EXAMINATION,
  },
  {
    title: "SMS",
    href: "/sms",
    icon: MessageSquare,
    permission: PERMISSIONS.SMS,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS,
  },
  {
    title: "Users",
    href: "/users",
    icon: UserCog,
    permission: PERMISSIONS.USERS,
  },
  {
    title: "Roles",
    href: "/roles",
    icon: ShieldCheck,
    permission: PERMISSIONS.ROLES,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    permission: PERMISSIONS.PROFILE,
  },
];