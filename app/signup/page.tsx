"use client"

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuLoader, LuMailCheck } from "react-icons/lu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiAlertCircle } from "react-icons/fi";

interface VerificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    onVerify: (code: string) => void;
    loading: boolean;
    error: string;
}

function VerificationModal({ open, onOpenChange, email, onVerify, loading, error }: VerificationModalProps) {
    const [code, setCode] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-100 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl">
                <DialogHeader className="items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-2">
                        <LuMailCheck size={32} />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Check your email
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500">
                        We sent a verification code to <span className="font-semibold text-neutral-800 dark:text-neutral-300">{email}</span>. <br/>Enter it below to confirm your account.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                    />
                    
                    {error && (
                        <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900/20">
                            <FiAlertCircle className="shrink-0 w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="flex-col gap-3">
                    <Button 
                        onClick={() => onVerify(code)} 
                        disabled={loading || code.length < 4}
                        className="w-full h-12 mb-5 text-base font-bold bg-[#0079BF] hover:bg-[#006CAB] text-white rounded-xl"
                    >
                        {loading ? <><LuLoader className="mr-2 h-5 w-5 animate-spin" /> Verifying...</> : "Verify & Create Account"}
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="w-full rounded-xl dark:text-white"
                    >
                        Back
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // For Step 1 (Sending Email)
    const [verificationLoading, setVerificationLoading] = useState(false); // For Step 2 (Verifying Code)
    const [verificationError, setVerificationError] = useState("");
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    method: 'GET',
                    credentials: "include"
                });
                const data = await res.json();
                if (data.isAuthenticated) {
                    router.push("/dashboard");
                } else {
                    setIsCheckingSession(false);
                }
            } catch (err) {
                console.log("Session Check Failed", err);
                setIsCheckingSession(false);
            }
        };
        checkSession();
    }, [router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    firstName: formData.firstName 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send verification code');
            }

            setIsVerificationOpen(true);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (code: string) => {
        setVerificationError("");
        setVerificationLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    code: code // Send the code along with user data
                }), 
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            router.push('/dashboard');

        } catch (error: any) {
            setVerificationError(error.message);
        } finally {
            setVerificationLoading(false);
        }
    }

    const handleGoogleSignup = async () =>{
      const rootUrl = "https://accounts.google.com/o/oauth2/auth"
      const options = {
        redirect_uri: `${window.location.origin}/login`, 
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
      }
      const qs = new URLSearchParams(options).toString();
      window.location.href = `${rootUrl}?${qs}`;
    }

    function toLoginPage(){
      router.push('/login')
    }

  if (isCheckingSession) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
              <LuLoader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
      );
  }

  return (
    <main className="bg-gray-100 dark:bg-slate-900 w-full min-h-screen py-8 transition-colors duration-300">
        <title>Finprime - Signup</title>
      <div className="w-11/12 max-w-md mx-auto px-6 py-8 bg-white dark:bg-slate-800 rounded-xl shadow-xs text-neutral-800 dark:text-neutral-300">
        <Image
          src="/logo.png"
          alt="FinPrime"
          width={32}
          height={32}
          className="block mx-auto mb-7"
        />
        <h2 className="font-sans text-2xl text-center font-bold text-neutral-900 dark:text-white mb-8">
          Create Your FinPrime Account
        </h2>
        
        <form onSubmit={handleInitialSubmit}>
          {error && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900/20">
                <FiAlertCircle className="shrink-0 w-5 h-5" />
                <span>{error}</span>
            </div>
           )}
           
          <section className="space-y-4">
              <div>
                <label htmlFor="first-name" className="block mb-1.5 font-sans text-sm font-semibold text-neutral-700 dark:text-neutral-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="first-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g John"
                  required
                />
              </div>

              <div>
                <label htmlFor="last-name" className="block mb-1.5 font-sans text-sm font-semibold text-neutral-700 dark:text-neutral-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="last-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1.5 font-sans text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="example@email.com"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1.5 font-sans text-sm font-semibold text-neutral-700 dark:text-neutral-300">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-1.5 font-sans text-sm font-semibold text-neutral-700 dark:text-neutral-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Confirm your Password"
                  required
                />
              </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-3 mt-8 flex items-center justify-center gap-2 font-sans text-base font-bold text-white bg-[#0079BF] rounded-lg shadow-sm cursor-pointer hover:bg-[#006CAB] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <><LuLoader className="animate-spin" /> Sending Code...</> : "Create Account"}
          </button>
          {error && (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900/20">
                <FiAlertCircle className="shrink-0 w-5 h-5" />
                <span>{error}</span>
            </div>
           )}
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800 px-2 text-neutral-500">Or continue with</span>
            </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full h-11 px-3 mb-6 flex items-center justify-center gap-2 font-sans text-sm font-bold text-neutral-700 cursor-pointer dark:text-white bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-600 transition-all active:scale-[0.98]"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?
          <button
            onClick={toLoginPage}
            className="ml-1 font-semibold text-[#0079BF] c dark:text-sky-400 cursor-pointer hover:underline focus:outline-none"
            type="button"
          >
            Login
          </button>
        </p>
      </div>

      <VerificationModal 
        open={isVerificationOpen}
        onOpenChange={setIsVerificationOpen}
        email={formData.email}
        onVerify={handleVerifyAndRegister}
        loading={verificationLoading}
        error={verificationError}
      />
    </main>
  );
}