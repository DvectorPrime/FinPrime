export interface FormData {
  transactionName: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
  date: Date | undefined;
  notes: string;
}