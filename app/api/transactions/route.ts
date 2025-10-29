import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { getAuth } from "firebase/auth";

export interface Transaction {
  id: string;
  transactionName: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  notes: string
}


const auth = getAuth();
const user = auth.currentUser;
let uid : string = "";

  if (user) {
    uid = user.uid;;
    console.log(user.uid)
  } else {
    console.log("No user is currently signed in.");
  }

// This is your mock database of 20 transactions.
const allTransactions : Transaction[] = [
  { id: 'txn_1', transactionName: 'October Salary', type: 'income', category: 'Salary', amount: 3500, date: 'Tue Oct 28 2025 13:28:44 GMT+0100 (West Africa Standard Time) {}', notes: "" },
  { id: 'txn_2', transactionName: 'Monthly Rent', type: 'expense', category: 'Housing', amount: 1200, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_3', transactionName: 'Weekly Groceries', type: 'expense', category: 'Food', amount: 150.75, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_4', transactionName: 'Electricity Bill', type: 'expense', category: 'Housing', amount: 85.50, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_5', transactionName: 'Uber to Office', type: 'expense', category: 'Transport', amount: 45.00, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_6', transactionName: 'Web Design Project', type: 'income', category: 'Business', amount: 450, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_7', transactionName: 'Lunch at The Place', type: 'expense', category: 'Food', amount: 65.20, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_8', transactionName: 'Movie Tickets', type: 'expense', category: 'Shopping', amount: 30.00, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_9', transactionName: 'Shoprite Run', type: 'expense', category: 'Food', amount: 95.30, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_10', transactionName: 'Bus Fare', type: 'expense', category: 'Transport', amount: 22.50, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_11', transactionName: 'Birthday Gift', type: 'income', category: 'Gifts', amount: 100, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_12', transactionName: 'Dinner with friends', type: 'expense', category: 'Food', amount: 110.00, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_13', transactionName: 'Internet Subscription', type: 'expense', category: 'Subscriptions', amount: 75.00, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_14', transactionName: 'Market Shopping', type: 'expense', category: 'Food', amount: 55.60, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_15', transactionName: 'Stock Dividend', type: 'income', category: 'Investments', amount: 230, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_16', transactionName: 'Bolt Ride Home', type: 'expense', category: 'Transport', amount: 35.80, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_17', transactionName: 'Concert Ticket', type: 'expense', category: 'Shopping', amount: 50.00, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_18', transactionName: 'Restocking Supplies', type: 'expense', category: 'Food', amount: 124.10, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_19', transactionName: 'Coffee Meeting', type: 'expense', category: 'Food', amount: 42.75, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" },
  { id: 'txn_20', transactionName: 'Article Writing Gig', type: 'income', category: 'Business', amount: 400, date: 'October 31, 2025 at 12:00:00 AM UTC+1', notes: "" }
];

const sortedTransactions = allTransactions.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

// app/api/transactions/route.js
export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Get the authenticated user's ID
    // You'll need to pass this from the client or get it from session/auth
  
    if (!uid) {
      console.log("No user found")
      return Response.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Prepare the transaction document
    const docData = {
      userId: uid, // Important: link transaction to user
      description: formData.transactionName, // Changed from transactionName to match your screenshot
      amount: parseFloat(formData.amount) || 0,
      type: formData.type, // 'income' or 'expense'
      category: formData.category !== 'All Categories' ? formData.category : null,
      date: new Date(formData.date),
      notes: formData.notes || '',
      createdAt: serverTimestamp(), // Use server timestamp for consistency
      updatedAt: serverTimestamp()
    };
    
    // Add to the flat transactions collection
    const docRef = await addDoc(
      collection(db, 'transactions'),
      docData
    );
    
    return Response.json({ 
      success: true, 
      id: docRef.id,
      message: 'Transaction created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating transaction:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const order = searchParams.get('order');

  // Handle the totals request separately
  if (order === 'totals') {
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let i = 0; i < sortedTransactions.length; i++) {
      if (sortedTransactions[i].type === 'income') {
        totalIncome += sortedTransactions[i].amount;
      } else {
        totalExpenses += sortedTransactions[i].amount;
      }
    }

    return NextResponse.json({
      income: totalIncome,
      expenses: totalExpenses,
    });
  }

  // --- Handle Pagination Request ---
  
  // 1. Get page and limit from the URL, with default values
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '7', 10); // Default to 7 items per page

  // 2. Calculate the starting and ending index for the slice
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // 3. Slice the data to get the current page's items
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  // 4. Calculate if there are more items beyond the current page
  const hasMore = endIndex < sortedTransactions.length;

  // 5. Return the data in the structure expected by the frontend
  return NextResponse.json({
    transactions: paginatedTransactions,
    hasMore: hasMore,
    nextPage: hasMore ? page + 1 : page, // Indicate the next page number
  });
}