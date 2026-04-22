import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface Transaction {
  _id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency?: string;
  type: string;
  createdAt: string;
  status: string;
  stripePaymentId?: string;
  billingName?: string;
  billingEmail?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden p-8 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden p-12 text-center">
        <div className="text-gray-400 mb-2 font-medium">No activity found</div>
        <p className="text-gray-500 text-sm">Transactions will appear here once processed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-6">
                TRANSACTION ID
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                CUSTOMER
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                AMOUNT
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                TYPE
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                DATE
              </TableHead>
              <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx._id} className="hover:bg-blue-50/30 transition-colors border-gray-50 group">
                <TableCell className="pl-6 font-medium text-gray-400 text-sm group-hover:text-blue-600 transition-colors">
                  #TXN-{tx._id.slice(-5).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-gray-100 shadow-sm">
                      <AvatarImage src={tx.user?.avatar} alt={tx.user?.name} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                        {tx.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {tx.billingName || tx.user?.name || "Deleted User"}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {tx.billingEmail || tx.user?.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-gray-900" suppressHydrationWarning>
                  {formatCurrency(tx.amount, tx.currency)}
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    tx.type === "CREDIT_REFILL" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-500"
                  )}>
                    {tx.type.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700" suppressHydrationWarning>
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
