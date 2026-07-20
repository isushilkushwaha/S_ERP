"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Student } from "../types/student";

interface StudentHeaderProps {
  student: Student;
  onDelete?: () => void;
}

const STATUS_VARIANT: Record<
  Student["status"],
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  TRANSFERRED: "secondary",
  ALUMNI: "secondary",
};

export function StudentHeader({
  student,
  onDelete,
}: StudentHeaderProps) {
  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}

        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">
                {fullName}
              </h1>

              <Badge variant={STATUS_VARIANT[student.status]}>
                {student.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Admission No :{" "}
              <span className="font-medium text-foreground">
                {student.admissionNumber}
              </span>
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-2">

  <Link href="/students">
    <Button variant="outline">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  </Link>

  <Link href={`/students/${student.id}/edit`}>
    <Button>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </Button>
  </Link>

  <Button
    variant="destructive"
    onClick={onDelete}
  >
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
  </Button>

</div>
      </CardContent>
    </Card>
  );
}