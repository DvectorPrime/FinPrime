import { Transaction } from "@/app/api/transactions/route"

interface TransactionTableProps {
    transactions: Transaction[],
    lastItemRef: (node: HTMLLIElement | HTMLTableRowElement | null) => void
}

export default function TransactionTable({transactions, lastItemRef} : TransactionTableProps){
    return (
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-400">
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

                const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                const formattedAmount = new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                }).format(transaction.amount);

                const amountString = `${transaction.type === "expense" ? "-" : "+"}${formattedAmount}`;

                return(
                    <tr key={transaction.id} ref={index === transactions.length - 1 ? lastItemRef : null}
                        className="odd:bg-white even:bg-neutral-200 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-700"
                    >
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{formattedDate}</td>
                        <td className="px-6 py-4">{transaction.transactionName}</td>
                        <td className="px-6 py-4">{transaction.category}</td>
                        <td className="px-6 py-4 text-neutral-900 font-semibold">{transaction.type.toUpperCase()}</td>
                        <td 
                            className={`font-mono text-right px-6 py-4 ${
                            transaction.type === "income"
                                ? "text-neutral-900 dark:text-neutral-100"
                                : "text-[#D64651]"
                            }`}>{amountString}</td>
                        <td className="px-6 py-4 font-medium text-center">...</td>
                    </tr>       
                )})}
            </tbody>
        </table>
    )
}