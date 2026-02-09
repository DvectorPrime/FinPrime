import { Transaction } from "./types/transactionTypes";
import { IoEllipsisVertical } from "react-icons/io5";

interface TransactionTableProps {
    transactions: Transaction[],
    lastItemRef: (node: HTMLLIElement | HTMLTableRowElement | null) => void
}

const SkeletonRow = () => (
  <tr className="animate-pulse odd:bg-white even:bg-neutral-100 dark:odd:bg-slate-900 dark:even:bg-slate-800 border-b dark:border-slate-700">
    <td className="px-6 py-4">
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
    </td>
    <td className="px-6 py-4 text-right">
       <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700 ml-auto"></div>
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-slate-700 mx-auto"></div>
    </td>
  </tr>
);


export default function TransactionTable({transactions, lastItemRef} : TransactionTableProps){
    return (
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-400 sticky top-0 z-10">
            <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((transaction, index) => {

                const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                const formattedAmount = new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                }).format(transaction.amount);

                const amountString = `${transaction.type.toLowerCase() === "expense" ? "-" : "+"}${formattedAmount}`;

                return(
                    <tr key={transaction.id} ref={index === transactions.length - 1 ? lastItemRef : null}
                        className="odd:bg-white even:bg-neutral-200 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-700"
                    >
                        <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">{formattedDate}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{transaction.transactionName}</td>
                        <td className="px-6 py-4 ">{transaction.category}</td>
                        <td className="px-6 py-4 font-semibold">{transaction.type.toUpperCase()}</td>
                        <td 
                            className={`font-mono text-right px-6 py-4 ${
                            transaction.type.toLowerCase() === "income"
                                ? "text-neutral-900 dark:text-neutral-100"
                                : "text-[#D64651]"
                            }`}>{amountString}</td>
                        <td className="px-6 py-4 font-medium text-center">
                            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
                                <IoEllipsisVertical />
                            </button>
                        </td>
                    </tr>       
                )})}
            </tbody>
        </table>
    )
}

TransactionTable.Skeleton = ({ count = 5 }: { count?: number }) => (
   <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
       {/* Keep the header visible during loading */}
       <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-400 sticky top-0 z-10">
           <tr>
               <th scope="col" className="px-6 py-3">Date</th>
               <th scope="col" className="px-6 py-3">Description</th>
               <th scope="col" className="px-6 py-3">Category</th>
               <th scope="col" className="px-6 py-3">Type</th>
               <th scope="col" className="px-6 py-3 text-right">Amount</th>
               <th scope="col" className="px-6 py-3 text-center">Actions</th>
           </tr>
       </thead>
       <tbody>
           {Array.from({ length: count }).map((_, index) => (
               <SkeletonRow key={index} />
           ))}
       </tbody>
   </table>
);