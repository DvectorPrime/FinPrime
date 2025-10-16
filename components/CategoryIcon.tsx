import React from 'react';

// 1. Import every icon used in your API
import { FaHome, FaCar, FaGift, FaQuestionCircle } from 'react-icons/fa';
import { BsBriefcase, BsReceiptCutoff, BsCart3 } from 'react-icons/bs';
import { MdFastfood } from 'react-icons/md';
import { IoTrendingUpOutline } from 'react-icons/io5';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';
import { LuLightbulb } from 'react-icons/lu';

// 2. Create the Icon Map
// This object maps the string names from your API to the actual icon components.
const iconMap: { [key: string]: React.ElementType } = {
  // Income Icons
  BsBriefcase,
  HiOutlineBuildingStorefront,
  IoTrendingUpOutline,
  FaGift,
  LuLightbulb,

  // Expense Icons
  FaHome,
  MdFastfood,
  FaCar,
  BsCart3,
  BsReceiptCutoff,
  
  // A fallback icon for safety
  Default: FaQuestionCircle,
};

// 3. Define the component's props
type CategoryIconProps = {
  iconName: string | null; // This will be a string like "FaHome" from your API data
  className?: string; // Allows you to pass Tailwind classes for styling
};

// 4. Build the component
export const CategoryIcon = ({ iconName, className }: CategoryIconProps) => {
  // Look up the icon component in the map using the name from the API.
  // If no match is found, it uses the 'Default' icon to prevent errors.
  const IconComponent = iconName ? iconMap[iconName] : iconMap.Default;

  // Render the found icon component with any provided styles.
  return <IconComponent className={className} />;
};
