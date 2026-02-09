import React from 'react';

import { FaHome, FaCar, FaGift, FaQuestionCircle } from 'react-icons/fa';
import { BsBriefcase, BsReceiptCutoff, BsCart3 } from 'react-icons/bs';
import { MdFastfood } from 'react-icons/md';
import { IoTrendingUpOutline } from 'react-icons/io5';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';
import { LuLightbulb } from 'react-icons/lu';

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

type CategoryIconProps = {
  iconName: string | null; 
  className?: string;
};

export const CategoryIcon = ({ iconName, className }: CategoryIconProps) => {
  const IconComponent = iconName ? iconMap[iconName] : iconMap.Default;

  return <IconComponent className={className} />;
};
