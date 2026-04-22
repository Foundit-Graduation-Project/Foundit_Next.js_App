"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSelectors";
import { updateAvatar } from "@/redux/features/auth/authThunk";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { useMounted } from "@/hooks/use-mounted";

export function AvatarUpload() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMounted = useMounted();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      await dispatch(updateAvatar(formData)).unwrap();
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative group cursor-pointer" onClick={triggerFileInput}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
          <Image
            src={isMounted ? getImageUrl(user?.avatar, user?.name) : getImageUrl(null, "Admin")}
            alt={isMounted ? (user?.name || "Avatar") : "Avatar"}
            fill
            unoptimized={true}
            className="object-cover transition-transform group-hover:scale-110"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <div className="bg-blue-600 p-2 rounded-full shadow-lg">
                <Camera className="w-5 h-5 text-white" />
             </div>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="text-center">
        <button 
          onClick={triggerFileInput}
          className="text-blue-600 font-semibold hover:underline text-sm"
        >
          Upload New Image
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Recommended: Square JPG or PNG, 400×400px
        </p>
      </div>
    </div>
  );
}
