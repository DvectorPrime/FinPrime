'use client';

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
} from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

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

const SpendingChart = () => {
  const { theme } = useTheme();

  const data = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct'],
    datasets: [
      {
        label: 'Monthly Spending (₦)',
        data: [350, 410, 380, 450, 420, 500],
        borderColor: '#0079BFFF',
        backgroundColor: 'rgba(0, 121, 191, 0.2)',
        pointRadius: 0,
        borderWidth: 2,
        fill: false, // Set to true to fill area
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        min: 0,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#6b7280',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SpendingChart;
