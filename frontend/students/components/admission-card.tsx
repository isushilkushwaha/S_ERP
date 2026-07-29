"use client";

import { useState } from "react";
import { Building2, Copy, Check, FileBadge, Pencil } from "lucide-react";
import { toast } from "sonner";

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
import { RegistrationForm } from "./update/registration-form";

interface RegistrationCardProps {
  student: Student;
}

export function RegistrationCard({ student }: RegistrationCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleCopy = (
    text: string | null | undefined,
    fieldName: string,
    label: string
  ) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const registrationFields = [
    {
      key: "studentCode",
      label: "Student Code",
      value: student.studentCode,
      highlight: true,
    },
    {
      key: "emisNumber",
      label: "EMIS Number",
      value: student.emisNumber,
      highlight: false,
    },
    {
      key: "apaarId",
      label: "APAAR ID",
      value: student.apaarId,
      highlight: false,
    },
    {
      key: "penNumber",
      label: "PEN Number",
      value: student.penNumber,
      highlight: false,
    },
  ];

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
                  aria-label="Edit registration details"
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
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Academic & Government Identifiers
            </CardTitle>

            <p className="text-xs font-medium text-muted-foreground">
              Official school registration and statutory identity numbers
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {registrationFields.map((field) => {
            const hasValue = Boolean(field.value && field.value !== "-");
            const isCopied = copiedField === field.key;

            return (
              <div
                key={field.key}
                className={`group relative flex flex-col justify-between rounded-lg border p-3.5 shadow-2xs transition-all hover:border-border ${
                  field.highlight
                    ? "border-primary/40 bg-primary/10 hover:bg-primary/15"
                    : "border-border/70 bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">
                    {field.label}
                  </span>

                  {hasValue && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md text-muted-foreground hover:bg-background/80 hover:text-foreground"
                              onClick={() =>
                                handleCopy(field.value, field.key, field.label)
                              }
                              aria-label={`Copy ${field.label}`}
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          }
                        />
                        <TooltipContent side="top" className="text-xs font-medium">
                          {isCopied ? "Copied!" : `Copy ${field.label}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <FileBadge
                    className={`h-4 w-4 shrink-0 ${
                      field.highlight
                        ? "text-primary"
                        : "text-muted-foreground/70"
                    }`}
                  />

                  <span
                    className={`font-mono text-sm font-bold tracking-wider ${
                      hasValue
                        ? "text-foreground"
                        : "text-muted-foreground/60 italic font-normal"
                    }`}
                  >
                    {field.value || "Not Assigned"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Edit Dialog Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="relative overflow-hidden border-b border-border/80 bg-muted/20 px-6 pb-5 pt-6 text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-xs">
                <Building2 className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                  Edit Registration Identifiers
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground">
                  Update student code, EMIS number, APAAR ID, and PEN numbers.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <RegistrationForm
            student={student}
            onCancel={() => setOpen(false)}
            onSubmitSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}