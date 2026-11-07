"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Hash,
  FileCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Activity,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";
import { GovernanceInsights } from "@/types";

export default function GovernanceInsightsPage() {
  const [insights, setInsights] = useState<GovernanceInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInsights()
      .then(setInsights)
      .catch((e) => console.error("Error loading insights:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !insights) {
    return (
      <div className="p-16 text-center text-xs font-mono text-[#A1A1A1] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-white animate-pulse" />
        <span>Aggregating Enterprise Governance Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-[#F5F5F5]">
      {/* Header - Glassmorphic Analytics Banner */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[14px] border border-white/18 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-2xl">
        <div className="space-y-1.5 z-10">
          <div className="glass-pill inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#D4D4D4] px-2.5 py-1 rounded-[4px]">
            <BarChart3 className="w-3.5 h-3.5 text-white" />
            <span>ADAPTIVE BRAND INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Governance Insights & Policy Analytics
          </h1>
          <p className="text-xs text-[#A1A1A1] max-w-2xl font-normal leading-relaxed">
            Real telemetry derived from all evaluated content. Identify recurring brand slips, vocabulary deviations, and guideline gaps to iteratively fortify your Brand DNA.
          </p>
        </div>

        <div className="glass-card flex items-center space-x-4 p-4 rounded-[10px] border border-white/15 z-10 shadow-xl">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#A1A1A1] font-semibold">Overall Compliance</span>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">{insights.overall_compliance_rate}%</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-[10px] uppercase font-mono text-[#A1A1A1] font-semibold">Approval Rate</span>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">{insights.approved_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Top 3 Analytical Columns - Glass Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Most Frequent Violations */}
        <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-white">
            <AlertTriangle className="w-4 h-4 text-white" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Top Brand Violations</h3>
          </div>
          <p className="text-xs text-[#A1A1A1] font-normal">
            Most frequent issues detected during automated RAG evaluation.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.top_violations.map((v, i) => (
              <div key={i} className="glass-card p-3 rounded-[8px] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[180px]">{v.issue_title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#181818] border border-white/15 text-white font-bold">
                    {v.count} flags
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#A1A1A1] font-mono">
                  <span className="capitalize">{v.category.replace('_', ' ')}</span>
                  <span className="uppercase text-[10px]">{v.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Terminology Slip Leaderboard */}
        <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-white">
            <Hash className="w-4 h-4 text-white" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Vocabulary Slip Leaderboard</h3>
          </div>
          <p className="text-xs text-[#A1A1A1] font-normal">
            Prohibited or non-compliant terminology most commonly used by copywriters.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.frequent_terminology_mistakes.map((t, i) => (
              <div key={i} className="glass-card p-3 rounded-[8px] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-white font-bold">&apos;{t.prohibited_term}&apos;</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-white text-black font-bold shadow-sm">
                    {t.occurrence_count} flagged
                  </span>
                </div>
                {t.replacement_suggestion && (
                  <p className="text-[11px] text-[#D4D4D4] font-mono truncate">
                    Replace: <span className="text-white font-semibold">{t.replacement_suggestion}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recurring Unverified Claims */}
        <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-white">
            <FileCheck className="w-4 h-4 text-white" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Recurring Unverified Claims</h3>
          </div>
          <p className="text-xs text-[#A1A1A1] font-normal">
            Claims lacking supporting evidence in Brand DNA.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.recurring_unverified_claims.map((c, i) => (
              <div key={i} className="glass-card p-3 rounded-[8px] border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[170px]">&ldquo;{c.claim_text}&rdquo;</span>
                  <span className="glass-pill text-[10px] font-mono px-2 py-0.5 rounded-[4px] text-[#D4D4D4] font-bold">
                    {c.classification}
                  </span>
                </div>
                {c.suggested_fix && (
                  <p className="text-[11px] text-[#A1A1A1] font-mono line-clamp-1">{c.suggested_fix}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Adaptive Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Issue Distribution by Governance Pillar</h3>
          <div className="space-y-3.5">
            {insights.category_breakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D4D4D4]">{cat.category_name}</span>
                  <span className="text-[#A1A1A1]">{cat.total_issues} issues ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full glass-inner overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Policy Recommendation Box */}
        <div className="glass-card-elevated p-6 rounded-[12px] border border-white/18 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-white">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Adaptive Policy Recommendations</h3>
          </div>
          <p className="text-xs text-[#A1A1A1] leading-relaxed font-normal">
            Based on recent submission patterns, AUREX AI recommends the following policy updates:
          </p>

          <div className="space-y-3 text-xs">
            <div className="glass-inner p-3.5 rounded-[8px] border border-white/10 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Add Sub-second Latency SLA to Brand Facts</strong>
                <span className="text-[#A1A1A1] text-[11px] leading-relaxed">Multiple writers cite &lt;420ms finality. Adding official network benchmarks to Brand Facts will turn these from UNVERIFIED to SUPPORTED.</span>
              </div>
            </div>

            <div className="glass-inner p-3.5 rounded-[8px] border border-white/10 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Enforce &apos;Digital Asset Liquidity Unit&apos; Rule</strong>
                <span className="text-[#A1A1A1] text-[11px] leading-relaxed">Repeated usage of retail crypto terms indicates a training gap among junior copywriters.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
