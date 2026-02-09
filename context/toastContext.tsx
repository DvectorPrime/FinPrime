"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils"; 
import { X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = (msg: string, toastType: ToastType = "success") => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      <div
        className={cn(
          "fixed inset-0 z-100 flex items-center justify-center pointer-events-none transition-all duration-300 ease-in-out",
          isVisible ? "opacity-100 backdrop-blur-sm bg-black/10 dark:bg-black/40" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-8 min-w-75 rounded-3xl shadow-2xl transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)", 
            "bg-white text-neutral-900",
            "dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700",
            isVisible ? "scale-100 translate-y-0" : "scale-50 translate-y-10"
          )}
        >
          <div className="mb-4">
             {type === "success" ? <AnimatedCheckIcon isVisible={isVisible} /> : <AnimatedErrorIcon isVisible={isVisible} />}
          </div>

          <h4 className="text-xl font-bold mb-1 text-center font-sans tracking-tight">
            {type === "success" ? "Success!" : "Error"}
          </h4>
          <p className="text-sm font-medium text-center text-neutral-500 dark:text-neutral-400">
            {message}
          </p>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// --- SUB-COMPONENTS: ANIMATED ICONS ---

function AnimatedCheckIcon({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={cn("relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 transition-all duration-500", isVisible ? "scale-100" : "scale-0")}>
       <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5 13l4 4L19 7" 
            className={cn("path-check", isVisible && "animate-draw")}
            style={{ strokeDasharray: 24, strokeDashoffset: 24 }} // 24 is roughly the length of the path
          />
       </svg>
       
       <style jsx>{`
         .animate-draw {
            animation: drawCheck 0.6s ease-out forwards 0.2s; /* 0.2s delay to wait for popup pop */
         }
         @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
         }
       `}</style>
    </div>
  );
}

function AnimatedErrorIcon({ isVisible }: { isVisible: boolean }) {
    return (
      <div className={cn("relative flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 transition-all duration-500", isVisible ? "scale-100" : "scale-0")}>
         <X className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
    );
  }