"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To potentially redirect after submit
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile"; // Assuming this is updated or replaced
import { Category } from "@/app/api/categories/route"; // Import Category type if needed elsewhere
import { Loader2 } from "lucide-react"; // Spinner icon
import { cn } from "@/lib/utils"; // For merging classes
import { auth } from "@/firebase/firebaseConfig";

// Define the structure for form data
interface FormData {
  id: string;
  transactionName: string;
  amount: number | string; // Use string initially for input control
  type: "income" | "expense";
  category: string; // Store the selected category ID
  date: Date | undefined;
  notes: string;
}

export default function AddTransaction() {
  const router = useRouter(); // Initialize router if needed for navigation

  // 1. State for form data (dictionary)
  const [formData, setFormData] = useState<FormData>({
    id: "",
    transactionName: "",
    amount: "", // Start with empty string
    type: "expense", // Default type
    category: "All Categories", //Default category
    date: new Date(),
    notes: "",
  });

  // 2. State for loading/submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- Handlers for Form Inputs ---

  // Handle changes for text input, number input, textarea
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle amount change specifically (allow only numbers/decimals)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     // Allow only numbers and a single decimal point
     if (/^\d*\.?\d*$/.test(value)) {
       setFormData((prev) => ({ ...prev, amount: value }));
     }
  };


  // Handle type change (assuming FilterByTypeMobile is adapted)
  const handleTypeChange = (newType: "income" | "expense") => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  // Handle category change (assuming CategoryPicker returns selected category object/id)
  const handleCategoryChange = (selectedOption: Category) => {
     // Adjust based on what CategoryPicker actually returns
    const category = selectedOption?.name 
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // --- Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setSubmitError(null);

    const user = auth.currentUser; // Your Firebase Auth instance
    if (!user) {
      console.error('No user signed in');
      return;
    }

   const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userId: user.uid, // Get from Firebase Auth
      }),
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Transaction created:', result.id);
    } else {
      setSubmitError("An error occured")
    }

    setIsSubmitting(false)
  };


  return (
    // Added dark mode background for the page
    <main className="px-4 py-5 bg-gray-100 dark:bg-slate-900 min-h-screen">
       {/* Added dark mode styles to the form container */}
      <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xs px-6 py-8 max-w-lg lg:max-w-3xl mx-auto" // Center form, add max-width
        >
        {/* Added dark mode text color */}
        <h1 className="font-sans text-xl font-semibold text-neutral-900 dark:text-white mb-8">
          Transaction Details
        </h1>

        {/* Transaction Name */}
        <section className="mb-5">
           {/* Added dark mode text color */}
          <label
            htmlFor="transaction-name"
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Transaction Name
          </label>
          <input
            type="text"
            name="transactionName" // Match state key
            id="transaction-name"
            value={formData.transactionName}
            onChange={handleInputChange}
            required // Make field required
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
            disabled={isSubmitting} // Disable when submitting
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
            type="text" // Use text for better control over formatting/input
            inputMode="decimal" // Hint for mobile keyboards
            min={0}
            step="0.01"
            name="amount" // Match state key
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
           {/* Assuming FilterByTypeMobile is adapted to accept value and onChange */}
          <FilterByTypeMobile
            allIncluded={false}
            value={formData.type}
            handleTypeChange={handleTypeChange}
            disabled={isSubmitting}
          />
        </section>

        {/* Category Picker */}
        <section className="mb-5 relative"> {/* Added relative for picker positioning */}
          <label
            htmlFor="category" // Although not directly linked, good practice
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Category
          </label>
           {/* Assuming CategoryPicker has value and onValueChange props */}
           {/* The component needs to be positioned correctly within the form flow */}
          <CategoryPicker
             value={formData.category} // Pass current category ID
             handleCategoryChange={handleCategoryChange} // Pass handler
             disabled={isSubmitting}
          />
        </section>

        {/* Date Picker */}
        <section className="mb-5 relative"> {/* Added relative for picker positioning */}
          <label
             htmlFor="date" // Although not directly linked, good practice
            className="block mb-2 font-sans text-base font-medium text-neutral-800 dark:text-neutral-300"
          >
            Date
          </label>
           {/* Assuming DatePicker has value and onValueChange/onSelect props */}
           {/* Needs positioning within the form flow */}
          <DatePicker
             value={formData.date} // Pass current date
             handleDateChange={handleDateChange} // Pass handler (adjust prop name if needed)
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
            name="notes" // Match state key
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

        {/* Action Buttons */}
        <section className="lg:grid grid-cols-2 gap-3">
          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={isSubmitting} // Disable button when submitting
            className={cn(
               "h-11 py-2 px-3 w-full mb-4 flex items-center justify-center font-sans text-sm font-medium text-white leading-[22px] bg-[#0079BF] border-none rounded-[10px] shadow-xs transition-colors duration-200",
               isSubmitting ? "bg-blue-300 dark:bg-sky-800 cursor-not-allowed" : "hover:bg-[#006CAB] active:bg-[#005586]"
            )}
          >
            {isSubmitting ? (
              <>
                 {/* Spinner Icon */}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Transaction"
            )}
          </button>
           {/* Cancel Button with Loading State */}
          <button
            type="button" // Important: type="button" to prevent form submission
            onClick={() => router.back()} // Example: Go back on cancel
            disabled={isSubmitting} // Disable button when submitting
            className="h-11 py-2 px-3 w-full flex items-center justify-center font-sans text-sm font-medium text-neutral-900 dark:text-neutral-300 leading-[22px] bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-[10px] shadow-xs transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

           {/* Display Submission Error */}
            {submitError && (
                <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
                  {submitError}
                </p>
            )}
        </section>
      </form>
    </main>
  );
}
