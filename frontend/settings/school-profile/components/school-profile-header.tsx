import { Building2 } from "lucide-react";

interface SchoolProfileHeaderProps {
  title?: string;
  description?: string;
}

export function SchoolProfileHeader({
  title = "School Profile",
  description = "Manage your school's basic information, branding, contact details, and localization settings.",
}: SchoolProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
          <Building2 className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}