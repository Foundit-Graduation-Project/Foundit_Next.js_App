import { PageHeader } from "@/components/shared/page-header";
import { ReportsPageView } from "@/components/admin/reports/reports-page-view";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Platform Reports" description="Review and moderate user-reported content." />
      <ReportsPageView />
    </div>
  );
}
