"use client";

import * as React from "react";
import { Check, ChevronDown, List } from "lucide-react"; // Added List icon

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

// Define the structure of a category from the API
interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
}

// 1. Define the special "All Categories" option
const allCategoriesOption = {
  id: "all",
  name: "All Categories",
  type: "all" as const, // Use a literal type to distinguish it
  icon: "all_icon", // Special identifier
};

export function CategoryPicker() {
  const [open, setOpen] = React.useState(false);
  // 2. Set "All Categories" as the default selected state
  const [selectedCategory, setSelectedCategory] = React.useState<
    Category | typeof allCategoriesOption
  >(allCategoriesOption);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch categories from the API when the component mounts
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
            className="w-full rounded-full justify-between font-normal text-neutral-900 dark:text-neutral-100 bg-neutral-300/20 lg:bg-white dark:bg-slate-700 border-neutral-300 dark:border-slate-600 hover:bg-neutral-300/30 dark:hover:bg-slate-600"
          >
            {/* 3. Custom display to handle the "All Categories" icon */}
            <div className="flex items-center gap-2">
              {selectedCategory.name}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white dark:bg-slate-800">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading..." : "No category found."}
              </CommandEmpty>
              
              {/* 4. Add "All Categories" as the first selectable item */}
              <CommandItem
                key={allCategoriesOption.id}
                value={allCategoriesOption.name}
                onSelect={() => {
                  setSelectedCategory(allCategoriesOption);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  {allCategoriesOption.name}
                </div>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategory.id === allCategoriesOption.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>

              <CommandGroup heading="Income">
                {incomeCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setSelectedCategory(category);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        iconName={category.icon}
                        className="w-4 h-4"
                      />
                      {category.name}
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory?.id === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Expense">
                {expenseCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      setSelectedCategory(category);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        iconName={category.icon}
                        className="w-4 h-4"
                      />
                      {category.name}
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
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

