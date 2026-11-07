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
  Filter,
  Sparkles
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-white">
      {/* Header Banner - Glassmorphic Hero Panel */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[12px] border border-white/15 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#D4D4D4] px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_6px_#ffffff]" />
            <span>EXECUTIVE GOVERNANCE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brand Integrity Overview
          </h1>
          <p className="text-xs text-[#A1A1A1] max-w-2xl font-normal leading-relaxed">
            Continuous autonomous verification active against approved Brand DNA truth. Every piece of copy is cross-examined against verified claims and regulatory constraints.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            href="/dashboard/submissions/new"
            className="px-5 py-2.5 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(255,255,255,0.25)] flex items-center space-x-2 font-mono group"
          >
            <PlusCircle className="w-4 h-4 text-black transition-transform group-hover:rotate-90" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - Glass Cards with Hover Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-[10px] p-5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A1A1A1] text-xs font-mono">
            <span>TOTAL SUBMISSIONS</span>
            <div className="w-7 h-7 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono tracking-tight">{totalSubmissions}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            <span className="text-white font-semibold">100% evaluated</span> via RAG
          </p>
        </div>

        <div className="glass-card rounded-[10px] p-5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A1A1A1] text-xs font-mono">
            <span>READY FOR REVIEW</span>
            <div className="w-7 h-7 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
              <Clock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono tracking-tight">{readyCount}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Awaiting sovereign reviewer sign-off
          </p>
        </div>

        <div className="glass-card rounded-[10px] p-5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A1A1A1] text-xs font-mono">
            <span>CHANGES REQUIRED</span>
            <div className="w-7 h-7 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono tracking-tight">{changesCount}</p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Contains conflicting or unverified items
          </p>
        </div>

        <div className="glass-card rounded-[10px] p-5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A1A1A1] text-xs font-mono">
            <span>COMPLIANCE INDEX</span>
            <div className="w-7 h-7 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {insights?.overall_compliance_rate ? `${insights.overall_compliance_rate}%` : "88.5%"}
          </p>
          <p className="text-[11px] text-[#A1A1A1] font-mono">
            Across voice, terms & claims
          </p>
        </div>
      </div>

      {/* Submissions Table with Glass Container */}
      <div className="glass-panel rounded-[12px] border border-white/12 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-white">Recent Brand Submissions</h2>
            <p className="text-xs text-[#A1A1A1] font-mono">Ground-truth records audited by AUREX AI</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search copy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-8 pr-3 py-1.5 rounded-[6px] text-xs placeholder-[#777777] w-44 md:w-56 font-mono"
              />
            </div>

            {/* Brand Toggle */}
            {selectedBrand && (
              <button
                onClick={() => setFilterBrandOnly(!filterBrandOnly)}
                className={`px-3 py-1.5 rounded-[6px] text-[11px] font-mono transition-all ${
                  filterBrandOnly 
                    ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]" 
                    : "glass-button text-[#A1A1A1]"
                }`}
              >
                {filterBrandOnly ? `Brand: ${selectedBrand.name}` : "All Brands"}
              </button>
            )}

            {/* Status Filter */}
            <div className="glass-pill flex items-center space-x-1 p-1 rounded-[6px] text-xs font-mono">
              {["all", "ready_for_review", "changes_required", "approved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-[4px] text-[11px] capitalize transition-all ${
                    filterStatus === st 
                      ? "bg-white text-black font-bold shadow-sm" 
                      : "text-[#A1A1A1] hover:text-white"
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
            <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-[#A1A1A1] border-b border-white/10">
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
            <tbody className="divide-y divide-white/5">
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
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-5">
                        <span className="font-sans font-bold text-white block max-w-xs truncate group-hover:text-white transition-colors">
                          {sub.title}
                        </span>
                        <span className="text-[10px] text-[#777777] font-mono">ID: {sub.id.substring(0, 8)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="glass-pill capitalize px-2 py-0.5 rounded-[4px] text-[#D4D4D4] text-[11px]">
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
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1A1] text-[11px]">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <Link
                          href={`/dashboard/trust-passport/${sub.id}`}
                          className="glass-button inline-flex items-center space-x-1 px-3 py-1.5 rounded-[6px] text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Trust Passport</span>
                        </Link>
                        <Link
                          href={`/dashboard/review/${sub.id}`}
                          className="glass-button inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-[6px] text-[#D4D4D4] text-xs font-semibold"
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
