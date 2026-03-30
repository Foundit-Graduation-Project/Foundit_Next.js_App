import React from "react";
import { ReportDetail } from "@/types/report.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteReportThunk } from "@/redux/features/reports/reportsThunk";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface Props {
  report: ReportDetail;
}

export const ReportDangerZone = ({ report }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to permanently delete this report. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-[24px]',
        confirmButton: 'rounded-xl px-6 py-2.5 font-bold order-2',
        cancelButton: 'rounded-xl px-6 py-2.5 font-bold order-1'
      }
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await dispatch(deleteReportThunk(report._id)).unwrap();
        toast.success("Report deleted successfully");
        router.replace("/admin/reports");
      } catch (err) {
        console.error("Failed to delete report:", err);
        setIsDeleting(false);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the report. Please try again.",
          icon: "error",
          customClass: {
            popup: 'rounded-[24px]',
            confirmButton: 'rounded-xl px-6 py-2.5 font-bold'
          }
        });
      }
    }
  };

  return (
    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
      </div>
      <p className="text-sm text-red-500/80 leading-relaxed mb-6 font-medium">
        Careful, deleting a report is permanent and cannot be undone. All associated history will be scrubbed from the secure server.
      </p>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm tracking-wide shadow-red-200"
      >
        {isDeleting ? "DELETING..." : "PERMANENTLY DELETE REPORT"}
      </button>
    </div>
  );
};
