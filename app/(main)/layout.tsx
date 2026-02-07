"use client";

import { FiMenu } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SidebarMenu } from "@/components/SidebarMenu";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMenu } from "@/context/menuContext";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

// --- TOUR DATA ---
const TOUR_STEPS = [
    {
        title: "Welcome to FinPrime! 🚀",
        description: "Your new financial command center. FinPrime helps you track expenses, visualize your wealth, and master your money—all in one place. Let's show you around!",
        target: "none"
    },
    {
        title: "Your Dashboard 📊",
        description: "This is your home base. See your monthly income vs. expenses, total balance, savings rate, spending graphs, and get smart AI insights on your financial health.",
        target: "nav-dashboard"
    },
    {
        title: "Transactions 💸",
        description: "Dive deep into your spending. View all transactions for any specific month, filter by category to find that one coffee, and add new income or expenses easily.",
        target: "nav-transactions"
    },
    {
        title: "Smart Budgeting 💰",
        description: "Stop overspending! Set monthly limits for different categories. Our AI will even analyze your habits and give you tips to stretch your Naira further.",
        target: "nav-budgets"
    },
    {
        title: "Reports (Coming Soon) 📈",
        description: "We are building powerful visualization tools for V2. Soon, you'll be able to generate detailed PDF reports and deep-dive analytics on your net worth.",
        target: "nav-reports"
    },
    {
        title: "Notifications 🔔",
        description: "Also coming in V2! We'll alert you when you're close to a budget limit or when you've successfully hit a savings goal. No spam, just money moves.",
        target: "nav-notifications"
    },
    {
        title: "Settings & Profile ⚙️",
        description: "Make it yours. Change your avatar, update your password, switch themes, or log out securely (especially if you're on a borrowed laptop!).",
        target: "nav-settings"
    },
    {
        title: "You're All Set! 🎉",
        description: "That's the tour! You are now a certified FinPrime pilot. Go forth and conquer your finances (and maybe buy yourself a treat). Happy tracking!",
        target: "none"
    }
];

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { user, refreshUser } = useAuth(); // Ensure refreshUser is available in context
    const router = useRouter();
    const { menuShowing, setMenuShowing, toggleMenu } = useMenu();

    // --- TOUR STATE ---
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // --- AUTO-START TOUR ---
    useEffect(() => {
        // If user is loaded, valid, and HAS NOT onboarded yet -> Start Tour
        if (user && !user.hasOnboarded) {
            setIsTourOpen(true);
        }

        return 
    }, [user]);

    // --- COMPLETE TOUR HANDLER ---
    const completeOnboarding = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/onboarded`, {
                method: "POST",
                credentials: "include"
            });
            if (res.ok) {
                // Update local user state so it doesn't show again 
                setIsTourOpen(false);
            }
        } catch (err) {
            console.error("Failed to mark onboarding", err);
            setIsTourOpen(false); // Close anyway so they aren't stuck
        }
    };

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeOnboarding();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        if(confirm("Are you sure you want to skip the tour?")) {
             completeOnboarding();
        }
    };

    // Calculate Position based on step (Desktop Only)
    // Adjust 'startY' if your header is taller/shorter
    const getDesktopPosition = (index: number) => {
        const startY = 210; // Distance from top to first menu item
        const itemHeight = 52; // Approx height of each menu item
        
        // Map steps to specific sidebar indices (Dashboard=0, Transactions=1, etc)
        const stepToSidebarIndex: {[key: number]: number} = {
            1: 0, // Dashboard
            2: 1, // Transactions
            3: 2, // Budget
            4: 3, // Reports
            5: 4, // Notifications
            6: 5  // Settings
        };

        if (index === 0 || index === 7) return "center"; // First & Last step centered

        // Calculate top position
        const sidebarIndex = stepToSidebarIndex[index] ?? 0;
        return { top: `${startY + (sidebarIndex * itemHeight)}px`, left: "420px" }; 
    };

    const pos = getDesktopPosition(currentStep);
    const isCentered = pos === "center";

    return (
        <>
            <div className="grid grid-cols-1 w-full h-full lg:flex">
                <SidebarMenu menuShowing={menuShowing} />
                <div className="flex flex-col w-full">
                    <header className="flex items-center justify-between w-full px-4 py-2 md:px-8 h-14 bg-[#0079BF] dark:bg-slate-800 dark:border-b dark:border-slate-700 shadow-xs z-20">
                        
                        {/* Left Side: Menu & Logo */}
                        <div className="flex justify-start items-center w-auto gap-3">
                            <button type="button" className="block lg:hidden" onClick={() => toggleMenu()}>
                                <FiMenu className="text-white text-5xl" />
                            </button>
                            <Image src="/logo-white.png" alt="FinPrime" width={36} height={36} className="hidden lg:block" />
                        </div>

                        {/* Right Side: Actions */}
                        <div className="flex gap-4 items-center">
                            <Image src="/logo-white.png" alt="FinPrime" width={36} height={36} className="block lg:hidden" />
                            
                            {/* --- TAKE A TOUR BUTTON --- */}
                            {user && !isTourOpen && (
                                <>
                                    <button
                                        onClick={() => setIsTourOpen(true)}
                                        className="hidden md:block px-4 py-1.5 text-sm font-bold text-[#0079BF] bg-white rounded-full shadow-lg animate-pulse cursor-pointer hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                                    >
                                        Take a Tour 🚀
                                    </button>
                                    <button
                                        onClick={() => setIsTourOpen(true)}
                                        className="md:hidden px-3 py-1 text-sm font-bold text-[#0079BF] bg-white rounded-full shadow-md animate-pulse cursor-pointer"
                                    >
                                        Tour 🚀
                                    </button>
                                </>
                            )}

                            <button
                                className="w-8 h-8 flex items-center justify-center text-white bg-white/20 cursor-pointer dark:bg-white/10 rounded-md transition-colors duration-200 hover:bg-white/30 dark:hover:bg-white/20"
                                onClick={() => router.push("/notifications")}
                            >
                                <IoMdNotificationsOutline className="w-6 h-6 text-white" />
                            </button>
                            
                            <UserAvatar size="md" src={`${user?.avatarUrl ? user?.avatarUrl : ""}`} name={`${user?.firstName} ${user?.lastName}`} />
                        </div>
                    </header>
                    {children}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {menuShowing && (
                <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMenuShowing(false)}></div>
            )}

            {/* --- ONBOARDING TOUR OVERLAY --- */}
            {isTourOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center lg:block">
                    {/* Dark Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => { /* Prevent closing on click outside */ }}></div>

                    {/* The Tour Card */}
                    <div 
                        className={`absolute bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-[90%] max-w-md transition-all duration-300 ease-in-out border-2 border-[#0079BF]
                        ${isCentered ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'lg:transform-none transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 lg:top-auto lg:left-auto'}
                        `}
                        // Apply dynamic position ONLY for desktop non-centered steps
                        style={!isCentered && typeof pos !== 'string' && typeof window !== 'undefined' && window.innerWidth >= 1024 ? { top: pos.top, left: pos.left } : {}}
                    >
                        {/* Arrow pointing Left (Desktop only, when not centered) */}
                        {!isCentered && (
                            <div className="hidden lg:block absolute top-6 -left-3 w-6 h-6 bg-white dark:bg-slate-800 border-l-2 border-b-2 border-[#0079BF] transform rotate-45"></div>
                        )}

                        {/* Header: Step Count & Skip */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-[#0079BF] bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md">
                                Step {currentStep + 1} / {TOUR_STEPS.length}
                            </span>
                            <button onClick={handleSkip} className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors cursor-pointer">
                                Skip Tour
                            </button>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {TOUR_STEPS[currentStep].title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                            {TOUR_STEPS[currentStep].description}
                        </p>

                        {/* Footer: Prev/Next Buttons */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                    ${currentStep === 0 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
                                    }`}
                            >
                                ← Prev
                            </button>

                            <button
                                onClick={handleNext}
                                className="px-6 py-2 text-sm font-bold text-white bg-[#0079BF] hover:bg-blue-600 rounded-lg shadow-md transition-transform cursor-pointer hover:scale-105"
                            >
                                {currentStep === TOUR_STEPS.length - 1 ? "Finish! 🥳" : "Next →"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}