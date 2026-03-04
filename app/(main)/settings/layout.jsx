"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserDetailContext } from "@/context/UserDetailContext";
import {
  User,
  Lock,
  Settings,
  LogOut,
} from "lucide-react";

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const { userDetail, isLoadingUser } = useContext(UserDetailContext);

  useEffect(() => {
    if (!isLoadingUser && !userDetail) {
      router.push("/");
    }
  }, [userDetail, isLoadingUser, router]);

  const menuItems = [
    {
      label: "Account",
      href: "/settings/account",
      icon: Settings,
      description: "General account information",
    },
    {
      label: "Profile",
      href: "/settings/profile",
      icon: User,
      description: "Edit your profile",
    },
    {
      label: "Security",
      href: "/settings/security",
      icon: Lock,
      description: "Password and sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Settings
              </h3>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800/50 transition-colors group"
                  >
                    <Icon size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
