"use client";

import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // New State: Block rendering while we check the session
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const googleEffectRan = useRef(false);

  useEffect(() => {
    (async () => {
      const code = searchParams.get("code");

      if (code && !googleEffectRan.current) {
        googleEffectRan.current = true;
        setLoading(true);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code }),
              credentials: "include",
            },
          );

          const data = await res.json();

          if (res.ok) {
            console.log({ Success: data });
            router.push("/dashboard");
          } else {
            setError(data.error || "Login failed");
            setLoading(false);
          }
        } catch (err) {
          setError("Connection failed");
          setLoading(false);
        }
      }
    })();
  }, [searchParams, router]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include", // vital for sending the cookie
        });

        const data = await res.json();
        console.log("data");
        // DEBUG: See exactly what the backend sends
        console.log("Session Check Data:", data);

        // FIX: Check 'authenticated', not 'isAuthenticated'
        if (data.isAuthenticated) {
          router.push("/dashboard");
        } else {
          // Only stop checking if we are sure they are NOT logged in
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("data.error", data.error);
        setLoading(false);
        throw new Error(data.error || "Something went wrong");
      }

      console.log("Success:", data);
      setLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      setLoading(false);
      console.log("Failed:", error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/auth";

    const options = {
      redirect_uri: "http://localhost:3000/login",
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`;
  };

  return (
    // Added a background color that changes with the theme
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="w-full h-30 bg-linear-to-br from-[#0078BD] to-[#93C5FD] rounded-none"></div>
      <main className="block h-fit">
        <div className="mx-auto -mt-7.5 w-[90%] md:w-[60%] max-w-125 pt-4 pb-8 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
          <div className="flex justify-center items-center mt-6 mx-auto gap-1">
            <Image src="/logo.png" alt="FinPrime" width={32} height={32} />
            <p className="hidden lg:block font-sans text-[38px] leading-9.5 font-bold text-[#0078BD] italic">
              FinPrime
            </p>
          </div>
          <p className="mt-6.25 text-center font-sans text-2xl leading-8 font-bold text-neutral-900 dark:text-neutral-100">
            Welcome back 👋
          </p>
          {error && (
            <div className="w-[85%] mx-auto mt-4 p-2 text-red-500 bg-red-100 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-[85%] mx-auto">
            <label htmlFor="user-email" className="block relative mt-4">
              <span className="hidden">Email</span>
              <HiOutlineMail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              <input
                type="email"
                name="email"
                id="user-email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="block w-full h-11 pr-3 pl-8.5 text-base font-sans rounded-md bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
            <label htmlFor="user-password" className="block relative mt-4">
              <span className="hidden">Password</span>
              <FiLock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              <input
                type="password"
                name="password"
                id="user-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full h-11 pr-3 pl-8.5 text-base font-sans rounded-md bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mx-auto mt-4 flex items-center justify-center font-sans text-sm font-semibold text-white leading-5.5 bg-[#0078BD] border-none rounded-md transition-colors duration-200 hover:bg-[#00507E] hover:cursor-pointer active:bg-[#003350] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {/* <button onClick={handleForgotPassword} className="mt-3 ml-auto w-fit border-none flex items-center justify-center font-sans text-sm font-medium text-[#0078BD] dark:text-sky-400 bg-transparent rounded-md hover:underline hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              Forgot Password?
            </button> */}
          </form>
          <fieldset className="border-t border-neutral-300 dark:border-slate-600 w-[85%] mx-auto mt-3 pt-4">
            <legend className="text-center px-2 font-medium text-neutral-600 dark:text-neutral-400">
              or continue with
            </legend>
            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-3 h-11 w-full mt-4 bg-white dark:bg-slate-700 rounded-md border border-neutral-300 dark:border-slate-600 font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 transition-colors hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600"
            >
              <FcGoogle className="text-2xl" />
              Sign in With Google
            </button>
            <p className="font-sans text-sm text-center font-normal text-neutral-600 dark:text-neutral-400 mt-5">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  router.push("/signup");
                }}
                className="font-sans text-sm font-semibold text-[#0078BD] dark:text-sky-400 bg-transparent border-none rounded-md hover:underline hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Register
              </button>
            </p>
          </fieldset>
        </div>
      </main>
    </div>
  );
}
