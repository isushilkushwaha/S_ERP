import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SchoolProfileCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SchoolProfileCard({
  title,
  description,
  children,
  className,
}: SchoolProfileCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>

        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}