export const schoolProfileQueryKeys = {
  all: ["school-profile"] as const,

  detail: () => [...schoolProfileQueryKeys.all, "detail"] as const,
};