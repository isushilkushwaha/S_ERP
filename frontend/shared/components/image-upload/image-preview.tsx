// frontend/shared/components/image-preview.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "avatar";
}

const sizeClasses = {
  sm: "h-28 w-28 rounded-xl",
  md: "h-36 w-36 rounded-xl",
  lg: "h-48 w-48 rounded-2xl",
  avatar: "h-28 w-28 rounded-full",
};

const dimensionMap = {
  sm: 112,
  md: 144,
  lg: 192,
  avatar: 112,
};

export function ImagePreview({
  src,
  alt = "Image Preview",
  className,
  size = "md",
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  if (src !== currentSrc) {
    setCurrentSrc(src);
    setImageError(false);
  }

  // 👈 Sanitize and format the image source safely for Next.js
  let formattedSrc: string | undefined = undefined;
  if (src && typeof src === "string" && src.trim() !== "") {
    const trimmed = src.trim();
    formattedSrc = trimmed.startsWith("http") || trimmed.startsWith("/")
      ? trimmed
      : `/${trimmed}`;
  }

  const hasImage = Boolean(formattedSrc) && !imageError;
  const dimension = dimensionMap[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border-2 border-dashed border-border/70 bg-muted/30 shadow-xs transition-all duration-200 hover:border-border",
        sizeClasses[size],
        className
      )}
    >
      {hasImage && formattedSrc ? (
        <div className="relative w-full h-full">
          <Image
            src={formattedSrc}
            alt={alt}
            width={dimension}
            height={dimension}
            unoptimized // 👈 Essential for local dynamic public folder uploads
            className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center text-muted-foreground">
          {imageError ? (
            <>
              <AlertCircle className="h-6 w-6 text-destructive/80" />
              <span className="text-[11px] font-medium text-destructive/90 leading-tight">
                Failed to load
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7 text-muted-foreground/60 stroke-1" />
              <span className="text-[11px] font-medium text-muted-foreground/80 leading-tight">
                No preview
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}