"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useMenu } from "@/context/menuContext";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const {setMenuShowing} = useMenu()

  const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
      setMenuShowing(false);
      
      // Simulate data fetching
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }, [setMenuShowing]);

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 dark:bg-slate-900">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome, {user?.displayName || 'User'}! to transactions
          </h1>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </ProtectedRoute>
  );
}