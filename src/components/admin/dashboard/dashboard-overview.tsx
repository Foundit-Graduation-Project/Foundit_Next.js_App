"use client";
import React from "react";
import { Users, ShieldAlert, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Active Reports",
    value: "18",
    change: "-4.3%",
    trend: "down",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Resolved Cases",
    value: "142",
    change: "+22.1%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Avg. Trust Score",
    value: "84%",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-2.5 rounded-xl transition-colors group-hover:scale-110 duration-300`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive Row for Charts/Recent Activity (Draft/Scaffold) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
           <div className="bg-gray-50 p-4 rounded-full mb-4">
             <TrendingUp className="h-8 w-8 text-gray-300" />
           </div>
           <h4 className="font-semibold text-gray-900">Performance Trends</h4>
           <p className="text-sm text-gray-500 max-w-xs mt-1">
             Detailed analytics visualization will appear here. (Responsive Chart Scaffold)
           </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
           <ShieldAlert className="h-8 w-8 text-gray-300 mb-4" />
           <h4 className="font-semibold text-gray-900">Recent Logs</h4>
           <p className="text-sm text-gray-500 mt-1">
             Real-time activity monitor.
           </p>
           <div className="w-full mt-6 space-y-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-3 bg-gray-50 rounded-full w-full animate-pulse" />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
