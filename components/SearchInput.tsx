import React from "react";
import {cn} from "@/lib/utils"

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  placeHolder: string;
  className: string
};

export const SearchInput = ({
  icon,
  iconPosition = "left",
  containerClassName = "",
  placeHolder = "Search...",
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className={`lg:w-[250px] relative block ${containerClassName}`}>
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
        className={cn(
          // Base styles
          "peer w-full h-10 rounded-2xl border border-neutral-300 bg-neutral-300/20",
          "font-sans text-base font-normal text-neutral-800 placeholder:text-neutral-500",
          "outline-none transition-all",
          // Positioning based on icon
          iconPosition === "left" ? "pl-[34px] pr-3" : "pr-[34px] pl-3",
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
          className)}
          placeholder={placeHolder}
      />
    </div>
  );
};