"use client";

import React from 'react';
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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. Register BarElement instead of LineElement
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OverviewChartProps {
  dataPoints: FinancialDataPoint[];
}

interface FinancialDataPoint {
  label: string; // Could be a date string like "Jan 23" or just "Jan"
  income: number;
  expense: number;
}

const OverviewChart: React.FC<OverviewChartProps> = ({ dataPoints }) => {
  const incomeColor = '#10b981'; // Emerald/Teal
  const expenseColor = '#ef4444'; // Red/Coral

  // 2. Transform data for Bar Chart
  const chartData: ChartData<'bar'> = {
    labels: dataPoints.map((point) => point.label),
    datasets: [
      {
        label: 'Income',
        data: dataPoints.map((point) => point.income),
        backgroundColor: incomeColor,
        borderRadius: 4, // Rounded corners at top of bars
        barPercentage: 0.6, // Controls width of individual bars
        categoryPercentage: 0.8, // Controls gap between groups
      },
      {
        label: 'Expense',
        data: dataPoints.map((point) => point.expense),
        backgroundColor: expenseColor,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  // 3. Configure Options (Labels + Horizontal Grids)
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Keeping legend hidden as you have the summary text above
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
            label: function(context: TooltipItem<'bar'>) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-NG', { 
                        style: 'currency', 
                        currency: 'NGN',
                        minimumFractionDigits: 0
                    }).format(context.parsed.y);
                }
                return label;
            }
        }
      },
    },
    scales: {
      x: {
        // Show Month Labels (X-axis)
        ticks: {
          display: true,
          color: '#6b7280', // gray-500
          font: {
            size: 11
          }
        },
        // Hide Vertical Grid Lines (cleaner look for bar charts)
        grid: {
          display: false, 
        },
        border: {
            display: false
        }
      },
      y: {
        // Show Amount Labels (Y-axis)
        ticks: {
          display: true,
          color: '#9ca3af', // gray-400
          font: {
            size: 10
          },
          // Format Y-axis numbers (e.g., 30k instead of 30000 to save space)
          callback: function(value) {
            if (typeof value === 'number') {
                if (value >= 1000000) return '₦' + (value / 1000000).toFixed(1) + 'M';
                if (value >= 1000) return '₦' + (value / 1000).toFixed(0) + 'k';
                return '₦' + value;
            }
            return value;
          }
        },
        // SHOW Horizontal Grid Lines
        grid: {
          display: true,
          color: '#f3f4f6', // Very light gray (gray-100)
        },
        border: {
            display: false // Hides the solid axis line on the left
        },
        beginAtZero: true,
      },
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
  };

  return (
    // Responsive container: h-48 mobile, h-64 desktop
    <div className="w-full h-48 md:h-64 lg:h-75 p-2">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OverviewChart;