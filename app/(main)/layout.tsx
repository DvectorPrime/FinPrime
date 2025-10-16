"use client";

import { FiMenu } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SidebarMenu } from "@/components/SidebarMenu";
import { HeaderSearchInput } from "@/components/HeaderSearchInput";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useMenu } from "@/context/menuContext";

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth();
    const [imgError, setImgError] = useState(false);
    const { menuShowing, setMenuShowing, toggleMenu } = useMenu();

    const profileImage = user?.photoURL && !imgError
        ? user.photoURL
        : '/default-avatar.png';

    return (
        <>
            <div className="relative grid grid-cols-1 w-full h-screen lg:grid-cols-[240px_1fr]">
                <SidebarMenu menuShowing={menuShowing} />
                <div className="flex flex-col w-full">
                    <header className="flex items-center justify-between w-full px-4 md:px-8 h-14 bg-[#0079BF] dark:bg-slate-800 dark:border-b dark:border-slate-700 shadow-xs z-20">
                        <div className="flex justify-start items-center w-auto gap-3">
                            <button type="button" className="block lg:hidden" onClick={() => {
                                toggleMenu()
                            }}>
                                <FiMenu className="text-white text-5xl" />
                            </button>
                            <Image src="/logo-white.png" alt="FinPrime" width={36} height={36}
                                className="hidden lg:block" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <Image src="/logo-white.png" alt="FinPrime" width={36} height={36}
                                className="block lg:hidden" />
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
                    {children}
                </div>
            </div>
            {menuShowing && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setMenuShowing(false)}
                ></div>
            )}
        </>
    )
}
