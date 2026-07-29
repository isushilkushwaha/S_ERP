"use client";

import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReviewCardProps {
  title: string;
  children: ReactNode;
}

export function ReviewCard({
  title,
  children,
}: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="divide-y">
        {children}
      </CardContent>
    </Card>
  );
} 