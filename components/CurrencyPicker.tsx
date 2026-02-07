"use client";

import * as React from "react";
import { Check, ChevronDown, Coins, Lock } from "lucide-react";
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

// 1. Define Active Currencies
const activeCurrencies = [
  { value: "NGN", label: "NGN" },
];

// 2. Define Future Currencies
const comingSoonCurrencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

interface CurrencyDropdownProps {
    value?: string;
    onChange?: (val: string) => void;
    preferredBg?: string;
}

export default function CurrencyDropdown({ preferredBg = "default", value = "NGN", onChange }: CurrencyDropdownProps) {
  const [open, setOpen] = React.useState(false);

  // Helper to find label for display button
  const allCurrencies = [...activeCurrencies, ...comingSoonCurrencies];
  const selectedLabel = allCurrencies.find((c) => c.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `w-full h-10 justify-between rounded-2xl border border-neutral-300 cursor-pointer ${
              preferredBg === "default" ? "bg-neutral-300/20" : preferredBg
            } px-3 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500`,
            "dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600 dark:focus:ring-sky-500",
            "lg:rounded-full lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50",
            "lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-neutral-500" />
            {selectedLabel || "Select currency..."}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 text-neutral-600 dark:text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 rounded-lg p-0 bg-white border border-neutral-300 dark:bg-slate-800 dark:border-slate-700 shadow-lg text-sm">
        <Command>
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            
            {/* GROUP 1: ACTIVE (Selectable) */}
            <CommandGroup heading="Available">
              {activeCurrencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={(currentValue) => {
                    onChange?.(currency.value); 
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

            {/* GROUP 2: COMING SOON (Disabled) */}
            <CommandGroup heading="Coming Soon">
              {comingSoonCurrencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  disabled={true} // Makes it non-interactive
                  className="opacity-50 cursor-not-allowed aria-selected:bg-transparent"
                >
                  <div className="flex items-center gap-2 grow">
                    <span className="font-medium">{currency.label}</span>
                  </div>
                  {/* Lock icon to indicate restricted access */}
                  <Lock className="ml-auto h-3 w-3 text-neutral-400" />
                </CommandItem>
              ))}
            </CommandGroup>
            
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}