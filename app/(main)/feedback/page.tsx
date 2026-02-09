"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { FiSend, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      setStatus("error");
      setErrorMessage("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 text-center max-w-md w-full border border-neutral-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
            <FiCheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">You're Awesome! 🚀</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Your feedback has been received. We’re working hard to make FinPrime the best it can be, thanks to you.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-4 bg-[#0079BF] hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed active:scale-95"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setStatus("idle")}
              className="w-full py-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium text-sm cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-56px)] overflow-y-auto bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Navigation / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors cursor-pointer disabled:cursor-not-allowed group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center lg:text-left mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#0079BF] mb-2">
            <FiMessageSquare className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Share Your <span className="text-[#0079BF]">Thoughts.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg leading-relaxed">
            Found a bug or have a brilliant idea? We read every single message. Help us shape the future of FinPrime.
          </p>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-neutral-100 dark:border-slate-800 shadow-xl shadow-blue-500/[0.02]">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0079BF] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your feedback here..."
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0079BF] focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-900/20">
                    <FiAlertCircle className="shrink-0 w-5 h-5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !message || !email}
                  className="w-full flex items-center justify-center gap-3 bg-[#0079BF] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Feedback</span>
                      <FiSend className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar / Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4">Why your feedback matters?</h4>
              <ul className="space-y-4 text-sm text-blue-800 dark:text-blue-400/80">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px] shrink-0">1</span>
                  We prioritize feature requests based on user demand.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px] shrink-0">2</span>
                  Bug reports help us keep your financial data safe.
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px] shrink-0">3</span>
                  Your insights lead to a better UI for everyone.
                </li>
              </ul>
            </div>

            <div className="text-center lg:text-left px-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                By submitting this form, you agree to our privacy policy. We typically respond to technical issues within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}