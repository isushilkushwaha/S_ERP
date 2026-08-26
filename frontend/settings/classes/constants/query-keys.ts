// export const CLASS_QUERY_KEYS = {
//   all: ["classes"] as const,
//   lists: () => [...CLASS_QUERY_KEYS.all, "list"] as const,
//   list: (status?: string) => [...CLASS_QUERY_KEYS.lists(), { status }] as const,
//   details: () => [...CLASS_QUERY_KEYS.all, "detail"] as const,
//   detail: (id: string) => [...CLASS_QUERY_KEYS.details(), id] as const,
//   configuration: (classId: string) => [...CLASS_QUERY_KEYS.all, "configuration", classId] as const,
//   sections: (classId: string) => [...CLASS_QUERY_KEYS.all, "sections", classId] as const,
//   occupancy: (classId: string) => [...CLASS_QUERY_KEYS.all, "occupancy", classId] as const,
// };

export const CLASS_QUERY_KEYS = {
  all: ["classes"] as const,

  lists: () =>
    [...CLASS_QUERY_KEYS.all, "list"] as const,

  list: (
    academicYearId?: string,
    status?: string
  ) =>
    [
      ...CLASS_QUERY_KEYS.lists(),
      {
        academicYearId,
        status,
      },
    ] as const,

  details: () =>
    [...CLASS_QUERY_KEYS.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...CLASS_QUERY_KEYS.details(),
      id,
    ] as const,

  configuration: (
    academicYearId: string,
    classId: string
  ) =>
    [
      ...CLASS_QUERY_KEYS.all,
      "configuration",
      academicYearId,
      classId,
    ] as const,

    
  sections: (classId: string) =>
    [
      ...CLASS_QUERY_KEYS.all,
      "sections",
      classId,
    ] as const,

  occupancy: (classId: string) =>
    [
      ...CLASS_QUERY_KEYS.all,
      "occupancy",
      classId,
    ] as const,
};