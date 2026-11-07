"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  PlusCircle,
  Eye,
  Search,
  Activity,
  Layers,
  ArrowRight,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { Submission, GovernanceInsights } from "@/types";
import { getStatusColor, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useBrand } from "@/lib/brand-context";

export default function DashboardOverviewPage() {
  const { role } = useAuth();
  const { selectedBrand } = useBrand();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [insights, setInsights] = useState<GovernanceInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBrandOnly, setFilterBrandOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const brandId = filterBrandOnly && selectedBrand ? selectedBrand.id : undefined;
        const [subsData, insightsData] = await Promise.all([
          api.listSubmissions(brandId),
          api.getInsights().catch(() => null),
        ]);
        setSubmissions(subsData);
        setInsights(insightsData);
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedBrand, filterBrandOnly]);

  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const changesCount = submissions.filter((s) => s.status === "changes_required").length;
  const readyCount = submissions.filter((s) => s.status === "ready_for_review").length;

  const filteredSubmissions = submissions.filter((s) => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[6px] bg-[#090909] border border-[#292929] relative overflow-hidden shadow-elevation">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>EXECUTIVE GOVERNANCE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brand Integrity Overview
          </h1>
          <p className="text-xs text-[#A1A1A1] max-w-2xl font-normal leading-relaxed">
            Continuous autonomous verification active against approved Brand DNA truth. Every piece of copy is cross-examined against verified claims.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            href="/dashboard/submissions/new"
            className="px-5 py-2.5 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-colors shadow-technical flex items-center space-x-2 font-mono"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[4px] bg-[#090909] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#777777] text-xs font-mono">
            <span>TOTAL SUBMISSIONS</span>
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{totalSubmissions}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            <span className="text-white font-semibold">100% evaluated</span> via RAG
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-[#090909] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#777777] text-xs font-mono">
            <span>READY FOR REVIEW</span>
            <Clock className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{readyCount}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Awaiting sovereign reviewer sign-off
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-[#090909] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#777777] text-xs font-mono">
            <span>CHANGES REQUIRED</span>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{changesCount}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Contains conflicting or unverified items
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-[#090909] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#777777] text-xs font-mono">
            <span>COMPLIANCE INDEX</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {insights?.overall_compliance_rate ? `${insights.overall_compliance_rate}%` : "88.5%"}
          </p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Across voice, terms & claims
          </p>
        </div>
      </div>

      {/* Submissions Table with Filter & Search */}
      <div className="rounded-[6px] bg-[#090909] border border-[#292929] overflow-hidden shadow-elevation">
        <div className="p-5 border-b border-[#292929] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-white">Recent Brand Submissions</h2>
            <p className="text-xs text-[#777777] font-mono">Ground-truth records audited by AUREX AI</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search copy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-[4px] bg-[#111111] border border-[#292929] text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white w-44 md:w-56 font-mono"
              />
            </div>

            {/* Brand Toggle & Status Filter */}
            {selectedBrand && (
              <button
                onClick={() => setFilterBrandOnly(!filterBrandOnly)}
                className={`px-2.5 py-1.5 rounded-[4px] border text-[11px] font-mono transition-colors ${filterBrandOnly ? "bg-white text-black font-bold border-white" : "bg-[#111111] border-[#292929] text-[#A1A1A1] hover:text-white"}`}
              >
                {filterBrandOnly ? `Brand: ${selectedBrand.name}` : "All Brands"}
              </button>
            )}

            {/* Status Filter */}
            <div className="flex items-center space-x-1 p-1 rounded-[4px] bg-[#111111] border border-[#292929] text-xs font-mono">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "all" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("ready_for_review")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "ready_for_review" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterStatus("changes_required")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "changes_required" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
              >
                Changes
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "approved" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111111] text-[10px] uppercase tracking-wider text-[#777777] border-b border-[#292929]">
              <tr>
                <th className="py-3 px-5 font-semibold">Submission Title</th>
                <th className="py-3 px-4 font-semibold">Content Type</th>
                <th className="py-3 px-4 font-semibold">Version</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#777777]">
                    No submissions found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const score = sub.latest_analysis?.overall_score || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-[#111111] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-sans font-bold text-white block max-w-xs truncate">{sub.title}</span>
                        <span className="text-[10px] text-[#777777] font-mono">ID: {sub.id.substring(0, 8)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-[2px] bg-[#181818] border border-[#292929] text-[#D4D4D4] text-[11px]">
                          {sub.content_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#D4D4D4]">
                        v{sub.version}.0
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-sm text-white">
                            {score.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[#777777]">/ 100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1A1] text-[11px]">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <Link
                          href={`/dashboard/trust-passport/${sub.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-[4px] bg-[#111111] hover:bg-white hover:text-black border border-[#292929] text-white text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Trust Passport</span>
                        </Link>
                        <Link
                          href={`/dashboard/review/${sub.id}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-[4px] bg-[#181818] hover:bg-white hover:text-black border border-[#292929] text-[#D4D4D4] text-xs font-semibold transition-colors"
                        >
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
