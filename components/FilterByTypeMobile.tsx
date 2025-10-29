"use client"

import {  useState } from "react";
import { cn } from "@/lib/utils";

interface FilterByTypeMobileProps{
  allIncluded: boolean
  value?: string
  handleTypeChange?: (newType: "income" | "expense") => void
  disabled: boolean
}

export default function FilterByTypeMobile({allIncluded = true, value, handleTypeChange} : FilterByTypeMobileProps){
    
    const [activeFilter, setActiveFilter] = useState(allIncluded ? "all" : value)

    return (
        <div className={`grid ${allIncluded ? "grid-cols-3" : "grid-cols-2"} p-1 col-span-2 h-12 bg-neutral-200 dark:bg-slate-700 ${allIncluded ? "rounded-2xl" : "rounded-xl"} lg:hidden`}>
          {allIncluded && 
          <button type="button" onClick={() => {
            setActiveFilter("all")
          }}
            className={cn(
              `w-full h-full px-3 flex items-center justify-center font-sans text-sm ${allIncluded  ? "rounded-xl" : "rounded-lg"} transition-colors duration-200`, // Rounded inside container
              activeFilter === "all"
                ? "font-semibold text-white bg-[#0079BF] shadow-xs" // Active state
                : "font-medium text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10" // Inactive state
            )}>All</button>
          }
          <button type="button" onClick={() => {
            setActiveFilter("income")
            if (handleTypeChange) {
              handleTypeChange("income")
            } else {
              return
            }
          }}
            className={cn(
              `w-full h-full px-3 flex items-center justify-center font-sans text-sm ${allIncluded  ? "rounded-xl" : "rounded-lg"} transition-colors duration-200`,
              activeFilter === "income"
                ? "font-semibold text-white bg-[#0079BF] shadow-xs"
                : "font-medium text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
            )}>Income</button>
          <button type="button" onClick={() => {
            setActiveFilter("expense")
            if (handleTypeChange) {
              handleTypeChange("expense")
            } else {
              return
            }
          }}
            className={cn(
              `w-full h-full px-3 flex items-center justify-center font-sans text-sm ${allIncluded  ? "rounded-xl" : "rounded-lg"} transition-colors duration-200`,
              activeFilter === "expense"
                ? "font-semibold text-white bg-[#0079BF] shadow-xs"
                : "font-medium text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
            )}>Expense</button>
        </div>
    )
}