"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Student } from "../types/student";
import { DetailItem } from "./detail-item";

interface ParentCardProps {
  student: Student;
}

export function ParentCard({
  student,
}: ParentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem
          label="Father Name"
          value={student.fatherName}
        />

        <DetailItem
          label="Mother Name"
          value={student.motherName}
        />

        <DetailItem
          label="Guardian Name"
          value={student.guardianName}
        />

        <DetailItem
          label="Father Mobile"
          value="-"
        />

        <DetailItem
          label="Mother Mobile"
          value="-"
        />

        <DetailItem
          label="Guardian Mobile"
          value="-"
        />

        <DetailItem
          label="Father Email"
          value="-"
        />

        <DetailItem
          label="Mother Email"
          value="-"
        />

        <DetailItem
          label="Guardian Email"
          value="-"
        />
      </CardContent>
    </Card>
  );
}