"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/frontend/shared/services";

import { ImageActions } from "./image-actions";
import { ImageDropzone } from "./image-dropzone";
import { ImagePreview } from "./image-preview";
import { ImageProgress } from "./image-progress";

import type { ImageUploadProps } from "./image-upload.types";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function ImageUpload({
  value,
  onChange,
  uploadUrl,
  label,
  description,
  accept = "image/png,image/jpeg,image/webp",
  disabled,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileSelect(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file format", {
        description: "Only PNG, JPG, and WEBP images are allowed.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Image size must not exceed 2 MB.",
      });
      return;
    }

    let progressTimer: NodeJS.Timeout | null = null;

    try {
      setLoading(true);
      setProgress(20);

      progressTimer = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const result = await uploadFile(file, uploadUrl);

      if (progressTimer) clearInterval(progressTimer);
      setProgress(100);

      onChange(result.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      if (progressTimer) clearInterval(progressTimer);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 300);
    }
  }

  function handleUploadClick() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  function handleRemove() {
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    toast.info("Image removed");
  }

  const isInteractionDisabled = disabled || loading;

  return (
    <div className="space-y-1.5 max-w-md">
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <h4 className="text-xs font-semibold text-foreground">{label}</h4>
          )}
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Ultra-compact container with reduced padding */}
      <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card p-2 shadow-2xs">
        {/* Small 80x80 Preview */}
        <ImagePreview
          src={value}
          alt={label || "Uploaded Image"}
          size="sm"
          className="h-20 w-20 shrink-0"
        />

        {/* Compact Right Controls */}
        <div className="flex flex-1 flex-col justify-center space-y-1.5 min-w-0">
          <ImageDropzone
            inputRef={inputRef}
            accept={accept}
            disabled={isInteractionDisabled}
            onFileSelect={handleFileSelect}
          />

          {progress > 0 && <ImageProgress progress={progress} />}

          <ImageActions
            hasImage={Boolean(value)}
            loading={loading}
            disabled={disabled}
            onUpload={handleUploadClick}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}