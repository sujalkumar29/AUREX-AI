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
      <div className="p-16 text-center text-xs font-mono text-teal-muted flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-signal-emerald animate-pulse" />
        <span>Aggregating Enterprise Governance Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[6px] bg-slate-deep border border-silver/15 relative overflow-hidden shadow-elevation">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-teal-muted">
            <BarChart3 className="w-3.5 h-3.5 text-signal-emerald" />
            <span>ADAPTIVE BRAND INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
            Governance Insights & Policy Analytics
          </h1>
          <p className="text-xs text-silver/80 max-w-2xl font-normal leading-relaxed">
            Real telemetry derived from all evaluated content. Identify recurring brand slips, vocabulary deviations, and guideline gaps to iteratively fortify your Brand DNA.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-midnight p-4 rounded-[4px] border border-silver/15 z-10">
          <div>
            <span className="text-[10px] uppercase font-mono text-silver/60">Overall Compliance</span>
            <p className="text-2xl font-mono font-bold text-signal-emerald">{insights.overall_compliance_rate}%</p>
          </div>
          <div className="w-px h-8 bg-silver/10" />
          <div>
            <span className="text-[10px] uppercase font-mono text-silver/60">Approval Rate</span>
            <p className="text-2xl font-mono font-bold text-offwhite">{insights.approved_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Top 3 Analytical Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Most Frequent Violations */}
        <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
          <div className="flex items-center space-x-2 text-signal-crimson">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite font-bold">Top Brand Violations</h3>
          </div>
          <p className="text-xs text-silver/70 font-normal">
            Most frequent issues detected during automated RAG evaluation.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.top_violations.map((v, i) => (
              <div key={i} className="p-3 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-offwhite truncate max-w-[180px]">{v.issue_title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-signal-crimsonLight text-signal-crimson font-bold">
                    {v.count} flags
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-silver/60 font-mono">
                  <span className="capitalize">{v.category.replace('_', ' ')}</span>
                  <span className="uppercase text-[10px]">{v.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Terminology Slip Leaderboard */}
        <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
          <div className="flex items-center space-x-2 text-signal-amber">
            <Hash className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite font-bold">Vocabulary Slip Leaderboard</h3>
          </div>
          <p className="text-xs text-silver/70 font-normal">
            Prohibited or non-compliant terminology most commonly used by copywriters.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.frequent_terminology_mistakes.map((t, i) => (
              <div key={i} className="p-3 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-signal-crimson font-bold">&apos;{t.prohibited_term}&apos;</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-signal-amberLight text-signal-amber font-bold">
                    {t.occurrence_count} flagged
                  </span>
                </div>
                {t.replacement_suggestion && (
                  <p className="text-[11px] text-teal-muted font-mono truncate">
                    Replace: {t.replacement_suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recurring Unverified Claims */}
        <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
          <div className="flex items-center space-x-2 text-teal-muted">
            <FileCheck className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite font-bold">Recurring Unverified Claims</h3>
          </div>
          <p className="text-xs text-silver/70 font-normal">
            Claims lacking supporting evidence in Brand DNA.
          </p>
          <div className="space-y-2.5 pt-1">
            {insights.recurring_unverified_claims.map((c, i) => (
              <div key={i} className="p-3 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-offwhite truncate max-w-[170px]">&ldquo;{c.claim_text}&rdquo;</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-signal-amberLight text-signal-amber font-bold">
                    {c.classification}
                  </span>
                </div>
                {c.suggested_fix && (
                  <p className="text-[11px] text-silver/60 font-mono line-clamp-1">{c.suggested_fix}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Adaptive Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
          <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite font-bold">Issue Distribution by Governance Pillar</h3>
          <div className="space-y-3">
            {insights.category_breakdown.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-silver">{cat.category_name}</span>
                  <span className="text-silver/60">{cat.total_issues} issues ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-midnight overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-muted"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Policy Recommendation Box */}
        <div className="p-6 rounded-[6px] bg-slate-deep border border-teal-muted/30 space-y-4 shadow-elevation">
          <div className="flex items-center space-x-2 text-teal-muted">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite font-bold">Adaptive Policy Recommendations</h3>
          </div>
          <p className="text-xs text-silver/80 leading-relaxed font-normal">
            Based on recent submission patterns, AUREX AI recommends the following policy updates:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-offwhite block font-bold">Add Sub-second Latency SLA to Brand Facts</strong>
                <span className="text-silver/70 text-[11px] leading-relaxed">Multiple writers cite &lt;420ms finality. Adding official network benchmarks to Brand Facts will turn these from UNVERIFIED to SUPPORTED.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-offwhite block font-bold">Enforce &apos;Digital Asset Liquidity Unit&apos; Rule</strong>
                <span className="text-silver/70 text-[11px] leading-relaxed">Repeated usage of retail crypto terms indicates a training gap among junior copywriters.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
