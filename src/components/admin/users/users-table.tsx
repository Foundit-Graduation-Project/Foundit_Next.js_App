import React from "react";
import { UserStatusBadge } from "./user-status-badge";
import { UserActionsDropdown } from "./user-actions-dropdown";
import { usersApi } from "@/lib/api/users.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersTableProps {
  users: any[];
  loading: boolean;
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
  onUserUpdate: () => void;
}

export function UsersTable({
  users,
  loading,
  currentPage,
  totalCount,
  limit,
  onPageChange,
  onUserUpdate,
}: UsersTableProps) {
  
  const totalPages = Math.ceil(totalCount / limit);
  const showingEnd = Math.min(currentPage * limit, totalCount);

  // Pagination Handler
  const handleStatusChange = async (id: string, newStatus: "active" | "banned") => {
    await usersApi.updateUserStatus(id, newStatus);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500";
    if (score >= 50) return "text-orange-500 bg-orange-500";
    return "text-red-500 bg-red-500";
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100";
    if (score >= 50) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Community</th>
              <th className="px-6 py-4 font-bold">Credits</th>
              <th className="px-6 py-4 font-bold">Trust Score</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isUnlimited = user.credits > 9999 || user.plan === "Premium";
                const creditText = isUnlimited ? "Unlimited" : `${user.credits || 0} Left`;
                const trustScore = user.trustScore ?? 100;
                const tsColor = getTrustScoreColor(trustScore);
                const tsBgColor = getTrustScoreBg(trustScore);

                return (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 overflow-hidden">
                          {user.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          <span className="text-[13px] text-gray-500">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <UserStatusBadge type="role" value={user.role} />
                    </td>

                    {/* Community */}
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {user.community?.name || "Global / None"}
                    </td>

                    {/* Credits */}
                    <td className="px-6 py-4">
                      <span className={`font-semibold text-[13.5px] ${isUnlimited ? "text-blue-600" : "text-gray-900"}`}>
                        {creditText}
                      </span>
                    </td>

                    {/* Trust Score */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-24">
                        <span className={`text-[13px] font-bold ${tsColor.split(" ")[0]}`}>
                          {trustScore}%
                        </span>
                        <div className={`h-1.5 w-full rounded-full ${tsBgColor}`}>
                          <div 
                            className={`h-full rounded-full ${tsColor.split(" ")[1]}`} 
                            style={{ width: `${Math.min(trustScore, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <UserStatusBadge type="status" value={user.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <UserActionsDropdown 
                        user={user} 
                        onUpdate={onUserUpdate} 
                        onStatusChange={handleStatusChange} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{showingEnd}</span> of <span className="font-bold text-gray-900">{totalCount.toLocaleString()}</span> users
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 rounded-full border-gray-200 text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              // Basic logic to show current and surrounding pages, but if totalPages < 5 just show all.
              let pageToShow = idx + 1;
              if (totalPages > 5 && currentPage > 3) {
                 pageToShow = currentPage - 2 + idx;
                 if (pageToShow > totalPages) return null;
              }
              
              const isCurrent = pageToShow === currentPage;
              return (
                <Button
                  key={pageToShow}
                  variant={isCurrent ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 rounded-full text-sm font-semibold ${
                    isCurrent ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-600"
                  }`}
                  onClick={() => onPageChange(pageToShow)}
                >
                  {pageToShow}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="text-gray-400 px-1">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-sm font-semibold text-gray-600"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 rounded-full border-gray-200 text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
