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
      <main className="p-3">
        <section>
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
        <section className="w-full mt-4 px-4 py-3 bg-white rounded-xl shadow-xs">
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full">
              <TiArrowUp className="text-2xl text-neutral-900" />
            </span>
            <h3 className="grow font-sans text-sm font-normal text-neutral-600">Total Income</h3>
            <p className="font-sans text-lg font-bold text-neutral-900">+$4,000.00</p>
          </div>
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-[#D64651]/10 rounded-full">
              <TiArrowDown className="text-2xl text-[#D64651]" />
            </span>
            <h3 className="grow font-sans text-sm font-normal text-neutral-600">Total Expenses</h3>
            <p className="font-sans text-lg font-bold text-[#D64651]">-$450.30</p>
          </div>
        </section>
        <section className="w-full mt-4 px-4 py-3 bg-white rounded-xl shadow-xs">
            <SearchInput icon={<CiSearch className="text-md" />} placeHolder="Search for transactions..." />
          <input type="date" name="dateFilter" id="date-filter" />
          <select name="categoryFilter" id="category-filter">
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
          </select>
          <input type="radio" name="typeFilter" id="allTypes" />
          <input type="radio" name="typeFilter" id="Income" />
          <input type="radio" name="typeFilter" id="Expenses" />
          <button>Reset Filters</button>
        </section>
        <section>
          <h3>Recent Transactions</h3>
          <ul>
            {transactions.map(transaction => <TransactionList key={transaction.id} data={transaction} />)}
          </ul>
        </section>
      </main>
    </ProtectedRoute>
  );
}