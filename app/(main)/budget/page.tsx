"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuWallet, LuPiggyBank } from "react-icons/lu";
import { TbCashBanknote } from "react-icons/tb";
import { RiRobot2Line } from "react-icons/ri";

import OverviewChart from "@/components/BudgetChart";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatCurrency } from "@/lib/utils";

/**
 * Skeleton Components for Loading State
 */
const StatSkeleton = () => (
  <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full" />
      <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="w-32 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
  </div>
);

const BudgetSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-4 mb-4 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm animate-pulse">
    <div className="flex justify-start gap-2.5 items-center mb-6">
      <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full" />
      <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="w-28 h-3 bg-gray-100 dark:bg-slate-700 rounded" />
        <div className="w-20 h-5 bg-gray-100 dark:bg-slate-700 rounded" />
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full" />
    </div>
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  // Simulated Fetching Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 second delay
    return () => clearTimeout(timer);
  }, []);

  interface Budget {
    category: string;
    totalBudget: number;
    totalSpent: number;
    icon: string;
  }

  const budgets: Budget[] = [
    { category: "Housing", totalBudget: 30000, totalSpent: 30000, icon: "FaHome" },
    { category: "Food", totalBudget: 120000, totalSpent: 60000, icon: "MdFastfood" },
    { category: "Transport", totalBudget: 50000, totalSpent: 30000, icon: "FaCar" },
    { category: "Shopping", totalBudget: 30000, totalSpent: 30000, icon: "BsCart3" },
    { category: "Subscriptions", totalBudget: 70000, totalSpent: 90000, icon: "BsReceiptCutoff" },
  ];

  const budgetsElements = budgets.map((budget, index) => {
    const sliderWidth = (budget.totalSpent / budget.totalBudget) * 100;
    const width = sliderWidth < 100 ? sliderWidth.toFixed(0) : 100;

    return (
      <div
        key={index}
        className="bg-white dark:bg-slate-800 p-4 mb-4 rounded-[18px] border border-transparent dark:border-slate-700 shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)] transition-colors"
      >
        <div className="flex justify-start gap-2.5 items-center mb-4">
          <CategoryIcon
            iconName={budget.icon}
            className="w-5 h-5 text-[#5A5F68] dark:text-slate-400"
          ></CategoryIcon>
          <p className="font-sans text-lg font-medium leading-7 text-[#17191C] dark:text-white">
            {budget.category}
          </p>
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-3 md:items-center">
          <p className="font-sans text-sm font-normal leading-5 text-[#5A5F68] dark:text-slate-400">
            {formatCurrency(budget.totalSpent)} of {formatCurrency(budget.totalBudget)} used
          </p>
          <p className={`font-sans text-xl font-semibold leading-7 ${budget.totalSpent < budget.totalBudget ? "text-blue-600 dark:text-blue-400" : "text-red-500"}`}>
            {formatCurrency(Math.max(0, budget.totalBudget - budget.totalSpent))} remaining
          </p>
          <div className="relative w-full h-7 flex items-center justify-evenly md:col-span-full">
            <div className="absolute top-2.5 w-full h-2 bg-[#E4EBFC] dark:bg-slate-700 overflow-hidden rounded-sm">
              <div
                className={`absolute left-0 h-2 ${budget.totalSpent > budget.totalBudget ? "bg-red-500" : "bg-blue-600 dark:bg-blue-500"}`}
                style={{ width: width + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const mockOverviewData = [
    { label: "Jan", income: 32000, expense: 21000 },
    { label: "Feb", income: 28000, expense: 23000 },
    { label: "Mar", income: 35000, expense: 18000 },
    { label: "Apr", income: 30000, expense: 20000 },
    { label: "May", income: 34000, expense: 15000 },
    { label: "Jun", income: 29000, expense: 19000 },
    { label: "Jul", income: 38000, expense: 12000 },
  ];

  const currentMonthData = mockOverviewData[3];
  const incomeTotal = currentMonthData?.income || 0;
  const expenseTotal = currentMonthData?.expense || 0;

  return (
    <main className="p-4 min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="mb-8 md:grid md:grid-cols-[1fr_200px] items-center">
        <div>
          <h3 className="font-sans text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Budget Overview
          </h3>
          <p className="font-sans text-base font-normal text-neutral-600 dark:text-slate-400 mb-2">
            Plan and control your monthly spending
          </p>
        </div>
        <div>
          <button className="w-full h-12 px-3 flex items-center justify-center gap-4 font-sans text-md font-medium leading-5.5 text-white bg-[#2563EB] dark:bg-blue-600 rounded-[18px] border-0 shadow-md transition-all cursor-pointer active:scale-95">
            Create Budget
          </button>
        </div>
      </div>

      <section className="mb-5 md:grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center">
                <LuWallet className="w-6 h-6 text-[#2563EB] dark:text-blue-400" />
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Total Budget</p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 250,000</p>
              </div>
            </div>

            <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center">
                <TbCashBanknote className="w-6 h-6 text-[#EF4444]" />
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Total Spent</p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 180,000</p>
              </div>
            </div>

            <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm md:col-span-full lg:col-span-1">
              <div className="flex justify-between items-center">
                <LuPiggyBank className="w-6 h-6 text-[#17191C] dark:text-slate-300" />
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Remaining Budget</p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 70,000</p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="mb-4">
        <h4 className="font-sans text-xl lg:3xl mb-8 font-semibold leading-7 text-[#17191C] dark:text-white">
          Category Budgets
        </h4>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {loading ? Array(3).fill(0).map((_, i) => <BudgetSkeleton key={i} />) : budgetsElements}
        </div>
      </section>

      <section className="mb-4">
        <div className="w-full mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#2563EB]"></div>
                <span className="text-sm text-gray-500 dark:text-slate-400">Budgeted</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {loading ? <span className="animate-pulse">...</span> : formatCurrency(incomeTotal)}
                </span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                <span className="text-sm text-gray-500 dark:text-slate-400">Actual</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {loading ? <span className="animate-pulse">...</span> : formatCurrency(expenseTotal)}
                </span>
              </div>
            </div>
            <div className="w-full">
              <OverviewChart dataPoints={mockOverviewData} isLoading={loading} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full p-5 bg-[#F1F5FE4D] dark:bg-blue-900/20 rounded-[18px] border border-[#DEDFE3] dark:border-blue-800 shadow-sm">
        <div className="mb-4 flex justify-start gap-5 items-center">
          <RiRobot2Line className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h4 className="font-sans text-lg font-semibold leading-7 text-blue-600 dark:text-blue-400">
            AI Budget Insight
          </h4>
        </div>
        <p className="font-sans text-sm font-normal leading-5 text-[#071B46] dark:text-slate-300">
          Your dining out expenses are 15% higher this month. Consider packing
          lunch twice a week to stay within your budget. This could save you
          approximately ₦15,000.
        </p>
      </section>
      <section className="h-10"></section>
    </main>
  );
}