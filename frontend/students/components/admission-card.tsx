"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Student } from "../types/student";
import { DetailItem } from "./detail-item";

interface AdmissionCardProps {
  student: Student;
}

function getStatusVariant(status: Student["status"]) {
  switch (status) {
    case "ACTIVE":
      return "default";

    case "INACTIVE":
      return "secondary";

    case "TRANSFERRED":
      return "outline";

    case "ALUMNI":
      return "destructive";

    default:
      return "secondary";
  }
}

export function AdmissionCard({
  student,
}: AdmissionCardProps) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Admission Information
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <DetailItem
            label="Admission Number"
            value={student.admissionNumber}
          />

          <DetailItem
            label="Admission Date"
            value="-"
          />

          <DetailItem
            label="Student Code"
            value="-"
          />

          <DetailItem
            label="Status"
            value={
              <Badge
                variant={getStatusVariant(
                  student.status
                )}
              >
                {student.status}
              </Badge>
            }
          />

        </div>

      </CardContent>

    </Card>
  );
}