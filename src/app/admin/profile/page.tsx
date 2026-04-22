import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/admin/profile/profile-form";
import { AvatarUpload } from "@/components/admin/profile/avatar-upload";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <PageHeader 
          title="Admin Profile Settings" 
          description="Manage your administrative credentials and security preferences." 
        />
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-50/50 border border-blue-50 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
           {/* Background Glow */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
           
           <div className="relative z-10 select-none">
             <AvatarUpload />
             <ProfileForm />
           </div>
        </div>
      </div>
    </div>
  );
}
