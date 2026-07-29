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

  {
    id: "students",
    title: "Student Registration  ",
    icon: GraduationCap,
    permission: PERMISSIONS.STUDENTS_VIEW,
    children: [
      
      {
        id: "student-list",
        title: "Registered Students",
        href: "/students",
        permission: PERMISSIONS.STUDENTS_VIEW,
      },
      {
        id: "student-registration",
        title: "Registration form",
        href: "/students/registration",
        permission: PERMISSIONS.STUDENTS_CREATE,
      },

      // {
      //   id: "student-documents",
      //   title: "Student Documents",
      //   href: "/student-documents",
      //   permission: PERMISSIONS.STUDENTS_VIEW,
      // },
    ],
  },

  {
    id: "admissions",
    title: "Admissions",
    icon: Users,
    permission: PERMISSIONS.STUDENT_ENROLLMENTS_VIEW,
    children: [
      {
        id: "new-admission",
        title: "New Admission",
        href: "/student-enrollments/create",
        permission: PERMISSIONS.STUDENT_ENROLLMENTS_CREATE,
      },
      {
        id: "all-admissions",
        title: "All Admissions",
        href: "/student-enrollments",
        permission: PERMISSIONS.STUDENT_ENROLLMENTS_VIEW,
      },
    ],
  },

  {
    id: "fees",
    title: "Fees",
    icon: Wallet,
    permission: PERMISSIONS.FEES_VIEW,
    children: [
      {
        id: "fee-collection",
        title: "Fee Collection",
        href: "/fees",
        permission: PERMISSIONS.FEES_VIEW,
      },
      {
        id: "fee-structure",
        title: "Fee Structure",
        href: "/fees/structure",
        permission: PERMISSIONS.FEES_VIEW,
      },
      {
        id: "fee-receipts",
        title: "Fee Receipts",
        href: "/fees/receipts",
        permission: PERMISSIONS.FEES_VIEW,
      },
    ],
  },

  {
    id: "attendance",
    title: "Attendance",
    icon: Users,
    permission: PERMISSIONS.ATTENDANCE_VIEW,
    children: [
      {
        id: "mark-attendance",
        title: "Mark Attendance",
        href: "/attendance",
        permission: PERMISSIONS.ATTENDANCE_VIEW,
      },
      {
        id: "attendance-report",
        title: "Attendance Report",
        href: "/attendance/reports",
        permission: PERMISSIONS.ATTENDANCE_VIEW,
      },
    ],
  },

  {
    id: "examination",
    title: "Examination",
    icon: BookOpen,
    permission: PERMISSIONS.EXAMINATION_VIEW,
    children: [
      {
        id: "marks-entry",
        title: "Marks Entry",
        href: "/examination/marks",
        permission: PERMISSIONS.EXAMINATION_VIEW,
      },
      {
        id: "results",
        title: "Results",
        href: "/examination/results",
        permission: PERMISSIONS.EXAMINATION_VIEW,
      },
      {
        id: "report-cards",
        title: "Report Cards",
        href: "/examination/report-cards",
        permission: PERMISSIONS.EXAMINATION_VIEW,
      },
    ],
  },

  {
    id: "sms",
    title: "SMS",
    icon: Bell,
    permission: PERMISSIONS.SMS_VIEW,
    children: [
      {
        id: "send-sms",
        title: "Send SMS",
        href: "/sms/send",
        permission: PERMISSIONS.SMS_VIEW,
      },
      {
        id: "bulk-sms",
        title: "Bulk SMS",
        href: "/sms/bulk",
        permission: PERMISSIONS.SMS_VIEW,
      },
      {
        id: "templates",
        title: "Templates",
        href: "/sms/templates",
        permission: PERMISSIONS.SMS_VIEW,
      },
    ],
  },

  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_VIEW,
    children: [
      {
        id: "school-profile",
        title: "School Profile",
        href: "/settings/school-profile",
        permission: PERMISSIONS.SETTINGS_VIEW,
      },
      {
        id: "academic-year",
        title: "Academic Year",
        href: "/academic-years",
        permission: PERMISSIONS.SETTINGS_VIEW,
      },
      {
        id: "users",
        title: "Users",
        href: "/users",
        permission: PERMISSIONS.USERS_VIEW,
      },
      {
        id: "roles",
        title: "Roles",
        href: "/roles",
        permission: PERMISSIONS.USERS_VIEW,
      },
    ],
  },
] as const;