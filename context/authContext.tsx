"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// 1. Define User Shape
interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  themePreference: "Light" | "Dark" | "System"; // Typed specifically
  currencyPreference: string;
  aiInsights: boolean;
  budgetAlerts: boolean;
  isGoogleAccount: boolean;
  hasPassword: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- 1. Fetch User Data ---
  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // --- 2. THEME LOGIC (The New Part) ---
  useEffect(() => {
    // 1. Determine which preference to use
    // If user is logged in, use their DB preference. If not, default to 'System'.
    const preference = user?.themePreference || "System";

    const applyTheme = () => {
      const root = document.documentElement;
      let isDark = false;

      if (preference === "Dark") {
        isDark = true;
      } else if (preference === "Light") {
        isDark = false;
      } else if (preference === "System") {
        // Check OS system setting
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        console.log(isDark, preference)
      }

      // Toggle the class on <html>
      root.classList.toggle("dark", isDark);
    };

    // Apply immediately
    applyTheme();

    // 2. Setup System Listener (Only needed if preference is System)
    // This handles the edge case where your OS switches modes while the site is open
    let mediaQuery: MediaQueryList | null = null;
    
    if (preference === "System") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      // Modern event listener for OS changes
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);

      // Cleanup listener when preference changes or component unmounts
      return () => mediaQuery?.removeEventListener("change", handleChange);
    }

  }, [user?.themePreference]); // Re-run whenever the user (or their preference) changes

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}