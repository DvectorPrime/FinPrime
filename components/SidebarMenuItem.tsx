import React from "react";

type SidebarMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  textColor?: string;
  href?: string;
};

export const SidebarMenuItem = ({
  icon,
  label,
  isSelected = false,
  textColor = "text-neutral-600",
  href = "#",
}: SidebarMenuItemProps) => {
  // Base classes for all items
  const baseClasses = "grid grid-cols-[24px_1fr] items-center p-4 cursor-pointer whitespace-nowrap rounded-md transition-colors";
  
  // Classes for the selected state
  const selectedClasses = "font-bold text-[#0079BF] bg-[#A3DDFF]";
  
  // Classes for the normal (not selected) state
  const normalClasses = `font-medium ${textColor} hover:bg-gray-100`;

  return (
    <a
      href={href}
      className={`
        ${baseClasses}
        ${isSelected ? selectedClasses : normalClasses}
      `}
    >
      <div className="">{icon}</div>
      <span>{label}</span>
    </a>
  );
};