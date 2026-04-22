import React from "react";
import { UserStatusBadge } from "./user-status-badge";
import { UserActionsDropdown } from "./user-actions-dropdown";
import { UserDetailsCard } from "./user-details-card";
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

  const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
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
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                <th className="px-4 sm:px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold hidden sm:table-cell">Role</th>
                <th className="px-6 py-4 font-bold hidden lg:table-cell">Community</th>
                <th className="px-6 py-4 font-bold hidden md:table-cell">Credits</th>
                <th className="px-6 py-4 font-bold hidden md:table-cell">Trust Score</th>
                <th className="px-6 py-4 font-bold hidden xl:table-cell">Activity Score</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 text-center font-bold">Actions</th>
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
                  const isUnlimited = user.credits > 9999 || user.plan === "Premium" || user.role === "super_admin";
                  const creditText = isUnlimited ? "Unlimited" : `${user.credits || 0} Left`;
                  const trustScore = user.trustScore ?? 0;
                  const activityScore = user.activityScore ?? 0;
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
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <UserStatusBadge type="role" value={user.role} />
                      </td>

                      {/* Community */}
                      <td className="px-6 py-4 text-gray-600 font-medium hidden lg:table-cell">
                        {user.community?.name || "Global / None"}
                      </td>

                      {/* Credits */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`font-semibold text-[13.5px] ${isUnlimited ? "text-blue-600" : "text-gray-900"}`}>
                          {creditText}
                        </span>
                      </td>

                      {/* Trust Score */}
                      <td className="px-6 py-4 hidden md:table-cell">
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
                      {/* Activity Score */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1.5 w-24">
                          <span className={`text-[13px] font-bold ${tsColor.split(" ")[0]}`}>
                            {activityScore}%
                          </span>
                          <div className={`h-1.5 w-full rounded-full ${tsBgColor}`}>
                            <div
                              className={`h-full rounded-full ${tsColor.split(" ")[1]}`}
                              style={{ width: `${Math.min(activityScore, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                 

                      {/* Status */}
                      <td className="px-6 py-4">
                        <UserStatusBadge type="status" value={user.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <UserActionsDropdown
                          user={user}
                          onUpdate={onUserUpdate}
                          onStatusChange={handleStatusChange}
                          onViewProfile={() => setSelectedUser(user)}
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
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500 order-2 sm:order-1">
              Showing <span className="font-bold text-gray-900">{showingEnd}</span> of <span className="font-bold text-gray-900">{totalCount.toLocaleString()}</span> users
            </div>

            <div className="flex items-center space-x-1 order-1 sm:order-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border-gray-200 text-gray-500 bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
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
                      className={`h-8 w-8 rounded-full text-sm font-semibold transition-all ${isCurrent ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" : "text-gray-600"
                        }`}
                      onClick={() => onPageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
              </div>

              {/* Mobile Page Indicator */}
              <div className="sm:hidden px-3 text-sm font-bold text-gray-700">
                Page {currentPage} of {totalPages}
              </div>

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="hidden sm:inline text-gray-400 px-1">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex h-8 w-8 rounded-full text-sm font-semibold text-gray-600"
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
                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border-gray-200 text-gray-500 bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <UserDetailsCard
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}
