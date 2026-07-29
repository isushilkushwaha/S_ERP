"use client";

import { useState } from "react";
import {
  MapPin,
  Building,
  Globe,
  Pencil,
  Hash,
  Map,
  Copy,
  Check,
} from "lucide-react";
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
import { AddressForm } from "./update/address-form";

interface AddressCardProps {
  student: Student;
}

/** Helper utility to format complete residential address string */
export function formatStudentAddress(student: Student): string | null {
  const addressParts = [
    student.addressLine1,
    student.addressLine2,
    student.city,
    student.district,
    student.state,
    student.country,
    student.postalCode,
  ].filter(Boolean);

  return addressParts.length > 0 ? addressParts.join(", ") : null;
}

export function AddressCard({ student }: AddressCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullAddress = formatStudentAddress(student);

  const handleCopyAddress = () => {
    if (!fullAddress) return;

    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    toast.success("Address copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

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
                  aria-label="Edit residential address"
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
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Residential Address
            </CardTitle>
            <p className="text-xs font-medium text-muted-foreground">
              Official correspondence and emergency contact location
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Full Address Banner with Animated Copy Button */}
        <div className="relative rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-2xs transition-all hover:border-primary/30">
          <div className="flex items-start justify-between gap-3 pr-10">
            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Full Residential Address
                </span>
                {fullAddress ? (
                  <p className="text-sm font-bold leading-relaxed text-foreground">
                    {fullAddress}
                  </p>
                ) : (
                  <p className="text-sm font-medium italic text-muted-foreground">
                    No residential address available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Copy Action */}
          {fullAddress && (
            <div className="absolute right-3 top-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg border border-primary/20 bg-background/80 text-primary shadow-2xs backdrop-blur-xs transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={handleCopyAddress}
                        aria-label="Copy full address"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 shrink-0" />
                        )}
                      </Button>
                    }
                  />
                  <TooltipContent side="left" className="text-xs font-medium">
                    {copied ? "Copied!" : "Copy Address"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Structured Address Details Header */}
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <Map className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Address Components
          </span>
        </div>

        {/* Structured Address Details Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <HighlightField
            label="Address Line 1"
            value={student.addressLine1 || "-"}
          />

          <HighlightField
            label="Address Line 2"
            value={student.addressLine2 || "-"}
          />

          <HighlightField label="City" value={student.city || "-"} />

          <HighlightField label="District" value={student.district || "-"} />

          <HighlightField label="State" value={student.state || "-"} />

          <HighlightField
            label="Postal Code"
            value={
              student.postalCode ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1 font-mono text-xs font-bold tracking-wider text-foreground border border-border shadow-2xs">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  {student.postalCode}
                </span>
              ) : (
                "-"
              )
            }
          />

          <HighlightField
            label="Country"
            value={
              student.country ? (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{student.country}</span>
                </div>
              ) : (
                "-"
              )
            }
          />
        </div>
      </CardContent>

      {/* Edit Address Information Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="relative overflow-hidden border-b border-border/80 bg-muted/20 px-6 pb-5 pt-6 text-left">
  

  <div className="flex items-center gap-3.5">
    {/* Icon Badge */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-xs">
      <MapPin className="h-5.5 w-5.5" />
    </div>

    {/* Header Content */}
    <div className="space-y-1">
      <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
        Edit Residential Address
      </DialogTitle>
      <DialogDescription className="text-xs font-medium text-muted-foreground">
        Update the official residential address and correspondence details for this student.
      </DialogDescription>
    </div>
  </div>
</DialogHeader>

          <AddressForm
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