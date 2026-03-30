"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usersApi } from "@/lib/api/users.api";
import { UsersTable } from "./users-table";
import { AddUserForm } from "./add-user-form";
import { toast } from "react-hot-toast";

export function UsersPageView() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getUsers({ page: currentPage, limit, search });
      if (res.status === "success" || res.data) {
        // Backend returns either { data: { users, totalCount } } or { users, totalCount }
        const rData = res.data || res;
        setUsers(rData.users || []);
        setTotalCount(rData.totalCount || 0);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page on search change
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [search, currentPage]);

  const handleUserAdded = () => {
    setIsAddUserOpen(false);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header section with heading and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h2>
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center h-10 px-5 rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      {/* Users Table */}
      <UsersTable 
        users={users} 
        loading={loading} 
        currentPage={currentPage}
        totalCount={totalCount}
        limit={limit}
        onPageChange={setCurrentPage}
        onUserUpdate={fetchUsers}
      />

      {/* Add User Modal */}
      {isAddUserOpen && (
        <AddUserForm 
          isOpen={isAddUserOpen} 
          onClose={() => setIsAddUserOpen(false)} 
          onSuccess={handleUserAdded}
        />
      )}
    </div>
  );
}

