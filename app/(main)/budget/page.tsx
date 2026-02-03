"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuWallet, LuPiggyBank, LuLoader } from "react-icons/lu"; // Added LuLoader2
import { TbCashBanknote } from "react-icons/tb";
import { RiRobot2Line } from "react-icons/ri";

import OverviewChart from "@/components/charts/BudgetChart";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/authContext"; 
import { useMenu } from "@/context/menuContext";

// ... (Your Interfaces and Skeletons remain exactly the same) ...
/** --- TYPES --- */
interface OverviewData {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

interface CategoryBudget {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

interface ChartDataPoint {
  label: string;
  budget: number;
  expense: number;
}

/** --- SKELETONS --- */
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

export default function Budget() {
  const router = useRouter();
  const {setMenuShowing} = useMenu()
  const { user, loading: authLoading } = useAuth();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  const [loading, setLoading] = useState<boolean>(true);

  // --- STATE ---
  const [overview, setOverview] = useState<OverviewData>({
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
  });

  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // AI State
  const [aiTip, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    setMenuShowing(false)
  }, [setMenuShowing])

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // --- FETCH BUDGET DATA ---
  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("API Error:", data.error);
          return;
        }

        setOverview(data.overview);
        setCategories(data.categories);
        setChartData(data.chartData);
      } catch (error) {
        console.error("Network Error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // --- NEW: FETCH AI INSIGHT ---
  useEffect(() => {
    if (!user || !user.aiInsights) return;

    const fetchBudgetInsight = async () => {
        setLoadingTip(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai-insight`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "BUDGET", timezone : userTimeZone }),
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

    fetchBudgetInsight();
  }, [user]);


  // --- RENDER HELPERS ---
  const getIconForCategory = (catName: string) => {
    const map: Record<string, string> = {
      Housing: "FaHome",
      Food: "MdFastfood",
      Transport: "FaCar",
      Shopping: "BsCart3",
      Subscriptions: "BsReceiptCutoff",
      Others: "LuLightbulb",
      Salary: "GiMoneyStack",
      Business: "FaBriefcase"
    };
    return map[catName] || "LuLightbulb";
  };

  const budgetsElements = categories.map((item, index) => {
    const width = item.percentage > 100 ? 100 : item.percentage.toFixed(0);

    return (
      <div
        key={index}
        className="bg-white dark:bg-slate-800 p-4 mb-4 rounded-[18px] border border-transparent dark:border-slate-700 shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_1px_3px_rgba(0,0,0,0.07)] transition-colors"
      >
        <div className="flex justify-start gap-2.5 items-center mb-4">
          <CategoryIcon
            iconName={getIconForCategory(item.category)}
            className="w-5 h-5 text-[#5A5F68] dark:text-slate-400"
          />
          <p className="font-sans text-lg font-medium leading-7 text-[#17191C] dark:text-white">
            {item.category}
          </p>
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-3 md:items-center">
          <p className="font-sans text-sm font-normal leading-5 text-[#5A5F68] dark:text-slate-400">
            {formatCurrency(item.spent)} of {formatCurrency(item.budgeted)} used
          </p>
          <p
            className={`font-sans text-xl font-semibold leading-7 ${
              item.isOverBudget ? "text-red-500" : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {item.isOverBudget 
                ? "Over Budget" 
                : `${formatCurrency(item.remaining)} remaining`
            }
          </p>
          <div className="relative w-full h-7 flex items-center justify-evenly md:col-span-full">
            <div className="absolute top-2.5 w-full h-2 bg-[#E4EBFC] dark:bg-slate-700 overflow-hidden rounded-sm">
              <div
                className={`absolute left-0 h-2 ${
                  item.isOverBudget ? "bg-red-500" : "bg-blue-600 dark:bg-blue-500"
                }`}
                style={{ width: width + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  if (authLoading || !user) return null;

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
          <button 
            onClick={() => router.push('/budget/manage')} 
            className="w-full h-12 px-3 flex items-center justify-center gap-4 font-sans text-md font-medium leading-5.5 text-white bg-[#2563EB] dark:bg-blue-600 rounded-[18px] border-0 shadow-md transition-all cursor-pointer active:scale-95 hover:bg-blue-700"
          >
            Manage Budget
          </button>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
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
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">
                  Total Budget
                </p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(overview.totalBudget)}
                </p>
              </div>
            </div>

            <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center">
                <TbCashBanknote className="w-6 h-6 text-[#EF4444]" />
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">
                  Total Spent
                </p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(overview.totalSpent)}
                </p>
              </div>
            </div>

            <div className="w-full px-4 py-6 mb-4 bg-white dark:bg-slate-800 rounded-[18px] border border-transparent dark:border-slate-700 shadow-sm md:col-span-full lg:col-span-1">
              <div className="flex justify-between items-center">
                <LuPiggyBank className="w-6 h-6 text-[#17191C] dark:text-slate-300" />
                <p className="font-sans text-lg font-medium leading-7 text-neutral-900 dark:text-white">
                  Remaining Budget
                </p>
              </div>
              <div className="mt-3 lg:mt-7">
                <p className="font-sans text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(overview.remainingBudget)}
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* --- CATEGORY LIST --- */}
      <section className="mb-4">
        <h4 className="font-sans text-xl lg:3xl mb-8 font-semibold leading-7 text-[#17191C] dark:text-white">
          Category Budgets
        </h4>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {loading
            ? Array(3).fill(0).map((_, i) => <BudgetSkeleton key={i} />)
            : budgetsElements}
          
          {!loading && categories.length === 0 && (
             <div className="col-span-full text-center py-10 text-gray-500">
               No budgets set for this month.
             </div>
          )}
        </div>
      </section>

      {/* --- CHART SECTION --- */}
      <section className="mb-4">
        <div className="w-full mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#2563EB]"></div>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Budgeted
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : formatCurrency(overview.totalBudget)}
                </span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Actual
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : formatCurrency(overview.totalSpent)}
                </span>
              </div>
            </div>
            <div className="w-full">
              <OverviewChart dataPoints={chartData} />
            </div>
          </div>
        </div>
      </section>

      {/* --- AI INSIGHT SECTION --- */}
      <section className="w-full p-5 bg-[#F1F5FE4D] dark:bg-blue-900/20 rounded-[18px] border border-[#DEDFE3] dark:border-blue-800 shadow-sm">
        <div className="mb-4 flex justify-start gap-5 items-center">
          <RiRobot2Line className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h4 className="font-sans text-lg font-semibold leading-7 text-blue-600 dark:text-blue-400">
            AI Budget Insight
          </h4>
        </div>
        <div className="font-sans text-sm font-normal leading-5 text-[#071B46] dark:text-slate-300">
          {/* Logic: 
                1. If Loading -> Show Spinner
                2. If User disabled it -> Show "Enable" message
                3. If Tip exists -> Show Tip
                4. Fallback -> "Analyzing..."
            */}
            {user?.aiInsights ? (
                loadingTip ? (
                    <div className="flex items-center gap-2 animate-pulse">
                        <LuLoader className="animate-spin" /> Analyzing your spending patterns...
                    </div>
                ) : (
                    aiTip || "Your budget looks balanced. Great job sticking to your plan!"
                )
            ) : (
                "Enable AI insights in Settings to get personalized budget recommendations."
            )}
        </div>
      </section>
      <section className="h-10"></section>
    </main>
  );
}