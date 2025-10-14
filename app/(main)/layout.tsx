"use client";

import { FiMenu } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SidebarMenu } from "@/components/SidebarMenu";
import { HeaderSearchInput } from "@/components/HeaderSearchInput";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth();
    const [imgError, setImgError] = useState(false);

    const profileImage = user?.photoURL && !imgError
        ? user.photoURL
        : '/default-avatar.png';


    const [menuShowing, setMenuShowing] = useState<boolean>(false)
    return (
        <>
            <div className="relative grid grid-cols-1 w-full h-screen md:grid-cols-[240px_1fr]">
                <SidebarMenu menuShowing={menuShowing} />
                <div className="flex flex-col w-full">
                    <header className="flex items-center justify-between w-full px-4 md:px-8 h-14 bg-[#0079BF] dark:bg-slate-800 dark:border-b dark:border-slate-700 shadow-xs z-20">
                        <button type="button" className="block md:hidden" onClick={() => { setMenuShowing((prev) => !prev) }}>
                            <FiMenu className="text-white text-2xl" />
                        </button>
                        <Image src="/logo-white.png" alt="FinPrime" width={36} height={36}
                            className="hidden md:block" />
                        <div className="flex gap-4 items-center">
                            <HeaderSearchInput
                                icon={<FaSearch className="w-4 h-4" />}
                                placeholder="Search..."
                                menuSearch={false}
                            />
                            <button
                                className="w-8 h-8 flex items-center justify-center text-white bg-white/20 cursor-pointer dark:bg-white/10 rounded-md transition-colors duration-200 hover:bg-white/30 dark:hover:bg-white/20"
                            >
                                <IoMdNotificationsOutline className="w-6 h-6 text-white" />
                            </button>
                            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#FCFBC9]">
                                <Image
                                    src={profileImage}
                                    alt={`${user?.displayName || 'User'}'s profile`}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                    priority
                                />
                            </div>
                        </div>
                    </header>
                    <main className="flex-grow overflow-y-auto bg-gray-50 dark:bg-slate-900 p-4 md:p-6">{children}</main>
                </div>
            </div>
            {menuShowing && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setMenuShowing(false)}
                ></div>
            )}
        </>
    )
}
