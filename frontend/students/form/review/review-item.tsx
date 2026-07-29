"use client";

interface ReviewItemProps {
  label: string;
  value?: React.ReactNode;
}

export function ReviewItem({
  label,
  value,
}: ReviewItemProps) {
  return (
    <div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[220px_1fr]">
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-semibold break-words">
        {value || "-"}
      </p>
    </div>
  );
}