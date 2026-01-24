"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData } from "@/components/types/transactionFormDataTypes";
import { useToast } from "@/context/toastContext";

export default function AddTransaction() {
  const router = useRouter();
  const { showToast } = useToast(); // <--- 2. Initialize Hook

  // State for current user
  const [firstName, setFirstName] = useState<String | null>(null)
  const [loading, setLoading] = useState(false);

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    transactionName: "",
    amount: "",
    type: "income",
    category: "Others",
    date: new Date(),
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleTypeChange = (newType: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type: newType }));
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Basic Frontend Validation
    if (!firstName) {
      setSubmitError("Please sign in to add a transaction");
      setIsSubmitting(false);
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setSubmitError("Please enter a valid amount");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare Payload
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount.toString().replace(/,/g, "")),
        type: formData.type.toUpperCase(),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // Handle Errors
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error || "Failed to create transaction");
        showToast("Failed to create transaction due to server error. Try again later", "error");
      }

      // --- STEP 3: SUCCESS FLOW ---
      // 1. Trigger Animation
      showToast("Transaction added successfully!", "success");
      
      // 2. Refresh Data & Redirect
      router.refresh();
      router.push("/transactions");

    } catch (error: any) {
      console.error("Submission failed:", error);
      setSubmitError(error.message || "An unexpected error occurred");
      showToast("Failed to save transaction", "error"); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Auth Check ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        if (!data.isAuthenticated) {
          router.push("/login");
        }
        setFirstName(data.name);
        setLoading(false);
      } catch (error: any) {
        router.push("/login");
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="px-4 py-5 bg-gray-100 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </main>
    );
  }

  return (
    <main className="px-4 py-5 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-xs px-6 py-8 max-w-lg lg:max-w-3xl mx-auto"
      >
        <h1 className="font-sans text-xl font-semibold text-neutral-900 dark:text-white mb-8">
          Transaction Details
        </h1>

        {/* Transaction Name */}
        <section className="mb-5">
          <label htmlFor="transaction-name" className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Transaction Name
          </label>
          <input
            type="text"
            name="transactionName"
            id="transaction-name"
            value={formData.transactionName}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 font-sans text-base font-normal text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
            placeholder="e.g., Monthly Salary, Groceries"
            disabled={isSubmitting}
          />
        </section>

        {/* Amount */}
        <section className="mb-5">
          <label htmlFor="amount" className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Amount (NGN)
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleAmountChange}
            required
            className="block w-full px-3 py-2 font-sans text-base font-normal text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </section>

        {/* Type Filter */}
        <section className="mb-5">
          <p className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Type
          </p>
          <FilterByTypeMobile
            allIncluded={false}
            value={formData.type}
            handleTypeChange={handleTypeChange}
            disabled={isSubmitting}
          />
        </section>

        {/* Category Picker */}
        <section className="mb-5 relative">
          <label htmlFor="category" className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Category
          </label>
          <CategoryPicker
            value={formData.category}
            setFormData={setFormData}
            disabled={isSubmitting}
          />
        </section>

        {/* Date Picker */}
        <section className="mb-5 relative">
          <label htmlFor="date" className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Date
          </label>
          <DatePicker
            value={formData.date}
            setFormData={setFormData}
            disabled={isSubmitting}
          />
        </section>

        {/* Notes Textarea */}
        <section className="mb-8">
          <label htmlFor="notes" className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 font-sans text-base font-normal text-neutral-600 dark:text-neutral-300 resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-md outline-none transition-colors hover:border-neutral-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
            placeholder="Add a note or description..."
            disabled={isSubmitting}
          ></textarea>
        </section>

        {/* Display Submission Error */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <section className="lg:grid grid-cols-2 gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-11 py-2 px-3 w-full mb-4 flex items-center justify-center font-sans text-sm font-medium text-white leading-5.5 bg-[#0079BF] border-none rounded-[10px] shadow-xs transition-colors duration-200",
              isSubmitting
                ? "bg-blue-300 dark:bg-sky-800 cursor-not-allowed"
                : "hover:bg-[#006CAB] active:bg-[#005586]",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Transaction"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="h-11 py-2 px-3 w-full flex items-center justify-center font-sans text-sm font-medium text-neutral-900 dark:text-neutral-300 leading-5.5 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-[10px] shadow-xs transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </section>
      </form>
    </main>
  );
}