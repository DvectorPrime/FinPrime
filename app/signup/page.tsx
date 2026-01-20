"use client"

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile
} from "firebase/auth";
import { useRouter } from "next/navigation";

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
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // 👈 You must add this manually with fetch
            },
            body: JSON.stringify(formData),
            credentials: "include"
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Something went wrong');
          }

          console.log('Success:', data);
          setLoading(false)
          router.push('/dashboard')

        } catch (error: any) {
          console.log('Failed:', error.message);
        }
    };

  return (
    <main className="bg-gray-100 dark:bg-slate-900 w-full min-h-screen py-8">
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
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 text-red-500 bg-red-100 dark:bg-red-900/20 rounded">
                {error}
            </div>
           )}
          <section>
            <label
              htmlFor="full-name"
              className="block mb-1 font-sans text-base leading-6.5 font-medium"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="first-name"
              value={formData.firstName}
              onChange={handleChange}
              className="block mb-3 px-3 py-1.5 w-full font-sans text-base leading-6.5 font-normal bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-900"
              placeholder="e.g John"
              required
            />
          </section>
          <section>
            <label
              htmlFor="full-name"
              className="block mb-1 font-sans text-base leading-6.5 font-medium"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="last-name"
              value={formData.lastName}
              onChange={handleChange}
              className="block mb-3 px-3 py-1.5 w-full font-sans text-base leading-6.5 font-normal bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-900"
              placeholder="e.g Doe"
              required
            />
          </section>
          <section>
            <label
              htmlFor="email"
              className="block mb-1 font-sans text-base leading-6.5 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="block mb-3 px-3 py-1.5 w-full font-sans text-base leading-6.5 font-normal bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-900"
              placeholder="example@email.com"
              required
            />
          </section>
          <section>
            <label
              htmlFor="password"
              className="block mb-1 font-sans text-base leading-6.5 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="block mb-3 px-3 py-1.5 w-full font-sans text-base leading-6.5 font-normal bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-900"
              placeholder="Create a password"
              required
            />
          </section>
          <section>
            <label
              htmlFor="confirm-password"
              className="block mb-1 font-sans text-base leading-6.5 font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block mb-3 px-3 py-1.5 w-full font-sans text-base leading-6.5 font-normal bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-900"
              placeholder="Confirm your Password"
              required
            />
          </section>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 px-3 mt-7 flex items-center justify-center gap-2 font-sans text-base leading-6.5 font-semibold text-white bg-[#0079BF] border-none rounded-md shadow-xs transition-colors duration-200 hover:bg-[#006CAB] hover:cursor-pointer active:bg-[#005586] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="my-3 font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400 text-center">
          or
        </p>
        {/* <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full h-10 px-3 mb-5 flex items-center justify-center gap-2 font-sans text-base leading-6.5 font-semibold text-[#0079BF] dark:text-sky-400 bg-white dark:bg-slate-700 border border-[#0079BF] dark:border-sky-500 rounded-md transition-colors duration-200 hover:bg-sky-50 hover:cursor-pointer dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Sign up with Google</span>
        </button> */}
        <p className="flex items-center justify-center font-sans text-sm font-normal text-center text-neutral-600 dark:text-neutral-400">
          Already have an account?
          <button
            className="ml-1 flex items-center justify-center font-sans text-sm font-medium text-[#0079BF] dark:text-sky-400 bg-transparent border-none rounded-md hover:underline hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}