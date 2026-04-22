import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { updateReportStatus } from "@/redux/features/reports/reportsThunk";
import { ReportStatus } from "@/types/report.types";

export const ModerationActions = ({ reportId }: { reportId: string }) => {
  const dispatch = useAppDispatch();

  const handleUpdate = (status: ReportStatus) => {
    dispatch(updateReportStatus({ id: reportId, status }));
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleUpdate("RESOLVED")}>Approve</Button>
      <Button variant="destructive" onClick={() => handleUpdate("REJECTED")}>Reject</Button>
    </div>
  );
};