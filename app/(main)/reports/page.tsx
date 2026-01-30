"use client";
import { LuChartBarBig } from "react-icons/lu";
import ComingSoon from "@/components/ComingSoon";
import { useMenu } from "@/context/menuContext";
import { useEffect } from "react";

export default function ReportsPage() {
  const { setMenuShowing } = useMenu()

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