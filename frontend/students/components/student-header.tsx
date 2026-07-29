

"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Mail, Pencil, Phone, Calendar, User } from "lucide-react";
import { toast } from "sonner";

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

import { ProfileForm } from "./update/profile-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ProfileAvatar } from "./student-header/profile-avatar";
import { useUploadStudentPhoto } from "../hooks/use-upload-student-photo";
import type { Student } from "../types/student";

interface StudentHeaderProps {
  student: Student;
  onEditProfile?: () => void;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const uploadPhotoMutation = useUploadStudentPhoto(student.id);

  const [open, setOpen] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  useEffect(() => {
    return () => {
      if (previewPhoto?.startsWith("blob:")) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, [previewPhoto]);

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

  const registrationDate = student.registrationDate
    ? new Date(student.registrationDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const handleSelectPhoto = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 2 MB.");

      event.target.value = "";
      return;
    }

    if (previewPhoto?.startsWith("blob:")) {
      URL.revokeObjectURL(previewPhoto);
    }

    const imageUrl = URL.createObjectURL(file);

    setPreviewPhoto(imageUrl);

    uploadPhotoMutation.mutate(file, {
      onSuccess: (response) => {
        setPreviewPhoto(response.data.photo);
        toast.success("Profile photo updated successfully.");
      },

      onError: (error) => {
        setPreviewPhoto(null);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to upload photo."
        );
      },
    });
  };

  return (
    <Card className="relative overflow-hidden border-border/60 bg-gradient-to-r from-card via-card to-muted/20 shadow-sm">
      <CardContent className="p-6">
        {/* Top Right Action: Pencil Icon Button with Tooltip */}
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-border/60 bg-background/80 shadow-xs backdrop-blur-xs transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setOpen(true)}
                    aria-label="Edit Information"
                  >
                    <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Button>
                }
              />
              <TooltipContent side="left" className="text-xs">
                Edit Information
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Avatar & Main Details */}
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <ProfileAvatar
              photo={previewPhoto ?? student.photo}
              fullName={fullName}
              initials={initials}
              inputRef={inputRef}
              onSelectPhoto={handleSelectPhoto}
              uploading={uploadPhotoMutation.isPending}
            />

            {/* Information */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {fullName}
                </h1>

                <Badge variant="secondary" className="font-mono text-xs">
                  {student.studentCode}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Registered: {registrationDate}</span>
                </div>
              </div>

              {/* Contact Quick Info */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                {student.mobile && (
                  <div className="flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>{student.mobile}</span>
                  </div>
                )}

                {student.email && (
                  <div className="flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>{student.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-2xl">
          
          <DialogHeader className="relative overflow-hidden border-b border-border/80 bg-muted/20 px-6 pb-5 pt-6 text-left">
  <div className="flex items-center gap-3.5">
    {/* Icon Badge */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-xs">
      <User className="h-5.5 w-5.5" />
    </div>

    {/* Header Content */}
    <div className="space-y-1">
      <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
        Edit Profile
      </DialogTitle>
      <DialogDescription className="text-xs font-medium text-muted-foreground">
        Update student's basic profile information and primary contact details.
      </DialogDescription>
    </div>
  </div>
</DialogHeader>

          <ProfileForm
            student={student}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}