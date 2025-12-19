import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../api/axios";

interface ProfilePictureUploadProps {
  profilePictureUrl?: string;
  firstName?: string;
  lastName?: string;
  onUploadSuccess: () => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export default function ProfilePictureUpload({
  profilePictureUrl,
  firstName,
  lastName,
  onUploadSuccess,
  onError,
  onSuccess,
}: ProfilePictureUploadProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }

    try {
      setUploading(true);
      onError("");

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Update profile picture
        await api.patch(
          "/employee-profile/self-update",
          { profilePictureUrl: base64String },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        onUploadSuccess();
        onSuccess("Profile picture updated successfully");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("Failed to upload profile picture:", error);
      onError(error.response?.data?.message || "Failed to upload profile picture");
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await api.patch(
        "/employee-profile/self-update",
        { profilePictureUrl: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUploadSuccess();
      onSuccess("Profile picture removed successfully");
      setUploading(false);
    } catch (error: any) {
      onError(error.response?.data?.message || "Failed to remove picture");
      setUploading(false);
    }
  };

  return (
    <div className="mb-6 pb-6 border-b border-white/10">
      <label className="block text-sm font-semibold text-white/90 mb-3">
        Profile Picture
      </label>
      <div className="flex items-center gap-4">
        <div className="relative">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400/50 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement)
                  .nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 flex items-center justify-center text-3xl font-bold text-white shadow-lg ${
              profilePictureUrl ? "hidden" : "flex"
            }`}
          >
            {firstName?.[0]?.toUpperCase() || "U"}
            {lastName?.[0]?.toUpperCase() || ""}
          </div>
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            id="profilePictureUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label
            htmlFor="profilePictureUpload"
            className={`inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium shadow-lg shadow-cyan-500/20 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading
              ? "Uploading..."
              : profilePictureUrl
              ? "Change Picture"
              : "Upload Picture"}
          </label>
          {profilePictureUrl && (
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="ml-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl text-sm font-medium transition-all duration-200 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

