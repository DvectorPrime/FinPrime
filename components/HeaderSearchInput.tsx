import React from "react";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  menuSearch: boolean
};

export const HeaderSearchInput = ({
  icon,
  menuSearch,
  ...props
}: SearchInputProps) => {
  return (
    <div className={`relative ${menuSearch ? "block md:hidden w-full px-2 mt-4" : "hidden md:block"}`}>
      <div
        className="
          absolute top-1/2 -translate-y-1/2 text-white/80
          peer-disabled:text-white/50 left-5 md:left-3"
      >
        {icon}
      </div>
      <input
        {...props}
        className={`
          peer ${menuSearch ? "w-full" : "w-64"} h-9 rounded-md border bg-[#0079BF] dark:bg-slate-700
          font-sans text-sm font-normal text-white
          border-white/40 dark:border-slate-600 placeholder:text-white/70
          outline-none transition-all
          hover:border-white/60 dark:hover:border-slate-500
          focus:ring-2 focus:ring-white/50
          disabled:opacity-70 disabled:cursor-not-allowed
          pl-[34px] pr-3`}
      />
    </div>
  );
};
