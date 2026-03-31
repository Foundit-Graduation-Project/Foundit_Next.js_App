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

  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);
  const stats = useSelector(selectTransactionsStats);
  const totalCount = useSelector(selectTransactionsTotalCount);
  const totalPages = useSelector(selectTransactionsTotalPages);
  const error = useSelector(selectTransactionsError);

  useEffect(() => {
    dispatch(fetchTransactionStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
