"use client";

import * as React from "react";
import { Filter as FilterIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Filters } from "./types/filtertypes";

interface FilterByTypeDesktopProps {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

export function FilterByTypeDesktop({setFilters} : FilterByTypeDesktopProps) {
  const [filterType, setFilterType] = React.useState("all");

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: filterType
    }))
  }, [filterType])

  return (
    <div className="hidden lg:block lg:order-3 relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FilterIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      </div>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value.toLowerCase())}
        className={cn(
          // --- Base styles for appearance ---
          "appearance-none w-full h-10 justify-between rounded-full pl-9 pr-8", // Rounded full
          "font-sans text-sm transition-colors cursor-pointer", // Added cursor-pointer
          // --- Light Mode ---
          "border border-neutral-300 bg-white text-neutral-600 font-medium hover:bg-gray-50",
           // --- Dark Mode ---
          "dark:bg-slate-800 dark:border-slate-700 dark:text-neutral-300 dark:hover:bg-slate-700",
           // --- Focus ---
          "focus:ring-2 focus:ring-blue-500 focus:outline-none dark:focus:ring-sky-500"
        )}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      </div>
    </div>
  );
}
