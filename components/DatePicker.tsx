"use client";

import * as React from "react";
import { ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filters } from "./types/filtertypes";
import { FormData } from "./types/transactionFormDataTypes";

interface DatePickerProps {
  preferredBg?: string;
  value?: Date | null;
  disabled?: boolean;
  setFilters?: React.Dispatch<React.SetStateAction<Filters>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
}

export function DatePicker({
  preferredBg = "default",
  value,
  setFilters,
  setFormData
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  const [date, setDate] = React.useState<Date>(value || new Date());
  const [menuYear, setMenuYear] = React.useState<number>(date.getFullYear());

  const selectedYear = date.getFullYear();
  const selectedMonth = date.getMonth();

  // --- EFFECT 1: Handle Filter Mode Updates ---
  React.useEffect(() => {
    if (setFilters){
      setFilters((prev) => ({
        ...prev,
        year: selectedYear,
        month: selectedMonth,
      }));
    }
  }, [selectedYear, selectedMonth, setFilters]);

  // --- EFFECT 2: Handle Form Mode Updates ---
  React.useEffect(() => {
    if (setFormData && date) {
      setFormData(prev => ({
        ...prev,
        date: date
      }));
    }
  }, [date, setFormData]);

  // --- HANDLERS ---
  const nextYear = () => setMenuYear((prev) => prev + 1);
  const prevYear = () => setMenuYear((prev) => prev - 1);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(menuYear, monthIndex, 1);
    setDate(newDate);
    setOpen(false);
  };

  const handleDaySelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setOpen(false); 
    }
  };

  const formattedDisplayDate = new Intl.DateTimeFormat("en-US", {
    month: setFormData ? "short" : "long",
    year: "numeric",
    day: setFormData ? "numeric" : undefined 
  }).format(date);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="lg:order-1 grow w-full">
      <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
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
            <CalendarIcon className="hidden lg:block h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            <span className="grow text-left">{formattedDisplayDate}</span>
            <ChevronDown className="h-4 w-4 text-neutral-900 dark:text-neutral-100 lg:text-neutral-600 lg:dark:text-neutral-400" />
          </Button>
        </PopoverTrigger>

        {/* --- POP CONTENT --- */}
        <PopoverContent className={cn("p-0", setFormData ? "w-auto" : "w-75 border-2 border-white dark:border-slate-700")} align="start">
          
          {setFormData ? (
             // === MODE A: FORM MODE (Full Calendar) ===
             // We inject specific classes here to override defaults and ensure dark mode/hover works
             <Calendar
                mode="single"
                selected={date}
                onSelect={handleDaySelect}
                initialFocus
                className="rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 pointer-events-auto p-3"
                classNames={{
                    // Navigation
                    nav_button: "border border-neutral-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-700 rounded-md transition-colors",
                    caption: "flex justify-center pt-1 relative items-center text-neutral-900 dark:text-neutral-100 font-semibold",
                    
                    // Days Container
                    head_cell: "text-neutral-500 dark:text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
                    
                    // Individual Days
                    day: cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        "hover:bg-neutral-100 dark:hover:bg-slate-700", // Hover effect
                        "rounded-md cursor-pointer transition-colors",   // Cursor & Shape
                        "text-neutral-900 dark:text-neutral-100"       // Text Color
                    ),
                    
                    // States
                    day_selected: "bg-neutral-900 text-white hover:bg-neutral-800 focus:bg-neutral-900 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
                    day_today: "bg-neutral-100 text-neutral-900 dark:bg-slate-700 dark:text-white",
                    day_outside: "text-neutral-400 opacity-50 dark:text-neutral-500",
                    day_disabled: "text-neutral-300 opacity-50 dark:text-neutral-600",
                    day_hidden: "invisible",
                }}
             />
          ) : (
             // === MODE B: FILTER MODE (Custom Month Picker) ===
             <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 shadow-xl">
               
               {/* Year Selector */}
               <div className="flex items-center justify-between mb-2">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={prevYear}
                   className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full cursor-pointer"
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
                   className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full cursor-pointer"
                 >
                   <ChevronRight className="h-4 w-4 text-neutral-900 dark:text-white" />
                 </Button>
               </div>

               {/* Month Grid */}
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
                         "h-9 text-sm font-normal cursor-pointer transition-colors",
                         isSelected 
                           ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-neutral-200" 
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
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}