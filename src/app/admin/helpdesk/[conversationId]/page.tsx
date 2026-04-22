import { PageHeader } from "@/components/shared/page-header";
import { ChatWindow } from "@/components/admin/helpdesk/chat-window";

export default function ConversationDetailPage({ params }: { params: { conversationId: string } }) {
  return (
    <div>
      <PageHeader title={`Conversation #${params.conversationId}`} description="Resolve user issues through live chat." />
      <ChatWindow />
    </div>
  );
}
