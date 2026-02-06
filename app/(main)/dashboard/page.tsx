"use client";

import SummaryCard from "@/components/SummaryCard";
import SpendingChart from "@/components/charts/MonthlySpendingChart";
import { useEffect, useState, useRef } from "react";
import RecentTransactionsList from "@/components/RecentTransactionsList";
import { FaRegLightbulb } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu"; 
import { useMenu } from "@/context/menuContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

type summaryData = {
  summaryType: string;
  amount: number;
  growthPercent?: number;
};

const SummaryCardSkeleton = () => (
  <div className="h-25 w-full px-3 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl shadow-xs animate-pulse">
    <div className="flex justify-start items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-slate-600"></div>
      <div className="h-4 w-20 bg-gray-300 dark:bg-slate-600 rounded"></div>
    </div>
    <div className="h-6 w-32 bg-gray-300 dark:bg-slate-600 rounded"></div>
  </div>
);

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const router = useRouter();
  const effectRan = useRef(false)
  const { setMenuShowing } = useMenu();
  const [error, setError] = useState("");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  console.log(userTimeZone)
  
  // Dashboard Stats State
  const [statsLoading, setStatsLoading] = useState(true);
  const [basicSummaryData, setBasicSummaryData] = useState<summaryData[]>([]);

  // AI Insight State
  const [aiTip, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch Dashboard Stats
  useEffect(() => {
    setMenuShowing(false);
    if (!user) return; 

    setStatsLoading(true);

    const fetchTotals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/dashboardStats`, {
          method: 'GET',
          credentials: "include"
        });

        if (!response.ok) throw new Error('Failed to get dashboard summary.');

        const data = await response.json();

        setBasicSummaryData([
          { summaryType: "Balance", amount: data.balance.value },
          { summaryType: "Income", amount: data.income.value, growthPercent: data.income.percentage },
          { summaryType: "Expenses", amount: data.expenses.value, growthPercent: data.expenses.percentage },
          { summaryType: "Savings Rate", amount: data.savingsRate.value },
        ]);
      } catch (err : any) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchTotals();
  }, [setMenuShowing, user]);

  useEffect(() => {
    if (effectRan.current === true) return;

    effectRan.current = true

    if (!user || !user.aiInsights) return;

    const fetchAiInsight = async () => {
        setLoadingTip(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-insight`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "DASHBOARD", timezone: userTimeZone }), 
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok) {
                setAiTip(data.insight);
            }
        } catch (err) {
            console.error("Failed to load AI tip", err);
        } finally {
            setLoadingTip(false);
        }
    };

    fetchAiInsight();
  }, [user]);

  const isLoading = authLoading || statsLoading;

  if (!authLoading && !user) return null; 

  return (
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-56px)] overflow-y-auto p-4 md:p-6 bg-white dark:bg-slate-900">
        <h1 className="font-sans text-2xl md:text-3xl font-bold md:col-span-2 lg:col-span-4 text-neutral-900 dark:text-white">
          Welcome back, {user?.firstName || "User"} 👋
        </h1>

        {/* Added error visual for dashboard summary fetch failure - shows if error occurred */}
        {error && (
          <div className="md:col-span-2 lg:col-span-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load dashboard data: {error}
            </p>
          </div>
        )}

        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SummaryCardSkeleton key={i} />)
          : basicSummaryData.map((data) => (
              <SummaryCard
                key={data.summaryType}
                summaryType={data.summaryType}
                amount={data.amount}
                growthPercent={data.growthPercent}
              />
            ))}

        <section className="h-fit mt-4 md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xs">
          <h2 className="font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Monthly Spending Overview
          </h2>
          <SpendingChart />
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-xs mt-4 p-4 md:col-span-2 lg:col-span-2">
          <header className="flex justify-between items-center mb-4">
            <h3 className="font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Recent Transactions
            </h3>
            <Link href="/transactions">
              <button className="flex items-center gap-2 font-sans text-sm font-medium text-[#0079BF] dark:text-sky-400 bg-transparent rounded-md transition-all hover:underline hover:cursor-pointer hover:gap-3 disabled:opacity-40">
                View All <FaArrowRightToBracket className="hidden md:block" />
              </button>
            </Link>
          </header>
          <RecentTransactionsList />
        </section>

        {/* AI Insight Section */}
        <section className="grid grid-cols-[auto_1fr] items-start gap-4 h-fit w-full p-4 bg-sky-50 dark:bg-sky-900/50 rounded-xl shadow-xs my-4 md:col-span-2 lg:col-span-4 min-h-20">
          <FaRegLightbulb className="w-5 h-5 text-sky-600 dark:text-sky-300 mt-1 shrink-0" />
          
          <div className="font-sans text-sm leading-relaxed font-normal text-sky-800 dark:text-sky-200">
            {user?.aiInsights ? (
                loadingTip ? (
                    <div className="flex items-center gap-2 animate-pulse">
                        <LuLoader className="animate-spin" /> Analyzing your finances...
                    </div>
                ) : (
                    aiTip || "Your financial health looks stable. Keep tracking your expenses!"
                )
            ) : (
                "Enable AI insights in Settings to get personalized spending tips."
            )}
          </div>
        </section>
      </main>
  );
}