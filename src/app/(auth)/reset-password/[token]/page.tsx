import React from "react";
import { ResetPasswordForm } from "@/components/admin/auth/reset-password-form";

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  // Await params in Next.js 13+ (App Router)
  const { token } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-admin-auth items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <ResetPasswordForm token={token} />
      </div>

      <footer className="mt-8 text-center space-y-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          © 2024 FOUNDIT  GUARDIAN SYSTEMS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
