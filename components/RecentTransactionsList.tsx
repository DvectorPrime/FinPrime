"use client";

import { useEffect, useState } from "react";
import TransactionCard from "./TransactionCard";

interface transactionType {
  id: string;
  transactionName: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

// A skeleton loader for a single transaction item
const TransactionSkeleton = () => (
  <li className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-slate-700 animate-pulse">
    <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
    <div className="grow">
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-300 dark:bg-slate-700 rounded"></div>
    </div>
    <div className="h-5 w-20 bg-gray-300 dark:bg-slate-700 rounded"></div>
  </li>
);

export default function RecentTransactionsList() {
  const [recentTransactions, setRecentTransactions] = useState<transactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecentTransactions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions?recentOnly=true`, {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        setRecentTransactions(data.data);
        console.log(data)
      } catch (error) {
        console.error("Couldn't Fetch recent transactions:", error);
        setError("Failed to load recent transactions");
      } finally {
        setLoading(false);
      }
    };

    getRecentTransactions();
  }, []);

  return (
    <ul>
      {loading ? (
        // Show 5 skeleton items while loading
        Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
      ) : error ? (
        // Added error visual when recent transactions fail to load - shows error message
        <li className="flex items-center justify-center py-8 text-red-500 dark:text-red-400">
          <span>{error}</span>
        </li>
      ) : (
        recentTransactions.map((tx) => <TransactionCard key={tx.id} {...tx} />)
      
      )
      }
    </ul>
  );
}
