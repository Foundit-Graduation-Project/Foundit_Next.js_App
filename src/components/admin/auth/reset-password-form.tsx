"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPasswordSchema, ResetPasswordFormValues } from "@/lib/validations/auth.schema";
import { resetPasswordAPI } from "@/lib/api/auth.api";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPasswordAPI(token, data);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/admin-login");
      }, 3000);
      
    } catch (error: any) {
       toast.error(error?.response?.data?.message || "Invalid or expired token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-10 md:p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Success!</h1>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
            Your password has been securely updated. Redirecting you to login...
          </p>
          <Link 
            href="/admin-login" 
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-black hover:underline tracking-tight"
          >
            Go to Login Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-10 md:p-12 border border-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 text-white">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-[32px] font-black text-slate-900 leading-none mb-3">Set New Password</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight px-4 leading-relaxed">
          Choose a strong, unique password for your administrative access.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-7">
        {/* New Password */}
        <div className="space-y-3">
          <Label htmlFor="password" className="text-slate-800 font-bold uppercase text-[10px] tracking-widest px-1">
            New Access Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`pl-12 h-14 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-slate-900 font-medium ${
                errors.password ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-slate-800 font-bold uppercase text-[10px] tracking-widest px-1">
            Confirm New Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`pl-12 h-14 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-slate-900 font-medium ${
                errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-xl shadow-blue-200 transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Updating...</>
          ) : (
            "Update Access Password"
          )}
        </Button>
      </form>
    </div>
  );
}
