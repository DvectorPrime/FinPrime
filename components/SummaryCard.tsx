import React from "react";
import { LuWallet, LuPiggyBank } from "react-icons/lu";
import { TbCashBanknote } from "react-icons/tb";
import { FiShoppingBag } from "react-icons/fi";
import { TiArrowUpThick, TiArrowDownThick } from "react-icons/ti";

type SummaryCardProps = {
  summaryType: string;
  amount: number;
  growthPercent?: number;
};

export default function SummaryCard({
  summaryType,
  amount,
  growthPercent,
}: SummaryCardProps) {
  const summaryIcon =
    summaryType === "Balance" ? (
      <LuWallet className="w-6 h-6 text-[#0079BF]" />
    ) : summaryType === "Income" ? (
      <TbCashBanknote className="w-6 h-6 text-green-500" />
    ) : summaryType === "Expenses" ? (
      <FiShoppingBag className="w-6 h-6 text-[#D64651]" />
    ) : (
      <LuPiggyBank className="w-6 h-6 text-teal-500" />
    );

  function formatCurrency(amount: number, currencyCode: string) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const summaryAmount =
    summaryType === "Savings Rate"
      ? `${amount.toFixed(1)}%`
      : formatCurrency(amount, "NGN");

  return (
    <article className="flex justify-between items-start h-[100px] w-full p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
      <div>
        <div className="flex justify-start items-center gap-2 mb-2">
          {summaryIcon}
          <p className="font-sans text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {summaryType}
          </p>
        </div>
        <p className="font-sans text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {summaryAmount}
        </p>
      </div>
      {growthPercent !== undefined && (
        <div
          className={`flex justify-start items-center text-xs ${
            growthPercent > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {growthPercent > 0 ? (
            <TiArrowUpThick className="w-3 h-3" />
          ) : (
            <TiArrowDownThick className="w-3 h-3" />
          )}
          <p>{Math.abs(growthPercent)}%</p>
        </div>
      )}
    </article>
  );
}
