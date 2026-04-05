import React from "react";
import { ResetPasswordForm } from "@/components/admin/auth/reset-password-form";

interface Props {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-admin-auth items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <ResetPasswordForm token={params.token} />
      </div>

      <footer className="mt-8 text-center space-y-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          © 2024 FOUNDIT GUARDIAN SYSTEMS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
