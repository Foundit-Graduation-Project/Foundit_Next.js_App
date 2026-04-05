"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; 
import { Loader2, ShieldCheck, Mail, Lock, LogIn, Search } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { adminLoginSchema, AdminLoginFormValues } from "@/lib/validations/auth.schema";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; 
import { ADMIN_ROUTES } from "@/lib/constants/routes";
import { loginAdmin, logoutAdmin } from "@/redux/features/auth/authThunk";

export function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    const resultAction = await dispatch(loginAdmin(data));

    if (loginAdmin.fulfilled.match(resultAction)) {
      const userRole = resultAction.payload.user.role;

      // 🛑 THE BOUNCER LOGIC: Block normal users from the Admin Dashboard!
      if (userRole !== "super_admin" && userRole !== "community_admin") {
        await dispatch(logoutAdmin());
        toast.error("Access Denied. You do not have administrative privileges.");
        return;
      }

      toast.success("Welcome back, Admin!");
      
      // Wait for refreshToken cookie to be set before redirecting
      const waitForCookie = () => {
        const cookies = document.cookie;
        if (cookies.includes('refreshToken')) {
          router.replace(ADMIN_ROUTES.DASHBOARD);
        } else {
          // Retry after 100ms if cookie not found yet
          setTimeout(waitForCookie, 100);
        }
      };

      // Start waiting, with a safety timeout of 3 seconds
      const timeout = setTimeout(() => {
        console.warn('Cookie not set within timeout, redirecting anyway');
        router.replace(ADMIN_ROUTES.DASHBOARD);
      }, 3000);

      setTimeout(() => {
        clearTimeout(timeout);
        waitForCookie();
      }, 300); // Give the response time to arrive
      
    } else {
      toast.error((resultAction.payload as string) || "Invalid credentials.");
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-10 md:p-12 border border-white/50 backdrop-blur-sm">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-blue-600 font-bold text-lg mb-1 tracking-tight">Foundit</h2>
        <h1 className="text-[32px] font-black text-slate-900 leading-none mb-3">Admin Portal</h1>
        <p className="text-sm text-slate-500 font-medium tracking-tight">
          Sign in with your secure credentials
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-7">
        {/* Email Input */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-slate-800 font-bold uppercase text-[12px] tracking-widest px-1">
            Email
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
              className={`pl-12 h-14 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-slate-900 placeholder:text-slate-400 font-medium ${
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <Label htmlFor="password" className="text-slate-800 font-bold uppercase text-[12px] tracking-widest">
              Password
            </Label>
            <a href="/forgot-password" className="text-[12px] text-blue-600 font-black hover:underline tracking-tight">
              Forgot your password?
            </a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pl-12 h-14 rounded-2xl bg-slate-100/50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 transition-all text-slate-900 placeholder:text-slate-400 font-medium ${
                errors.password ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{errors.password.message}</p>}
        </div>

        {/* Security Notice */}
        <div className="bg-slate-100/50 rounded-2xl p-4 flex items-start gap-3 border border-slate-100/20">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
            Encrypted 256-bit secure session. Your IP and activity are logged for security auditing.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-base shadow-xl shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Authenticating...</>
          ) : (
            <>
              Access Dashboard
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Internal Version Footer */}
        <div className="pt-4 text-center">
          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            Guardian Systems V4.2
          </span>
        </div>
      </form>
    </div>
  );
}
