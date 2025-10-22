import { Transaction } from "@/app/api/transactions/route";
import { IoEllipsisVertical } from "react-icons/io5";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";

interface TransactionListProp {
  transactions: Transaction[];
  lastItemRef: (node: HTMLLIElement | HTMLTableRowElement | null) => void;
}

interface ListItemProp {
  data: Transaction;
  lastItemRef: (node: HTMLLIElement | HTMLTableRowElement | null) => void;
  isLastItem: boolean;
}

function ListItem({ data, lastItemRef, isLastItem }: ListItemProp) {
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  const amountString = `${data.type === "expense" ? "-" : "+"}${formattedAmount}`;

  return (
    <li
      ref={isLastItem ? lastItemRef : null}
      className="grid grid-cols-[minmax(65%,_1fr)_auto] p-2 bg-white dark:bg-slate-700 rounded-xl shadow-xs"
    >
      <div>
        <p className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400">
          {formattedDate}
        </p>
        <h5 className="font-sans my-1 text-base font-medium text-neutral-900 dark:text-neutral-100">
          {data.transactionName}
        </h5>
        <p
          className="py-1 px-1.5 mt-2 w-fit rounded-full
            flex items-center justify-center gap-1
            font-sans text-xs font-normal text-neutral-800 dark:text-neutral-200
            bg-neutral-200 dark:bg-slate-600"
        >
          {data.category}
        </p>
      </div>
      <div className="flex flex-col justify-between">
        <button
          className="w-8 h-8 px-2.5 ml-auto
            flex items-center justify-center
            text-neutral-600 dark:text-neutral-400 bg-transparent border-none rounded-full
            transition-colors
            hover:bg-neutral-100 dark:hover:bg-slate-600
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <IoEllipsisVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
        <div className="flex items-start justify-end">
          {data.type === "income" ? (
            <TiArrowUp className="w-[14px] h-[14px] mt-1 text-neutral-900 dark:text-neutral-100" />
          ) : (
            <TiArrowDown className="w-[14px] h-[14px] mt-1 text-[#D64651]" />
          )}
          <p
            className={`font-sans text-lg font-semibold ${
              data.type === "income"
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-[#D64651]"
            }`}
          >
            {amountString}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function TransactionList({
  transactions,
  lastItemRef,
}: TransactionListProp) {
  return (
    <ul className="block lg:hidden">
      {transactions.map((transaction, index) => {
        const isLastItem = index === transactions.length - 1;
        return (
          <ListItem
          key={transaction.id}
          data={transaction}
          lastItemRef={lastItemRef}
          isLastItem={isLastItem}
          />
        );
      })}
  </ul>
  );
}