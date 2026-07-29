"use client";

import {
  Loader2,
  RefreshCcw,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageActionsProps {
  hasImage: boolean;

  loading: boolean;

  disabled?: boolean;

  onUpload: () => void;

  onRemove: () => void;
}

export function ImageActions({
  hasImage,
  loading,
  disabled,
  onUpload,
  onRemove,
}: ImageActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || loading}
        onClick={onUpload}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Uploading...
          </>
        ) : hasImage ? (
          <>
            <RefreshCcw className="mr-2 size-4" />
            Replace
          </>
        ) : (
          <>
            <Upload className="mr-2 size-4" />
            Upload Image
          </>
        )}
      </Button>

      {hasImage && (
        <Button
          type="button"
          variant="destructive"
          disabled={disabled || loading}
          onClick={onRemove}
        >
          <Trash2 className="mr-2 size-4" />
          Remove
        </Button>
      )}
    </div>
  );
}