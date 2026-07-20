import {
  Bell,
  BookOpen,
  GraduationCap,
  Home,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { NavigationItem } from "./navigation-types";

export const navigation: readonly NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  // {
  //   id: "students",
  //   title: "Students",
  //   href: "/students",
  //   icon: GraduationCap,
  //   permission: PERMISSIONS.STUDENTS_VIEW,
  // },

  {
  id: "students",
  title: "Students",
  href: "/students",
  icon: GraduationCap,
  permission: PERMISSIONS.STUDENTS_VIEW,
  children: [
    {
      id: "student-registration",
      title: "Registration",
      href: "/students/registration",
      icon: GraduationCap,
      permission: PERMISSIONS.STUDENTS_CREATE,
    },
    {
      id: "student-list",
      title: "All Students",
      href: "/students",
      icon: GraduationCap,
      permission: PERMISSIONS.STUDENTS_VIEW,
    },
    {
      id: "student-enrollments",
      title: "Academic Enrollment",
      href: "/students/enrollments",
      icon: GraduationCap,
      permission: PERMISSIONS.STUDENT_ENROLLMENTS_VIEW,
    },
  ],
}
,

   
  {
    id: "student-enrollments",
    title: "Student Enrollments",
    href: "/student-enrollments",
    icon: GraduationCap,
    permission: PERMISSIONS.STUDENT_ENROLLMENTS_VIEW,
  },



  {
    id: "fees",
    title: "Fees",
    href: "/fees",
    icon: Wallet,
    permission: PERMISSIONS.FEES_VIEW,
  },
  {
    id: "attendance",
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: Users,
    permission: PERMISSIONS.ATTENDANCE_VIEW,
  },
  {
    id: "examination",
    title: "Examination",
    href: "/dashboard/examination",
    icon: BookOpen,
    permission: PERMISSIONS.EXAMINATION_VIEW,
  },
  {
    id: "sms",
    title: "SMS",
    href: "/dashboard/sms",
    icon: Bell,
    permission: PERMISSIONS.SMS_VIEW,
  },
  {
    id: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_VIEW,
  },
  {
    id: "users",
    title: "Users",
    href: "/users",
    icon: Users,
    permission: PERMISSIONS.USERS_VIEW,
  },
] as const;