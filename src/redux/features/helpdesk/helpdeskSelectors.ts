import { RootState } from "../../store";

export const selectConversations = (state: RootState) => state.helpdesk.conversations;
export const selectActiveConversationId = (state: RootState) => state.helpdesk.activeConversationId;
export const selectActiveConversationMessages = (state: RootState) => state.helpdesk.messages;
export const selectIsLoadingConversations = (state: RootState) => state.helpdesk.isLoadingConversations;
export const selectIsLoadingMessages = (state: RootState) => state.helpdesk.isLoadingMessages;
export const selectIsSendingMessage = (state: RootState) => state.helpdesk.isSendingMessage;
export const selectHelpdeskError = (state: RootState) => state.helpdesk.error;
export const selectOnlineUsers = (state: RootState) => state.helpdesk.onlineUsers;
export const selectTypingUsers = (state: RootState) => state.helpdesk.typingUsers;

export const selectActiveConversation = (state: RootState) =>
  state.helpdesk.conversations.find((c) => c._id === state.helpdesk.activeConversationId);
export const selectHasMoreMessages = (state: RootState) => state.helpdesk.hasMoreMessages;
