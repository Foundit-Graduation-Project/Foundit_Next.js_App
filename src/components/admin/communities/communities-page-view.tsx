"use client";
import React from "react";
import { Plus, Users, Shield, Globe, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockCommunities = [
  { id: 1, name: "Cairo Central", members: "1.2k", admin: "Ahmed Aly", status: "Active" },
  { id: 2, name: "Alexandria North", members: "840", admin: "Sara Osman", status: "Active" },
  { id: 3, name: "Giza South", members: "530", admin: "Mona Said", status: "Moderated" },
];

export function CommunitiesPageView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
           <Globe className="h-4 w-4" />
           <span>3 Active Communities</span>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px]">Community</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] hidden sm:table-cell">Members</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] hidden md:table-cell">Admin</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px]">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockCommunities.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {c.members}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Shield className="h-3.5 w-3.5 text-blue-500" />
                      {c.admin}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
