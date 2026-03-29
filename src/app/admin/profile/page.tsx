import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/admin/profile/profile-form";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile Settings" description="Manage your account preferences and security." />
      <ProfileForm />
    </div>
  );
}
