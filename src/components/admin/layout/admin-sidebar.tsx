"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { SIDEBAR_ITEMS } from "@/lib/constants/sidebar-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/redux/features/auth/authThunk";
import { AppDispatch } from "@/redux/store";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { useMounted } from "@/hooks/use-mounted";

interface AdminSidebarProps {
  /** Called when a nav link is clicked — used by the mobile Sheet to close itself */
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isMounted = useMounted();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      toast.success("Logged out successfully");
      router.push(AUTH_ROUTES.LOGIN);
      if (onNavigate) onNavigate(); // Close mobile sheet if open
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-100">

      {/* ── Brand ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 shrink-0">
        <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-md">
          <Search className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">
            FoundIt Admin
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-0.5">
            Management Console
          </p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-3"
        aria-label="Admin navigation"
      >
        <ul className="space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLogout = (item as any).isLogout;
            const isActive =
              !isLogout &&
              (pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href)));

            const handleClick = (e: React.MouseEvent) => {
              if (isLogout) {
                e.preventDefault();
                handleLogout();
              } else if (onNavigate) {
                onNavigate();
              }
            };

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={handleClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 select-none",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : isLogout
                        ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      isActive ? "text-blue-600" : isLogout ? "text-red-400 group-hover:text-red-600" : "text-gray-400"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom user card ──────────────────────── */}
      <div className="border-t border-gray-100 p-4 shrink-0">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage 
              src={isMounted ? getImageUrl(user?.avatar, user?.name) : ""} 
              alt={isMounted ? (user?.name || "Admin") : "Admin"} 
            />
            <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-bold uppercase">
              {isMounted ? user?.name?.substring(0, 2) || "AD" : "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {isMounted ? user?.name || "Admin User" : "Admin User"}
            </p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-wide font-medium">
              {isMounted ? user?.role?.replace("_", " ") || "Administrator" : "Administrator"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
