"use client";

import React, { useState } from "react";
import { Section } from "@/frontend/settings/classes/types/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface SectionsCardProps {
  sections: Section[];
  classId: string;
  onCreateSection: (name: string, capacity: number, displayOrder: number) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
  isCreating?: boolean;
}

export function SectionsCard({
  sections,
  onCreateSection,
  onDeleteSection,
  isCreating,
}: SectionsCardProps) {
  const [newSectionName, setNewSectionName] = useState("");
  const [newCapacity, setNewCapacity] = useState<number>(40);

  const handleAdd = async () => {
    if (!newSectionName.trim()) return;
    const nextOrder = sections.length + 1;
    await onCreateSection(newSectionName.trim(), newCapacity, nextOrder);
    setNewSectionName("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Sections Management</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inline Section Add Bar */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Name (e.g. A)"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="w-1/2 text-sm"
          />
          <Input
            type="number"
            placeholder="Capacity"
            value={newCapacity}
            onChange={(e) => setNewCapacity(Number(e.target.value))}
            className="w-1/3 text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={isCreating || !newSectionName.trim()}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {/* Sections List */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center">Order</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-16 text-center text-xs text-muted-foreground">
                    No sections added yet.
                  </TableCell>
                </TableRow>
              ) : (
                sections.map((sec) => (
                  <TableRow key={sec.id}>
                    <TableCell className="text-center font-semibold text-xs">{sec.displayOrder}</TableCell>
                    <TableCell className="font-medium text-sm">Section {sec.name}</TableCell>
                    <TableCell className="text-sm">{sec.capacity} seats</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onDeleteSection(sec.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}