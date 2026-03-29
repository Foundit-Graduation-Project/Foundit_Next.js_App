import { PageHeader } from "@/components/shared/page-header";
import { UsersPageView } from "@/components/admin/users/users-page-view";

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="User Management" description="View and manage user accounts and platform activities." />
      <UsersPageView />
    </div>
  );
}
