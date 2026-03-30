"use client";

import React, { useState } from "react";
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

export function AdminHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

        {/* Search bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              id="admin-global-search"
              placeholder="Search across users, reports or communities..."
              className="pl-9 bg-gray-50 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-400"
              defaultValue={searchParams.get('search')?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right: notification bell + brand badge */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1.5 pl-1">
            <span className="font-semibold text-gray-800 text-sm hidden sm:inline">
              FoundIt
            </span>
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold tracking-wide">
              PRO
            </Badge>
          </div>
        </div>

      </div>
    </header>
  );
}
