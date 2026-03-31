"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Plus, MoreVertical, MapPin, Globe, Users } from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCommunities, toggleStatus } from "@/redux/features/communities/communitiesThunk";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function CommunitiesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: communities, isLoading } = useSelector((state: RootState) => state.communities);

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    dispatch(toggleStatus({ id, status: newStatus }));
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Registered Communities" 
          description="Manage institutional access and subscription tiers across the global network." 
        />
        <Link href="/admin/communities/new">
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Add New Community
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-8 py-5">
                  COMMUNITY NAME
                </TableHead>
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  DOMAIN
                </TableHead>
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  LOCATION
                </TableHead>
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  ACTIVE MEMBERS
                </TableHead>
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  PLAN
                </TableHead>
                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right pr-8">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && communities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-gray-400 font-medium">
                    Loading communities...
                  </TableCell>
                </TableRow>
              ) : communities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-gray-400 font-medium">
                    No communities registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                communities.map((community: any) => (
                  <TableRow key={community._id} className="hover:bg-blue-50/20 transition-colors border-gray-50 group">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-11 h-11 border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                          <AvatarImage src={community.logo} alt={community.name} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                            {community.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {community.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100/50 px-2 py-1 rounded-md">
                        {community.domain}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {community.location?.coordinates ? (
                          <span suppressHydrationWarning>
                            {community.location.coordinates[1].toFixed(2)}, {community.location.coordinates[0].toFixed(2)}
                          </span>
                        ) : (
                          "Location N/A"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900">
                          {(community.admins?.length || 0) * 10} {/* Placeholder logic for members */}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        community.plan === "PRO" 
                          ? "bg-amber-50 text-amber-600 border-amber-100" 
                          : community.plan === "ENTERPRISE"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {community.plan}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={community.subscriptionStatus === "active"}
                            onChange={() => handleToggleStatus(community._id, community.subscriptionStatus)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                        </label>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {communities.length > 0 && (
          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            totalItems={communities.length}
            itemsPerPage={10}
          />
        )}
      </div>
    </div>
  );
}
