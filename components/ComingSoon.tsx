"use client";

import { useRouter } from "next/navigation";
import { LuArrowLeft, LuRocket, LuConstruction } from "react-icons/lu";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export default function ComingSoon({ 
  title, 
  description, 
  icon: Icon = LuRocket
}: ComingSoonProps) {
  const router = useRouter();

  return (
    <main className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 transition-colors">
      <title>{title}</title>
      <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-sky-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center ring-1 ring-blue-100 dark:ring-slate-700">
          <Icon className="w-10 h-10 text-blue-600 dark:text-sky-400" />
        </div>
        
        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">In Progress</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3 font-sans">
        {title}
      </h1>
      <p className="text-base text-neutral-500 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-neutral-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <LuArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-blue-600 dark:bg-sky-600 rounded-xl hover:bg-blue-700 dark:hover:bg-sky-500 active:scale-95 transition-all cursor-pointer shadow-md shadow-blue-500/20"
        >
          Return to Dashboard
        </button>
      </div>
    </main>
  );
}