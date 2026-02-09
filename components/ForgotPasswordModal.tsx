"use client";

import { useState } from "react";
import { LuLoader, LuMail, LuKeyRound } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordProps) {
  const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClose = () => {
    onOpenChange(false);

    setTimeout(() => {
        setStep("EMAIL");
        setEmail("");
        setCode("");
        setNewPassword("");
        setError("");
        setSuccessMsg("");
    }, 300);
  };

  // Step 1: Request PIN
  const handleSendCode = async () => {
    if (!email) {
        setError("Please enter your email.");
        return;
    }
    setLoading(true);
    setError("");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to send code");

        setStep("RESET"); 
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  // Step 2: Verify PIN & Reset Password
  const handleResetPassword = async () => {
    if (!code || !newPassword) {
        setError("Please fill in all fields.");
        return;
    }
    setLoading(true);
    setError("");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Reset failed");

        setSuccessMsg("Password reset successfully! You can now login.");
        
        // Close modal after success
        setTimeout(() => {
            handleClose();
        }, 2000);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-slate-900 border-none rounded-2xl shadow-xl">
        <DialogHeader className="items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-2">
                {successMsg ? <FaCheckCircle size={28} className="text-green-500" /> : <LuKeyRound size={28} />}
            </div>
            <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                {step === "EMAIL" ? "Forgot Password?" : "Reset Password"}
            </DialogTitle>
            <DialogDescription className="text-neutral-500">
                {step === "EMAIL" 
                    ? "Enter your email and we'll send you a recovery code." 
                    : `Enter the code sent to ${email}`}
            </DialogDescription>
        </DialogHeader>

        {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
            </div>
        )}
        
        {successMsg && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 text-sm rounded-lg text-center font-medium">
                {successMsg}
            </div>
        )}

        <div className="py-4 space-y-4">
            {step === "EMAIL" ? (
                // STEP 1 FORM
                <div>
                    <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Email Address</label>
                    <div className="relative">
                        <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:text-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
            ) : (
                // STEP 2 FORM
                <>
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Verification Code</label>
                        <input
                            type="text"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit PIN"
                            maxLength={6}
                            className="w-full text-center tracking-[0.3em] font-bold text-lg py-3 rounded-xl border border-neutral-200 dark:text-white dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            autoComplete="new-password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:text-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </>
            )}
        </div>

        <div className="flex-col gap-2">
            {!successMsg && (
                <Button 
                    onClick={step === "EMAIL" ? handleSendCode : handleResetPassword} 
                    disabled={loading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer disabled:cursor-not-allowed"
                >
                    {loading ? <LuLoader className="animate-spin" /> : (step === "EMAIL" ? "Send Code" : "Reset Password")}
                </Button>
            )}
            <Button 
                variant="ghost" 
                onClick={handleClose} 
                disabled={loading}
                className="w-full rounded-xl dark:text-white cursor-pointer disabled:cursor-not-allowed"
            >
                Cancel
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}