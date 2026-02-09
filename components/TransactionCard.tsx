'use client';

import { useState, useEffect } from 'react';
import { CategoryIcon } from './CategoryIcon';

interface TransactionCardProps {
  id: string;
  transactionName: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
}

export default function TransactionCard({
  transactionName,
  type,
  category,
  amount,
  createdAt,
}: TransactionCardProps) {
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null);
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    const findIcon = async () => {
      try {
        const response = await fetch('/api/categories');
        const categories: Category[] = await response.json();
        const foundCategory = categories.find((c) => c.name === category);
        if (foundCategory) {
          setCategoryIcon(foundCategory.icon);
        }
      } catch (error) {
        console.error('Failed to find category icon:', error);
        setIconError(true);
      }
    };
    findIcon();
  }, [category]);

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);

  const amountString = `${type.toLowerCase() === "expense" ? "-" : "+"}${formattedAmount}`;

  return (
    <li className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-slate-700">
      <div className={`shrink-0 flex justify-center items-center w-10 h-10 ${type.toLowerCase() === 'income' ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'} rounded-full`}>
        {iconError ? (
          // Added fallback icon when category icon fails to load - shows generic icon
          <span className={`h-5 w-5 ${type.toLowerCase() === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-400'}`}>⚠️</span>
        ) : (
          <CategoryIcon
            iconName={categoryIcon}
            className={`h-5 w-5 ${type.toLowerCase() === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-400'}`}
          />
        )}
      </div>
      <div className="grow">
        <p className="font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          {transactionName}
        </p>
        <p className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400">
          {formattedDate}
        </p>
      </div>
      <p
        className={`shrink-0 font-sans text-sm font-medium ${
          type.toLowerCase() === "income" ? 'text-green-600 dark:text-green-500' : "text-[#D64651] dark:text-red-400"
        }`}
      >
        {amountString}
      </p>
    </li>
  );
}
