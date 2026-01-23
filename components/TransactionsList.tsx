import { Transaction } from "./types/transactionTypes";
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
  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(data.amount);

  return (
    <li
      ref={isLastItem ? lastItemRef : null}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs border-b border-gray-100 dark:border-slate-700 last:border-b-0"
    >
      <div className="overflow-hidden">
        <p className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-400">
          {formattedDate}
        </p>
        <h5 className="font-sans text-base my-2 font-medium text-neutral-900 dark:text-neutral-100 truncate">
          {data.transactionName}
        </h5>
        <p
          className="py-1 px-2.5 mt-2 w-fit rounded-full
            flex items-center justify-center gap-1
            font-sans text-xs font-normal text-neutral-800 dark:text-neutral-200
            bg-neutral-200 dark:bg-slate-600"
        >
          {data.category}
        </p>
      </div>
      <div className="flex flex-col justify-between h-full">
        <button
          className="w-8 h-8 px-2.5 ml-auto mb-auto
            flex items-center justify-center
            text-neutral-600 dark:text-neutral-400 bg-transparent border-none rounded-full
            transition-colors
            hover:bg-neutral-100 dark:hover:bg-slate-600
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <IoEllipsisVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
        <div className="flex items-center justify-end">
          {data.type.toLowerCase() === "income" ? (
            <TiArrowUp className="w-3 h-3 text-neutral-900 dark:text-neutral-100" />
          ) : (
            <TiArrowDown className="w-3 h-3 text-red-600 dark:text-red-400" />
          )}
          <p
            className={`ml-1 font-sans text-base font-semibold ${
            data.type.toLowerCase() === "income"
              ? "text-neutral-900 dark:text-neutral-100" // Keep income amount neutral
              : "text-[#D64651] dark:text-red-400" // Expense amount red
          }`}
          >
            {formattedAmount}
          </p>
        </div>
      </div>
    </li>
  );
}

const SkeletonItem = () => (
  <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs border-b border-gray-100 dark:border-slate-700 last:border-b-0 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700"></div> {/* Icon Placeholder */}
    <div className="overflow-hidden space-y-2">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700"></div> {/* Title Placeholder */}
      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-700"></div> {/* Subtitle Placeholder */}
    </div>
    <div className="flex items-center justify-end">
       <div className="h-5 w-16 rounded bg-gray-200 dark:bg-slate-700"></div> {/* Amount Placeholder */}
    </div>
  </li>
);

export default function TransactionList({
  transactions,
  lastItemRef,
}: TransactionListProp) {
  return (
    <ul className="block lg:hidden space-y-3">
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

TransactionList.Skeleton = ({ count = 5 }: { count?: number }) => (
  <ul className="block lg:hidden space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonItem key={index} />
    ))}
  </ul>
);
