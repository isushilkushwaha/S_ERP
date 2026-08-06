import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "../api/section.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import { CreateSectionPayload, UpdateSectionPayload } from "../types/section";
import { Status } from "../types/class";

export function useSections(classId: string, status?: Status) {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.sections(classId),
    queryFn: () => sectionApi.getByClassId(classId, status),
    enabled: Boolean(classId),
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSectionPayload) => sectionApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.sections(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.occupancy(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.detail(variables.classId) });
    },
  });
}

interface UpdateSectionParams {
  id: string;
  classId: string;
  payload: UpdateSectionPayload;
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSectionParams) => sectionApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.sections(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.occupancy(variables.classId) });
    },
  });
}

interface DeleteSectionParams {
  id: string;
  classId: string;
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteSectionParams) => sectionApi.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.sections(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.occupancy(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.detail(variables.classId) });
    },
  });
}