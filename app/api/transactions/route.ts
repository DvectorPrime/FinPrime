import { NextResponse } from 'next/server';

export interface Transaction {
  id: string;
  transactionName: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
}



// This is your mock database of 20 transactions.
const allTransactions : Transaction[] = [
  { id: 'txn_1', transactionName: 'October Salary', type: 'income', category: 'Salary', amount: 3500, date: '2025-10-01' },
  { id: 'txn_2', transactionName: 'Monthly Rent', type: 'expense', category: 'Housing', amount: 1200, date: '2025-10-01' },
  { id: 'txn_3', transactionName: 'Weekly Groceries', type: 'expense', category: 'Food', amount: 150.75, date: '2025-10-02' },
  { id: 'txn_4', transactionName: 'Electricity Bill', type: 'expense', category: 'Housing', amount: 85.50, date: '2025-10-03' },
  { id: 'txn_5', transactionName: 'Uber to Office', type: 'expense', category: 'Transport', amount: 45.00, date: '2025-10-04' },
  { id: 'txn_6', transactionName: 'Web Design Project', type: 'income', category: 'Business', amount: 450, date: '2025-10-05' },
  { id: 'txn_7', transactionName: 'Lunch at The Place', type: 'expense', category: 'Food', amount: 65.20, date: '2025-10-06' },
  { id: 'txn_8', transactionName: 'Movie Tickets', type: 'expense', category: 'Shopping', amount: 30.00, date: '2025-10-07' },
  { id: 'txn_9', transactionName: 'Shoprite Run', type: 'expense', category: 'Food', amount: 95.30, date: '2025-10-08' },
  { id: 'txn_10', transactionName: 'Bus Fare', type: 'expense', category: 'Transport', amount: 22.50, date: '2025-10-09' },
  { id: 'txn_11', transactionName: 'Birthday Gift', type: 'income', category: 'Gifts', amount: 100, date: '2025-10-10' },
  { id: 'txn_12', transactionName: 'Dinner with friends', type: 'expense', category: 'Food', amount: 110.00, date: '2025-10-10' },
  { id: 'txn_13', transactionName: 'Internet Subscription', type: 'expense', category: 'Subscriptions', amount: 75.00, date: '2025-10-11' },
  { id: 'txn_14', transactionName: 'Market Shopping', type: 'expense', category: 'Food', amount: 55.60, date: '2025-10-12' },
  { id: 'txn_15', transactionName: 'Stock Dividend', type: 'income', category: 'Investments', amount: 230, date: '2025-10-13' },
  { id: 'txn_16', transactionName: 'Bolt Ride Home', type: 'expense', category: 'Transport', amount: 35.80, date: '2025-10-13' },
  { id: 'txn_17', transactionName: 'Concert Ticket', type: 'expense', category: 'Shopping', amount: 50.00, date: '2025-10-14' },
  { id: 'txn_18', transactionName: 'Restocking Supplies', type: 'expense', category: 'Food', amount: 124.10, date: '2025-10-14' },
  { id: 'txn_19', transactionName: 'Coffee Meeting', type: 'expense', category: 'Food', amount: 42.75, date: '2025-10-15' },
  { id: 'txn_20', transactionName: 'Article Writing Gig', type: 'income', category: 'Business', amount: 300, date: '2025-10-15' }
];

export async function GET() {
  // 1. Sort all transactions by date in descending order (newest first).
  const sortedTransactions = allTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 2. Take only the first 7 transactions from the sorted list.
  const recentTransactions = sortedTransactions.slice(0, 7);

  // 3. Return the recent transactions as a JSON response.
  return NextResponse.json(recentTransactions);
}