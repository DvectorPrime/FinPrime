"use client"

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useMenu } from "@/context/menuContext";
import { IoAddOutline } from "react-icons/io5"
import { TiArrowDown, TiArrowUp } from "react-icons/ti";
import TransactionList from "@/components/TransactionsList";
import { Transaction } from "@/app/api/transactions/route";
import { CiSearch } from "react-icons/ci";
import { SearchInput } from "@/components/SearchInput";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile";
import { FilterByTypeDesktop } from "@/components/FilterByTypeDesktop";
export default function Dashboard() {
  const router = useRouter();
  const {setMenuShowing} = useMenu()

  const [loading, setLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pageNum, setPageNum] = useState(1)
  const [error, setError] = useState("")

  useEffect(() => {
    setMenuShowing(false);
    
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [setMenuShowing]);

  useEffect(() => {
    // 1. Create the AbortController to manage the request
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transactions?page=${pageNum}`, { 
          signal: controller.signal // Attach the signal to the fetch
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        
        const data = await response.json();
        setTransactions(data.transactions); // Or however your data is structured

      } catch (err : any) {
        // 2. Check if the error is the one we expect from aborting
        if (err.name === 'AbortError') {
          console.log('Fetch successfully aborted.');
        } else {
          // This is a real error
          console.error('An error occurred:', err.message);
          setError(err.message);
        }
      }
    };

    fetchData();

    // 3. The cleanup function still calls abort()
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array

  return (
    <ProtectedRoute>
      <main className="lg:flex flex-col p-3">
        <section className="sticky top-2 z-20 lg:order-1">
          <button
            className="h-10 px-3 ml-auto
              flex items-center justify-center gap-2
              font-sans text-sm leading-[22px] font-medium text-white
              bg-[#0079BF] border-none rounded-2xl shadow-xs
              transition-colors duration-200
              hover:bg-[#006CAB]
              active:bg-[#005586]
              disabled:opacity-40 disabled:cursor-not-allowed"
          ><IoAddOutline className="text-white text-xl" /> Add Transaction</button>
        </section>
        <h3 className="hidden lg:block lg:order-2 font-sans text-3xl font-bold text-neutral-900">Transactions</h3>
        <section className="w-full mt-4 px-4 py-4 lg:p-6 bg-white rounded-xl shadow-xs lg:order-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full lg:hidden">
              <TiArrowUp className="text-2xl text-neutral-900" />
            </span>
            <h3 className="col-span-2 grow font-sans text-sm font-normal text-neutral-600 lg:text-lg lg:font-semibold lg:text-neutral-900">Total Income</h3>
            <p className="font-sans text-lg font-bold text-neutral-900 lg:text-2xl">+$4,000.00</p>
          </div>
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-[#D64651]/10 rounded-full lg:hidden">
              <TiArrowDown className="text-2xl text-[#D64651]" />
            </span>
           <h3 className="col-span-2 grow font-sans text-sm font-normal text-neutral-600 lg:text-lg lg:font-semibold lg:text-neutral-900">Total Expenses</h3>
            <p className="font-sans text-lg font-bold text-[#D64651] lg:text-2xl">-$450.30</p>
          </div>
        </section>
        <section className="grid grid-cols-2 lg:flex lg:justify-between gap-2 w-full mt-7 px-2 py-3 bg-white rounded-xl shadow-xs lg:order-3">
          <SearchInput containerClassName="w-full col-span-2 lg:col-span-1 lg:grow lg:order-4" icon={<CiSearch className="text-md" />} placeHolder="Search for transactions..." />
          <DatePicker />
          <CategoryPicker />
          <FilterByTypeMobile />
          <FilterByTypeDesktop />
          <button className="hidden w-fit min-w-[100px] h-10 px-1 order-5
            lg:flex items-center justify-center
            font-sans text-sm font-medium text-neutral-900
            bg-white border border-neutral-300 rounded-2xl
            transition-colors
            hover:bg-gray-50
            disabled:opacity-40 disabled:cursor-not-allowed">Reset Filters</button>
        </section>
        <section className="w-full mt-7 px-2 py-3 bg-white rounded-xl shadow-xs lg:order-4">
          <h3 className="font-sans text-lg font-semibold text-neutral-900 lg:hidden">Recent Transactions</h3>
          {/* <ul>
            {transactions.map(transaction => <TransactionList key={transaction.id} data={transaction} />)}
          </ul> */}
          <div className="w-full overflow-x-auto rounded-md shadow-sm border border-gray-200 dark:border-slate-700">
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
                {transactions.map(transaction => <tr key={transaction.id}
                  className="odd:bg-white even:bg-neutral-200 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-700"
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{transaction.date}</td>
                  <td className="px-6 py-4">{transaction.transactionName}</td>
                  <td className="px-6 py-4">{transaction.category}</td>
                  <td className="px-6 py-4 text-neutral-900 font-semibold">{transaction.type.toUpperCase()}</td>
                  <td className="px-6 py-4 text-right font-mono">{transaction.amount}</td>
                  <td className="px-6 py-4 font-medium text-center">...</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}