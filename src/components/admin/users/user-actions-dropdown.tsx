import React, { useState } from "react";
import { MoreVertical, User, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsDropdownProps {
  user: any;
  onUpdate: () => void;
  onStatusChange: (id: string, newStatus: "active" | "banned") => Promise<void>;
}

export function UserActionsDropdown({ user, onUpdate, onStatusChange }: UserActionsDropdownProps) {
  const [loading, setLoading] = useState(false);
  const isBanned = user.status === "banned";

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      await onStatusChange(user._id, isBanned ? "active" : "banned");
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 shadow-lg border-gray-100 rounded-xl p-1.5">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:text-blue-600 focus:bg-blue-50 rounded-lg">
          <User className="h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-100 my-1" />
        
        <DropdownMenuItem 
          disabled={loading}
          onClick={handleStatusToggle}
          className={`flex items-center gap-2 cursor-pointer font-medium py-2 text-sm rounded-lg ${
            isBanned 
              ? "text-green-600 hover:text-green-700 hover:bg-green-50 focus:text-green-700 focus:bg-green-50" 
              : "text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
          }`}
        >
          {isBanned ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Unban User
            </>
          ) : (
            <>
              <Ban className="h-4 w-4" />
              Suspend User
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
