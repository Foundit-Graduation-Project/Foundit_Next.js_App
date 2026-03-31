export type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  role: "user" | "community_admin" | "super_admin";
};

export type Message = {
  _id: string;
  sender: Participant | string;
  content: string;
  attachments?: string[];
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  seen?: boolean;
};

export type Conversation = {
  _id: string;
  participants: Participant[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  isSupport?: boolean;
  assignedTo?: Participant | string | null;
  createdAt: string;
  updatedAt: string;
};

export interface CreateConversationPayload {
  userB: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content?: string;
  attachments?: File[];
}

export interface SupportTicketPayload {
  message: string;
}

export interface ChatResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

