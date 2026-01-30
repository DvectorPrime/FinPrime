"use client";

import * as React from "react";
import { useState } from "react";
import { LuShieldCheck, LuLoader, LuCircleAlert } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChangePasswordProps {
  open: boolean;
  onOpenChange: (arg: boolean) => void;
  hasPassword?: boolean; // 1. New Prop
}

export function ChangePasswordModal({ open, onOpenChange, hasPassword = true }: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (open) {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setError("");
      setSuccess(false);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // 2. Conditional Validation
    // Only check currentPassword if the user actually has one
    if (hasPassword && !formData.currentPassword) {
        setError("Current password is required.");
        setLoading(false);
        return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in the new password fields.");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send null if they don't have a password, backend handles logic
          currentPassword: hasPassword ? formData.currentPassword : null, 
          newPassword: formData.newPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-4xl border-none bg-white dark:bg-slate-950 p-8 shadow-2xl">
        <DialogHeader className="items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4">
            <LuShieldCheck size={28} />
          </div>
          {/* 3. Dynamic Title */}
          <DialogTitle className="text-2xl dark:text-white font-bold">
            {hasPassword ? "Update Password" : "Set Password"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500">
            {hasPassword 
                ? "Enter your current password and choose a new one." 
                : "Secure your account by setting a password for login."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <LuCircleAlert className="shrink-0" /> {error}
          </div>
        )}
        
        {success && (
           <div className="p-3 text-sm text-center text-green-600 bg-green-50 dark:bg-green-900/20 rounded-xl font-medium">
             Password updated successfully!
           </div>
        )}

        <div className="space-y-4 py-4">
          
          {/* 4. Conditional Rendering of Current Password Input */}
          {hasPassword && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading || success}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 dark:text-white bg-neutral-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading || success}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 dark:text-white bg-neutral-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading || success}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 dark:text-white bg-neutral-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter className="sm:flex-col gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-md font-bold disabled:opacity-70"
          >
            {loading ? (
              <>
                <LuLoader className="mr-2 h-5 w-5 animate-spin" /> {hasPassword ? "Updating..." : "Setting Password..."}
              </>
            ) : success ? (
              "Success!"
            ) : (
              hasPassword ? "Save Changes" : "Set Password"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}