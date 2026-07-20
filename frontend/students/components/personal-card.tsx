"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Student } from "../types/student";
import { DetailItem } from "./detail-item";

interface PersonalCardProps {
  student: Student;
}

export function PersonalCard({
  student,
}: PersonalCardProps) {
  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DetailItem
          label="Full Name"
          value={fullName}
        />

        <DetailItem
          label="First Name"
          value={student.firstName}
        />

        <DetailItem
          label="Middle Name"
          value={student.middleName}
        />

        <DetailItem
          label="Last Name"
          value={student.lastName}
        />

        <DetailItem
          label="Gender"
          value={student.gender}
        />

        <DetailItem
          label="Date of Birth"
          value={student.dateOfBirth}
        />

        <DetailItem
          label="Mobile Number"
          value={student.mobileNumber}
        />

        <DetailItem
          label="Email"
          value={student.email}
        />

        <DetailItem
          label="Status"
          value={student.status}
        />
      </CardContent>
    </Card>
  );
}