"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface SidebarContextValue {
  collapsed: boolean;
  expanded: boolean;
  mobileOpen: boolean;
  isMobile: boolean;

  toggleSidebar: () => void;
  collapse: () => void;
  expand: () => void;

  toggleMobile: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export const SidebarContext =
  createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
}

const MOBILE_BREAKPOINT = 1024;

export function SidebarProvider({
  children,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth < MOBILE_BREAKPOINT;

      setIsMobile(mobile);

      if (!mobile) {
        setMobileOpen(false);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      collapsed,

      expanded: !collapsed,

      mobileOpen,

      isMobile,

      toggleSidebar,

      collapse,

      expand,

      toggleMobile,

      openMobile,

      closeMobile,
    }),
    [
      collapsed,
      mobileOpen,
      isMobile,
      toggleSidebar,
      collapse,
      expand,
      toggleMobile,
      openMobile,
      closeMobile,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}