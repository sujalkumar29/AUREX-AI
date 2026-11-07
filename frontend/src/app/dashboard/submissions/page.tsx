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
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
            Brand Content Submissions
          </h1>
          <p className="text-xs text-silver/70 font-mono">
            Audited copy drafts, campaigns, documents, and creative assets
          </p>
        </div>
        <Link
          href="/dashboard/submissions/new"
          className="px-4 py-2 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors shadow-technical flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4 text-midnight" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-[6px] bg-slate-deep border border-silver/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-elevation">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-silver/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-[4px] bg-charcoal border border-silver/20 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {["all", "ready_for_review", "changes_required", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? "bg-midnight text-teal-muted font-bold border border-teal-muted/40"
                  : "bg-charcoal text-silver/60 hover:text-offwhite"
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-teal-muted flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4 text-signal-emerald animate-pulse" />
            <span>Loading Submissions Database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-[6px] bg-slate-deep border border-silver/15 text-center text-xs text-silver/60 font-mono">
            No submissions found matching your query.
          </div>
        ) : (
          filtered.map((sub) => {
            const score = sub.latest_analysis?.overall_score || 0;
            return (
              <div
                key={sub.id}
                className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 hover:border-teal-muted/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-elevation"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(sub.status)}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-silver/60 bg-charcoal px-2 py-0.5 rounded-[2px] border border-silver/10">
                      v{sub.version}.0
                    </span>
                    <span className="text-[11px] capitalize text-teal-muted font-mono">
                      {sub.content_type.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-offwhite">{sub.title}</h3>
                  {sub.raw_text && (
                    <p className="text-xs text-silver/70 line-clamp-1 font-mono">
                      {sub.raw_text}
                    </p>
                  )}
                  <span className="text-[10px] text-silver/50 font-mono block">
                    Created: {formatDate(sub.created_at)}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-silver/60 block">Governance Score</span>
                    <span className={`font-mono font-bold text-xl ${score >= 90 ? "text-signal-emerald" : score >= 70 ? "text-signal-amber" : "text-signal-crimson"}`}>
                      {score.toFixed(1)} <span className="text-[10px] text-silver/50 font-normal">/ 100</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/trust-passport/${sub.id}`}
                      className="px-3.5 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/20 hover:border-teal-muted text-teal-muted text-xs font-semibold font-mono transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Trust Passport</span>
                    </Link>
                    <Link
                      href={`/dashboard/review/${sub.id}`}
                      className="px-3 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/20 text-offwhite text-xs font-semibold font-mono transition-colors"
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
