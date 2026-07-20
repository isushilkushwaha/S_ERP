"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;

  isEdit: boolean;
}

export function FormActions({
  isSubmitting,
  isEdit,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}

        {isEdit
          ? "Update Student"
          : "Create Student"}
      </Button>
    </div>
  );
}