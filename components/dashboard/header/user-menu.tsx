"use client";

import React, { memo, useTransition } from "react";
import { LogOut, User,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/authentication/actions/logout";

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
}

export const UserMenu = memo(({ name, email, role }: UserMenuProps) => {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button {...props} variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
              <User className="h-4 w-4" />
            </div>
          </Button>
        )}
      />
      <DropdownMenuContent className="w-64" align="end">
        {/* The Group provides the context required by the Label */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
              <div className="pt-1">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                  {role}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => startTransition(() => logout())}
          disabled={pending}
          className="text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {pending ? "Signing Out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserMenu.displayName = "UserMenu";