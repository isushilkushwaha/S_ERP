"use client";

import React from "react";
import { Class } from "@/frontend/settings/classes/types/class";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings2, Trash2 } from "lucide-react";

interface ClassesTableProps {
  classes: Class[];
  selectedClassId: string | null;
  onSelectClass: (cls: Class) => void;
  onOpenCreateDialog: () => void;
  onOpenEditDialog: (cls: Class) => void;
  onDeleteClass: (id: string) => void;
  isLoading?: boolean;
}

export function ClassesTable({
  classes,
  selectedClassId,
  onSelectClass,
  onOpenCreateDialog,
  onOpenEditDialog,
  onDeleteClass,
  isLoading,
}: ClassesTableProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Classes</h2>
          <p className="text-xs text-muted-foreground">Select a class to manage configurations & sections</p>
        </div>
        <Button onClick={onOpenCreateDialog} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <div className="relative overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">Order</TableHead>
              <TableHead>Class Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  Loading classes...
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  No classes configured. Click Add Class to get started.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => {
                const isSelected = cls.id === selectedClassId;
                return (
                  <TableRow
                    key={cls.id}
                    onClick={() => onSelectClass(cls)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-accent/70 font-medium" : "hover:bg-muted/40"
                    }`}
                  >
                    <TableCell className="text-center font-semibold text-xs">{cls.displayOrder}</TableCell>
                    <TableCell className="font-medium">
                      {cls.name}
                      {cls.shortName && <span className="ml-1 text-xs text-muted-foreground">({cls.shortName})</span>}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{cls.code}</TableCell>
                    <TableCell className="text-xs">{cls.medium}</TableCell>
                    <TableCell>
                      <Badge variant={cls.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px]">
                        {cls.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => onOpenEditDialog(cls)}>
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteClass(cls.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}