"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { RemoveStudentDialog } from "./remove-student-dialog";

export function RemoveStudentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Remove Student
      </Button>

      <RemoveStudentDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}