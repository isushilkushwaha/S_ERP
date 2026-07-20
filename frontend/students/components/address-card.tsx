"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Student } from "../types/student";
import { DetailItem } from "./detail-item";

interface AddressCardProps {
  student: Student;
}

export function AddressCard({
  student,
}: AddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailItem
          label="Address"
          value={student.addressLine1}
          className="md:col-span-2"
        />

        {/* Placeholder fields until backend supports them */}

        <DetailItem
          label="Address Line 2"
          value="-"
        />

        <DetailItem
          label="City"
          value="-"
        />

        <DetailItem
          label="District"
          value="-"
        />

        <DetailItem
          label="State"
          value="-"
        />

        <DetailItem
          label="Country"
          value="-"
        />

        <DetailItem
          label="Postal Code"
          value="-"
        />
      </CardContent>
    </Card>
  );
}