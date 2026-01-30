"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuTrash2, LuTriangleAlert, LuLoader, LuEye, LuEyeOff } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastContext"; 

interface DeleteAccountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGoogleAccount?: boolean; // NEW PROP
}

export function DeleteAccountModal({ open, onOpenChange, isGoogleAccount }: DeleteAccountProps) {
  const { showToast } = useToast();
  
  const [step, setStep] = useState<"input" | "confirm">("input");
  
  // We use this single state for either "Password" OR "Delete Confirmation Text"
  const [inputValue, setInputValue] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state when modal closes
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setStep("input");
        setInputValue("");
        setError("");
        setLoading(false);
    }, 300);
  };

  // Step 1: Verification Logic
  const handleVerify = () => {
    if (!inputValue) {
      setError(isGoogleAccount ? "Please type 'delete' to confirm." : "Please enter your password.");
      return;
    }

    // Google User Check: Must type "delete" (case insensitive)
    if (isGoogleAccount && inputValue.toLowerCase() !== "delete") {
        setError("Please type exactly 'delete' to continue.");
        return;
    }

    setError("");
    setStep("confirm"); 
  };

  // Step 2: Final API Call
  const handleFinalDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // Only send password if it's NOT a google account
        body: JSON.stringify({ password: isGoogleAccount ? null : inputValue }), 
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      showToast("Account deleted successfully.", "success");
      window.location.href = "/login"; 

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep("input");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl border-none bg-white dark:bg-slate-950 p-6 shadow-2xl">
        
        {/* STEP 1: VERIFICATION (Password OR Text Match) */}
        {step === "input" && (
          <>
            <DialogHeader className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                <LuTrash2 size={24} />
              </div>
              <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-neutral-500">
                {isGoogleAccount 
                    ? "To confirm deletion, please type the word 'delete' below."
                    : "Please enter your password to confirm your identity."
                }
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <div className="relative">
                <input
                  type={isGoogleAccount || showPassword ? "text" : "password"}
                  value={inputValue}
                  onChange={(e) => {
                      setInputValue(e.target.value);
                      setError("");
                  }}
                  placeholder={isGoogleAccount ? "Type 'delete'" : "Enter your password"}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 dark:text-white bg-neutral-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all pr-10"
                />
                
                {/* Only show Eye icon for Password users */}
                {!isGoogleAccount && (
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                    </button>
                )}
              </div>
              
              {error && (
                <p className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-center">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button 
                onClick={handleVerify} 
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-bold"
              >
                Continue
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClose} 
                className="w-full rounded-xl"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {/* STEP 2: CONFIRMATION WARNING (Same for both) */}
        {step === "confirm" && (
          <>
             <DialogHeader className="space-y-3 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 animate-pulse">
                <LuTriangleAlert size={32} />
              </div>
              <DialogTitle className="text-xl font-bold text-red-600">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-neutral-600 dark:text-neutral-300 font-medium">
                This action cannot be undone. All your data, budgets, and transactions will be permanently erased.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4" />

            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button 
                onClick={handleFinalDelete} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-500/20"
              >
                {loading ? (
                    <>
                        <LuLoader className="mr-2 h-5 w-5 animate-spin" /> Deleting...
                    </>
                ) : "Yes, Delete Everything"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setStep("input")} // Go back
                disabled={loading}
                className="w-full rounded-xl border-neutral-200 dark:border-slate-800"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}