import { PageHeader } from "@/components/shared/page-header";
import { CreateCommunityForm } from "@/components/admin/communities/create-community-form";

export default function NewCommunityPage() {
  return (
    <div>
      <PageHeader title="Create Community" description="Initialize a new platform-wide community." />
      <CreateCommunityForm />
    </div>
  );
}
