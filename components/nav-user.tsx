


// "use client";

// import * as React from "react";
// import type { Session } from "next-auth";
// import { signOut } from "next-auth/react";

// import {
//   BadgeCheck,
//   Bell,
//   ChevronsUpDown,
//   LogOut,
//   Settings,
//   UserCircle,
// } from "lucide-react";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";

// interface NavUserProps {
//   session: Session | null;
// }

// export function NavUser({
//   session,
// }: NavUserProps) {
//   const { isMobile } = useSidebar();

//   if (!session?.user) {
//     return null;
//   }

//   const user = session.user;

//   const initials =
//     user.name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase() ?? "U";

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent"
//             >
//               <Avatar className="h-8 w-8 rounded-lg">
//                 <AvatarImage
//                   src={user.image ?? ""}
//                   alt={user.name ?? ""}
//                 />

//                 <AvatarFallback className="rounded-lg">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{user.name}</span>

//                 <span className="truncate text-xs text-muted-foreground">
//                   {user.email}
//                 </span>
//               </div>

//               <ChevronsUpDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="w-64"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={8}
//           >
//             <DropdownMenuLabel className="p-0">
//               <div className="flex items-center gap-2 px-2 py-2">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage
//                     src={user.image ?? ""}
//                     alt={user.name ?? ""}
//                   />

//                   <AvatarFallback className="rounded-lg">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="grid flex-1 text-left">
//                   <span className="truncate font-semibold">
//                     {user.name}
//                   </span>

//                   <span className="truncate text-xs text-muted-foreground">
//                     {user.email}
//                   </span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck className="mr-2 h-4 w-4" />
//                 My Account
//               </DropdownMenuItem>

//               <DropdownMenuItem>
//                 <UserCircle className="mr-2 h-4 w-4" />
//                 Profile
//               </DropdownMenuItem>

//               <DropdownMenuItem>
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </DropdownMenuItem>

//               <DropdownMenuItem>
//                 <Bell className="mr-2 h-4 w-4" />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem
//               onClick={() =>
//                 signOut({
//                   callbackUrl: "/login",
//                 })
//               }
//               className="text-red-600"
//             >
//               <LogOut className="mr-2 h-4 w-4" />

//               Sign Out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }