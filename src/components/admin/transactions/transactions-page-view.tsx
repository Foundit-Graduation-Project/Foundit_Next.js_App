"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { 
  fetchTransactions, 
  fetchTransactionStats 
} from "@/redux/features/transactions/transactionsThunk";
import { 
  selectTransactions, 
  selectTransactionsLoading, 
  selectTransactionsStats, 
  selectTransactionsTotalCount, 
  selectTransactionsTotalPages,
  selectTransactionsError
} from "@/redux/features/transactions/transactionsSelectors";
import { RevenueCards } from "./revenue-cards";
import { TransactionsTable } from "./transactions-table";
import { Pagination } from "@/components/shared/pagination";
import { toast } from "react-hot-toast";

export function TransactionsPageView() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isMounted, setIsMounted] = useState(false);

  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);
  const stats = useSelector(selectTransactionsStats);
  const totalCount = useSelector(selectTransactionsTotalCount);
  const totalPages = useSelector(selectTransactionsTotalPages);
  const error = useSelector(selectTransactionsError);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchTransactionStats());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted) {
      dispatch(fetchTransactions({ page, limit }));
    }
  }, [dispatch, page, isMounted]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (!isMounted) {
    return (
      <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Revenue & Stats Section */}
      <RevenueCards stats={stats} />

      {/* Transactions List Section */}
      <div className="space-y-0">
        <TransactionsTable 
          transactions={transactions} 
          isLoading={loading} 
        />
        
        {!loading && transactions.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
