import React from "react";
import { 
  Sheet, 
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { UserStatusBadge } from "./user-status-badge";
import { Calendar, Mail, Shield, ShieldCheck, CreditCard, Activity, MapPin } from "lucide-react";

interface UserDetailsCardProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsCard({ user, isOpen, onClose }: UserDetailsCardProps) {
  if (!user) return null;

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500";
    if (score >= 50) return "text-orange-500 bg-orange-500";
    return "text-red-500 bg-red-500";
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-100";
    return "bg-red-50 text-red-700 border-red-100";
  };

  const trustScore = user.trustScore ?? 100;
  const tsColor = getTrustScoreColor(trustScore);
  const tsBgColor = getTrustScoreBg(trustScore);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-0 border-l-0 shadow-2xl sm:rounded-l-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>{user.name}'s Profile</SheetTitle>
          <SheetDescription>Detailed information and metrics for {user.name}.</SheetDescription>
        </SheetHeader>

        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-white relative h-40">
           <div className="absolute top-4 right-8 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
             {user.plan || "Free User"}
           </div>
        </div>
        
        {/* Avatar positioned halfway across the header edge */}
        <div className="px-6 relative">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-xl -mt-12 overflow-hidden flex items-center justify-center z-10 relative">
            {user.avatar?.url ? (
               <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
            ) : (
               <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
                 {user.name?.charAt(0).toUpperCase()}
               </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user.name}</h2>
              <div className="flex items-center text-gray-500 mt-1 space-x-2 text-sm max-w-[200px] sm:max-w-[300px] truncate">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            <div className="shrink-0 pt-1">
              <UserStatusBadge type="status" value={user.status} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             {/* Trust Score Card */}
             <div className={`p-4 rounded-xl border ${tsBgColor} flex flex-col shadow-sm`}>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Trust Score</span>
                   <ShieldCheck className="h-4 w-4 opacity-80" />
                </div>
                <div className="mt-2 flex items-end gap-2">
                   <span className="text-3xl font-black tracking-tight">{trustScore}</span>
                   <span className="mb-1 text-sm font-medium opacity-80">/ 100</span>
                </div>
             </div>

             {/* Credits Card */}
             <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
                <div className="flex items-center justify-between text-gray-500">
                   <span className="text-xs font-semibold uppercase tracking-wider">Credits</span>
                   <CreditCard className="h-4 w-4 text-blue-500" />
                </div>
                <div className="mt-2 flex items-end gap-2">
                   <span className="text-3xl font-black text-gray-900 tracking-tight">
                     {user.credits > 9999 || user.plan === "Premium" || user.role === "super_admin" ? "∞" : user.credits || 0}
                   </span>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-100 mt-8 pt-8 space-y-4">
             <h3 className="font-semibold text-gray-900 text-sm tracking-wide uppercase px-1">Account Details</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-100 rounded-xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-100 shadow-sm bg-white">
                <div className="p-4 flex flex-col justify-center items-center text-center hover:bg-gray-50/50 transition-colors">
                   <Shield className="h-5 w-5 text-emerald-500 mb-2" />
                   <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Role</span>
                   <div className="scale-90 transform origin-top"><UserStatusBadge type="role" value={user.role} /></div>
                </div>
                
                <div className="p-4 flex flex-col justify-center items-center text-center px-2 hover:bg-gray-50/50 transition-colors">
                   <MapPin className="h-5 w-5 text-indigo-500 mb-2" />
                   <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Community</span>
                   <span className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight px-1">
                     {user.community?.name || "Global"}
                   </span>
                </div>
 
                <div className="p-4 flex flex-col justify-center items-center text-center hover:bg-gray-50/50 transition-colors">
                   <Calendar className="h-5 w-5 text-blue-500 mb-2" />
                   <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Joined</span>
                   <span className="font-semibold text-sm text-gray-900">
                     {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                   </span>
                </div>
             </div>
          </div>

          <div className="border-t border-gray-100 mt-8 pt-8 pb-12">
             <h3 className="font-semibold text-gray-900 text-sm tracking-wide uppercase mb-4">Security & Metadata</h3>
             <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-100 shadow-inner space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">User ID</span>
                   <span className="text-gray-900 font-mono text-xs bg-white px-2 py-1 rounded border border-gray-200">{user._id || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">Email Verification</span>
                   <span className={`font-semibold ${user.isVerified ? "text-emerald-600" : "text-amber-500"}`}>
                     {user.isVerified === undefined ? "Unknown" : user.isVerified ? "Verified" : "Pending"}
                   </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">Last Updated</span>
                   <span className="text-gray-900 font-medium">
                     {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
