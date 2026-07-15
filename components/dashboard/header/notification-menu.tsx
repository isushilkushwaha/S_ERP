"use client";

import React, { memo } from "react";
import { Bell, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "alert" | "info" | "success";
}

const dummyNotifications: Notification[] = [
  { id: "1", title: "New Assignment", description: "Class 10A has a new math assignment.", time: "2m ago", read: false, type: "info" },
  { id: "2", title: "Fee Overdue", description: "Student #4421 has an overdue payment.", time: "1h ago", read: false, type: "alert" },
];

export const NotificationMenu = memo(() => {
  const unreadCount = dummyNotifications.filter((n) => !n.read).length;

  return (
    <Popover>
      {/* Using the render prop pattern for Base UI.
        This injects the Popover logic directly into our Button,
        avoiding the nested <button> HTML error.
      */}
      <PopoverTrigger
        aria-label="Notifications"
        render={(props) => (
          <Button {...props} variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </Button>
        )}
      />
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          <span className="text-xs text-muted-foreground">{unreadCount} Unread</span>
        </div>
        <ScrollArea className="h-80">
          {dummyNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
              <Info className="mb-2 h-8 w-8 opacity-20" />
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col p-2">
              {dummyNotifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors", 
                    !n.read && "bg-accent/50"
                  )}
                >
                  {n.type === "alert" ? (
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> 
                  ) : (
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground/60">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full text-xs" size="sm">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});

NotificationMenu.displayName = "NotificationMenu";