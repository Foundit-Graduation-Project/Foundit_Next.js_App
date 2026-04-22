"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getSocket, connectSocket } from "@/lib/socket";
import { AppDispatch, RootState } from "@/redux/store";
import { addSocketMessage, updateMessagesSeen, setOnlineUsers, setTypingStatus, updateConversationAssignment } from "@/redux/features/helpdesk/helpdeskSlice";

export default function SocketNotificationHandler() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { activeConversationId } = useSelector((state: RootState) => state.helpdesk);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("accessToken") || "";
    const socket = connectSocket(token);

    if (socket) {
      // 1. Listen for persistent notifications (Toasts)
      socket.on("new_notification", (notification: any) => {
        console.log("[SocketNotificationHandler] New notification:", notification);
        const isMessage = notification.category === "MESSAGE" || notification.category === "SUPPORT";
        const convId = notification.data?.conversationId;

        // Suppression Logic
        const isViewingThisChat = pathname.includes("/admin/helpdesk") && convId === activeConversationId;
        if (isMessage && isViewingThisChat) return;

        toast.success(
          <div>
            <div className="font-bold">{notification.title}</div>
            {notification.message && <div className="text-xs opacity-90">{notification.message}</div>}
          </div>,
          { duration: 5000 }
        );
      });

      // 2. Global Message Listener
      socket.on("receiveMessage", (message: any) => {
        dispatch(addSocketMessage(message));
        
        // Auto-mark as seen if we are currently viewing this chat on the helpdesk page
        const msgChatId = message.conversationId?._id || message.conversationId;
        if (pathname.includes("/admin/helpdesk") && msgChatId === activeConversationId) {
          socket.emit("markAsSeen", { conversationId: activeConversationId });
        }
      });

      // 3. Status & Activity Listeners
      socket.on("messagesSeen", (data: any) => {
        dispatch(updateMessagesSeen(data));
      });

      socket.on("typing", (data: any) => {
        dispatch(setTypingStatus({ chatId: data.conversationId, isTyping: true }));
      });

      socket.on("stopTyping", (data: any) => {
        dispatch(setTypingStatus({ chatId: data.conversationId, isTyping: false }));
      });

      socket.on("onlineUsers", (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      // 4. Ticket Claimed Listener
      socket.on("ticketClaimed", (data: any) => {
        const { assignedTo } = data;
        if (assignedTo._id !== user?._id) {
          toast.success(
            <div>
              <div className="font-bold text-blue-600">Ticket Claimed</div>
              <div className="text-xs text-slate-600">Admin <span className="font-semibold">{assignedTo.name}</span> has claimed a support request.</div>
            </div>,
            { duration: 4000 }
          );
        }
        dispatch(updateConversationAssignment(data));
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
        socket.off("receiveMessage");
        socket.off("messagesSeen");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("onlineUsers");
        socket.off("ticketClaimed");
      }
    };
  }, [user, pathname, activeConversationId, dispatch]);

  return null;
}


