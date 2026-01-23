"use client";

import * as React from "react";
import { Check, ChevronDown, List } from "lucide-react"; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryIcon } from "./CategoryIcon";

import { Filters } from "./types/filtertypes";

export interface Category {
  id: string;
  name: string;
  type: "all" | "income" | "expense";
  icon: string;
}

const allCategoriesOption = {
  id: "all",
  name: "All Categories",
  type: "all" as const,
  icon: "all_icon", 
};

interface CategoryPickerProps{
  preferredBg?: string
  value?: string
  handleCategoryChange?: (selectedOption: Category) => void
  disabled: boolean
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

export function CategoryPicker({preferredBg = "default", handleCategoryChange, value, setFilters} : CategoryPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<
    Category | typeof allCategoriesOption
  >(allCategoriesOption);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 1. Sync Filters with Selection
  React.useEffect(() => {
    setFilters((prev) => {
      return {
        ...prev,
        category : selectedCategory.id === "all" ? selectedCategory.id : selectedCategory.name
      }
    })
  }, [selectedCategory, setFilters])

  // 2. Fetch Categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 3. Handle External Value Changes (The Fix)
  // BUG FIX: Added [value, categories] to dependencies. 
  // Previously this only ran on mount ([]), so it missed the moment when 'categories' finished loading.
  React.useEffect(() => {
    if (value && categories.length > 0) {
      const current_category = categories.find(category => category.name === value)
  
      if (current_category){
        setSelectedCategory(current_category)
      }
    } 
  }, [value, categories]) 

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <div className="lg:order-2 grow">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              `w-full h-10 justify-between rounded-2xl border border-neutral-300 ${preferredBg === "default" ? "bg-neutral-300/20" : preferredBg} px-3 font-sans text-sm font-normal text-neutral-900 transition-colors hover:bg-neutral-300/30 focus:ring-2 focus:ring-blue-500`,
              "dark:bg-slate-700 dark:border-slate-600 dark:text-neutral-100 dark:hover:bg-slate-600 dark:focus:ring-sky-500",
              "lg:rounded-full lg:bg-white lg:text-neutral-600 lg:hover:bg-gray-50",
              "lg:dark:bg-slate-800 lg:dark:border-slate-700 lg:dark:text-neutral-300 lg:dark:hover:bg-slate-700"
            )}
          >
            <div className="flex items-center gap-2">
               {/* Handle special icon for "All Categories" vs Standard Icons */}
               {selectedCategory.id === "all" ? (
                  <List className="w-4 h-4" />
               ) : (
                  <CategoryIcon iconName={selectedCategory.icon} className="w-4 h-4" />
               )}
              {selectedCategory.name}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 text-neutral-600 dark:text-neutral-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] rounded-lg p-0 bg-white border border-neutral-300 dark:bg-slate-800 dark:border-slate-700 shadow-lg text-sm">
          <Command>
            <CommandInput className="dark:text-neutral-100 dark:placeholder:text-neutral-400" placeholder="Search category..." />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                {loading ? "Loading..." : "No category found."}
              </CommandEmpty>
              
              <CommandItem
                key={allCategoriesOption.id}
                value={allCategoriesOption.name}
                onSelect={() => {
                  setSelectedCategory(allCategoriesOption);
                  setOpen(false);
                  if (handleCategoryChange) {
                    handleCategoryChange(allCategoriesOption)
                  }
                }}
                className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground dark:aria-selected:bg-slate-700 dark:text-neutral-300"
              >
                <div className="flex items-center gap-2 grow">
                  <List className="w-4 h-4" />
                  {allCategoriesOption.name}
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCategory.id === allCategoriesOption.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>

              <CommandGroup className="text-xs text-muted-foreground dark:text-neutral-500 px-2 py-1.5" heading="Income">
                {incomeCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setSelectedCategory(category);
                      setOpen(false);
                      if (handleCategoryChange) {
                        handleCategoryChange(category)
                      }
                    }}
                    className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground dark:aria-selected:bg-slate-700 dark:text-neutral-300"
                  >
                    <div className="flex items-center gap-2 grow">
                      <CategoryIcon
                        iconName={category.icon}
                        className="w-4 h-4"
                      />
                      {category.name}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCategory?.id === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Expense" className="text-xs text-muted-foreground dark:text-neutral-500 px-2 py-1.5">
                {expenseCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setSelectedCategory(category);
                      setOpen(false);
                      if (handleCategoryChange) {
                        handleCategoryChange(category)
                      }
                    }}
                    className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground dark:aria-selected:bg-slate-700 dark:text-neutral-300"
                  >
                    <div className="flex items-center gap-2 grow">
                      <CategoryIcon
                        iconName={category.icon}
                        className="w-4 h-4"
                      />
                      {category.name}
                    </div>
                    <Check
                      className={cn(
                          "ml-auto h-4 w-4",
                        selectedCategory?.id === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}