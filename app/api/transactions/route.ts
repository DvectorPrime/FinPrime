import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, where, orderBy, Timestamp, query,  } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Remove auth import


export interface Transaction {
  id: string;
  transactionName: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  notes: string;
}

// POST endpoint - Create transaction
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('Received form data:', formData); // Debug log

    const userId = formData.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Prepare the transaction document
    const docData = {
      userId: userId,
      description: formData.transactionName,
      amount: amount,
      type: formData.type,
      category: formData.category !== 'All Categories' ? formData.category : null,
      date: formData.date ? Timestamp.fromDate(new Date(formData.date)) : Timestamp.now(),
      notes: formData.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('Saving to Firestore:', docData); // Debug log

    // Add to the transactions collection
    const docRef = await addDoc(collection(db, 'transactions'), docData);

    console.log('Document created with ID:', docRef.id); // Debug log

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Transaction created successfully',
    });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const order = searchParams.get('order');
    
    // Get userId from query params
    const userId = searchParams.get('userId');

    // ========================================
    // NEW: Handle Firebase queries with userId
    // ========================================
    
    // Get pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '20', 10);
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    // Query all transactions for the user, sorted by date
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', sortOrder)
    );

    const querySnapshot = await getDocs(q);
    
    // Arrays to hold all transactions and split by type
    const allTransactions: any[] = [];
    const incomeTransactions: any[] = [];
    const expenseTransactions: any[] = [];
    
    let totalIncome = 0;
    let totalExpenses = 0;

    // Process each transaction
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      const transaction = {
        id: doc.id,
        transactionName: data.description,
        type: data.type,
        category: data.category,
        amount: data.amount,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
        notes: data.notes || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
      };

      // Add to all transactions
      allTransactions.push(transaction);

      // Split by type and calculate totals
      if (data.type === 'income'.toUpperCase()) {
        incomeTransactions.push(transaction);
        totalIncome += data.amount || 0;
      } else if (data.type === 'expense'.toUpperCase()) {
        expenseTransactions.push(transaction);
        totalExpenses += data.amount || 0;
      }
    });

    // Sort arrays by date
    const sortByDate = (a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    };

    allTransactions.sort(sortByDate);
    incomeTransactions.sort(sortByDate);
    expenseTransactions.sort(sortByDate);

    // Apply pagination to all transactions
    const startIndex = (page - 1) * limitParam;
    const endIndex = startIndex + limitParam;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
    const hasMore = endIndex < allTransactions.length;

    console.log(paginatedTransactions)
    console.log("working")

    // Return comprehensive data
    return NextResponse.json({
      success: true,
      // Paginated all transactions (for backward compatibility)
      transactions: paginatedTransactions,
      hasMore: hasMore,
      nextPage: hasMore ? page + 1 : page,
      // Full lists split by type
      allTransactions: allTransactions,
      incomeTransactions: incomeTransactions,
      expenseTransactions: expenseTransactions,
      // Totals
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      balance: totalIncome - totalExpenses,
      income: totalIncome, // For backward compatibility
      expenses: totalExpenses, // For backward compatibility
      // Pagination info
      pagination: {
        currentPage: page,
        limit: limitParam,
        hasMore: hasMore,
        nextPage: hasMore ? page + 1 : null,
        total: allTransactions.length,
        totalPages: Math.ceil(allTransactions.length / limitParam),
      },
      // Counts
      counts: {
        total: allTransactions.length,
        income: incomeTransactions.length,
        expenses: expenseTransactions.length,
      }
    });

  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch transactions',
      },
      { status: 500 }
    );
  }
}
