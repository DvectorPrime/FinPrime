"use client"

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
      <div className="bg-gray-100 dark:bg-slate-900">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome, {'User'}! to reports
          </h1>
          {/* Add your dashboard content here */}
        </div>
      </div>
  );
}