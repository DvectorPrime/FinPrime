import { useRouter, usePathname } from "next/navigation";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { HeaderSearchInput } from "./HeaderSearchInput";
import { FaHome, FaCog, FaChartBar, FaSearch } from "react-icons/fa";
import { BsReceiptCutoff } from "react-icons/bs";
import { LuPiggyBank } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import Image from "next/image";
import { useToast } from "@/context/toastContext";

type SidebarMenuProps = {
  menuShowing: boolean;
};

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "transactions", label: "Transactions", icon: <BsReceiptCutoff /> },
  { id: "budget", label: "Budget", icon: <LuPiggyBank /> },
  { id: "reports", label: "Reports", icon: <FaChartBar /> },
  { id: "notifications", label: "Notifications", icon: <IoMdNotificationsOutline /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

export const SidebarMenu = ({ menuShowing }: SidebarMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const isActive = (itemId: string) => {
    if (itemId === "dashboard" && pathname === "/") return true;
    return pathname.startsWith(`/${itemId}`);
  };

  async function logOut() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      console.log("failed to log out", err);
      // Added error visual for logout failure - shows toast notification
      showToast("Failed to logout. Please try again.", "error");
    }
  }

  return (
    <nav
      className={`
        /* Mobile Styles: Absolute positioning to overlay content */
        absolute top-0 left-0 w-60 h-screen z-40
        bg-white dark:bg-slate-800 border-r border-neutral-200 dark:border-slate-700
        transition-transform duration-300 ease-in-out
        
        /* Mobile Visibility Toggle */
        ${menuShowing ? "translate-x-0" : "-translate-x-full"}

        /* Desktop Styles: Sticky positioning to stay fixed while content scrolls */
        lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen lg:shrink-0 lg:w-48
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-1.5 mx-4 mt-5 mb-8 shrink-0">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <p className="font-sans text-2xl font-bold text-[#0079BF] dark:text-sky-400 italic">
            FinPrime
          </p>
        </div>

        {/* Menu Items (Scrollable area) */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {menuItems.map((item) => {
            const isSelected = isActive(item.id);
            return (
              <div
                key={item.id}
                onClick={() => router.push(`/${item.id}`)}
                className="cursor-pointer"
              >
                <SidebarMenuItem
                  label={item.label}
                  icon={item.icon}
                  isSelected={isSelected}
                  textColor={
                    isSelected
                      ? "text-neutral-900 dark:text-white font-semibold"
                      : "text-neutral-600 dark:text-neutral-400"
                  }
                />
              </div>
            );
          })}
          
          {/* <div className="mt-4 px-2">
            <HeaderSearchInput
                icon={<FaSearch className="w-4 h-4" />}
                placeholder="Search..."
                menuSearch={true}
            />
          </div> */}
        </div>

        {/* Footer / Logout Section (Stays at bottom) */}
        <div className="p-4 mt-auto border-t border-neutral-100 dark:border-slate-700 shrink-0">
          <button
            onClick={logOut}
            className="w-full h-10 px-3 flex items-center justify-center gap-4
            font-sans text-sm leading-5.5 font-medium text-white
            bg-red-500/90 border-none rounded-md
            transition-colors duration-200
            hover:bg-red-500 active:bg-red-600
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdLogout className="w-4 h-4 text-white" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};