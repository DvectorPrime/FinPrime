"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMenu } from "@/context/menuContext";
import { IoAddOutline } from "react-icons/io5";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";
import TransactionList from "@/components/TransactionsList";
import { Transaction } from "@/components/types/transactionTypes";
import { CiSearch } from "react-icons/ci";
import { SearchInput } from "@/components/SearchInput";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DatePicker } from "@/components/DatePicker";
import FilterByTypeMobile from "@/components/FilterByTypeMobile";
import { FilterByTypeDesktop } from "@/components/FilterByTypeDesktop";
import TransactionTable from "@/components/TransactionTable";
import useWindowWidth from "@/app/hooks/useWindowWidth";
import { useAuth } from "@/context/authContext"; // 1. Import Auth Context

interface PaginatedApiResponse {
  data: Transaction[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    net: number;
  };
  meta: {
    hasNextPage: boolean;
    page: number;
  };
}

const ITEMS_PER_PAGE = 15;

export default function Transactions() {
  const router = useRouter();
  const { setMenuShowing } = useMenu();

  // 2. Get Global Auth State
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalsData, setTotalsData] = useState({ income: 0, expenses: 0 });

  const [filters, setFilters] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    type: "all",
    category: "all",
    search: "",
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const windowWidth = useWindowWidth();

  const observer = useRef<IntersectionObserver | null>(null);

  // 3. Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Helper to construct query params
  const getQueryParams = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.append("page", pageNumber.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());
    params.append("month", filters.month.toString());
    params.append("year", filters.year.toString());

    if (filters.type !== "all") params.append("type", filters.type);
    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    
    return params;
  };

  const getMonthName = (monthIndex: number) => {
    return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
  };
  
  const dateLabel = `(${getMonthName(filters.month)} ${filters.year})`;

  const lastTransactionElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loadingMore || !hasMore || loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, loading]
  );

  useEffect(() => {
    setMenuShowing(false);
  }, [setMenuShowing]);

  // 1. Initial Fetch
  useEffect(() => {
    // 4. Don't fetch if not authenticated yet
    if (!user) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const params = getQueryParams(1);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?${params.toString()}`,
          { method: "GET", credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch transactions.");

        const data: PaginatedApiResponse = await response.json();

        setTransactions(data.data || []);
        setHasMore(data.meta?.hasNextPage || false);

        if (data.summary) {
            setTotalsData({
                income: data.summary.totalIncome || 0,
                expenses: data.summary.totalExpense || 0
            });
        }

        setPage(1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters, user]); // Added user as dependency

  // 2. Fetch More Data
  useEffect(() => {
    if (page === 1) return;
    if (!hasMore) return;
    if (!user) return;

    const fetchMoreTransactions = async () => {
      setLoadingMore(true);
      
      try {
        const params = getQueryParams(page);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?${params.toString()}`,
          { method: "GET", credentials: "include" }
        );
        
        if (!response.ok) throw new Error("Failed to fetch more data.");

        const data: PaginatedApiResponse = await response.json();

        setTransactions((prev) => [...prev, ...(data.data || [])]);
        setHasMore(data.meta?.hasNextPage || false);
        
      } catch (err: any) {
        console.error("Fetch more error:", err.message);
        setError("Failed to load more transactions.");
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMoreTransactions();
  }, [page, user]); 

  const displayTotalIncome = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(totalsData.income);

  const displayTotalExpenses = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(totalsData.expenses);

  // Prevent flash while checking auth
  if (authLoading || !user) return null; 

  return (
    <main className="lg:flex flex-col p-3 bg-white dark:bg-slate-900 h-fit min-h-screen">
      <section className="sticky top-2 z-20 lg:order-1">
        <button
          className="h-10 px-3 ml-auto flex items-center justify-center gap-2 font-sans text-sm font-medium text-white bg-[#0079BF] rounded-2xl shadow-xs transition-colors hover:bg-[#006CAB] active:bg-[#005586] cursor-pointer"
          onClick={() => router.push("/transactions/add")}
        >
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
            Total Income <span className="text-xs lg:text-sm font-normal text-neutral-500">{dateLabel}</span>
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
            Total Expenses <span className="text-xs lg:text-sm font-normal text-neutral-500">{dateLabel}</span>
          </h3>
          <p className="font-sans text-lg font-bold text-[#D64651] lg:text-2xl">
            {displayTotalExpenses}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-5 lg:justify-between gap-2 w-full mt-7 px-2 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs lg:order-3">
        <SearchInput
          containerClassName="w-full col-span-2 lg:col-span-1 lg:grow lg:order-4"
          icon={
            <CiSearch className="text-md text-neutral-600 dark:text-neutral-400" />
          }
          placeHolder="Search for transactions..."
          className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder:text-neutral-400 dark:text-white"
          setFilters={setFilters}
        />
        <DatePicker setFilters={setFilters} />
        <CategoryPicker disabled={false} setFilters={setFilters} />
        <FilterByTypeMobile disabled={windowWidth > 760} setFilters={setFilters} />
        <FilterByTypeDesktop setFilters={setFilters} />
        <button 
            onClick={() => {
                setFilters({
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),
                    type: "all",
                    category: "all",
                    search: "",
                })
            }}
            className="hidden w-full text-center min-w-25 h-10 px-1 order-5 cursor-pointer lg:flex items-center justify-center font-sans text-sm font-medium text-neutral-900 dark:text-neutral-300 bg-white dark:bg-slate-700 border border-neutral-300 dark:border-slate-600 rounded-2xl transition-colors hover:bg-gray-50 dark:hover:bg-slate-600">
          Reset Filters
        </button>
      </section>

      <section className="w-full mt-7 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs lg:order-5 grow">
        <h3 className="mx-3 font-sans text-lg font-semibold text-neutral-900 dark:text-white lg:hidden mb-4">
          Transactions
        </h3>

        {windowWidth < 1024 ? (
          loading ? (
            <TransactionList.Skeleton count={5} />
          ) : (
            <TransactionList
              transactions={transactions}
              lastItemRef={lastTransactionElementRef}
            />
          )
        ) : (
          <div className="hidden lg:block w-full rounded-md shadow-sm border border-gray-200 dark:border-slate-700">
            {loading ? (
              <TransactionTable.Skeleton count={5} />
            ) : (
              <TransactionTable
                transactions={transactions}
                lastItemRef={lastTransactionElementRef}
              />
            )}
          </div>
        )}
        
        {/* Loading States */}
        {loadingMore && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="ml-2 text-gray-500 dark:text-gray-400">
              Loading more...
            </p>
          </div>
        )}
        {!hasMore && !loading && transactions.length > 0 && (
          <p className="text-center my-8 text-sm text-gray-400 dark:text-gray-200">
            — You have reached the end —
          </p>
        )}
        {error && <p className="text-center my-4 text-red-500">{error}</p>}
        {!loading && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found.</p>
            <p className="text-gray-400 dark:text-gray-200 text-sm mt-1">Try adjusting your filters or date.</p>
          </div>
        )}
      </section>
    </main>
  );
}