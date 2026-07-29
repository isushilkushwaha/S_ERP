"use client";

import { User, Users, Hash, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Student } from "../../types";

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = [student.firstName?.[0], student.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <Card className="border-border/70 bg-card shadow-2xs">
      <CardHeader className="border-b border-border/40 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-tight">
              Verified Student Profile
            </CardTitle>
          </div>
          <Badge variant="secondary" className="font-mono text-[11px] font-semibold">
            {student.studentCode}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Main Identity Banner */}
        <div className="flex items-center gap-3.5 rounded-lg border border-border/60 bg-muted/30 p-3">
          {student.photo ? (
            <img
              src={student.photo}
              alt={fullName}
              className="h-12 w-12 rounded-full border border-background object-cover shadow-2xs shrink-0"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary">
              {initials || <User className="h-6 w-6" />}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground">
              {fullName || "Unnamed Student"}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              Official Student Record
            </p>
          </div>
        </div>

        {/* Quick Details Grid */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          <InfoTile
            icon={<Hash className="h-3.5 w-3.5" />}
            label="Student Code"
            value={student.studentCode}
            isMono
          />

          <InfoTile
            icon={<User className="h-3.5 w-3.5" />}
            label="Full Name"
            value={fullName}
          />

          <InfoTile
            icon={<Users className="h-3.5 w-3.5" />}
            label="Father's Name"
            value={student.fatherName}
          />

          <InfoTile
            icon={<Users className="h-3.5 w-3.5" />}
            label="Mother's Name"
            value={student.motherName}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  isMono?: boolean;
}

function InfoTile({ icon, label, value, isMono = false }: InfoTileProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border/50 bg-background/50 p-2.5 transition-colors">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-muted-foreground">
          {label}
        </span>

        <span
          className={`truncate text-xs font-semibold text-foreground ${
            isMono ? "font-mono" : ""
          }`}
        >
          {value || "-"}
        </span>
      </div>
    </div>
  );
}