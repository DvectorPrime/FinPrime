import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Filters } from "./types/filtertypes";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  placeHolder: string;
  className: string;
  setFilters?: React.Dispatch<React.SetStateAction<Filters>>;
  filters?: Filters
};

export const SearchInput = ({
  icon,
  iconPosition = "left",
  containerClassName = "",
  placeHolder = "Search...",
  className,
  setFilters,
  filters,
  ...props
}: SearchInputProps) => {
  // 1. Local state for immediate UI feedback
  const [localSearch, setLocalSearch] = useState("");

  // 2. Debounce Effect: Updates the actual filter after 1.5s delay
  useEffect(() => {
    // Set a timer to update the global filters
    const handler = setTimeout(() => {
      if (setFilters) {
        setFilters((prev) => ({
          ...prev,
          search: localSearch,
        }));
      }
    }, 1500); // 1.5 second delay

    // Cleanup: If user types again before 1.5s, cancel the previous timer
    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, setFilters]);

  useEffect(() => {
    if (filters){
      setLocalSearch(filters.search)
    }
  }, [filters])
  return (
    <div className={`relative block ${containerClassName}`}>
      <div
        className={`
          absolute top-1/2 -translate-y-1/2 text-neutral-600
          peer-disabled:text-neutral-400
          ${iconPosition === "left" ? "left-3" : "right-3"}
        `}
      >
        {icon}
      </div>
      <input
        {...props}
        // 3. Bind value to local state
        value={localSearch} 
        className={cn(
          // Base styles
          "peer w-full h-10 rounded-2xl border border-neutral-300 bg-neutral-300/20",
          "font-sans text-base font-normal text-neutral-800 placeholder:text-neutral-500",
          "outline-none transition-all",
          // Positioning based on icon
          iconPosition === "left" ? "pl-8.5 pr-3" : "pr-8.5 pl-3",
          // Desktop specific styles
          "lg:bg-white lg:border-neutral-300",
          // Hover & Focus States
          "hover:border-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          // Disabled State
          "disabled:opacity-70 disabled:cursor-not-allowed",
          // Dark Mode Styles
          "dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:placeholder:text-neutral-400",
          "dark:hover:border-slate-500",
          "dark:focus:ring-sky-500 dark:focus:border-transparent",
          // Dark Desktop Specific
          "lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300",
          className
        )}
        placeholder={placeHolder}
        // 4. Update ONLY local state immediately
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
};