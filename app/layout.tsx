import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/context/menuContext";
import { AuthProvider } from "@/context/authContext";
import { ToastProvider } from "@/context/toastContext";

// 1. Set up the Inter font with a CSS variable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinPrime",
  description: "Personal Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 2. Apply the Inter font variable to the body */}
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <div className="absolute top-4 right-4 z-50">
        </div>
            <AuthProvider>
              <MenuProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </MenuProvider>
            </AuthProvider>
      </body>
    </html>
  );
}