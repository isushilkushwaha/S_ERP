"use client";

import Link from "next/link";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { StudentListItem } from "../../types";
import { STUDENT_ROUTES } from "../../constants";

interface StudentActionsProps {
  student: StudentListItem;

  onDelete?: (student: StudentListItem) => void;
}

export function StudentActions({
  student,
  onDelete,
}: StudentActionsProps) {
  return (
    <DropdownMenu>
      {/* <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger> */}
      <DropdownMenuTrigger
  className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  aria-label="Open actions"
>
  <MoreHorizontal className="size-4" />
</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <Link href={STUDENT_ROUTES.DETAILS(student.id)}>
          <DropdownMenuItem>
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
        </Link>

        <Link href={STUDENT_ROUTES.EDIT(student.id)}>
          <DropdownMenuItem>
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete?.(student)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}