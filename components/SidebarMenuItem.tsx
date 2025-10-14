import React from "react";

type SidebarMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  textColor?: string;
};

export const SidebarMenuItem = ({
  icon,
  label,
  isSelected = false,
  textColor = "text-neutral-600 dark:text-neutral-400",
}: SidebarMenuItemProps) => {
  // Base classes for all items
  const baseClasses = "grid grid-cols-[24px_1fr] items-center p-3 cursor-pointer whitespace-nowrap rounded-md transition-colors";
  
  // Classes for the selected state
  const selectedClasses = "font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-slate-700";
  
  // Classes for the normal (not selected) state
  const normalClasses = `font-medium ${textColor} hover:bg-gray-100 dark:hover:bg-slate-700/50`;

  return (
    <a
      className={`
        ${baseClasses}
        ${isSelected ? selectedClasses : normalClasses}
      `}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span>{label}</span>
    </a>
  );
};
