"use client";

import * as React from "react";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  function formatDateObject(dateObject: Date) {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
      dateObject
    );
    return formattedDate.replace(/ /g, ", ").replace(",", "");
  }

  return (
    <div className="lg:order-1 grow">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id="date"
            className={cn(
              // --- Mobile (default) styles ---
              "w-full h-10 justify-between rounded-2xl border border-neutral-300 bg-neutral-300/20 px-3 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600",
              
              // --- Desktop (lg:) styles ---
              "lg:rounded-full lg:justify-start lg:gap-4 lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50 lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700",

              !date && "text-muted-foreground"
            )}
          >
            {/* 4. Added a Calendar icon that only shows on desktop */}
            <CalendarIcon className="hidden lg:block h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            
            {/* Date text */}
            <span className="flex-grow text-left">
              {date ? formatDateObject(date) : <span>Pick a date</span>}
            </span>

            {/* Chevron icon, now pushed to the end on desktop */}
            <ChevronDownIcon className="h-4 w-4 text-neutral-900 dark:text-neutral-100 lg:text-neutral-600 lg:dark:text-neutral-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden rounded-lg border-neutral-200 bg-white p-0 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

