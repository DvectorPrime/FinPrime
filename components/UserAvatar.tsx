"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LuUser } from "react-icons/lu";

interface UserAvatarProps {
  src?: string | null;  
  name: string;         // Full name (e.g., "John Doe")
  size?: "sm" | "md" | "lg" | "xl"; 
  className?: string;
}

export function UserAvatar({ src, name, size = "md", className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  // 1. Size Configurations
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",      // Navbar
    md: "w-10 h-10 text-sm",    // Cards / Lists
    lg: "w-16 h-16 text-lg",    // Dashboard Header
    xl: "w-20 h-20 text-2xl",   // Settings Page
  };

  // 2. Initials Logic: "John Doe" -> "JD", "Admin" -> "A"
  const getInitials = (fullName: string) => {
    if (!fullName) return "";

    const names = fullName.trim().split(/\s+/); 
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  // 3. Render
  return (
    <div
      className={`
        relative overflow-hidden rounded-full flex items-center justify-center font-bold shrink-0 select-none
        ${sizeClasses[size]} 
        ${className}
        ${!src || imageError ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-sm" : "bg-gray-100 dark:bg-slate-800"}
      `}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={size === "xl"}
        />
      ) : (
        <span>
            {initials || <LuUser />} 
        </span>
      )}
    </div>
  );
}