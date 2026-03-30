"use client";
import React, { useEffect } from "react";
import { connectSocket, getSocket } from "@/lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { ConversationList } from "./conversation-list";
import { ChatWindow } from "./chat-window";
import { MessageInput } from "./message-input";
import { fetchConversationsThunk } from "@/redux/features/helpdesk/helpdeskThunk";
import { 
  selectActiveConversationId,
  selectActiveConversation 
} from "@/redux/features/helpdesk/helpdeskSelectors";
import { 
  addSocketMessage, 
  updateMessagesSeen, 
  setOnlineUsers, 
  setTypingStatus,
  updateConversationAssignment
} from "@/redux/features/helpdesk/helpdeskSlice";

export function HelpdeskPageView() {
  const dispatch = useDispatch<AppDispatch>();
  const activeId = useSelector(selectActiveConversationId);
  const activeConversation = useSelector(selectActiveConversation);

  // ── Fetch conversations & setup socket ────────────────────────────────────
  useEffect(() => {
    dispatch(fetchConversationsThunk());
    const token = localStorage.getItem("accessToken") || "";
    const socket = connectSocket(token);
    if (socket) {
      socket.on("receiveMessage", (message: any) => {
        dispatch(addSocketMessage(message));
        // Auto-mark as seen if this conversation is open
        const msgChatId =
          message.conversationId?._id ||
          message.conversationId ||
          message.conversation?._id ||
          message.conversation;
        if (msgChatId === activeId) {
          socket.emit("markAsSeen", { conversationId: activeId });
        }
      });
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
      socket.on("ticketClaimed", (data: any) => {
        dispatch(updateConversationAssignment(data));
      });
    }
    const handleFocus = () => {
      if (activeId && socket) {
        socket.emit("markAsSeen", { conversationId: activeId });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      if (socket) {
        socket.off("receiveMessage");
        socket.off("messagesSeen");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("onlineUsers");
        socket.off("ticketClaimed");
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, activeId]);
 
  // ── Emit markAsSeen when switching conversations ────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (activeId && socket) {
      socket.emit("markAsSeen", { conversationId: activeId });
    }
  }, [activeId]);

  // Is the current active chat an unassigned support ticket?
  const isUnassignedSupport = activeConversation?.isSupport && !activeConversation.assignedTo;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-150px)] font-sans text-slate-900 overflow-hidden">
      <main className="flex flex-1 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        {/* Sidebar */}
        <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-slate-200 flex-col bg-white shrink-0 ${activeId ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Support Conversations</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationList />
          </div>
        
        </div>
        {/* Chat area */}
        <div className={`flex-1 flex-col overflow-hidden ${!activeId ? "hidden md:flex" : "flex"}`}>
          <div className="flex-1 overflow-hidden">
            <ChatWindow />
          </div>
          {!isUnassignedSupport && <MessageInput />}
        </div>
      </main>
    </div>
  );
}