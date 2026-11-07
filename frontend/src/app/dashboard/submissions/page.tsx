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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Brand Content Submissions
          </h1>
          <p className="text-xs text-[#A1A1A1] font-mono">
            Audited copy drafts, campaigns, documents, and creative assets
          </p>
        </div>
        <Link
          href="/dashboard/submissions/new"
          className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_18px_rgba(255,255,255,0.2)] flex items-center space-x-2 font-mono group"
        >
          <PlusCircle className="w-4 h-4 text-black transition-transform group-hover:rotate-90" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-[12px] border border-white/12 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-3 py-1.5 rounded-[6px] text-xs placeholder-[#777777] font-mono"
          />
        </div>

        <div className="glass-pill p-1 rounded-[6px] flex flex-wrap items-center gap-1 text-xs font-mono">
          {["all", "ready_for_review", "changes_required", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[4px] text-xs uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-[#A1A1A1] hover:text-white"
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
          <div className="p-16 text-center text-xs font-mono text-[#A1A1A1] flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4 text-white animate-pulse" />
            <span>Loading Submissions Database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel p-12 rounded-[12px] border border-white/10 text-center text-xs text-[#777777] font-mono">
            No submissions found matching your query.
          </div>
        ) : (
          filtered.map((sub) => {
            const score = sub.latest_analysis?.overall_score || 0;
            return (
              <div
                key={sub.id}
                className="glass-card p-5 rounded-[10px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="glass-pill text-[11px] font-mono text-[#D4D4D4] px-2 py-0.5 rounded-[4px]">
                      v{sub.version}.0
                    </span>
                    <span className="text-[11px] capitalize text-[#A1A1A1] font-mono">
                      {sub.content_type.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">{sub.title}</h3>
                  {sub.raw_text && (
                    <p className="text-xs text-[#A1A1A1] line-clamp-1 font-mono">
                      {sub.raw_text}
                    </p>
                  )}
                  <span className="text-[10px] text-[#777777] font-mono block">
                    Created: {formatDate(sub.created_at)}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[#777777] block font-semibold">Governance Score</span>
                    <span className="font-mono font-bold text-xl text-white">
                      {score.toFixed(1)} <span className="text-[10px] text-[#777777] font-normal">/ 100</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/trust-passport/${sub.id}`}
                      className="glass-button px-3.5 py-1.5 rounded-[6px] text-white text-xs font-semibold font-mono flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Trust Passport</span>
                    </Link>
                    <Link
                      href={`/dashboard/review/${sub.id}`}
                      className="glass-button px-3 py-1.5 rounded-[6px] text-[#D4D4D4] text-xs font-semibold font-mono"
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
