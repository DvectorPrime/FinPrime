"use client"

import { FiMenu } from "react-icons/fi";
import { SidebarMenu } from "@/components/SidebarMenu";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function MainLayout() {
    const { user } = useAuth();
    const [imgError, setImgError] = useState(false);

    const profileImage = user?.photoURL && !imgError 
        ? user.photoURL 
        : '/default-avatar.png';

    return (
        <div className="grid grid-cols-1 w-full h-[100vh] md:grid-cols-[240px_1fr] lg:min-h-screen">
            <SidebarMenu />
            <header className="flex items-center justify-between w-full px-3 h-12 bg-[#0079BF] rounded-none shadow-xs">
                <div className="hidden md:block"></div>
                <FiMenu className="text-white md:hidden text-3xl font-bold" />
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
            </header>
        </div>
    )
}