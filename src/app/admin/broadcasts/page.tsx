import { PageHeader } from "@/components/shared/page-header";
import { BroadcastForm } from "@/components/admin/broadcasts/broadcast-form";

export default function BroadcastsPage() {
  return (
    <div>
      <PageHeader title="Broadcast Notifications" description="Sent system-wide notifications to platform users." />
      <BroadcastForm />
    </div>
  );
}
