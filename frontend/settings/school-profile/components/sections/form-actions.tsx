"use client";

import { Loader2, RotateCcw, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
  mode: "create" | "update";
  isSubmitting?: boolean;
  onReset: () => void;
  onCancel?: () => void;
}

export function FormActions({
  mode,
  isSubmitting = false,
  onReset,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={isSubmitting}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>

      <div className="flex gap-3">
        {mode === "update" && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === "create"
                ? "Create School Profile"
                : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}