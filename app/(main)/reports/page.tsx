"use client";
import { LuChartBarBig } from "react-icons/lu";
import ComingSoon from "@/components/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon 
      title="Advanced Reports"
      description="We are building powerful analytics to help you visualize your financial health over time. Exportable PDFs and CSVs are coming in v2."
      icon={LuChartBarBig}
    />
  );
}