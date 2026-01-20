"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMenu } from "@/context/menuContext";
import { IoAddOutline } from "react-icons/io5";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";
import TransactionList from "@/components/TransactionsList";
import { Transaction } from "@/app/api/transactions/route";
import { CiSearch } from "react-icons/ci";
import { SearchInput } from "@/components/SearchInput";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile";
import { FilterByTypeDesktop } from "@/components/FilterByTypeDesktop";
import TransactionTable from "@/components/TransactionTable";
import useWindowWidth from "@/app/hooks/useWindowWidth";

interface PaginatedApiResponse {
  transactions: Transaction[];
  hasMore: boolean;
  nextPage: number;
}

const ITEMS_PER_PAGE = 7;

export default function Transactions() {
  const router = useRouter();
  const { setMenuShowing } = useMenu();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalsData, setTotalsData] = useState({ income: 0, expenses: 0 });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const windowWidth = useWindowWidth()

  const observer = useRef<IntersectionObserver | null>(null);

  // Callback ref for intersection observer
  const lastTransactionElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loadingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            console.log("Last item visible, loading more...");
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          root: null, // Use viewport for both mobile and desktop
          threshold: 0.1,
          rootMargin: "10px",
        }
      );

      if (node) {
        console.log("Observing element:", node);
        observer.current.observe(node);
      }
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    setMenuShowing(false);
  }, [setMenuShowing]);

  // Initial data fetch
  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const totalsResponse = await fetch("/api/transactions?order=totals", {
          signal: controller.signal,
        });
        if (!totalsResponse.ok) throw new Error("Failed to get totals.");
        const totals = await totalsResponse.json();
        setTotalsData(totals);

        const transactionsResponse = await fetch(
          `/api/transactions?page=1&limit=${ITEMS_PER_PAGE}`,
          { signal: controller.signal }
        );
        if (!transactionsResponse.ok)
          throw new Error("Failed to fetch initial data.");
        const data: PaginatedApiResponse = await transactionsResponse.json();
        
        console.log("Initial data:", data);
        setTransactions(data.transactions);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Initial fetch error:", err.message);
          setError(err.message);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);   
        }, 3000);
      }
    };

    fetchInitialData();

    return () => {
      controller.abort();
    };
  }, []);

  // Fetch more data when page changes
  useEffect(() => {
    if (page === 1 || !hasMore) return;

    const controller = new AbortController();

    const fetchMoreTransactions = async () => {
      setLoadingMore(true);
      console.log(`Fetching page ${page}...`);
      
      try {
        const response = await fetch(
          `/api/transactions?page=${page}&limit=${ITEMS_PER_PAGE}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch more data.");

        const data: PaginatedApiResponse = await response.json();
        console.log(`Loaded ${data.transactions.length} more transactions`);
        
        setTransactions((prev) => [...prev, ...data.transactions]);
        setHasMore(data.hasMore);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Fetch more error:", err.message);
          setError(err.message);
        }
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMoreTransactions();

    return () => {
      controller.abort();
    };
  }, [page, hasMore]);

  const displayTotalIncome = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(totalsData.income);

  const displayTotalExpenses = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(totalsData.expenses);

  return (
      <main className="lg:flex flex-col p-3 bg-white dark:bg-slate-900 min-h-full">
        <section className="sticky top-2 z-20 lg:order-1">
          <button className="h-10 px-3 ml-auto flex items-center justify-center gap-2 font-sans text-sm font-medium text-white bg-[#0079BF] rounded-2xl shadow-xs transition-colors hover:bg-[#006CAB] active:bg-[#005586] cursor-pointer"
           onClick={() => router.push("/transactions/add")}>
            <IoAddOutline className="text-white text-xl" /> Add Transaction
          </button>
        </section>

        <h3 className="hidden lg:block lg:order-2 font-sans text-3xl font-bold text-neutral-900 dark:text-white">
          Transactions
        </h3>

        <section className="w-full mt-4 px-4 py-4 lg:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xs lg:order-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full lg:hidden">
              <TiArrowUp className="text-2xl text-neutral-900 dark:text-neutral-100" />
            </span>
            <h3 className="col-span-2 grow font-sans text-sm font-normal text-neutral-600 dark:text-neutral-400 lg:text-lg lg:font-semibold lg:text-neutral-900 lg:dark:text-white">
              Total Income
            </h3>
            <p className="font-sans text-lg font-bold text-neutral-900 dark:text-neutral-100 lg:text-2xl">
              {displayTotalIncome}
            </p>
          </div>
          <div className="flex justify-center items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-[#D64651]/10 rounded-full lg:hidden">
              <TiArrowDown className="text-2xl text-[#D64651]" />
            </span>
            <h3 className="col-span-2 grow font-sans text-sm font-normal text-neutral-600 dark:text-neutral-400 lg:text-lg lg:font-semibold lg:text-neutral-900 lg:dark:text-white">
              Total Expenses
            </h3>
            <p className="font-sans text-lg font-bold text-[#D64651] lg:text-2xl">
              {displayTotalExpenses}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:flex lg:justify-between gap-2 w-full mt-7 px-2 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs lg:order-3">
          <SearchInput
            containerClassName="w-full col-span-2 lg:col-span-1 lg:grow lg:order-4"
            icon={<CiSearch className="text-md text-neutral-600 dark:text-neutral-400" />}
            placeHolder="Search for transactions..."
            className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder:text-neutral-400 dark:text-white"
          />
          <DatePicker />
          {/* <CategoryPicker />
          <FilterByTypeMobile /> */}
          <FilterByTypeDesktop />
          <button className="hidden w-fit min-w-[100px] h-10 px-1 order-5 cursor-pointer lg:flex items-center justify-center font-sans text-sm font-medium text-neutral-900 dark:text-neutral-300 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-2xl transition-colors hover:bg-gray-50 dark:hover:bg-slate-600">
            Reset Filters
          </button>
        </section>

        <section className="w-full mt-7 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs lg:order-5 flex-grow">
          <h3 className="mx-3 font-sans text-lg font-semibold text-neutral-900 dark:text-white lg:hidden mb-4">
            Recent Transactions
          </h3>

        {windowWidth < 1024 ? 
          (loading) ? <TransactionList.Skeleton count={5} /> : <TransactionList transactions={transactions} lastItemRef={lastTransactionElementRef} />
          :
          <div className="hidden lg:block w-full rounded-md shadow-sm border border-gray-200 dark:border-slate-700">
            {(loading) ? 
              <TransactionTable.Skeleton count={5}/>
              :
              <TransactionTable
                transactions={transactions}
                lastItemRef={lastTransactionElementRef}
              />
            }
          </div>
        } 
          {/* Loading States */}
          {loading && (
            <p className="text-center my-8 text-lg text-neutral-800 dark:text-neutral-300">
              Loading Transactions...
            </p>
          )}
          {loadingMore && (
            <div className="flex justify-center items-center my-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="ml-2 text-gray-500 dark:text-gray-400">Loading more...</p>
            </div>
          )}
          {!hasMore && !loading && transactions.length > 0 && (
            <p className="text-center my-4 text-gray-500 dark:text-gray-400">
              You have reached the end.
            </p>
          )}
          {error && <p className="text-center my-4 text-red-500">{error}</p>}
          {!loading && transactions.length === 0 && (
            <p className="text-center my-4 text-gray-500 dark:text-gray-400">
              No transactions found.
            </p>
          )}
        </section>
      </main>
  );
}