import { cn } from "@/lib/utils";

interface DetailItemProps {
  /**
   * Field label
   * Example: "Admission Number"
   */
  label: string;

  /**
   * Field value
   */
  value?: React.ReactNode;

  /**
   * Optional className
   */
  className?: string;

  /**
   * Optional value class
   */
  valueClassName?: string;

  /**
   * Optional label class
   */
  labelClassName?: string;
}

export function DetailItem({
  label,
  value,
  className,
  valueClassName,
  labelClassName,
}: DetailItemProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p
        className={cn(
          "text-sm font-medium text-muted-foreground",
          labelClassName
        )}
      >
        {label}
      </p>

      <div
        className={cn(
          "text-sm font-semibold break-words text-foreground",
          valueClassName
        )}
      >
        {value ?? (
          <span className="text-muted-foreground">
            —
          </span>
        )}
      </div>
    </div>
  );
}