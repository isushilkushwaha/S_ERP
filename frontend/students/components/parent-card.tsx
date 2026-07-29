"use client";

import { useState } from "react";
import { Users, Phone, Mail, UserCheck, Shield, Pencil, Briefcase, HeartHandshake } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Student } from "../types/student";
import { ParentForm } from "./update/parent-form";

interface ParentCardProps {
  student: Student;
}

export function ParentCard({ student }: ParentCardProps) {
  const [open, setOpen] = useState(false);

  const hasGuardian = Boolean(
    student.guardianName ||
      student.guardianRelation ||
      student.guardianMobile ||
      student.guardianEmail
  );

  return (
    <Card className="relative overflow-hidden border border-border bg-card text-card-foreground shadow-md transition-all">
      

      {/* Top Right Action: Pencil Icon Button with Tooltip */}
      <div className="absolute right-3 top-4 z-10 sm:right-5 sm:top-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border bg-background shadow-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setOpen(true)}
                  aria-label="Edit parent and guardian information"
                >
                  <Pencil className="h-4 w-4 shrink-0 text-foreground" />
                </Button>
              }
            />
            <TooltipContent side="left" className="text-xs font-medium">
              Edit Information
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Card Header */}
      <CardHeader className="border-b border-border/80 bg-muted/20 pb-5 pr-14">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30 shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Parent & Guardian Information
            </CardTitle>
            <p className="text-xs font-medium text-muted-foreground">
              Primary contacts, family details, and emergency communication
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Father Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Father Details
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HighlightField
              label="Father Name"
              value={student.fatherName || "-"}
            />

            <HighlightField
              label="Father Occupation"
              value={
                student.fatherOccupation ? (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{student.fatherOccupation}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField
              label="Father Mobile"
              value={
                student.fatherMobile ? (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{student.fatherMobile}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField
              label="Father Email"
              value={
                student.fatherEmail ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{student.fatherEmail}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </section>

        {/* Mother Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Mother Details
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HighlightField
              label="Mother Name"
              value={student.motherName || "-"}
            />

            <HighlightField
              label="Mother Occupation"
              value={
                student.motherOccupation ? (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{student.motherOccupation}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField
              label="Mother Mobile"
              value={
                student.motherMobile ? (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{student.motherMobile}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />

            <HighlightField
              label="Mother Email"
              value={
                student.motherEmail ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{student.motherEmail}</span>
                  </div>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </section>

        {/* Guardian Information */}
        {hasGuardian && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                Guardian Details
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <HighlightField
                label="Guardian Name"
                value={student.guardianName || "-"}
              />

              <HighlightField
                label="Guardian Relation"
                value={
                  student.guardianRelation ? (
                    <div className="flex items-center gap-1.5">
                      <HeartHandshake className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>{student.guardianRelation}</span>
                    </div>
                  ) : (
                    "-"
                  )
                }
              />

              <HighlightField
                label="Guardian Mobile"
                value={
                  student.guardianMobile ? (
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{student.guardianMobile}</span>
                    </div>
                  ) : (
                    "-"
                  )
                }
              />

              <HighlightField
                label="Guardian Email"
                value={
                  student.guardianEmail ? (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{student.guardianEmail}</span>
                    </div>
                  ) : (
                    "-"
                  )
                }
              />
            </div>
          </section>
        )}
      </CardContent>

      {/* Edit Parent & Guardian Information Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="relative overflow-hidden border-b border-border/80 bg-muted/20 px-6 pb-5 pt-6 text-left">
  

  <div className="flex items-center gap-3.5">
    {/* Icon Badge */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-xs">
      <Users className="h-5.5 w-5.5" />
    </div>

    {/* Header Content */}
    <div className="space-y-1">
      <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
        Edit Parent & Guardian Information
      </DialogTitle>
      <DialogDescription className="text-xs font-medium text-muted-foreground">
        Update family contact information, occupations, and emergency guardian details.
      </DialogDescription>
    </div>
  </div>
</DialogHeader>

          <ParentForm
            student={student}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/**
 * Reusable High-Visibility Detail Box Component
 */
function HighlightField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border/70 bg-muted/30 p-3 shadow-2xs transition-all hover:border-border hover:bg-muted/50">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">
        {label}
      </span>
      <div className="mt-1 text-sm font-bold text-foreground">
        {value}
      </div>
    </div>
  );
}