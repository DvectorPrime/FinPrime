"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuWallet, LuPiggyBank } from "react-icons/lu";
import { TbCashBanknote } from "react-icons/tb";
import { RiRobot2Line } from "react-icons/ri";

import OverviewChart from "@/components/BudgetChart";

import { CategoryIcon } from "@/components/CategoryIcon";

import { formatCurrency } from "@/lib/utils";

export default function Dashboard(){
  const router = useRouter();

  interface Budget {
    category: string;
    totalBudget: number;
    totalSpent: number;
    icon: string;
  }

  const [loading, setLoading] = useState<boolean>(true);

  const budgets: Budget[] = [
    {
      category: "Housing",
      totalBudget: 30000,
      totalSpent: 30000,
      icon: "FaHome",
    },
    {
      category: "Food",
      totalBudget: 120000,
      totalSpent: 60000,
      icon: "MdFastfood",
    },
    {
      category: "Transport",
      totalBudget: 50000,
      totalSpent: 30000,
      icon: "FaCar",
    },
    {
      category: "Shopping",
      totalBudget: 30000,
      totalSpent: 30000,
      icon: "BsCart3",
    },
    {
      category: "Subscriptions",
      totalBudget: 70000,
      totalSpent: 90000,
      icon: "BsReceiptCutoff",
    },
  ];

  const budgetsElements = budgets.map((budget, index) => {
    const sliderWidth = (((budget.totalSpent)/budget.totalBudget) * 100)
    const width = sliderWidth < 100 ? sliderWidth.toFixed(0) : 100

    return (
      <div key={index} className="bg-white p-4 mb-4 rounded-[18px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)]">
        <div className="flex justify-start gap-2.5 items-center mb-4">
          <CategoryIcon iconName={budget.icon} className="w-5 h-5 text-[#5A5F68]"></CategoryIcon>
          <p className="font-sans text-lg font-medium leading-7 text-[#17191C]">{budget.category}</p>
        </div>
        <div>
          <p className="font-sans text-sm font-normal leading-5 text-[#5A5F68]">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(budget.totalSpent)}{" "}
            of{" "}
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(budget.totalBudget)}{" "}
            used
          </p>
          <p className={
            `
              font-sans text-xl font-semibold leading-7 ${budget.totalSpent < budget.totalBudget ? "text-blue-600" : "text-red-500"}
            `
          }>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(budget.totalBudget - budget.totalSpent)}{" "}
            remaining
          </p>
          <div className="relative w-full h-7 flex items-center justify-evenly">
            <div className="absolute top-2.5 w-full h-2 bg-[#E4EBFC] overflow-hidden rounded-sm">
              <div className="absolute left-0 h-2 bg-blue-600" style={{width: width + "%"}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  interface FinancialDataPoint {
    label: string; // Could be a date string like "Jan 23" or just "Jan"
    income: number;
    expense: number;
  }

  // Mock data that mimics the curves in your image
  const mockOverviewData: FinancialDataPoint[] = [
    { label: "Jan", income: 32000, expense: 21000 },
    { label: "Feb", income: 28000, expense: 23000 },
    { label: "Mar", income: 35000, expense: 18000 },
    { label: "Apr", income: 30000, expense: 20000 }, // The current point in your image
    { label: "May", income: 34000, expense: 15000 },
    { label: "Jun", income: 29000, expense: 19000 },
    { label: "Jul", income: 38000, expense: 12000 },
  ];

  const data = mockOverviewData;

  // Calculate totals based on the latest data point (or an average, depending on requirements)
  // Let's grab the data corresponding to the "April" point in your image example
  const currentMonthData = data[3];
  const incomeTotal = currentMonthData?.income || 0;
  const expenseTotal = currentMonthData?.expense || 0;

  return (
    <main className="p-4 h-screen">
      <div className="mb-8">
        <div>
          <h3 className="font-sans text-3xl font-bold text-neutral-900 mb-2">
            Budget Overview
          </h3>
          <p className="font-sans text-base font-normal text-neutral-600 mb-2">
            Plan and control your monthly spending
          </p>
        </div>
        <div>
          <button className = {`
            w-full h-12 px-3
            flex items-center justify-center gap-4
            font-sans text-sm font-medium leading-5.5 text-white
            bg-[#2563EB] rounded-[18px] border-0
            shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)]
            transition-all cursor-pointer
            hover:bg-[#2563EB]
            active:bg-[#2563EB]
            disabled:opacity-40 disabled:cursor-not-allowed
          `}>Create Budget</button>
        </div>
      </div>
      <section className="mb-5">
        <div className="w-full p-4 mb-4 bg-white dark:bg-slate-800 rounded-[18px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center">
            <LuWallet className="w-6 h-6 text-[#2563EB]"></LuWallet>
            <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Total Budget</p>
          </div>
          <div className="mt-3">
            <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 250,000</p>
          </div>
        </div>
        <div className="w-full p-4 mb-4 bg-white dark:bg-slate-800 rounded-[18px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center">
            <TbCashBanknote className="w-6 h-6 text-[#EF4444]"></TbCashBanknote>
            <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Total Spent</p>
          </div>
          <div className="mt-3">
            <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 180,000</p>
          </div>
        </div>
        <div className="w-full p-4 mb-4 bg-white dark:bg-slate-800 rounded-[18px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center">
            <LuPiggyBank className="w-6 h-6 text-[#17191C]"></LuPiggyBank>
            <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">Remaining Budget</p>
          </div>
          <div className="mt-3">
            <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">NGN 70,000</p>
          </div>
        </div>
      </section>
      <section className="mb-4">
        <h4 className="font-sans text-xl lg:3xl mb-8 font-semibold leading-7 text-[#17191C]">Category Budgets</h4>
        <div>{budgetsElements}</div>
      </section>
      <section>
        <div className="max-w-4xl mx-auto">
          {/* The Chart Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Card Header (Text summary matching the image) */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-500">Income</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(incomeTotal)}
                </span>
              </div>

              {/* Divider for desktop, hidden on small mobile */}
              <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-500">Expense</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(expenseTotal)}
                </span>
              </div>
            </div>

            {/* The Chart Container */}
            <div className="w-full">
              <OverviewChart dataPoints={data} />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <RiRobot2Line></RiRobot2Line>
          <h4>AI Budget Insight</h4>
        </div>
        <p>
          Your dining out expenses are 15% higher this month. Consider packing
          lunch twice a week to stay within your budget. This could save you
          approximately ₦15,000.
        </p>
      </section>
    </main>
  );
}