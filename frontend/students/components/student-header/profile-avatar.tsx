"use client";

import type { RefObject, ChangeEvent } from "react";
import { Camera, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProfileAvatarProps {
  photo?: string | null;
  fullName: string;
  initials: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onSelectPhoto: (event: ChangeEvent<HTMLInputElement>) => void;
  uploading?: boolean;
}

export function ProfileAvatar({
  photo,
  fullName,
  initials,
  inputRef,
  onSelectPhoto,
  uploading = false,
}: ProfileAvatarProps) {
  return (
    <div className="relative group">
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={onSelectPhoto}
      />

      {/* Avatar Display */}
      <div className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-md ring-2 ring-primary/20">
        {photo ? (
          <img
            src={photo}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
            {initials || <User className="h-10 w-10 text-muted-foreground" />}
          </div>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Camera Trigger Button */}
      <Button
        type="button"
        size="icon"
        variant="secondary"
        disabled={uploading}
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full border border-background shadow-sm hover:bg-secondary"
        onClick={() => inputRef.current?.click()}
        title="Upload photo"
      >
        <Camera className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}