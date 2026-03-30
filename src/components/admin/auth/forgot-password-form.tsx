"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/validations/auth.schema";
import { forgotPasswordAPI } from "@/lib/api/auth.api";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await forgotPasswordAPI(data);
      setIsSubmitted(true);
      toast.success("Reset link sent! Please check your email.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-10 md:p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Send className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Check Your Inbox</h1>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed max-w-[280px]">
            We've sent a password reset link to your corporate email address.
          </p>
          <Link 
            href="/admin-login" 
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-black hover:underline tracking-tight"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-10 md:p-12 border border-white/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 font-black text-white">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-[32px] font-black text-slate-900 leading-none mb-3">Forgot Password?</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight px-4 leading-relaxed">
          Enter your admin email and we'll send you a link to reset your access.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-7">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-slate-800 font-bold uppercase text-[10px] tracking-widest px-1">
            Corporate Email
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <span className="text-lg font-medium">@</span>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="admin@foundit.com"
              {...register("email")}
              className={`pl-12 h-14 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-slate-900 font-medium ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-xl shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
          ) : (
            "Reset Access Link"
          )}
        </Button>

        <div className="pt-4 text-center">
          <Link 
            href="/admin-login" 
            className="text-xs text-slate-400 font-bold hover:text-blue-600 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
