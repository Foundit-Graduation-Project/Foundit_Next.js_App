"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ChevronLeft, Info, MapPin, Zap, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppDispatch } from "@/redux/store";
import { createCommunityAction } from "@/redux/features/communities/communitiesThunk";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const communitySchema = z.object({
  name: z.string().min(3, "Community name must be at least 3 characters"),
  type: z.enum(["University", "Compound", "Company", "Others"]),
  domain: z.string().regex(/^@/, "Domain must start with @").min(3),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  radius: z.number().min(100).max(10000),
  plan: z.enum(["PRO", "ENTERPRISE"]),
  immediateActivation: z.boolean(),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

export default function NewCommunityPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      type: "University",
      radius: 1000,
      longitude: 31.2117,
      latitude: 30.0263,
      plan: "PRO",
      immediateActivation: true,
    },
  });

  const radius = watch("radius");

  const onSubmit = async (data: CommunityFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        type: data.type,
        domain: data.domain,
        location: {
          lng: data.longitude,
          lat: data.latitude,
        },
        radius: data.radius,
        plan: data.plan,
        subscriptionStatus: data.immediateActivation ? "active" : "inactive",
      };

      await dispatch(createCommunityAction(payload)).unwrap();
      toast.success("Community registered successfully!");
      router.push("/admin/communities");
    } catch (error: any) {
      toast.error(error.message || "Failed to register community");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center p-4 md:p-10 animate-in fade-in duration-300">
      {/* Backdrop (Blurry background) */}
      <div 
        className="absolute inset-0 bg-black/5 bg-white/20 backdrop-blur-md transition-opacity" 
        onClick={() => router.push("/admin/communities")}
      />

      {/* Pop-Up Scrollable Container */}
      <div className="relative w-full max-w-5xl overflow-y-auto rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] border border-white/40 bg-white/90 backdrop-blur-xl animate-in slide-in-from-bottom-12 duration-700">
        <div className="p-8 lg:p-14 space-y-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <button 
                onClick={() => router.push("/admin/communities")}
                className="group flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Communities
              </button>

              <div className="space-y-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">Register New Community</h1>
                <p className="text-gray-500 font-medium tracking-tight">
                  Onboard a new tenant, configure their safe zone, and set subscription limits.
                </p>
              </div>
            </div>

            <button 
              onClick={() => router.push("/admin/communities")}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-10">
            {/* Basic Information */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                    COMMUNITY NAME
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g., Cairo University"
                    className={cn(
                      "w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none px-6 py-5 rounded-3xl text-sm font-bold text-gray-900 shadow-inner transition-all placeholder:text-gray-300",
                      errors.name && "border-rose-500 focus:border-rose-500"
                    )}
                  />
                  {errors.name && <p className="text-xs text-rose-500 px-2">{errors.name.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                    COMMUNITY TYPE
                  </label>
                  <select
                    {...register("type")}
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none px-6 py-5 rounded-3xl text-sm font-bold text-gray-900 shadow-inner transition-all cursor-pointer"
                  >
                    <option value="University">University</option>
                    <option value="Compound">Compound</option>
                    <option value="Company">Company</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                      EMAIL DOMAIN
                    </label>
                    <Info size={14} className="text-gray-300" />
                  </div>
                  <input
                    {...register("domain")}
                    placeholder="e.g., @cu.edu.eg"
                    className={cn(
                      "w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 outline-none px-6 py-5 rounded-3xl text-sm font-bold text-gray-900 shadow-inner transition-all placeholder:text-gray-300",
                      errors.domain && "border-rose-500 focus:border-rose-500"
                    )}
                  />
                  {errors.domain && <p className="text-xs text-rose-500 px-2">{errors.domain.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                    SUBSCRIPTION PLAN
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    {["PRO", "ENTERPRISE"].map((planOption) => (
                      <label
                        key={planOption}
                        className={cn(
                          "flex items-center justify-center gap-3 px-6 py-5 rounded-3xl border-2 cursor-pointer transition-all font-black text-xs uppercase tracking-wider",
                          watch("plan") === planOption
                            ? "bg-blue-50 border-blue-600 text-blue-600 shadow-md scale-[1.02]"
                            : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          value={planOption}
                          {...register("plan")}
                        />
                        {planOption}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Geo-Fencing & Location */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Geo-Fencing & Location</h2>
              </div>

              <div className="relative aspect-[21/9] w-full bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2666&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <div className="bg-white p-4 rounded-full shadow-2xl">
                    <MapPin className="w-10 h-10 text-blue-600 scale-110" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Interactive Map Interface</span>
                  <span className="text-[10px] font-bold text-gray-300">Click to pin the community center on implementation</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">
                    CENTER COORDINATES (LAT/LNG)
                  </label>
                  <div className="relative">
                    <input
                      readOnly
                      value={`${watch("latitude")?.toFixed(4)}° N, ${watch("longitude")?.toFixed(4)}° E`}
                      className="w-full bg-blue-50/50 border border-transparent px-6 py-5 rounded-3xl text-sm font-black text-blue-900 shadow-inner cursor-default"
                    />
                    <button 
                      type="button"
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-xl shadow-sm hover:text-blue-600 transition-all text-gray-400"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      SAFE ZONE RADIUS
                    </label>
                    <span className="text-sm font-black text-blue-600 tracking-tight">{radius} METERS</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    {...register("radius", { valueAsNumber: true })}
                    className="w-full h-2.5 bg-blue-50 rounded-full appearance-none cursor-pointer accent-blue-600 mb-2"
                  />
                </div>
              </div>
            </div>

            {/* Activation Toggle */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-[2rem] p-8 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-blue-100/60 p-3.5 rounded-2xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Immediate Activation</h3>
                  <p className="text-sm text-gray-500 font-medium">Community will go live as soon as form is submitted</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  {...register("immediateActivation")}
                />
                <div className="w-16 h-8 bg-blue-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-8 rtl:peer-checked:after:-translate-x-8 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-8 pt-8 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => router.push("/admin/communities")}
                className="text-gray-400 hover:text-gray-900 font-black text-sm uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-14 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-2xl shadow-blue-200 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {isSubmitting ? "Registering..." : "Register Community"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
