"use client";

import * as React from "react";
import { Filter as FilterIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterByTypeDesktop() {
  const [filterType, setFilterType] = React.useState("all");

  return (
    <div className="hidden lg:block lg:order-3 relative w-full lg:w-fit">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FilterIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      </div>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className={cn(
          // --- Base & Mobile styles ---
          "appearance-none w-full h-10 justify-between rounded-2xl border border-neutral-300 bg-neutral-300/20 pl-9 pr-8 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600",
          // --- Desktop styles ---
          "lg:rounded-full lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50 lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700"
        )}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="h-4 w-4 text-neutral-900 dark:text-neutral-100 lg:text-neutral-600 lg:dark:text-neutral-400" />
      </div>
    </div>
  );
}
