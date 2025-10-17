import { NextResponse } from 'next/server';

// Define the structure of a category object for type safety
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string; // This will be the string identifier for the React icon
}

// Data for income categories
const incomeCategories: Category[] = [
  {
    id: 'inc_1',
    name: 'Salary',
    type: 'income',
    icon: 'BsBriefcase',
  },
  {
    id: 'inc_2',
    name: 'Business',
    type: 'income',
    icon: 'HiOutlineBuildingStorefront',
  },
  {
    id: 'inc_3',
    name: 'Investments',
    type: 'income',
    icon: 'IoTrendingUpOutline',
  },
  {
    id: 'inc_4',
    name: 'Gifts',
    type: 'income',
    icon: 'FaGift',
  },
  {
    id: 'inc_5',
    name: 'Others',
    type: 'income',
    icon: 'LuLightbulb',
  },
];

// Data for expenditure categories
const expenseCategories: Category[] = [
  {
    id: 'exp_1',
    name: 'Housing',
    type: 'expense',
    icon: 'FaHome',
  },
  {
    id: 'exp_2',
    name: 'Food',
    type: 'expense',
    icon: 'MdFastfood',
  },
  {
    id: 'exp_3',
    name: 'Transport',
    type: 'expense',
    icon: 'FaCar',
  },
  {
    id: 'exp_4',
    name: 'Shopping',
    type: 'expense',
    icon: 'BsCart3',
  },
  {
    id: 'exp_5',
    name: 'Subscriptions',
    type: 'expense',
    icon: 'BsReceiptCutoff',
  },
];

// This is the API route handler for GET requests
export async function GET(request: Request) {
  // Combine both arrays into a single list
  const allCategories = [...incomeCategories, ...expenseCategories];

  // Return the combined list as a JSON response
  return NextResponse.json(allCategories);
}
