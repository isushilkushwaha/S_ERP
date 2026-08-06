import { Badge } from "@/components/ui/badge";

import {
  ACADEMIC_YEAR_STATUS,
  ACADEMIC_YEAR_STATUS_LABELS,
} from "@/frontend/settings/academic-years";

type AcademicYearStatus =
  (typeof ACADEMIC_YEAR_STATUS)[keyof typeof ACADEMIC_YEAR_STATUS];

interface StatusBadgeProps {
  status: AcademicYearStatus;
}

const STATUS_VARIANTS: Record<
  AcademicYearStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  [ACADEMIC_YEAR_STATUS.ACTIVE]: "default",
  [ACADEMIC_YEAR_STATUS.ARCHIVED]: "secondary",
  [ACADEMIC_YEAR_STATUS.UPCOMING]: "outline",
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {ACADEMIC_YEAR_STATUS_LABELS[status]}
    </Badge>
  );
}