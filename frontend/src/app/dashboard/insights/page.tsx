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
      <div className="p-16 text-center text-xs font-mono text-[#77738F] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-[#5B4BFF] animate-pulse" />
        <span>Aggregating Enterprise Governance Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-[#17143A]">
      {/* Header - Glassmorphic Analytics Banner */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[16px] border border-[#E5E1F2] bg-white/85 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-2xl">
        <div className="space-y-1.5 z-10">
          <div className="glass-pill inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#5B4BFF] px-2.5 py-1 rounded-[6px] bg-[#E6E0FF] border border-[#5B4BFF]/25 font-bold">
            <BarChart3 className="w-3.5 h-3.5 text-[#5B4BFF]" />
            <span>ADAPTIVE BRAND INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
            Governance Insights & Policy Analytics
          </h1>
          <p className="text-xs text-[#77738F] max-w-2xl font-normal leading-relaxed">
            Real telemetry derived from all evaluated content. Identify recurring brand slips, vocabulary deviations, and guideline gaps to iteratively fortify your Brand DNA.
          </p>
        </div>

        <div className="glass-card flex items-center space-x-4 p-4 rounded-[12px] border border-[#5B4BFF]/20 bg-[#F0EDFF]/80 z-10 shadow-md">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#77738F] font-semibold">Overall Compliance</span>
            <p className="text-2xl font-mono font-bold text-[#0D0B2D] tracking-tight">{insights.overall_compliance_rate}%</p>
          </div>
          <div className="w-px h-8 bg-[#E5E1F2]" />
          <div>
            <span className="text-[10px] uppercase font-mono text-[#77738F] font-semibold">Approval Rate</span>
            <p className="text-2xl font-mono font-bold text-[#5B4BFF] tracking-tight">{insights.approved_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Top 3 Analytical Columns - Glass Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Most Frequent Violations */}
        <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
          <div className="flex items-center space-x-2 text-[#0D0B2D]">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Top Brand Violations</h3>
          </div>
          <p className="text-xs text-[#77738F] font-normal">
            Most frequent issues detected during automated RAG evaluation.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.top_violations.map((v, i) => (
              <div key={i} className="glass-card p-3 rounded-[10px] border border-[#E5E1F2] bg-white/90 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0D0B2D] truncate max-w-[180px]">{v.issue_title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-red-50 border border-red-200 text-red-700 font-bold">
                    {v.count} flags
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#77738F] font-mono">
                  <span className="capitalize">{v.category.replace('_', ' ')}</span>
                  <span className="uppercase text-[10px] text-amber-600 font-semibold">{v.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Terminology Slip Leaderboard */}
        <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
          <div className="flex items-center space-x-2 text-[#0D0B2D]">
            <Hash className="w-4 h-4 text-[#5B4BFF]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Vocabulary Slip Leaderboard</h3>
          </div>
          <p className="text-xs text-[#77738F] font-normal">
            Prohibited or non-compliant terminology most commonly used by copywriters.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.frequent_terminology_mistakes.map((t, i) => (
              <div key={i} className="glass-card p-3 rounded-[10px] border border-[#E5E1F2] bg-white/90 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#0D0B2D] font-bold">&apos;{t.prohibited_term}&apos;</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#E6E0FF] text-[#5B4BFF] font-bold shadow-sm border border-[#5B4BFF]/20">
                    {t.occurrence_count} flagged
                  </span>
                </div>
                {t.replacement_suggestion && (
                  <p className="text-[11px] text-[#77738F] font-mono truncate">
                    Replace: <span className="text-[#5B4BFF] font-semibold">{t.replacement_suggestion}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recurring Unverified Claims */}
        <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
          <div className="flex items-center space-x-2 text-[#0D0B2D]">
            <FileCheck className="w-4 h-4 text-[#5B4BFF]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Recurring Unverified Claims</h3>
          </div>
          <p className="text-xs text-[#77738F] font-normal">
            Claims lacking supporting evidence in Brand DNA.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.recurring_unverified_claims.map((c, i) => (
              <div key={i} className="glass-card p-3 rounded-[10px] border border-[#E5E1F2] bg-white/90 space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0D0B2D] truncate max-w-[170px]">&ldquo;{c.claim_text}&rdquo;</span>
                  <span className="glass-pill text-[10px] font-mono px-2 py-0.5 rounded-[4px] text-amber-800 bg-amber-50 border border-amber-200 font-bold">
                    {c.classification}
                  </span>
                </div>
                {c.suggested_fix && (
                  <p className="text-[11px] text-[#77738F] font-mono line-clamp-1">{c.suggested_fix}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Adaptive Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Issue Distribution by Governance Pillar</h3>
          <div className="space-y-3.5">
            {insights.category_breakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0D0B2D] font-medium">{cat.category_name}</span>
                  <span className="text-[#77738F]">{cat.total_issues} issues ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full glass-inner overflow-hidden border border-[#E5E1F2] bg-[#F7F8FF]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5B4BFF] to-[#A78BFA] shadow-[0_0_8px_rgba(91,75,255,0.4)]"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Policy Recommendation Box */}
        <div className="glass-card-elevated p-6 rounded-[14px] border border-[#E5E1F2] bg-white/85 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-[#0D0B2D]">
            <Sparkles className="w-4 h-4 text-[#5B4BFF]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Adaptive Policy Recommendations</h3>
          </div>
          <p className="text-xs text-[#77778F] leading-relaxed font-normal">
            Based on recent submission patterns, AUREX AI recommends the following policy updates:
          </p>

          <div className="space-y-3 text-xs">
            <div className="glass-inner p-3.5 rounded-[10px] border border-[#E5E1F2] bg-[#F7F8FF] flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BFF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0D0B2D] block font-bold">Add Sub-second Latency SLA to Brand Facts</strong>
                <span className="text-[#77738F] text-[11px] leading-relaxed">Multiple writers cite &lt;420ms finality. Adding official network benchmarks to Brand Facts will turn these from UNVERIFIED to SUPPORTED.</span>
              </div>
            </div>

            <div className="glass-inner p-3.5 rounded-[10px] border border-[#E5E1F2] bg-[#F7F8FF] flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B4BFF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0D0B2D] block font-bold">Enforce &apos;Digital Asset Liquidity Unit&apos; Rule</strong>
                <span className="text-[#77738F] text-[11px] leading-relaxed">Repeated usage of retail crypto terms indicates a training gap among junior copywriters.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
