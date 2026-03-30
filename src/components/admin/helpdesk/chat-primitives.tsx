"use client";

import React from "react";
import { Check, CheckCheck } from "lucide-react";

// --- Skeleton Loader ---
export const ChatSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200/60 ${className}`} />
);

// --- Message Bubble ---
interface MessageBubbleProps {
  message: {
    _id: string;
    content: string;
    attachments?: string[];
    sender: any;
    createdAt: string;
    seen?: boolean;
  };
  currentUserId: string | undefined;
  otherUser: {
    name?: string;
    initials: string;
    avatarColor: string;
  };
}

export function MessageBubble({ message, currentUserId, otherUser }: MessageBubbleProps) {
  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender?._id;
  const isMe = senderId === currentUserId;
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex gap-3 max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-2 ${
        isMe ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      {!isMe && (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-1 ${otherUser.avatarColor}`}
        >
          {otherUser.initials}
        </div>
      )}

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`flex flex-col gap-2 p-1 shadow-sm overflow-hidden ${
            isMe
              ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
              : "bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
          }`}
        >
          {message.attachments && message.attachments.length > 0 && (
            <div className={`flex flex-wrap gap-1 p-1 ${message.attachments.length > 1 ? "grid grid-cols-2" : ""}`}>
              {message.attachments.map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  alt="attachment" 
                  className="rounded-xl max-h-[300px] w-full object-cover cursor-zoom-in hover:brightness-95 transition-all"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          )}
          {message.content && (
            <div className="px-3 py-2 text-[15px] leading-relaxed">
              {message.content}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 px-1">
          <span className="text-[11px] font-medium text-slate-400">{time}</span>
          {isMe && !message.seen && <Check className="w-3.5 h-3.5 text-slate-400" />}
          {isMe && message.seen && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
        </div>
      </div>
    </div>
  );
}

// --- Typing Bubble ---
interface TypingBubbleProps {
  otherUser: { initials: string; avatarColor: string };
}

export function TypingBubble({ otherUser }: TypingBubbleProps) {
  return (
    <div className="flex gap-3 max-w-[85%] md:max-w-[75%] self-start animate-in fade-in slide-in-from-bottom-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-1 ${otherUser.avatarColor}`}
      >
        {otherUser.initials}
      </div>
      <div className="bg-slate-100 px-4 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm h-[44px]">
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
