"use client";

import SummaryCard from "@/components/SummaryCard";
import SpendingChart from "@/components/charts/MonthlySpendingChart";
import { useEffect, useState } from "react";
import RecentTransactionsList from "@/components/RecentTransactionsList";
import { FaRegLightbulb } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useMenu } from "@/context/menuContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

type summaryData = {
  summaryType: string;
  amount: number;
  growthPercent?: number;
};

// Skeleton component for summary cards
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
  const [firstName, setFirstName] = useState<string | null>("User");
  const router = useRouter()
  const { setMenuShowing } = useMenu()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true);
  const [basicSummaryData, setBasicSummaryData] = useState<summaryData[]>([])

  useEffect(() => {
    (async () => {
        try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: 'GET',
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("data.error", data.error)
          setLoading(false)
          throw new Error(data.error || 'Something went wrong');
        }

        console.log('Success:', data);
        if(!data.isAuthenticated){
          console.log("not")
          router.push('/login')
        }

        setFirstName(data.name)

        setLoading(false)
      } catch (error: any) {
        console.log('Failed:', error.message);
      }
      })()
  }, [])

  useEffect(() => {
    setMenuShowing(false);
    const controller = new AbortController()

    // Simulate data fetching
    const fetchTotals = async () => {
      try {
        const response = await fetch("/api/transactions?order=totals", {
          signal: controller.signal
        });

        if (!response.ok){
          throw new Error('Failed to get totals from teh server.')
        }

        const data = await response.json()
        setBasicSummaryData([
          { summaryType: "Balance", amount: data.income - data.expenses },
          { summaryType: "Income", amount: data.income, growthPercent: 5.2 },
          { summaryType: "Expenses", amount: data.expenses, growthPercent: 8.1 },
          { summaryType: "Savings Rate", amount: 15.2, growthPercent: -1.5 },
        ]);
      } catch (err : any) {
        if (err.name === 'AbortError') {
          console.log('Fetch successfully aborted.');
        } else {
          console.error('An error occurred:', err.message);
          setError(err.message);
        }
      }

      setLoading(false)
    }
    
    fetchTotals()

    return(() => {
      controller.abort()
    })
  }, [setMenuShowing]);


  return (
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-56px)] overflow-y-auto p-4 md:p-6 bg-white dark:bg-slate-900">
        <h1 className="font-sans text-2xl md:text-3xl font-bold md:col-span-2 lg:col-span-4 text-neutral-900 dark:text-white">
          Welcome back, {firstName} 👋
        </h1>

        {loading
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

        <section className="grid grid-cols-[auto_1fr] items-start gap-4 w-full p-4 bg-sky-50 dark:bg-sky-900/50 rounded-xl shadow-xs my-4 md:col-span-2 lg:col-span-4">
          <FaRegLightbulb className="w-5 h-5 text-sky-600 dark:text-sky-300 mt-1" />
          <p className="font-sans text-sm leading-relaxed font-normal text-sky-800 dark:text-sky-200">
            Your spending on Groceries is 12% higher than last month. Consider
            reviewing your weekly meal plan.
          </p>
        </section>
      </main>
  );
}
