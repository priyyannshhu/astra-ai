"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  User,
  Settings,
  LogOut,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { userDetail, isLoadingUser } = useContext(UserDetailContext);
  const [copiedId, setCopiedId] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isLoadingUser && !userDetail) {
      router.push("/");
    }
  }, [userDetail, isLoadingUser, router]);

  const handleCopyId = () => {
    if (userDetail?._id) {
      navigator.clipboard.writeText(userDetail._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogout = () => {
    // This would be handled by your auth context
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account details</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        {/* Messages */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
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

        {/* Account Information Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {userDetail?.name || "User"}
              </h2>
              <p className="text-slate-400 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {userDetail?.email}
              </p>
              {userDetail?.authMethod && (
                <p className="text-sm text-slate-400 mt-2">
                  Auth Method: <span className="text-blue-400">{userDetail.authMethod}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-700">
            {/* User ID */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                User ID
              </label>
              <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2">
                <code className="flex-1 text-xs text-slate-300 break-all">
                  {userDetail?._id}
                </code>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">
                  {userDetail?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Email Verified */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Email Verification
              </label>
              <div className="flex items-center gap-2">
                {userDetail?.emailVerified ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">Verified</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400">Pending verification</span>
                  </>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Account Created
              </label>
              <p className="text-slate-400">
                {userDetail?.createdAt
                  ? new Date(userDetail.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>

            {/* Last Login */}
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Last Login
              </label>
              <p className="text-slate-400">
                {userDetail?.lastLoginAt
                  ? new Date(userDetail.lastLoginAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "First login"}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => router.push("/settings/profile")}
            className="w-full px-8 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors border-b border-slate-700 group"
          >
            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-400" />
              <div className="text-left">
                <p className="font-medium text-white">Edit Profile</p>
                <p className="text-sm text-slate-400">Update your profile information</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
          </button>

          <button
            onClick={() => router.push("/settings/security")}
            className="w-full px-8 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors border-b border-slate-700 group"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-blue-400" />
              <div className="text-left">
                <p className="font-medium text-white">Security</p>
                <p className="text-sm text-slate-400">Password, sessions, 2FA</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-8 py-4 flex items-center justify-between hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-400" />
              <div className="text-left">
                <p className="font-medium text-white">Sign Out</p>
                <p className="text-sm text-slate-400">End your session</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <p className="text-sm text-slate-400">
            For additional help, contact support or refer to our documentation. Your account data is secure and encrypted.
          </p>
        </div>
      </main>
    </div>
  );
}
