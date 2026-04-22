"use client";
import React, { useEffect, useState } from "react";
import { Users, ShieldAlert, CheckCircle2, DollarSign, TrendingUp, XCircle, Link } from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardStats, DashboardStats } from "@/lib/api/dashboard.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <>{prefix}{count.toLocaleString()}</>;
}

// A Framer Motion variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardOverview() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"last7Days" | "last30Days" | "allTime">("last30Days");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (error) {
        console.log("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Pre-process chart data
  const rawChartData = data.charts.reportsByCategory[timeframe] || [];
  const allTimeData = data.charts.reportsByCategory.allTime || [];
  
  // Create a config map and color assignments
  const defaultColors = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6"  // Violet
  ];

  // Guarantee all categories from 'allTime' show up even if their count is 0 in this timeframe
  const baseCategories = Array.from(new Set(allTimeData.map(item => item.category)));

  const chartData = baseCategories.map((cat, index) => {
    const found = rawChartData.find(d => d.category === cat);
    return {
      name: cat,
      value: found ? found.count : 0,
      fill: defaultColors[index % defaultColors.length]
    };
  });

  // Construct chart config for shadcn ChartContainer
  const chartConfig = baseCategories.reduce((acc, cat, index) => {
      acc[cat] = {
        label: cat,
        color: defaultColors[index % defaultColors.length]
      };
      return acc;
  }, {} as ChartConfig);

  const statsCards = [
    {
      title: "Total Users",
      value: data.summary.totalUsers,
      prefix: "",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Reports",
      value: data.summary.activeReports,
      prefix: "",
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Resolved Cases",
      value: data.summary.resolvedCases,
      prefix: "",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: data.summary.totalRevenue,
      prefix: "EGP ",
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-2.5 rounded-xl transition-colors group-hover:scale-110 duration-300`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter value={stat.value} prefix={stat.prefix} />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Reports Chart Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Reports by Category</CardTitle>
              <CardDescription>Breakdown of reported items category.</CardDescription>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeframe("last7Days")}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${timeframe === "last7Days" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeframe("last30Days")}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${timeframe === "last30Days" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                30 Days
              </button>
              <button 
                onClick={() => setTimeframe("allTime")}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${timeframe === "allTime" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                All Time
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
             <div className="w-full pt-6">
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
                   <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                     <XAxis 
                       dataKey="name" 
                       tickLine={false}
                       axisLine={false}
                       tick={{ fill: '#6b7280', fontSize: 12 }}
                       dy={10}
                     />
                     <YAxis 
                       tickLine={false} 
                       axisLine={false} 
                       tick={{ fill: '#6b7280', fontSize: 12 }}
                     />
                     <ChartTooltip 
                       cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                       content={<ChartTooltipContent hideLabel />} 
                     />
                     <Bar 
                       dataKey="value" 
                       radius={[6, 6, 0, 0]} 
                       maxBarSize={60}
                       isAnimationActive={true}
                       animationDuration={1500}
                       animationEasing="ease-out"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ChartContainer>
               </div>
            ) : (
               <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                 <TrendingUp className="h-8 w-8 text-gray-300 mb-2" />
                 <p className="text-sm text-gray-400">No data available for this timeframe</p>
               </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Info Layout: Vertical column next to chart */}
        <div className="flex flex-col gap-6 w-full h-full">
          <Card className="border-gray-100 shadow-sm flex-1 flex flex-col justify-center transition-all hover:shadow-md group">
            <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-50 p-2.5 rounded-xl transition-colors group-hover:scale-110 duration-300">
                      <Link className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Matched Reports</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter value={data.summary.matchedCases || 0} />
                    </p>
                  </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm flex-1 flex flex-col justify-center transition-all hover:shadow-md group">
            <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-rose-50 p-2.5 rounded-xl transition-colors group-hover:scale-110 duration-300">
                      <XCircle className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rejected Reports</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter value={data.summary.rejectedCases || 0} />
                    </p>
                  </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
