"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuInfo, LuLoader, LuRefreshCw } from "react-icons/lu";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useAuth } from "@/context/authContext"; 
import { useToast } from "@/context/toastContext"; // 1. Import Toast Hook

// Define the shape of our data
type CategoryKey = "Housing" | "Food" | "Transport" | "Shopping" | "Subscriptions" | "Others";
type FormDataType = Record<CategoryKey, number>;

export default function ManageBudget() {

  const router = useRouter();
  
  // 2. Use Global Auth
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast(); // 3. Initialize Toast
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    Housing: 0,
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Subscriptions: 0,
    Others: 0,
  });

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // GET Request
  useEffect(() => {
    if (!user) return;

    const fetchCurrentBudget = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets`, {
           method: "GET",
           credentials: "include" 
        });
        
        if (!res.ok) throw new Error("Failed to load");
        
        const data = await res.json();
        
        const currentData: any = { ...formData };
        
        if (data.categories) {
            data.categories.forEach((item: any) => {
                if (currentData.hasOwnProperty(item.category)) {
                    currentData[item.category] = item.budgeted;
                }
            });
        }
        
        setFormData(currentData);
      } catch (error) {
        console.error("Error fetching budget", error);
        showToast("Failed to load current budget. Check your connection and try again.", "error")
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCurrentBudget();
  }, [user]); 

  const getIconForCategory = (catName: string) => {
    const map: Record<string, string> = {
      Housing: "FaHome",
      Food: "MdFastfood",
      Transport: "FaCar",
      Shopping: "BsCart3",
      Subscriptions: "BsReceiptCutoff",
      Others: "LuLightbulb",
    };
    return map[catName] || "LuLightbulb";
  };

  const handleInputChange = (key: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const updateBudget = async (dataOverride?: FormDataType) => {
    setIsSaving(true);
    const payload = dataOverride || formData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include"
        });

        if (!res.ok) throw new Error("Update failed");

        // 4. Success Toast
        showToast("Budget updated successfully!", "success");
        return true;
    } catch (error) {
        console.error("Failed to update", error);
        // 5. Error Toast
        showToast("Failed to update budget. Please try again.", "error");
        return false;
    } finally {
        setIsSaving(false);
    }
  }

  const formElements = Object.keys(formData).map((key) => {
    const typedKey = key as CategoryKey;
    
    if (initialLoading) {
        return (
            <div key={key} className="w-full h-25 bg-gray-100 dark:bg-slate-800 rounded-[18px] animate-pulse" />
        )
    }

    return (
      <div
        key={key}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full px-5 py-6 bg-white dark:bg-slate-800 rounded-[18px] shadow-sm border border-transparent focus-within:border-blue-500 dark:focus-within:border-sky-500 transition-all hover:shadow-md group"
      >
        <div className="flex justify-start gap-4 items-center mb-4 sm:mb-0">
          <div className="p-3 bg-blue-50 dark:bg-sky-900/30 rounded-xl group-hover:scale-110 transition-transform">
            <CategoryIcon
              iconName={getIconForCategory(key)}
              className="w-6 h-6 text-blue-600 dark:text-sky-400"
            />
          </div>
          <label
            htmlFor={key}
            className="font-sans text-lg font-semibold leading-7 text-neutral-900 dark:text-white"
          >
            {key}
          </label>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative flex items-center">
            <span className="absolute left-3 font-sans text-lg font-medium text-neutral-400 dark:text-slate-500">
              ₦
            </span>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[typedKey] === 0 ? "" : formData[typedKey]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder="0"
              className="w-full sm:w-48 h-11 pl-8 pr-4 font-sans text-base font-semibold text-neutral-900 dark:text-white bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-sky-500/20 transition-all"
            />
          </div>
          <p className="text-right mt-2 pr-1 font-sans text-xs font-medium text-neutral-500 dark:text-slate-400">
            {formData[typedKey] === 0 ? "No budget set" : "Monthly spending limit"}
          </p>
        </div>
      </div>
    );
  });

  // Prevent Flash
  if (authLoading || !user) return null;

  return (
    <main className="p-4 md:p-8 min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        <div className="h-6 mb-2 flex justify-end">
            {initialLoading && (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                    <LuRefreshCw className="animate-spin" /> Syncing with database...
                </div>
            )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => router.push("/budget")}
            className="group flex items-center gap-2 px-4 py-2 font-medium text-sm text-blue-600 dark:text-sky-400 bg-transparent hover:bg-blue-50 dark:hover:bg-sky-900/20 rounded-xl transition-all active:scale-95"
          >
            <IoIosArrowRoundBack className="text-2xl group-hover:-translate-x-1 transition-transform" />
            Back to Budget
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-sans text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
              Manage Budgets
            </h1>
            <p className="font-sans text-base text-neutral-600 dark:text-slate-400">
              Allocate your income across different categories to stay on track.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
                disabled={isSaving || initialLoading}
                className="flex-1 md:flex-none h-11 px-6 font-sans text-sm font-bold text-neutral-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm disabled:opacity-50" 
                onClick={async () => {
                    const defaultValues = {
                        Housing: 20000,
                        Food: 20000,
                        Transport: 20000,
                        Shopping: 20000,
                        Subscriptions: 20000,
                        Others: 20000,
                    };
                    setFormData(defaultValues);
                    await updateBudget(defaultValues); 
                    router.push("/budget");
                }}
            >
              Reset Default
            </button>

            <button 
                disabled={isSaving || initialLoading}
                className="flex-1 md:flex-none h-11 px-8 font-sans text-sm font-bold text-white bg-blue-600 dark:bg-sky-600 rounded-xl hover:bg-blue-700 dark:hover:bg-sky-500 active:scale-95 transition-all shadow-md shadow-blue-500/20 dark:shadow-sky-500/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                onClick={async () => {
                    const success = await updateBudget();
                    if (success) router.push("/budget");
                }}
            >
              {isSaving ? <LuLoader className="animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {formElements}
        </section>

        <section className="mt-8">
          <div className="flex items-start gap-4 p-5 bg-blue-50/50 dark:bg-sky-900/20 rounded-[18px] border border-blue-100 dark:border-sky-800/50 shadow-sm">
            <LuInfo className="w-5 h-5 text-blue-600 dark:text-sky-400 mt-0.5 shrink-0" />
            <p className="font-sans text-sm leading-relaxed text-blue-900 dark:text-sky-100/80">
              <span className="font-bold">Pro Tip:</span> Budgets are tied to the current calendar month. They will automatically carry over to the next month unless you update them here. 
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}