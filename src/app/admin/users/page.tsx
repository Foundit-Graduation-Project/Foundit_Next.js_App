import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { UsersPageView } from "@/components/admin/users/users-page-view";

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="p-8 md:p-12 text-center">
        <div className="inline-block w-12 h-12 bg-blue-100 rounded-2xl animate-spin border-4 border-blue-200 border-t-transparent mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Users</h2>
        <p className="text-gray-500">Fetching user data...</p>
      </div>
    }>
      <div>
        <UsersPageView />
      </div>
    </Suspense>
  );
}
