import { useState } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { FaHome, FaCog, FaChartBar } from "react-icons/fa"; 
import { BsReceiptCutoff } from "react-icons/bs";
import { LuPiggyBank } from "react-icons/lu";
import { MdLogout } from "react-icons/md";

import Image from "next/image";


type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "transactions", label: "Transactions", icon: <BsReceiptCutoff /> },
  { id: "budget", label: "Budget", icon: <LuPiggyBank /> },
  { id: "reports", label: "Reports", icon: <FaChartBar />},
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

export const SidebarMenu = () => {
  const [selectedItemId, setSelectedItemId] = useState("dashboard"); // Default selected item

  return (
    <nav className="hidden relative md:block p-2 bg-white border border-neutral-300">
      <div className="flex items-center gap-0.5 mx-4 mt-3 mb-5">
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="inline" />
        <p className="inline font-sans text-[25px] leading-[25px] font-bold text-[#0079BF] italic">FinPrime</p>
      </div>
      {menuItems.map((item, index) => (
        <div key={item.id} onClick={() => setSelectedItemId(item.id)}>
          <SidebarMenuItem
            label={item.label}
            icon={item.icon}
            isSelected={selectedItemId === item.id}
            // This handles your :nth-child(1) style
            textColor={index === 0 ? "text-neutral-800" : "text-neutral-600"}
          />
        </div>
      ))}
      <button className="absolute w-[calc(100%-16px)] bottom-4 h-10 px-3 mt-auto
        flex items-center justify-center gap-4
        font-sans text-sm leading-[22px] font-medium text-white
        bg-[#D64651] border-none rounded-md
        transition-colors duration-200
        hover:bg-[#BD2936] hover:cursor-pointer
        active:bg-[#A6242F]
        disabled:opacity-40 disabled:cursor-not-allowed">
        <MdLogout className="w-4 h-4 text-white font-thin " />
        Logout
      </button>
    </nav>
  );
};