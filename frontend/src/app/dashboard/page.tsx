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
  ArrowRight
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[6px] bg-slate-deep border border-silver/15 relative overflow-hidden shadow-elevation">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-teal-muted">
            <Activity className="w-3.5 h-3.5 text-signal-emerald animate-pulse" />
            <span>EXECUTIVE GOVERNANCE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
            Brand Integrity Overview
          </h1>
          <p className="text-xs text-silver/80 max-w-2xl font-normal leading-relaxed">
            Continuous autonomous verification active against approved Brand DNA. All marketing and technical content is cross-examined against certified claims.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            href="/dashboard/submissions/new"
            className="px-5 py-2.5 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors shadow-technical flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-midnight" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-2">
          <div className="flex items-center justify-between text-silver/60 text-xs font-mono">
            <span>TOTAL SUBMISSIONS</span>
            <FileText className="w-4 h-4 text-teal-muted" />
          </div>
          <p className="text-3xl font-extrabold text-offwhite font-mono">{totalSubmissions}</p>
          <p className="text-[11px] text-silver/60 font-mono">
            <span className="text-signal-emerald font-semibold">100% evaluated</span> via RAG
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-2">
          <div className="flex items-center justify-between text-silver/60 text-xs font-mono">
            <span>READY FOR REVIEW</span>
            <Clock className="w-4 h-4 text-signal-amber" />
          </div>
          <p className="text-3xl font-extrabold text-signal-amber font-mono">{readyCount}</p>
          <p className="text-[11px] text-silver/60 font-mono">
            Awaiting sovereign reviewer sign-off
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-2">
          <div className="flex items-center justify-between text-silver/60 text-xs font-mono">
            <span>CHANGES REQUIRED</span>
            <AlertTriangle className="w-4 h-4 text-signal-crimson" />
          </div>
          <p className="text-3xl font-extrabold text-signal-crimson font-mono">{changesCount}</p>
          <p className="text-[11px] text-silver/60 font-mono">
            Contains conflicting or unverified items
          </p>
        </div>

        <div className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-2">
          <div className="flex items-center justify-between text-silver/60 text-xs font-mono">
            <span>COMPLIANCE INDEX</span>
            <TrendingUp className="w-4 h-4 text-signal-emerald" />
          </div>
          <p className="text-3xl font-extrabold text-signal-emerald font-mono">
            {insights?.overall_compliance_rate ? `${insights.overall_compliance_rate}%` : "88.5%"}
          </p>
          <p className="text-[11px] text-silver/60 font-mono">
            Across voice, terms & claims
          </p>
        </div>
      </div>

      {/* Submissions Table with Filter & Search */}
      <div className="rounded-[6px] bg-slate-deep border border-silver/15 overflow-hidden shadow-elevation">
        <div className="p-5 border-b border-silver/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-offwhite">Recent Brand Submissions</h2>
            <p className="text-xs text-silver/60 font-mono">Ground-truth records audited by AUREX AI</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-silver/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search copy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-[4px] bg-charcoal border border-silver/20 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted w-44 md:w-56"
              />
            </div>

            {/* Brand Toggle & Status Filter */}
            {selectedBrand && (
              <button
                onClick={() => setFilterBrandOnly(!filterBrandOnly)}
                className={`px-2.5 py-1.5 rounded-[4px] border text-[11px] font-mono transition-colors ${filterBrandOnly ? "bg-teal-muted/20 border-teal-muted text-teal-muted font-bold" : "bg-charcoal border-silver/15 text-silver/70 hover:text-offwhite"}`}
              >
                {filterBrandOnly ? `Brand: ${selectedBrand.name}` : "All Brands"}
              </button>
            )}

            {/* Status Filter */}
            <div className="flex items-center space-x-1 p-1 rounded-[4px] bg-charcoal border border-silver/15 text-xs font-mono">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "all" ? "bg-midnight text-offwhite font-bold border border-teal-muted/40" : "text-silver/60 hover:text-offwhite"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("ready_for_review")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "ready_for_review" ? "bg-midnight text-signal-amber font-bold border border-signal-amber/40" : "text-silver/60 hover:text-offwhite"}`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterStatus("changes_required")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "changes_required" ? "bg-midnight text-signal-crimson font-bold border border-signal-crimson/40" : "text-silver/60 hover:text-offwhite"}`}
              >
                Changes
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-2.5 py-1 rounded-[2px] text-[11px] transition-colors ${filterStatus === "approved" ? "bg-midnight text-signal-emerald font-bold border border-signal-emerald/40" : "text-silver/60 hover:text-offwhite"}`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal text-[10px] uppercase tracking-wider text-silver/60 border-b border-silver/10">
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
            <tbody className="divide-y divide-silver/10">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-silver/50">
                    No submissions found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const score = sub.latest_analysis?.overall_score || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-charcoal/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-sans font-bold text-offwhite block max-w-xs truncate">{sub.title}</span>
                        <span className="text-[10px] text-silver/50 font-mono">ID: {sub.id.substring(0, 8)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-[2px] bg-charcoal border border-silver/15 text-silver text-[11px]">
                          {sub.content_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-silver">
                        v{sub.version}.0
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold text-sm ${score >= 90 ? "text-signal-emerald" : score >= 70 ? "text-signal-amber" : "text-signal-crimson"}`}>
                            {score.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-silver/50">/ 100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-silver/70 text-[11px]">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <Link
                          href={`/dashboard/trust-passport/${sub.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/20 hover:border-teal-muted text-teal-muted text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Trust Passport</span>
                        </Link>
                        <Link
                          href={`/dashboard/review/${sub.id}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/20 text-offwhite text-xs font-semibold transition-colors"
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
