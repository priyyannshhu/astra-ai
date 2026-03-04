"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  LogOut,
  Trash2,
} from "lucide-react";

export default function SecuritySettings() {
  const router = useRouter();
  const { userDetail, isLoadingUser } = useContext(UserDetailContext);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch user sessions
  const sessions = useQuery(
    api.auth.GetUserSessions,
    userDetail?._id ? { userId: userDetail._id } : "skip"
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const changePassword = useMutation(api.userProfile.ChangePassword);
  const revokeSession = useMutation(api.auth.RevokeSession);

  useEffect(() => {
    if (!isLoadingUser && !userDetail) {
      router.push("/");
    }
  }, [userDetail, isLoadingUser, router]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setMessage({
        type: "error",
        text: "Please fill in all password fields",
      });
      setIsSaving(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      setIsSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      setIsSaving(false);
      return;
    }

    try {
      await changePassword({
        userId: userDetail._id,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await revokeSession({ sessionId });
      setMessage({
        type: "success",
        text: "Session revoked",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to revoke session",
      });
    }
  };

  if (isLoadingUser) {
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
            <h1 className="text-3xl font-bold text-white">Security Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account security</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
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

        {/* Change Password Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
          </div>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 py-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Active Sessions Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <LogOut size={24} className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Active Sessions</h2>
          </div>

          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {session.userAgent?.includes("Chrome")
                        ? "Chrome"
                        : session.userAgent?.includes("Firefox")
                        ? "Firefox"
                        : "Browser"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      IP: {session.ipAddress || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Last used: {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRevokeSession(session._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No active sessions found</p>
          )}
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={24} className="text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-300 mb-4">Danger Zone</h2>
          <p className="text-sm text-slate-400 mb-4">
            These actions are permanent and cannot be undone
          </p>
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            disabled
          >
            <Trash2 size={18} />
            Delete Account
          </Button>
        </div>
      </main>
    </div>
  );
}
