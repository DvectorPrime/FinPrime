"use client";
import { LuChartBarBig } from "react-icons/lu";
import ComingSoon from "@/components/ComingSoon";
import { useMenu } from "@/context/menuContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReportsPage() {
  const { setMenuShowing } = useMenu()

  const { user, loading: authLoading } = useAuth();
      
    const router = useRouter();
    
    useEffect(() => {
        if (!authLoading && !user) {
          router.push("/login");
        }
      }, [user, authLoading, router]);
    

  useEffect(() => {
    setMenuShowing(false)
  }, [setMenuShowing])
  return (
    <ComingSoon 
      title="Advanced Reports"
      description="We are building powerful analytics to help you visualize your financial health over time. Exportable PDFs and CSVs are coming in v2."
      icon={LuChartBarBig}
    />
  );
}