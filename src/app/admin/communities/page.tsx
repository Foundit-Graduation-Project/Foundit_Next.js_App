import { PageHeader } from "@/components/shared/page-header";
import { CommunitiesPageView } from "@/components/admin/communities/communities-page-view";

export default function CommunitiesPage() {
  return (
    <div>
      <PageHeader title="Communities" description="Manage and moderate platform communities." />
      <CommunitiesPageView />
    </div>
  );
}
