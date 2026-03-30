"use client";

import React, { useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { sendMessageThunk } from "@/redux/features/helpdesk/helpdeskThunk";
import {
  selectActiveConversationId,
  selectIsSendingMessage,
  selectActiveConversation,
} from "@/redux/features/helpdesk/helpdeskSelectors";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { getSocket } from "@/lib/socket";
import { Paperclip, Send, X, Image as ImageIcon } from "lucide-react";

export function MessageInput() {
  const dispatch = useDispatch<AppDispatch>();
  const activeId = useSelector(selectActiveConversationId);
  const isSending = useSelector(selectIsSendingMessage);
  const activeConversation = useSelector(selectActiveConversation);
  const currentUser = useSelector(selectUser);

  const [messageInput, setMessageInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resolve the other participant's id for typing events ──────────────────
  const otherParticipantId = useMemo(() => {
    if (!activeConversation || !currentUser) return null;
    const otherUser = (activeConversation as any).otherUser;
    const participants = (activeConversation as any).participants || [];
    const other =
      otherUser ||
      participants.find((p: any) => p._id !== currentUser._id) ||
      participants[0];
    return other?._id || null;
  }, [activeConversation, currentUser]);

  // ── Typing events ─────────────────────────────────────────────────────────
  const emitStopTyping = () => {
    const socket = getSocket();
    if (socket && activeId && otherParticipantId) {
      socket.emit("stopTyping", { conversationId: activeId, receiverId: otherParticipantId });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    const socket = getSocket();
    if (socket && activeId && otherParticipantId) {
      socket.emit("typing", { conversationId: activeId, receiverId: otherParticipantId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(emitStopTyping, 1500);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(0, 5); // Limit to 5
      setSelectedFiles(newFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };
  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && selectedFiles.length === 0) || !activeId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitStopTyping();

    try {
      await dispatch(
        sendMessageThunk({ 
          conversationId: activeId, 
          content: messageInput.trim() || undefined,
          attachments: selectedFiles.length > 0 ? selectedFiles : undefined
        })
      ).unwrap();
      
      setMessageInput("");
      setSelectedFiles([]);
      previews.forEach(url => URL.revokeObjectURL(url));
      setPreviews([]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!activeId) return null;

  return (
    <form
      onSubmit={handleSend}
      className="p-4 bg-white border-t border-slate-200 shrink-0"
    >
      {/* File Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {previews.map((url, index) => (
            <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group">
              <img src={url} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0.5 right-0.5 bg-slate-900/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending || selectedFiles.length >= 5}
          className="w-10 h-10 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={handleInputChange}
          disabled={isSending}
          className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-2 text-[15px] outline-none placeholder:text-slate-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isSending || (!messageInput.trim() && selectedFiles.length === 0)}
          className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-sm shrink-0 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </form>
  );
}
