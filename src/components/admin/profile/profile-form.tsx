"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  User, 
  Lock, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { updateProfile, changePassword } from "@/redux/features/auth/authThunk";
import { profileSchema, changePasswordSchema, ProfileFormValues, ChangePasswordFormValues } from "@/lib/validations/profile.schema";
import { toast } from "react-hot-toast";
import { useMounted } from "@/hooks/use-mounted";

export function ProfileForm() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMounted = useMounted();

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onUpdateProfile = async (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      await dispatch(changePassword(data)).unwrap();
      toast.success("Password changed successfully");
      resetPasswordForm();
    } catch (error: any) {
      toast.error(error || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          General Information
        </h2>
        
        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Name
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                {...registerProfile("name")}
                placeholder="Alex Rivera"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
            {profileErrors.name && (
              <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Password Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          Security Settings
        </h2>

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                {...registerPassword("currentPassword")}
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  {...registerPassword("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  {...registerPassword("confirmNewPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmNewPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isChangingPassword ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
