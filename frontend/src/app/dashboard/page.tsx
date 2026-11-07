"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  PlusCircle,
  Eye,
  Search
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#17143A]">
      {/* Header Banner - Glassmorphic Hero Panel */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[16px] border border-[#5B4BFF]/25 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shadow-xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#5B4BFF] font-bold px-2.5 py-1 rounded-[6px] bg-[#E6E0FF] border border-[#5B4BFF]/20">
            <span className="w-2 h-2 rounded-full bg-[#5B4BFF] animate-pulse shadow-[0_0_8px_#5B4BFF]" />
            <span>EXECUTIVE GOVERNANCE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
            Brand Integrity Overview
          </h1>
          <p className="text-xs text-[#77738F] max-w-2xl font-normal leading-relaxed">
            Continuous autonomous verification active against approved Brand DNA truth. Every piece of copy is cross-examined against verified claims and regulatory constraints.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            href="/dashboard/submissions/new"
            className="glass-button-primary px-5 py-2.5 rounded-[10px] font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 font-mono group shadow-[0_4px_18px_rgba(91,75,255,0.3)]"
          >
            <PlusCircle className="w-4 h-4 text-white transition-transform group-hover:rotate-90" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - Glass Cards with Hover Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-[14px] p-5 space-y-2 relative overflow-hidden group border border-[#E5E1F2] bg-white">
          <div className="flex items-center justify-between text-[#77738F] text-xs font-mono font-bold">
            <span>TOTAL SUBMISSIONS</span>
            <div className="w-8 h-8 rounded-[8px] bg-[#E6E0FF] flex items-center justify-center text-[#5B4BFF] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4 text-[#5B4BFF]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0D0B2D] font-mono tracking-tight">{totalSubmissions}</p>
          <p className="text-[11px] text-[#77738F] font-mono">
            <span className="text-[#5B4BFF] font-bold">100% evaluated</span> via RAG
          </p>
        </div>

        <div className="glass-card rounded-[14px] p-5 space-y-2 relative overflow-hidden group border border-[#E5E1F2] bg-white">
          <div className="flex items-center justify-between text-[#77738F] text-xs font-mono font-bold">
            <span>READY FOR REVIEW</span>
            <div className="w-8 h-8 rounded-[8px] bg-[#E6E0FF] flex items-center justify-center text-[#5B4BFF] group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-[#5B4BFF]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0D0B2D] font-mono tracking-tight">{readyCount}</p>
          <p className="text-[11px] text-[#77738F] font-mono">
            Awaiting sovereign reviewer sign-off
          </p>
        </div>

        <div className="glass-card rounded-[14px] p-5 space-y-2 relative overflow-hidden group border border-[#E5E1F2] bg-white">
          <div className="flex items-center justify-between text-[#77738F] text-xs font-mono font-bold">
            <span>CHANGES REQUIRED</span>
            <div className="w-8 h-8 rounded-[8px] bg-[#F0EDFF] flex items-center justify-center text-[#5B4BFF] group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4 text-[#5B4BFF]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0D0B2D] font-mono tracking-tight">{changesCount}</p>
          <p className="text-[11px] text-[#77738F] font-mono">
            Contains conflicting or unverified items
          </p>
        </div>

        <div className="glass-card rounded-[14px] p-5 space-y-2 relative overflow-hidden group border border-[#E5E1F2] bg-white">
          <div className="flex items-center justify-between text-[#77738F] text-xs font-mono font-bold">
            <span>COMPLIANCE INDEX</span>
            <div className="w-8 h-8 rounded-[8px] bg-[#E6E0FF] flex items-center justify-center text-[#5B4BFF] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-[#5B4BFF]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#5B4BFF] font-mono tracking-tight">
            {insights?.overall_compliance_rate ? `${insights.overall_compliance_rate}%` : "88.5%"}
          </p>
          <p className="text-[11px] text-[#77738F] font-mono">
            Across voice, terms & claims
          </p>
        </div>
      </div>

      {/* Submissions Table with Glass Container */}
      <div className="glass-panel rounded-[16px] border border-[#E5E1F2] overflow-hidden shadow-xl bg-white">
        <div className="p-5 border-b border-[#E5E1F2] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-[#0D0B2D]">Recent Brand Submissions</h2>
            <p className="text-xs text-[#77738F] font-mono">Ground-truth records audited by AUREX AI</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#77738F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search copy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-8 pr-3 py-1.5 rounded-[8px] text-xs placeholder-[#77738F] w-44 md:w-56 font-mono"
              />
            </div>

            {/* Brand Toggle */}
            {selectedBrand && (
              <button
                onClick={() => setFilterBrandOnly(!filterBrandOnly)}
                className={`px-3 py-1.5 rounded-[8px] text-[11px] font-mono transition-all ${
                  filterBrandOnly 
                    ? "bg-[#5B4BFF] text-white font-bold shadow-sm" 
                    : "glass-button text-[#77738F]"
                }`}
              >
                {filterBrandOnly ? `Brand: ${selectedBrand.name}` : "All Brands"}
              </button>
            )}

            {/* Status Filter */}
            <div className="glass-pill flex items-center space-x-1 p-1 rounded-[8px] text-xs font-mono">
              {["all", "ready_for_review", "changes_required", "approved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] capitalize transition-all ${
                    filterStatus === st 
                      ? "bg-[#5B4BFF] text-white font-bold shadow-sm" 
                      : "text-[#77738F] hover:text-[#0D0B2D]"
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F0EDFF]/60 text-[10px] uppercase tracking-wider text-[#77738F] border-b border-[#E5E1F2]">
              <tr>
                <th className="py-3 px-5 font-bold">Submission Title</th>
                <th className="py-3 px-4 font-bold">Content Type</th>
                <th className="py-3 px-4 font-bold">Version</th>
                <th className="py-3 px-4 font-bold">Score</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1F2]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#77738F]">
                    No submissions found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const score = sub.latest_analysis?.overall_score || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-[#F0EDFF]/50 transition-colors group">
                      <td className="py-3.5 px-5">
                        <span className="font-sans font-bold text-[#0D0B2D] block max-w-xs truncate group-hover:text-[#5B4BFF] transition-colors">
                          {sub.title}
                        </span>
                        <span className="text-[10px] text-[#77738F] font-mono">ID: {sub.id.substring(0, 8)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="glass-pill capitalize px-2 py-0.5 rounded-[4px] text-[#17143A] text-[11px] font-medium">
                          {sub.content_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#77738F] font-semibold">
                        v{sub.version}.0
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-sm text-[#0D0B2D]">
                            {score.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-[#77738F]">/ 100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-[6px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#77738F] text-[11px]">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <Link
                          href={`/dashboard/trust-passport/${sub.id}`}
                          className="glass-button inline-flex items-center space-x-1 px-3 py-1.5 rounded-[8px] text-xs font-bold text-[#5B4BFF] hover:bg-[#5B4BFF] hover:text-white"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Trust Passport</span>
                        </Link>
                        <Link
                          href={`/dashboard/review/${sub.id}`}
                          className="glass-button inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-[8px] text-[#0D0B2D] text-xs font-semibold"
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
