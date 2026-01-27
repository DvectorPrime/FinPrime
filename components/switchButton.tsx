"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export default function CustomSwitch({ checked = false, onCheckedChange, disabled = false } : SwitchProps) {
  const toggle = () => !disabled && onCheckedChange?.(!checked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "relative w-11 h-6 flex items-center transition-all outline-none",
        disabled ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer"
      )}
    >
      <div className={cn(
          "w-11 h-6 rounded-full transition-colors duration-300",
          checked ? "bg-[#0079BF]" : "bg-[#BDC1CA] dark:bg-slate-700"
      )} />
      <div className={cn(
          "absolute w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out",
          "top-0.5", 
          checked ? "left-[22px]" : "left-0.5"
      )} />
    </button>
  );
}