import { useQuery } from "@tanstack/react-query";

import {
  getSectionById,
  getSections,
} from "./sections.api";

export const sectionKeys = {
  all: ["sections"] as const,

  lists: () => [...sectionKeys.all, "list"] as const,

  list: (classId?: string) =>
    [...sectionKeys.lists(), classId] as const,

  details: () => [...sectionKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...sectionKeys.details(), id] as const,
};

/**
 * Get sections by class
 */
export function useSections(classId?: string) {
  return useQuery({
    queryKey: sectionKeys.list(classId),

    queryFn: () =>
      getSections({
        classId,
      }),

    enabled: !!classId,

    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get single section
 */
export function useSection(id: string) {
  return useQuery({
    queryKey: sectionKeys.detail(id),

    queryFn: () => getSectionById(id),

    enabled: !!id,

    staleTime: 5 * 60 * 1000,
  });
}