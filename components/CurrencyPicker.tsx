"use client";

import * as React from "react";
import { Check, ChevronDown, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const currencies = [
  {
    value: "ngn",
    label: "NGN",
  },
];

export default function CurrencyDropdown({ preferredBg = "default" }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("ngn");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `w-full h-10 justify-between rounded-2xl border border-neutral-300 ${
              preferredBg === "default" ? "bg-neutral-300/20" : preferredBg
            } px-3 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500`,
            "dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600 dark:focus:ring-sky-500",
            "lg:rounded-full lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50",
            "lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-neutral-500" />
            {value
              ? currencies.find((c) => c.value === value)?.label
              : "Select currency..."}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 text-neutral-600 dark:text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] rounded-lg p-0 bg-white border border-neutral-300 dark:bg-slate-800 dark:border-slate-700 shadow-lg text-sm">
        <Command>
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup heading="Available Currencies">
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground dark:aria-selected:bg-slate-700 dark:text-neutral-300"
                >
                  <div className="flex items-center gap-2 grow">
                    <span className="font-medium">{currency.label}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === currency.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Coming Soon" className="opacity-50">
              <div className="px-2 py-1.5 text-xs italic">
                More options will be added shortly.
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}