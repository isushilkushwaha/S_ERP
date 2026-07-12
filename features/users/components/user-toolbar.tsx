"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
}

export function UserToolbar({
  search,
  onSearchChange,
  onAddUser,
}: UserToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-80">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Button onClick={onAddUser}>
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}