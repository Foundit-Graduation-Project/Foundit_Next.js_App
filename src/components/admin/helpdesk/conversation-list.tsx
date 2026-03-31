"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  selectConversations,
  selectActiveConversationId,
  selectIsLoadingConversations,
  selectOnlineUsers,
  selectTypingUsers,
} from "@/redux/features/helpdesk/helpdeskSelectors";
import { setActiveConversation } from "@/redux/features/helpdesk/helpdeskSlice";
import { fetchConversationMessagesThunk } from "@/redux/features/helpdesk/helpdeskThunk";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { Search } from "lucide-react";
import { ChatSkeleton } from "./chat-primitives";

export function ConversationList() {
  const dispatch = useDispatch<AppDispatch>();
  const conversations = useSelector(selectConversations);
  const activeId = useSelector(selectActiveConversationId);
  const isLoading = useSelector(selectIsLoadingConversations);
  const currentUser = useSelector(selectUser);
  const onlineUsers = useSelector(selectOnlineUsers);
  const typingUsers = useSelector(selectTypingUsers);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"my" | "unassigned">("my");

  const handleSelect = (id: string) => {
    dispatch(setActiveConversation(id));
    dispatch(fetchConversationMessagesThunk({ conversationId: id }));
  };

  const filteredConversations = conversations.filter((conv: any) => {
    // 1. Tab filtering
    if (activeTab === "unassigned") {
      if (!conv.isSupport || conv.assignedTo) return false;
    } else {
      // "My" tab: standard logic (either not support, or assigned to me)
      // Actually, if it's unassigned, it shouldn't be in "My"
      if (conv.isSupport && !conv.assignedTo) return false;
    }

    // 2. Search filtering
    const other =
      conv.otherUser ||
      (conv.participants && currentUser
        ? conv.participants.find((p: any) => p._id !== currentUser._id)
        : null) ||
      (conv.participants ? conv.participants[0] : null);
    const name =
      other?.name ||
      `${other?.firstName || ""} ${other?.lastName || ""}`.trim() ||
      "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const unassignedCount = conversations.filter(c => c.isSupport && !c.assignedTo).length;

  return (
    <aside className="w-full flex flex-col bg-white h-full">
      {/* Tabs */}
      <div className="flex p-2 gap-1 bg-slate-50 border-b border-slate-100">
        <button
          onClick={() => setActiveTab("my")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            activeTab === "my"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          My Tickets
        </button>
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all relative ${
            activeTab === "unassigned"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          Unassigned
          {unassignedCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unassignedCount}
            </span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 p-4 border-b border-slate-50">
              <ChatSkeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <ChatSkeleton className="h-4 w-3/4" />
                <ChatSkeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            No {activeTab === "unassigned" ? "unassigned tickets" : "conversations"} found.
          </div>
        ) : (
          filteredConversations.map((conv: any) => {
            const otherParticipant =
              conv.otherUser ||
              (conv.participants && currentUser
                ? conv.participants.find((p: any) => p._id !== currentUser._id)
                : null) ||
              (conv.participants ? conv.participants[0] : null);

            if (!otherParticipant) return null;

            const name =
              otherParticipant.name ||
              `${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`.trim() ||
              "Unknown";
            const initials = name.charAt(0).toUpperCase();
            const isOnline =
              otherParticipant._id && onlineUsers.includes(otherParticipant._id);
            const isTyping = (typingUsers as any)[conv._id];
            const lastMessage =
              typeof conv.lastMessage === "string"
                ? conv.lastMessage
                : conv.lastMessage?.content || "";
            const time = conv.updatedAt
              ? new Date(conv.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={conv._id}
                onClick={() => handleSelect(conv._id)}
                className={`flex items-start gap-3 p-4 cursor-pointer border-b border-slate-50 transition-colors ${
                  activeId === conv._id
                    ? "bg-slate-50"
                    : "hover:bg-slate-50/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border bg-blue-100 text-blue-600 border-blue-200">
                    {initials}
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3
                      className={`text-sm pr-2 truncate ${
                        conv.unread
                          ? "font-bold text-blue-600"
                          : "font-semibold text-slate-900"
                      }`}
                    >
                      {name}
                    </h3>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        conv.unread
                          ? "font-bold text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate ${
                        isTyping
                          ? "text-blue-500 italic"
                          : conv.unread
                          ? "text-slate-900 font-medium"
                          : "text-slate-500"
                      }`}
                    >
                      {isTyping ? "typing..." : lastMessage || "No messages yet"}
                    </p>
                    {conv.unread && !isTyping && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
