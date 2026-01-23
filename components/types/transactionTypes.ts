export interface Transaction {
  id: string;
  transactionName: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  createdAt: string;
  notes: string;
}