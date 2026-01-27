"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  LuImage, LuShieldCheck, LuLogOut, LuTrash2, 
  LuSun, LuMoon, LuMonitor, LuLock 
} from "react-icons/lu"; // Using Lu to maintain consistency with your style

import CurrencyDropdown from "@/components/CurrencyPicker";
import CustomSwitch from "@/components/switchButton";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [theme, setTheme] = useState("system");

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-10 md:px-8 lg:py-16 space-y-12">
        
        {/* Header */}
        <header className="space-y-1 border-b border-neutral-100 dark:border-slate-900 pb-6">
          <h3 className="text-3xl font-bold tracking-tight">Settings</h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your account settings, preferences, and security.
          </p>
        </header>

        {/* Profile Section */}
        <section className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold">Profile</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Update your personal details and manage your profile.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 rounded-3xl bg-neutral-50 dark:bg-slate-900/50">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                <Image src="/api/placeholder/80/80" alt="Avatar" width={80} height={80} className="object-cover" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg">
                <LuImage size={14} />
              </button>
            </div>
            <div>
              <p className="font-medium">Change Avatar</p>
              <p className="text-xs text-neutral-500">Recommended size: 400x400px</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="firstName">First Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-transparent" type="text" id="firstName" defaultValue="FirstName" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="lastName">Last Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-transparent" type="text" id="lastName" defaultValue="LastName" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="email">Email Address</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 text-neutral-400 cursor-not-allowed" type="email" id="email" value="example@gmail.com" disabled />
            </div>
          </div>
        </section>

        <hr className="border-neutral-100 dark:border-slate-900" />

        {/* Preferences Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold">Preferences</h4>
            <p className="text-sm text-neutral-500">Configure your app UI and localization.</p>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <h5 className="text-sm font-medium">Theme Mode</h5>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: <LuSun /> },
                  { id: 'dark', label: 'Dark', icon: <LuMoon /> },
                  { id: 'system', label: 'System', icon: <LuMonitor /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-sm",
                      theme === item.id 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                        : "border-neutral-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-medium">Default Currency</h5>
              <CurrencyDropdown />
            </div>
          </div>
        </section>

        <hr className="border-neutral-100 dark:border-slate-900" />

        {/* AI & Notifications */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-semibold uppercase text-xs tracking-[0.2em] text-blue-600 dark:text-blue-400">AI & Notifications</h4>
            <p className="text-sm text-neutral-500">Manage automation and alert settings.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="font-medium">Enable AI Insights</p>
                <p className="text-xs text-neutral-500">Personalized financial recommendations.</p>
              </div>
              <CustomSwitch checked={true} />
            </div>

            <div className="flex items-center justify-between p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="font-medium">Budget Alerts</p>
                <p className="text-xs text-neutral-500">Alerts for exceeding monthly limits.</p>
              </div>
              <CustomSwitch />
            </div>
          </div>
        </section>

        {/* Security & Danger Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 rounded-3xl border border-neutral-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold flex items-center gap-2"><LuLock size={18} /> Security</h4>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Change Password
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
              <LuLogOut size={16} /> Logout
            </button>
          </div>

          <div className="p-6 rounded-3xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 space-y-4">
            <h4 className="font-bold text-red-600 flex items-center gap-2"><LuTrash2 size={18} /> Danger Zone</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Permanently delete your account and all associated data. This cannot be undone.</p>
            <button className="w-full py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
    </main>
  );
}