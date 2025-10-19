import React from "react";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  placeHolder: string;
};

export const SearchInput = ({
  icon,
  iconPosition = "left",
  containerClassName = "",
  placeHolder = "Search...",
  ...props
}: SearchInputProps) => {
  return (
    <div className={`relative ${containerClassName}`}>
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
        className={`
          peer w-[326px] h-10 rounded-2xl border border-neutral-300 bg-neutral-300/20
          font-sans text-base leading-[26px] font-normal text-neutral-800
          placeholder:text-neutral-500
          outline-none transition-all
          hover:border-neutral-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-70 disabled:cursor-not-allowed
          ${iconPosition === "left" ? "pl-[34px] pr-3" : "pr-[34px] pl-3"}
        `}
        placeholder={placeHolder}
      />
    </div>
  );
};