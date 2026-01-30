'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { useAuth } from '@/context/authContext'; // Ensure casing matches your file

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataPoint {
    month: string;
    income: number;
    expense: number;
}

const SpendingChart = () => {
  const { user } = useAuth();
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // 1. Fetch Real Data
  useEffect(() => {
    // Only fetch if user exists
    if (!user) return;

    const fetchData = async () => {
        try {
            // Adjust endpoint to match your actual backend route for monthly stats
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/monthly-stats`, {
                credentials: 'include'
            });
            
            if (!res.ok) throw new Error("Failed to fetch chart data");
            
            const data = await res.json();
            // Expected format: [{ month: 'Jan', income: 5000, expense: 2000 }, ...]
            // If your API returns something else, we map it here.
            setChartData(data); 
        } catch (error) {
            console.error("Chart data error:", error);
            // Fallback empty data to prevent crash
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]);

  // 2. Dark Mode Logic (Kept from your original code)
  useEffect(() => {
    const preference = user?.themePreference || "System";

    const checkDarkMode = () => {
      if (preference === "Dark") return true;
      if (preference === "Light") return false;
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    };

    setIsDark(checkDarkMode());

    if (preference === "System" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e : MediaQueryListEvent) => setIsDark(e.matches);
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [user?.themePreference]);

  // 3. Configure Chart Data
  const data = {
    // Map the labels from the fetched data (e.g., "Jan", "Feb")
    labels: chartData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: chartData.map(d => d.income),
        borderColor: '#10B981', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 3,
        pointBackgroundColor: '#10B981',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: chartData.map(d => d.expense),
        borderColor: '#0079BF', // Brand Blue
        backgroundColor: 'rgba(0, 121, 191, 0.1)',
        pointRadius: 2,
        pointBackgroundColor: '#0079BF',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Allows height control via CSS container
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        align: 'end',
        labels: {
            color: isDark ? '#e5e7eb' : '#374151',
            usePointStyle: true,
            boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(context.parsed.y);
                }
                return label;
            }
        }
      },
    },
    scales: {
      y: {
        min: 0,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: { size: 11 },
          callback: function(value) {
             // Abbreviate large numbers (e.g., 50k)
             return typeof value === 'number' && value >= 1000 
                ? '₦' + (value / 1000).toFixed(0) + 'k' 
                : '₦' + value;
          }
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: { size: 11 }
        },
        border: { display: false }
      },
    },
  };

  // 4. Loading Skeleton
  if (loading) {
    return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
            <div className="text-sm text-gray-400">Loading chart data...</div>
        </div>
    )
  }

  // 5. Empty State
  if (chartData.length === 0) {
    return (
        <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">No transaction data yet</p>
            <p className="text-xs text-gray-400">Add transactions to see your history</p>
        </div>
    )
  }

  return (
    <div className="w-full h-[300px]">
        <Line data={data} options={options} />
    </div>
  );
};

export default SpendingChart;