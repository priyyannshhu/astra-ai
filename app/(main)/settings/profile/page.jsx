"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Check, AlertCircle } from "lucide-react";

export default function ProfileSettings() {
  const router = useRouter();
  const { userDetail, isLoadingUser } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch user profile
  const userProfile = useQuery(
    api.userProfile.GetUserProfile,
    userDetail?._id ? { userId: userDetail._id } : "skip"
  );

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    website: "",
    location: "",
    company: "",
    phoneNumber: "",
  });

  const updateProfile = useMutation(api.userProfile.UpdateUserProfile);

  useEffect(() => {
    if (!isLoadingUser && !userDetail) {
      router.push("/");
    }
  }, [userDetail, isLoadingUser, router]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || userDetail?.name || "",
        bio: userDetail?.bio || "",
        website: userProfile.website || "",
        location: userProfile.location || "",
        company: userProfile.company || "",
        phoneNumber: userProfile.phoneNumber || "",
      });
      setIsLoading(false);
    }
  }, [userProfile, userDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile({
        userId: userDetail._id,
        displayName: formData.displayName,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        company: formData.company,
        phoneNumber: formData.phoneNumber,
      });

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-slate-400 mt-1">Manage your public profile information</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/20 border border-green-500/50 text-green-300"
                : "bg-red-500/20 border border-red-500/50 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://example.com"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="City, Country"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Your company"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
