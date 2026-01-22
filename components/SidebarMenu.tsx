import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { HeaderSearchInput } from "./HeaderSearchInput";
import { FaHome, FaCog, FaChartBar, FaSearch } from "react-icons/fa";
import { BsReceiptCutoff } from "react-icons/bs";
import { LuPiggyBank } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import Image from "next/image";

type SidebarMenuProps = {
  menuShowing: boolean
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "transactions", label: "Transactions", icon: <BsReceiptCutoff /> },
  { id: "budget", label: "Budget", icon: <LuPiggyBank /> },
  { id: "goals", label: "Goals", icon: <LuPiggyBank />},
  { id: "reports", label: "Reports", icon: <FaChartBar /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

export const SidebarMenu = ({ menuShowing }: SidebarMenuProps) => {
  const router = useRouter()

  const [selectedItemId, setSelectedItemId] = useState("dashboard");

  async function logOut() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {credentials: "include"})
      window.location.href = '/login'
    } catch (err) {
      console.log('failed to log out', err)
    }
    }

  return (
    <nav
      className={`
        absolute top-0 left-0 w-[240px] h-full p-2 bg-white dark:bg-slate-800 border-r border-neutral-200 dark:border-slate-700 z-40
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${menuShowing ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center gap-1.5 mx-2 mt-3 mb-5">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <p className="font-sans text-2xl font-bold text-[#0079BF] dark:text-sky-400 italic">
          FinPrime
        </p>
      </div>
      {menuItems.map((item, index) => (
        <div key={item.id} onClick={() => {setSelectedItemId(item.id); router.push(`/${item.id}`)}}>
          <SidebarMenuItem
            label={item.label}
            icon={item.icon}
            isSelected={selectedItemId === item.id}
            textColor={index === 0 ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-600 dark:text-neutral-400"}
          />
        </div>
      ))}
      <HeaderSearchInput
        icon={<FaSearch className="w-4 h-4" />}
        placeholder="Search..."
        menuSearch={true}
      />
      <button onClick={logOut} className="absolute w-[calc(100%-16px)] bottom-4 h-10 px-3 mt-auto
        flex items-center justify-center gap-4
        font-sans text-sm leading-[22px] font-medium text-white
        bg-red-500/90 border-none rounded-md
        transition-colors duration-200
        hover:bg-red-500
        active:bg-red-600
        disabled:opacity-40 disabled:cursor-not-allowed">
        <MdLogout className="w-4 h-4 text-white" />
        Logout
      </button>
    </nav>
  );
};
