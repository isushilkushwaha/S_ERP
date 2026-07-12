import { format } from "date-fns";

export function formatDateTime(
  date: Date | string | null
) {
  if (!date) return "Never";

  return format(
    new Date(date),
    "dd MMM yyyy, hh:mm a"
  );
}

export function formatDate(
  date: Date | string | null
) {
  if (!date) return "-";

  return format(
    new Date(date),
    "dd MMM yyyy"
  );
}