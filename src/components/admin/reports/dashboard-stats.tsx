"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Clock, Package, CheckCircle } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { StatCardProps } from "@/types/stats.types";

const StatCard = ({ title, value, icon: Icon, color, index, loading }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-md group"
    >
      <div 
        className={`w-[50px] h-[50px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${color.iconBg}`}
      >
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
          {title}
        </span>
        <div className="flex items-center">
          {loading ? (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse delay-150" />
            </div>
          ) : (
            <span className="text-2xl font-black text-gray-900 tracking-tight truncate">
              {value}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardStats = () => {
  const { stats, loading } = useAppSelector((state) => state.reports);

  const statItems = [
    {
      title: "Total Reports",
      value: stats.total,
      icon: FileText,
      color: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        iconBg: "bg-blue-50",
      },
    },
    {
      title: "Pending Reviews",
      value: stats.OPEN,
      icon: Clock,
      color: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        iconBg: "bg-amber-50",
      },
    },
    {
      title: "Active Matches",
      value: stats.MATCHED,
      icon: Package,
      color: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        iconBg: "bg-purple-50",
      },
    },
    {
      title: "Resolved Items",
      value: stats.RESOLVED,
      icon: CheckCircle,
      color: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        iconBg: "bg-emerald-50",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <StatCard
          key={item.title}
          {...item}
          index={index}
          loading={loading}
        />
      ))}
    </div>
  );
};
