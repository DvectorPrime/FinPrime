"use client";

import * as React from "react";
import { ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filters } from "./types/filtertypes";

interface DatePickerProps {
  preferredBg?: string;
  value?: Date | null;
  handleDateChange?: (newDate: Date | undefined) => void;
  disabled?: boolean;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function DatePicker({
  preferredBg = "default",
  value,
  handleDateChange,
  setFilters,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  // Initialize with today if no value provided
  const [date, setDate] = React.useState<Date>(value || new Date());
  
  // State for the "viewing" year (what the user sees in the menu), not necessarily the selected year
  const [menuYear, setMenuYear] = React.useState<number>(date.getFullYear());

  const selectedYear = date.getFullYear();
  const selectedMonth = date.getMonth();

  // Update filters when date changes
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      year: selectedYear,
      month: selectedMonth,
    }));
  }, [selectedYear, selectedMonth, setFilters]);

  // Handle Year Navigation
  const nextYear = () => setMenuYear((prev) => prev + 1);
  const prevYear = () => setMenuYear((prev) => prev - 1);

  // Handle Month Selection
  const handleMonthSelect = (monthIndex: number) => {
    // Create new date: 1st of the selected month/year
    const newDate = new Date(menuYear, monthIndex, 1);
    setDate(newDate);
    setOpen(false);
    
    if (handleDateChange) {
      handleDateChange(newDate);
    }
  };

  // Format date for button display (e.g. "January 2026")
  const formattedDisplayDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="lg:order-1 grow w-full">
      <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset menu year to currently selected year when reopening
        if (isOpen) setMenuYear(date.getFullYear());
      }}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id="date"
            className={cn(
              // --- Base & Mobile styles ---
              `w-full h-10 justify-between rounded-2xl border border-neutral-300 ${
                preferredBg === "default" ? "bg-neutral-300/20" : preferredBg
              } px-3 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500`,
              "dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600 dark:focus:ring-sky-500",
              // --- Desktop styles ---
              "lg:rounded-full lg:justify-start lg:gap-2 lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50",
              "lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700"
            )}
          >
            {/* Desktop Icon */}
            <CalendarIcon className="hidden lg:block h-4 w-4 text-neutral-600 dark:text-neutral-400" />

            {/* Date Text */}
            <span className="grow text-left">{formattedDisplayDate}</span>

            {/* Chevron Icon */}
            <ChevronDown className="h-4 w-4 text-neutral-900 dark:text-neutral-100 lg:text-neutral-600 lg:dark:text-neutral-400" />
          </Button>
        </PopoverTrigger>

        {/* --- CUSTOM MONTH PICKER CONTENT --- */}
        <PopoverContent className="w-75 p-0 border-2 border-white" align="start">
          <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-xl">
            
            {/* Header: Year Selector */}
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevYear}
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4 text-neutral-900 dark:text-white" />
              </Button>
              
              <div className="font-semibold text-sm text-neutral-900 dark:text-white">
                {menuYear}
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextYear}
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4 text-neutral-900 dark:text-white" />
              </Button>
            </div>

            {/* Grid: Months */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((monthName, index) => {
                const isSelected = selectedYear === menuYear && selectedMonth === index;
                const isCurrentMonth = new Date().getFullYear() === menuYear && new Date().getMonth() === index;

                return (
                  <Button
                    key={monthName}
                    variant="ghost"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "h-9 text-sm font-normal",
                      isSelected 
                        ? "bg-neutral-900 text-neutral-500 hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-neutral-200" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-neutral-300",
                      !isSelected && isCurrentMonth && "border border-neutral-300 dark:border-slate-600"
                    )}
                  >
                    {monthName}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}