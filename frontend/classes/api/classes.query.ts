"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getClasses,
  getClassById,
} from "./classes.api";

import type {
  Class,
  ClassListResponse,
  ClassQuery,
} from "../types/class";

export const classKeys = {
  all: ["classes"] as const,

  list: (params?: ClassQuery) =>
    [...classKeys.all, params] as const,

  detail: (id?: string) =>
    [...classKeys.all, id] as const,
};

export function useClasses(
  params?: ClassQuery
) {
  return useQuery<ClassListResponse>({
    queryKey: classKeys.list(params),

    queryFn: () => getClasses(params),
  });
}

export function useClass(
  id?: string
) {
  return useQuery<Class>({
    queryKey: classKeys.detail(id),

    queryFn: () => getClassById(id!),

    enabled: !!id,
  });
}