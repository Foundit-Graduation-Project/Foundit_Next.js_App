"use client";
import React from "react";
import { AlertCircle, User, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReports = [
  { id: 1, reporter: "Alice Smith", target: "Lost Item #12", reason: "Spam/Fake", date: "2h ago", priority: "High" },
  { id: 2, reporter: "Bob Jones", target: "Comment #45", reason: "Harassment", date: "5h ago", priority: "Medium" },
  { id: 3, reporter: "Charlie Day", target: "User Profile #89", reason: "Inappropriate Avatar", date: "Yesterday", priority: "Low" },
];

export function ReportsPageView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
        <div className="text-sm text-orange-700">
          <span className="font-bold">Pro Tip:</span> Prioritize reports that has been flagged "High" for immediate action.
        </div>
      </div>

      <div className="space-y-3">
        {mockReports.map((report) => (
          <div 
            key={report.id} 
            className="group block bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${
                  report.priority === "High" ? "bg-red-50 text-red-600" : 
                  report.priority === "Medium" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                }`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{report.reporter}</h4>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{report.priority} Priority</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">Reported <span className="font-semibold text-gray-900">{report.target}</span> for <span className="text-blue-600">{report.reason}</span></p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {report.date}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> View Discussion</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" className="sm:h-auto h-11 w-full sm:w-auto bg-gray-50/50 sm:bg-transparent rounded-xl sm:rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                Handle Report <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
