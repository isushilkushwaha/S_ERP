"use client";

import { useCallback, useState } from "react";

export function useRemoveStudentDialog() {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleDialog = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
}