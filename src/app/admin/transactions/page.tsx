import { PageHeader } from "@/components/shared/page-header";
import { TransactionsPageView } from "@/components/admin/transactions/transactions-page-view";

export default function TransactionsPage() {
  return (
    <div>
      <PageHeader title="Transaction History" description="View system financial activity and history." />
      <TransactionsPageView />
    </div>
  );
}
