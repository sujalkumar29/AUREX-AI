"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Search,
  Eye,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";
import { Submission } from "@/types";
import { getStatusColor, formatDate } from "@/lib/utils";

export default function SubmissionsListPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    api.listSubmissions()
      .then(setSubmissions)
      .catch((e) => console.error("Error loading submissions:", e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = submissions.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#17143A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
            Brand Content Submissions
          </h1>
          <p className="text-xs text-[#77738F] font-mono">
            Audited copy drafts, campaigns, documents, and creative assets
          </p>
        </div>
        <Link
          href="/dashboard/submissions/new"
          className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)] flex items-center space-x-2 font-mono group"
        >
          <PlusCircle className="w-4 h-4 text-white transition-transform group-hover:rotate-90" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-[14px] border border-[#E5E1F2] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm bg-white/70">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#77738F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-3 py-1.5 rounded-[8px] text-xs placeholder-[#77738F]/60 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
          />
        </div>

        <div className="glass-pill p-1 rounded-[8px] flex flex-wrap items-center gap-1 text-xs font-mono bg-[#F0EDFF] border border-[#E5E1F2]">
          {["all", "ready_for_review", "changes_required", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[6px] text-xs uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
                  : "text-[#77738F] hover:text-[#0D0B2D]"
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 gap-3.5">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#77738F] flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4 text-[#5B4BFF] animate-pulse" />
            <span>Loading Submissions Database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel p-12 rounded-[14px] border border-[#E5E1F2] text-center text-xs text-[#77738F] font-mono bg-white/60">
            No submissions found matching your query.
          </div>
        ) : (
          filtered.map((sub) => {
            const score = sub.latest_analysis?.overall_score || 0;
            return (
              <div
                key={sub.id}
                className="glass-card p-5 rounded-[12px] border border-[#E5E1F2] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm bg-white/80 hover:border-[#5B4BFF]/40 hover:shadow-md transition-all group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="glass-pill text-[11px] font-mono text-[#5B4BFF] bg-[#E6E0FF] px-2 py-0.5 rounded-[4px] border border-[#5B4BFF]/20">
                      v{sub.version}.0
                    </span>
                    <span className="text-[11px] capitalize text-[#77738F] font-mono">
                      {sub.content_type.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0D0B2D] group-hover:text-[#5B4BFF] transition-colors">{sub.title}</h3>
                  {sub.raw_text && (
                    <p className="text-xs text-[#77738F] line-clamp-1 font-mono">
                      {sub.raw_text}
                    </p>
                  )}
                  <span className="text-[10px] text-[#77738F] font-mono block">
                    Created: {formatDate(sub.created_at)}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[#77738F] block font-semibold">Governance Score</span>
                    <span className="font-mono font-bold text-xl text-[#0D0B2D]">
                      {score.toFixed(1)} <span className="text-[10px] text-[#77738F] font-normal">/ 100</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/trust-passport/${sub.id}`}
                      className="glass-button px-3.5 py-1.5 rounded-[8px] text-[#0D0B2D] hover:text-[#5B4BFF] text-xs font-semibold font-mono flex items-center space-x-1.5 border border-[#E5E1F2] hover:bg-[#F0EDFF] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#5B4BFF]" />
                      <span>Trust Passport</span>
                    </Link>
                    <Link
                      href={`/dashboard/review/${sub.id}`}
                      className="glass-button px-3 py-1.5 rounded-[8px] text-[#5B4BFF] text-xs font-semibold font-mono border border-[#5B4BFF]/30 bg-[#F0EDFF] hover:bg-[#E6E0FF] transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
