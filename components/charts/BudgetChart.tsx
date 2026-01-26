"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface OverviewChartProps {
  dataPoints: FinancialDataPoint[];
  isLoading?: boolean;
}

interface FinancialDataPoint {
  label: string;
  budget: number;
  expense: number;
}

const OverviewChart: React.FC<OverviewChartProps> = ({ dataPoints, isLoading }) => {
  const budgetColor = "#2563EB"; 
  const expenseColor = "#ef4444"; 

  // Loading UI: Mimics bars using styled divs
  if (isLoading) {
    return (
      <div className="w-full h-50 md:h-64 lg:h-75 p-2 flex items-end justify-between gap-4 animate-pulse">
        {Array(7).fill(0).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex gap-1 items-end w-full justify-center">
               <div className="w-2 md:w-4 bg-gray-200 dark:bg-slate-700 rounded-t h-24" style={{ height: `${20 + (i * 10)}px` }} />
               <div className="w-2 md:w-4 bg-gray-100 dark:bg-slate-600 rounded-t h-16" style={{ height: `${10 + (i * 8)}px` }} />
            </div>
            <div className="w-6 h-2 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const chartData: ChartData<"bar"> = {
    labels: dataPoints.map((point) => point.label),
    datasets: [
      {
        label: "Budget",
        data: dataPoints.map((point) => point.budget),
        backgroundColor: budgetColor,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: "Expense",
        data: dataPoints.map((point) => point.expense),
        backgroundColor: expenseColor,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
          color: "#9ca3af",
          font: { size: 11 },
        },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: {
          display: true,
          color: "#9ca3af",
          font: { size: 10 },
          callback: function (value) {
            if (typeof value === "number") {
              if (value >= 1000) return "₦" + (value / 1000).toFixed(0) + "k";
              return "₦" + value;
            }
            return value;
          },
        },
        grid: {
          display: true,
          color: "rgba(156, 163, 175, 0.1)",
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="w-full h-50 md:h-64 lg:h-75 p-2">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OverviewChart;