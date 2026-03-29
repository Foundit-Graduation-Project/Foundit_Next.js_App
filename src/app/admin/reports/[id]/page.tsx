import { PageHeader } from "@/components/shared/page-header";
import { ReportDetails } from "@/components/admin/reports/report-details";

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <PageHeader title={`Report #${params.id}`} description="View report details and take moderation actions." />
      <ReportDetails />
    </div>
  );
}
