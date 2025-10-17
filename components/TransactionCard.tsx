'use client';

import { useState, useEffect } from 'react';
import { CategoryIcon } from './CategoryIcon';

interface TransactionCardProps {
  id: string;
  transactionName: string;
  type: string;
  category: string;
  amount: number;
  date: string;
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
  date,
}: TransactionCardProps) {
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null);

  useEffect(() => {
    // This is a more efficient way to get the icon.
    // We can cache categories in a context later for even better performance.
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
      }
    };
    findIcon();
  }, [category]);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);

  const amountString = `${type === "expense" ? "-" : "+"}${formattedAmount}`;

  return (
    <li className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-slate-700">
      <div className={`flex-shrink-0 flex justify-center items-center w-10 h-10 ${type === 'income' ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'} rounded-full`}>
        <CategoryIcon
          iconName={categoryIcon}
          className={`h-5 w-5 ${type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        />
      </div>
      <div className="flex-grow">
        <p className="font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          {transactionName}
        </p>
        <p className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400">
          {formattedDate}
        </p>
      </div>
      <p
        className={`flex-shrink-0 font-sans text-sm font-medium ${
          type === "income" ? "text-neutral-900 dark:text-neutral-200" : "text-[#D64651] dark:text-red-400"
        }`}
      >
        {amountString}
      </p>
    </li>
  );
}
