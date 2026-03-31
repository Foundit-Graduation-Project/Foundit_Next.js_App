"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SendBroadcastDialog } from "@/components/admin/broadcasts/broadcast-form";
import { BroadcastsList } from "@/components/admin/broadcasts/broadcasts-list";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function BroadcastsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader 
        title="Broadcast Notifications" 
        description="Send system-wide notifications to all active users on the platform." 
      />

      {/* Send Broadcast Button */}
      <div className="mb-8">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all"
        >
          <Send className="w-5 h-5" />
          Send Broadcast
        </Button>
      </div>

      {/* Send Broadcast Dialog */}
      <SendBroadcastDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => setIsDialogOpen(false)}
      />

      {/* Broadcasts History */}
      <BroadcastsList />
    </div>
  );
}
