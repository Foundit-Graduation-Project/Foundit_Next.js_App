"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";
import { NotificationsDropdown } from "./notifications-dropdown";
import { notificationsApi } from "@/lib/api/notifications.api";
import { useSocketBroadcasts } from "@/hooks/use-socket-broadcasts";
import { connectSocket, getSocket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSelectors";
import toast from "react-hot-toast";

export function AdminHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  // Initialize socket listeners for broadcasts
  useSocketBroadcasts();

  // Initialize socket listeners for notifications
  useEffect(() => {
    if (!user) {
      console.log("[AdminHeader] No user logged in");
      return;
    }

    console.log("[AdminHeader] Setting up socket for user:", user.email, "role:", user.role);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      console.log("[AdminHeader] No access token found");
      return;
    }

    const socket = connectSocket(token);

    // Listen for new notifications
    socket?.on("new_notification", (notification: any) => {
      console.log("[AdminHeader] Received notification:", notification);
      console.log("[AdminHeader] Current user:", user.email, "role:", user.role);
      
      // Show toast notification
      toast.success(`🔔 ${notification.title}`, {
        duration: 4,
        icon: "🔔",
      });

      // Update unread count
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket?.off("new_notification");
    };
  }, [user]);

  // Fetch unread notifications count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (notificationsOpen) {
      const handleClick = () => setNotificationsOpen(false);
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [notificationsOpen]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    // Only add search param if we are on a searchable page, for now just append it globally
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b bg-white">
      <div className="flex h-full w-full items-center gap-4 px-4 md:px-6">

        {/* Menu button — ONLY visible on tablet & mobile (hidden on md+) */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              id="mobile-menu-trigger"
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 text-gray-500"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72" showCloseButton={false}>
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            {/* onNavigate closes the sheet when any link is clicked */}
            <AdminSidebar onNavigate={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Search bar — slightly smaller on mobile to save space */}
        <div className="flex-1 max-w-sm sm:max-w-xl transition-all">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="admin-global-search"
              placeholder="Search..."
              className="pl-9 bg-gray-50/50 border-gray-100 text-sm placeholder:text-gray-400 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 h-9 sm:h-10 rounded-xl sm:rounded-full transition-all"
              defaultValue={searchParams.get('search')?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
 
        {/* Right: notification bell + brand badge */}
        <div className="flex items-center gap-1 sm:gap-3 ml-auto shrink-0">
          {/* Notifications Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full h-9 w-9 sm:h-10 sm:w-10 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            <NotificationsDropdown isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          </div>
 
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-gray-100 h-6">
            <span className="font-bold text-gray-800 text-xs sm:text-sm hidden xs:inline">
              FoundIt
            </span>
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-blue-500/20 uppercase tracking-tighter">
              PRO
            </Badge>
          </div>
        </div>

      </div>
    </header>
  );
}
