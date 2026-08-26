import { useState } from 'react';

export function useInstallmentPopovers() {
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});

  const setPopoverOpen = (index: number, open: boolean) => {
    setOpenPopovers((previous) => ({
      ...previous,
      [index]: open,
    }));
  };

  return {
    openPopovers,
    setOpenPopovers,
    setPopoverOpen,
  };
}