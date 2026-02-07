"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import {
  LuImage,
  LuLogOut,
  LuTrash2,
  LuSun,
  LuMoon,
  LuMonitor,
  LuLock,
  LuLoader,
  LuCheck,
} from "react-icons/lu";

import CurrencyDropdown from "@/components/CurrencyPicker";
import CustomSwitch from "@/components/switchButton";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal"; // 1. IMPORT HERE
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useAuth } from "@/context/authContext";
import { useMenu } from "@/context/menuContext";

export default function SettingsPage() {
  const router = useRouter();
  const { setMenuShowing } = useMenu();

  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 2. NEW STATE

  // 1. New State for Avatar Uploading
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get User AND Loading state
  const { user, setUser, refreshUser, loading: authLoading } = useAuth();

  // --- STATE MANAGEMENT ---
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  const [theme, setTheme] = useState("System");
  const [currency, setCurrency] = useState("NGN");

  const [notifications, setNotifications] = useState({
    aiInsights: true,
    budgetAlerts: false,
  });

  useEffect(() => {
    setMenuShowing(false);
  }, [setMenuShowing]);

  // --- AUTH PROTECTION ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    refreshUser()
  }, [])

  // --- DATA SYNC ---
  useEffect(() => {
    if (user) {
      setProfileData((prev) => {
        const newFirstName = user.firstName || "";
        const newLastName = user.lastName || "";
        const newEmail = user.email || "";
        const newAvatar = user.avatarUrl || "";

        if (
          prev.firstName === newFirstName &&
          prev.lastName === newLastName &&
          prev.email === newEmail &&
          prev.avatar === newAvatar
        ) {
          return prev;
        }

        return {
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          avatar: newAvatar,
        };
      });

      setTheme(user.themePreference || "System");
      setCurrency(user.currencyPreference || "NGN");
      setNotifications({
        aiInsights: user.aiInsights,
        budgetAlerts: user.budgetAlerts,
      });
    }
  }, [user]);

  // --- AVATAR UPLOAD HANDLER ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Check file size (e.g. 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please select an image under 5MB.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/upload-avatar`,
        {
          method: "POST",
          body: formData, // No Content-Type header needed; browser sets it
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();

      // 1. Update local state to show new image immediately
      setProfileData((prev) => ({ ...prev, avatar: data.avatarUrl }));

      // 2. Refresh global context so Navbar updates instantly
      await refreshUser();
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      // Reset input so you can select the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // --- GENERIC SAVE FUNCTION ---
  const saveToBackend = async (data: any) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to save settings", err);
      throw err;
    }
  };

  // --- AUTO SAVE ---
  const profileSaveStatus = useAutoSave(profileData, saveToBackend, 1000);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);

    // 1. Define the valid options (for a real JavaScript check)
    const validThemes = ['System', 'Light', 'Dark'];

    // 2. Check if the string is actually valid
    if (user && validThemes.includes(newTheme)) {
        setUser((prev) => {
            return prev ? {
                ...prev,
                // 3. The Magic Fix: "as" casts the string to the specific type
                themePreference: newTheme as 'System' | 'Light' | 'Dark'
            } : null
        })
    }
    
    await saveToBackend({ themePreference: newTheme });
};

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await saveToBackend({ currency: newCurrency });
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    await saveToBackend({ [key]: value });
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <LuLoader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-56px)] overflow-y-auto bg-white dark:bg-slate-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <title>Settings</title>
      <div className="max-w-4xl mx-auto px-4 py-10 md:px-8 lg:py-16 space-y-12">
        {/* Header */}
        <header className="space-y-1 border-b border-neutral-100 dark:border-slate-900 pb-6 flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">Settings</h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              Manage your account settings, preferences, and security.
            </p>
          </div>
        </header>

        {/* Profile Section */}
        <section className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold">Profile</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Update your personal details and manage your profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 rounded-3xl bg-neutral-50 dark:bg-slate-900/50">
            {/* Hidden Input Field */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />

            {/* Clickable Avatar Area */}
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()} // Trigger the hidden input
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm relative">
                <UserAvatar
                  src={profileData.avatar}
                  name={`${profileData.firstName} ${profileData.lastName}`}
                  size="lg"
                />

                {/* Loading Overlay */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <LuLoader className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer disabled:cursor-not-allowed transition-transform group-hover:scale-110"
              >
                <LuImage size={14} />
              </button>
            </div>

            <div>
              <p className="font-medium">Change Avatar</p>
              <p className="text-xs text-neutral-500">
                Recommended size: 400x400px
              </p>
            </div>

            {/* VISUAL SAVE INDICATOR */}
            <div className="h-6 flex items-center text-sm font-medium sm:ml-auto">
              {profileSaveStatus === "saving" && (
                <span className="flex items-center gap-2 text-neutral-500">
                  <LuLoader className="animate-spin" /> Saving...
                </span>
              )}
              {profileSaveStatus === "saved" && (
                <span className="flex items-center gap-2 text-green-600">
                  <LuCheck /> Saved
                </span>
              )}
              {/* Added error visual for auto-save failure - shows error message */}
              {profileSaveStatus === "error" && (
                <span className="flex items-center gap-2 text-red-600">
                  <LuLoader className="animate-spin" /> Failed to save
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-neutral-500"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                type="text"
                id="firstName"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-neutral-500"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                type="text"
                id="lastName"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-neutral-500"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 text-neutral-400 cursor-not-allowed"
                type="email"
                id="email"
                value={profileData.email}
                disabled
              />
            </div>
          </div>
        </section>

        <hr className="border-neutral-100 dark:border-slate-900" />

        {/* Preferences Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold">Preferences</h4>
            <p className="text-sm text-neutral-500">
              Configure your app UI and localization.
            </p>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <h5 className="text-sm font-medium">Theme Mode</h5>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Light", label: "Light", icon: <LuSun /> },
                  { id: "Dark", label: "Dark", icon: <LuMoon /> },
                  { id: "System", label: "System", icon: <LuMonitor /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleThemeChange(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-sm cursor-pointer",
                      theme === item.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "border-neutral-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-900",
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
              {/* Using Controlled Component */}
              <CurrencyDropdown
                value={currency}
                onChange={(val) => handleCurrencyChange(val)}
              />
            </div>
          </div>
        </section>

        <hr className="border-neutral-100 dark:border-slate-900" />

        {/* AI & Notifications */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              AI & Notifications
            </h4>
            <p className="text-sm text-neutral-500">
              Manage automation and alert settings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="font-medium">Enable AI Insights</p>
                <p className="text-xs text-neutral-500">
                  Personalized financial recommendations.
                </p>
              </div>
              <CustomSwitch
                checked={notifications.aiInsights}
                onCheckedChange={(val) =>
                  handleNotificationChange("aiInsights", val)
                }
              />
            </div>

            <div className="flex items-center justify-between p-5 rounded-3xl bg-neutral-50 dark:bg-slate-900/50 border border-neutral-100 dark:border-slate-800">
              <div className="space-y-1">
                <p className="font-medium">Budget Alerts</p>
                <p className="text-xs text-neutral-500">
                  Alerts for exceeding monthly limits.
                </p>
              </div>
              <CustomSwitch
                checked={notifications.budgetAlerts}
                onCheckedChange={(val) =>
                  handleNotificationChange("budgetAlerts", val)
                }
              />
            </div>
          </div>
        </section>

        {/* Security & Danger Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 rounded-3xl border border-neutral-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <LuLock size={18} /> Security
            </h4>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <LuLogOut size={16} /> Logout
            </button>
          </div>

          <div className="p-6 rounded-3xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 space-y-4">
            <h4 className="font-bold text-red-600 flex items-center gap-2">
              <LuTrash2 size={18} /> Danger Zone
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
            {/* 3. UPDATED DELETE BUTTON */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        hasPassword={user?.hasPassword}
      />
      {/* 4. CONNECT MODAL */}
      <DeleteAccountModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        isGoogleAccount={user?.isGoogleAccount} // <--- PASS THIS PROP
      />
    </main>
  );
}
