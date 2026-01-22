"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile";
import { Category } from "@/app/api/categories/route";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Define the structure for form data
interface FormData {
  id: string;
  userId: string;
  transactionName: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
  date: Date | undefined;
  notes: string;
}

export default function AddTransaction() {
  const router = useRouter();
  
  // State for current user
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Update form data with user ID when user loads
      if (user) {
        setFormData((prev) => ({
          ...prev,
          userId: user.uid,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // 1. State for form data (dictionary)
  const [formData, setFormData] = useState<FormData>({
    id: "",
    userId: "",
    transactionName: "",
    amount: "",
    type: "expense",
    category: "All Categories",
    date: new Date(),
    notes: "",
  });

  // 2. State for loading/submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- Handlers for Form Inputs ---

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleTypeChange = (newType: "income" | "expense") => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const handleCategoryChange = (selectedOption: Category) => {
    const category = selectedOption?.name;
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!currentUser) {
      alert("Please sign in to add a transaction");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting:", formData);

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.uid,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Transaction created:", result.id);
        alert("Transaction saved successfully!");
        
        // Reset form or redirect
        router.push("/dashboard"); // Or wherever you want to redirect
      } else {
        setSubmitError(result.error || "An error occurred");
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setSubmitError("Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <main className="px-4 py-5 bg-gray-100 dark:bg-slate-900 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </main>
    );
  }

  // // Show sign-in message if not authenticated
  // if (!currentUser) {
  //   return (
  //     <main className="px-4 py-5 bg-gray-100 dark:bg-slate-900 min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
  //           Please sign in to add transactions
  //         </p>
  //         <button
  //           onClick={() => router.push("/login")}
  //           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  //         >
  //           Go to Login
  //         </button>
  //       </div>
  //     </main>
  //   );
  // }

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
          <label
            htmlFor="transaction-name"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Transaction Name
          </label>
          <input
            type="text"
            name="transactionName"
            id="transaction-name"
            value={formData.transactionName}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2
                       font-sans text-base font-normal
                       text-neutral-900 dark:text-neutral-100
                       placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                       bg-white dark:bg-slate-700
                       border border-neutral-300 dark:border-slate-600
                       rounded-md outline-none transition-colors
                       hover:border-neutral-400 dark:hover:border-slate-500
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500
                       disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
            placeholder="e.g., Monthly Salary, Groceries"
            disabled={isSubmitting}
          />
        </section>

        {/* Amount */}
        <section className="mb-5">
          <label
            htmlFor="amount"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
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
            className="block w-full px-3 py-2
                       font-sans text-base font-normal
                       text-neutral-900 dark:text-neutral-100
                       placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                       bg-white dark:bg-slate-700
                       border border-neutral-300 dark:border-slate-600
                       rounded-md outline-none transition-colors
                       hover:border-neutral-400 dark:hover:border-slate-500
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500
                       disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
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
          <label
            htmlFor="category"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Category
          </label>
          <CategoryPicker
            value={formData.category}
            handleCategoryChange={handleCategoryChange}
            disabled={isSubmitting}
          />
        </section>

        {/* Date Picker */}
        <section className="mb-5 relative">
          <label
            htmlFor="date"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Date
          </label>
          <DatePicker
            value={formData.date}
            handleDateChange={handleDateChange}
            disabled={isSubmitting}
          />
        </section>

        {/* Notes Textarea */}
        <section className="mb-8">
          <label
            htmlFor="notes"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="block w-full px-3 py-2
                       font-sans text-base font-normal
                       text-neutral-600 dark:text-neutral-300 resize-none
                       placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                       bg-white dark:bg-slate-700
                       border border-neutral-300 dark:border-slate-600
                       rounded-md outline-none transition-colors
                       hover:border-neutral-400 dark:hover:border-slate-500
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-sky-500
                       disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800"
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
              "h-11 py-2 px-3 w-full mb-4 flex items-center justify-center font-sans text-sm font-medium text-white leading-[22px] bg-[#0079BF] border-none rounded-[10px] shadow-xs transition-colors duration-200",
              isSubmitting
                ? "bg-blue-300 dark:bg-sky-800 cursor-not-allowed"
                : "hover:bg-[#006CAB] active:bg-[#005586]"
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
            className="h-11 py-2 px-3 w-full flex items-center justify-center font-sans text-sm font-medium text-neutral-900 dark:text-neutral-300 leading-[22px] bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-[10px] shadow-xs transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </section>
      </form>
    </main>
  );
}