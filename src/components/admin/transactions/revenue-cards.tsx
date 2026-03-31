import React from "react";
import { CreditCard, CheckCircle, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils";

interface RevenueCardsProps {
  stats: {
    totalRevenueThisMonth: number;
    revenueGrowthPercentage: number;
    successfulTransactionsCount: number;
    currentMonthTransactionsCount: number;
    dailyAverage: number;
  } | null;
}

export function RevenueCards({ stats }: RevenueCardsProps) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!stats) return null;
  
  const isPositiveGrowth = stats.revenueGrowthPercentage >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue Card */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              TOTAL REVENUE THIS MONTH
            </p>
            <h3 className="text-3xl font-bold text-gray-900 leading-none">
              {hasMounted ? formatCurrency(stats.totalRevenueThisMonth) : "---"}
            </h3>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn(
            "flex items-center text-xs font-bold",
            isPositiveGrowth ? "text-emerald-500" : "text-rose-500"
          )}>
            {isPositiveGrowth ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(stats.revenueGrowthPercentage)}%
          </span>
          <span className="text-xs text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>

      {/* Successful Transactions Card */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              SUCCESSFUL TRANSACTIONS
            </p>
            <h3 className="text-3xl font-bold text-gray-900 leading-none">
              {hasMounted ? stats.currentMonthTransactionsCount : "---"}
            </h3>
          </div>
          <div className="bg-emerald-50 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
          <span>Daily average:</span>
          <span className="text-gray-600">{hasMounted ? (stats.dailyAverage || "0") : "---"}</span>
        </div>
      </div>

      {/* System Health Card */}
      <div className="bg-blue-600 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1 opacity-70">
            SYSTEM HEALTH
          </p>
          <h3 className="text-xl font-bold text-white mb-4">
            Payment Infrastructure
          </h3>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Stripe: Operational</span>
          </div>
        </div>
        
        {/* Decorative Wallet Icon Background */}
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-10 transform scale-150 rotate-12 transition-transform group-hover:rotate-6">
          <Wallet className="w-32 h-32 text-white" />
        </div>
      </div>
    </div>
  );
}
