"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  selectActiveConversationMessages,
  selectIsLoadingMessages,
  selectActiveConversationId,
  selectActiveConversation,
  selectOnlineUsers,
  selectTypingUsers,
  selectHasMoreMessages,
} from "@/redux/features/helpdesk/helpdeskSelectors";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { fetchConversationMessagesThunk, claimTicketThunk } from "@/redux/features/helpdesk/helpdeskThunk";
import { ChevronLeft, Lock, Loader2 } from "lucide-react";
import { setActiveConversation } from "@/redux/features/helpdesk/helpdeskSlice";
import { MessageBubble, TypingBubble, ChatSkeleton } from "./chat-primitives";

// Colour rotation for avatars (same feel as user side)
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function ChatWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const [isClaiming, setIsClaiming] = React.useState(false);
  
  const messages = useSelector(selectActiveConversationMessages);
  const isLoading = useSelector(selectIsLoadingMessages);
  const activeId = useSelector(selectActiveConversationId);
  const activeConversation = useSelector(selectActiveConversation);
  const currentUser = useSelector(selectUser);
  const onlineUsers = useSelector(selectOnlineUsers);
  const typingUsers = useSelector(selectTypingUsers);
  const hasMoreMessages = useSelector(selectHasMoreMessages);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef(0);

  // ── Resolve the other participant ──────────────────────────────────────────
  const otherParticipant = React.useMemo(() => {
    if (!activeConversation) return null;
    const otherUser = (activeConversation as any).otherUser;
    const participants = (activeConversation as any).participants;
    return (
      otherUser ||
      (participants && currentUser
        ? participants.find((p: any) => p._id !== currentUser._id)
        : null) ||
      (participants ? participants[0] : null)
    );
  }, [activeConversation, currentUser]);

  const otherName =
    otherParticipant?.name ||
    `${otherParticipant?.firstName || ""} ${otherParticipant?.lastName || ""}`.trim() ||
    "Unknown";
  const otherInitials = otherName.charAt(0).toUpperCase();
  const otherAvatarColor = otherParticipant?._id
    ? getAvatarColor(otherParticipant._id)
    : "bg-blue-100 text-blue-600";
  const isOnline =
    otherParticipant?._id && onlineUsers.includes(otherParticipant._id);
  const isTyping = activeId && (typingUsers as any)[activeId];

  // ── Claim Logic ──────────────────────────────────────────────────────────
  const isUnassigned = (activeConversation as any)?.isSupport && !(activeConversation as any).assignedTo;
  
  const handleClaim = async () => {
    if (!activeId) return;
    setIsClaiming(true);
    try {
      await dispatch(claimTicketThunk(activeId)).unwrap();
    } catch (err) {
      console.error("Failed to claim ticket:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  // ── Scroll management ──────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const diff = container.scrollHeight - previousScrollHeightRef.current;
      if (diff > 0) container.scrollTop = diff;
      previousScrollHeightRef.current = 0;
    } else if (container && !isLoading && previousScrollHeightRef.current === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isLoading, isTyping]);

  // ── Scroll-to-top triggers pagination ─────────────────────────────────────
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (
      container.scrollTop === 0 &&
      !isLoading &&
      messages.length > 0 &&
      hasMoreMessages &&
      activeId
    ) {
      previousScrollHeightRef.current = container.scrollHeight;
      const oldestId = (messages[0] as any)._id;
      dispatch(fetchConversationMessagesThunk({ conversationId: activeId, before: oldestId }));
    }
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!activeId) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-slate-400 bg-slate-50/30">
        Select a conversation
      </div>
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────────
  const Header = () => {
    const assignedAdmin = (activeConversation as any)?.assignedTo;

    return (
      <div className="h-19 px-4 md:px-6 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setActiveConversation(null))}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {isLoading ? (
            <div className="flex items-center gap-3">
              <ChatSkeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <ChatSkeleton className="w-32 h-4" />
                <ChatSkeleton className="w-20 h-3" />
              </div>
            </div>
          ) : (
            <>
              <div className="relative shrink-0 hidden sm:block">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border ${otherAvatarColor} border-blue-200`}>
                  {otherInitials}
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h2 className="text-[17px] font-bold leading-tight text-slate-900">
                  {otherName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-slate-300"}`} />
                  {isTyping ? (
                    <span className="text-[13px] font-medium text-blue-500 italic">
                      typing...
                    </span>
                  ) : (
                    <span className="text-[13px] font-medium text-slate-500">
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {assignedAdmin && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">Assigned to:</span>
            <span className="text-[12px] font-medium text-blue-700">{assignedAdmin.name}</span>
          </div>
        )}
      </div>
    );
  };

  // ── Message list ───────────────────────────────────────────────────────────
  const otherUser = { name: otherName, initials: otherInitials, avatarColor: otherAvatarColor };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 relative">
      <Header />

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6"
      >
        {isLoading ? (
          <div className="space-y-6">
            <ChatSkeleton className="w-[60%] h-16 rounded-2xl rounded-tl-sm" />
            <ChatSkeleton className="w-[50%] h-12 rounded-2xl rounded-tr-sm self-end" />
            <ChatSkeleton className="w-[70%] h-20 rounded-2xl rounded-tl-sm" />
          </div>
        ) : (
          <>
            {hasMoreMessages && messages.length > 0 && (
              <div className="flex justify-center">
                <span className="bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full animate-pulse">
                  Scroll up for older messages
                </span>
              </div>
            )}

            {messages.map((msg: any, index: number) => {
              const prevMsg = (messages as any[])[index - 1];
              const msgDate = msg.createdAt
                ? new Date(msg.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "";
              const prevDate = prevMsg?.createdAt
                ? new Date(prevMsg.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "";
              
              const isMe = typeof msg.sender === 'string'
                ? msg.sender === currentUser?._id
                : msg.sender?._id === currentUser?._id;
              
              const isNew = !isMe && !msg.seen;
              const wasPrevNew = prevMsg && (
                typeof prevMsg.sender === 'string'
                  ? prevMsg.sender !== currentUser?._id && !prevMsg.seen
                  : prevMsg.sender?._id !== currentUser?._id && !prevMsg.seen
              );
              const showNewBadge = isNew && !wasPrevNew;
              const showDateSeparator = index === 0 || msgDate !== prevDate;

              return (
                <React.Fragment key={msg._id}>
                  {showDateSeparator && msgDate && (
                    <div className="flex justify-center mt-2 mb-2">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {msgDate}
                      </span>
                    </div>
                  )}

                  {showNewBadge && (
                    <div className="flex justify-center my-3">
                      <span className="bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        New Messages
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={msg}
                    currentUserId={currentUser?._id}
                    otherUser={otherUser}
                  />
                </React.Fragment>
              );
            })}

            {isTyping && <TypingBubble otherUser={otherUser} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Claim Ticket Overlay */}
      {isUnassigned && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-20 flex flex-col items-center">
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 flex flex-col items-center max-w-sm w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ticket is Unassigned</h3>
            <p className="text-sm text-slate-500 mb-6">
              Claim this ticket to start communicating with the user. Other admins won't be able to reply once you claim it.
            </p>
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Ticket"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
