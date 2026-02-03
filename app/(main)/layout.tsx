"use client";

import { FiMenu } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SidebarMenu } from "@/components/SidebarMenu";
import { HeaderSearchInput } from "@/components/HeaderSearchInput";
import Image from "next/image";

import { useState } from "react";
import { useMenu } from "@/context/menuContext";
import { ToastProvider } from "@/context/toastContext";
import { UserAvatar } from "@/components/UserAvatar";
import {  useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const {user} = useAuth()

    const router = useRouter()

    const { menuShowing, setMenuShowing, toggleMenu } = useMenu();

    return (
        <>
            <div className="grid grid-cols-1 w-full h-full lg:flex">
                <SidebarMenu menuShowing={menuShowing} />
                <div className="flex flex-col w-full">
                    <header className="flex items-center justify-between w-full px-4 py-2 md:px-8 h-14 bg-[#0079BF] dark:bg-slate-800 dark:border-b dark:border-slate-700 shadow-xs z-20">
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
                            {/* <HeaderSearchInput
                                icon={<FaSearch className="w-4 h-4" />}
                                placeholder="Search..."
                                menuSearch={false}
                            /> */}
                            <button
                                className="w-8 h-8 flex items-center justify-center text-white bg-white/20 cursor-pointer dark:bg-white/10 rounded-md transition-colors duration-200 hover:bg-white/30 dark:hover:bg-white/20"
                                onClick={() => {
                                    router.push("/notifications")
                                }}
                            >
                                <IoMdNotificationsOutline className="w-6 h-6 text-white" />
                            </button>
                            <UserAvatar size="md" src={`${user?.avatarUrl ? user?.avatarUrl : "" }`} name={`${user?.firstName} ${user?.lastName}`} />

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
