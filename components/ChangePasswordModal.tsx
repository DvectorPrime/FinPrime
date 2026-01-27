"use client";

import * as React from "react";
import { LuShieldCheck } from "react-icons/lu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChangePasswordProps {
    open: boolean,
    onOpenChange: (arg: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange } : ChangePasswordProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-4xl border-none bg-white dark:bg-slate-950 p-8 shadow-2xl">
        <DialogHeader className="items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4">
            <LuShieldCheck size={28} />
          </div>
          <DialogTitle className="text-2xl font-bold">Update Password</DialogTitle>
          <DialogDescription className="text-neutral-500">Enter your current password and choose a new one.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {["Current Password", "New Password", "Confirm Password"].map((label) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          ))}
        </div>

        <DialogFooter className="sm:flex-col gap-3">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-md font-bold">
            Save Changes
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full rounded-xl text-neutral-500">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}