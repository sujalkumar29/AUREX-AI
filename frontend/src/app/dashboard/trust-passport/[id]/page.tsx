"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  User,
  Info,
  Activity,
  Layers,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";
import { TrustPassportDetail, Finding } from "@/types";
import { getStatusColor, formatDate } from "@/lib/utils";

export default function TrustPassportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [passport, setPassport] = useState<TrustPassportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});
  const [isRevising, setIsRevising] = useState(false);

  useEffect(() => {
    if (submissionId) {
      api.getTrustPassport(submissionId)
        .then(setPassport)
        .catch((e) => console.error("Error loading passport:", e))
        .finally(() => setLoading(false));
    }
  }, [submissionId]);

  const handleApplyFix = async (finding: Finding) => {
    if (!passport || !finding.suggested_correction || !passport.raw_text) return;
    setIsRevising(true);

    try {
      let updatedText = passport.raw_text;
      if (updatedText.includes(finding.detected_text)) {
        let repl = finding.suggested_correction;
        const match = repl.match(/'([^']+)'/);
        if (match) {
          repl = match[1];
        }
        updatedText = updatedText.replace(finding.detected_text, repl);
      }

      await api.reviseSubmission(passport.submission_id, {
        raw_text: updatedText,
      });

      setAppliedFixes((prev) => ({ ...prev, [finding.id]: true }));
      const freshPassport = await api.getTrustPassport(submissionId);
      setPassport(freshPassport);
    } catch (e) {
      console.error("Failed to apply fix:", e);
    } finally {
      setIsRevising(false);
    }
  };

  const handlePdfDownload = () => {
    window.open(api.getTrustPassportPdfUrl(submissionId), "_blank");
  };

  if (loading || !passport) {
    return (
      <div className="p-16 text-center text-xs font-mono text-teal-muted flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-signal-emerald animate-pulse" />
        <span>Synthesizing Cryptographic Trust Passport from Evidence Vault...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-silver/60">
          <Link href="/dashboard/submissions" className="hover:text-offwhite transition-colors">
            Submissions
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-offwhite font-bold">Trust Passport</span>
          <span className="text-silver/40">[{passport.submission_id.substring(0, 8)}]</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/review/${passport.submission_id}`}
            className="px-4 py-2 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/20 text-offwhite text-xs font-bold font-mono transition-colors flex items-center space-x-2"
          >
            <User className="w-3.5 h-3.5 text-teal-muted" />
            <span>Review & Approve</span>
          </Link>
          <button
            onClick={handlePdfDownload}
            className="px-4 py-2 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors shadow-technical flex items-center space-x-2"
          >
            <Download className="w-3.5 h-3.5 text-midnight" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Header Card */}
      <div className="p-6 md:p-8 rounded-[6px] bg-slate-deep border border-silver/20 shadow-elevation relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-silver/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-[2px] text-xs font-mono uppercase font-bold border ${getStatusColor(passport.overall_status)}`}>
                GOVERNANCE STATUS: {passport.overall_status}
              </span>
              <span className="text-[11px] font-mono text-silver/60 px-2 py-0.5 rounded-[2px] bg-charcoal border border-silver/10">
                v{passport.version}.0
              </span>
              <span className="text-[11px] font-mono text-teal-muted px-2 py-0.5 rounded-[2px] bg-midnight border border-teal-muted/30">
                MODE: {passport.execution_mode.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
              {passport.submission_title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-silver/70">
              <span>Brand: <strong className="text-offwhite">{passport.brand.name}</strong></span>
              <span>•</span>
              <span>Author: <strong className="text-offwhite">{passport.creator_name}</strong></span>
              <span>•</span>
              <span>Evaluated: <strong>{formatDate(passport.analyzed_at)}</strong></span>
            </div>
          </div>

          {/* Governance Score Badge */}
          <div className="flex items-center space-x-4 bg-midnight p-4 rounded-[4px] border border-silver/15">
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono tracking-wider text-silver/60">
                Governance Index
              </p>
              <p className={`text-4xl font-mono font-extrabold ${passport.governance_score >= 90 ? "text-signal-emerald" : passport.governance_score >= 70 ? "text-signal-amber" : "text-signal-crimson"}`}>
                {passport.governance_score.toFixed(1)}
                <span className="text-xs text-silver/50 font-normal"> / 100</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-[4px] bg-charcoal border border-teal-muted/40 text-offwhite flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-teal-muted" />
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-silver/60">Brand Voice</span>
            <p className="text-xl font-bold font-mono text-offwhite">{passport.brand_voice_score}%</p>
            <p className="text-[11px] text-silver/60">Tone & personality</p>
          </div>
          <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-silver/60">Terminology</span>
            <p className="text-xl font-bold font-mono text-offwhite">{passport.terminology_score}%</p>
            <p className="text-[11px] text-silver/60">Approved vocabulary</p>
          </div>
          <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-silver/60">Claim Integrity</span>
            <p className="text-xl font-bold font-mono text-offwhite">{passport.claim_integrity_score}%</p>
            <p className="text-[11px] text-silver/60">Grounding & facts</p>
          </div>
          <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-silver/60">Visual Standards</span>
            <p className="text-xl font-bold font-mono text-offwhite">{passport.visual_compliance_score}%</p>
            <p className="text-[11px] text-silver/60">Palette & contrast</p>
          </div>
        </div>
      </div>

      {/* Evaluated Copy Viewer */}
      {passport.raw_text && (
        <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-3 shadow-elevation">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-teal-muted" />
              <span>Evaluated Content Draft</span>
            </h3>
            <span className="text-[11px] text-silver/60 font-mono">VERSION: {passport.version}.0</span>
          </div>
          <div className="p-4 rounded-[4px] bg-midnight border border-silver/15 text-xs text-silver font-mono leading-relaxed whitespace-pre-wrap">
            {passport.raw_text}
          </div>
        </div>
      )}

      {/* Claim Verification Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-offwhite">
              Three-Tier Claim Verification Matrix
            </h2>
            <p className="text-xs text-silver/60 font-mono">
              Factual assertions cross-examined against official Brand DNA
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-[2px] bg-signal-emeraldLight text-signal-emerald border border-signal-emerald/30 font-bold">
              {passport.supported_claims} Supported
            </span>
            <span className="px-2.5 py-0.5 rounded-[2px] bg-signal-crimsonLight text-signal-crimson border border-signal-crimson/30 font-bold">
              {passport.conflicting_claims} Conflicting
            </span>
            <span className="px-2.5 py-0.5 rounded-[2px] bg-signal-amberLight text-signal-amber border border-signal-amber/30 font-bold">
              {passport.unverified_claims} Unverified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {passport.claims_matrix.length === 0 ? (
            <div className="p-6 rounded-[4px] bg-slate-deep border border-silver/15 text-center text-xs text-silver/60 font-mono">
              No quantitative or superlative claims detected in this copy.
            </div>
          ) : (
            passport.claims_matrix.map((c, idx) => {
              const isSupported = c.classification === "SUPPORTED";
              const isConflicting = c.classification === "CONFLICTING";
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-[4px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                    isSupported
                      ? "bg-slate-deep border-teal-muted/40"
                      : isConflicting
                      ? "bg-slate-deep border-signal-crimson/40"
                      : "bg-slate-deep border-signal-amber/40"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold uppercase ${
                        isSupported
                          ? "bg-signal-emeraldLight text-signal-emerald"
                          : isConflicting
                          ? "bg-signal-crimsonLight text-signal-crimson"
                          : "bg-signal-amberLight text-signal-amber"
                      }`}>
                        {c.classification}
                      </span>
                      <span className="text-xs font-semibold text-offwhite">&ldquo;{c.statement}&rdquo;</span>
                    </div>
                    <p className="text-xs text-silver leading-relaxed">{c.explanation}</p>
                    {c.supporting_source && (
                      <p className="text-[11px] text-teal-muted font-mono flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Source: {c.supporting_source}</span>
                      </p>
                    )}
                  </div>

                  {c.suggested_correction && (
                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className="text-[11px] text-silver bg-midnight px-3 py-1.5 rounded-[2px] border border-silver/15 max-w-xs text-left font-mono">
                        {c.suggested_correction}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed Traceable Findings & One-Click Corrections */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-offwhite">
            Traceable Findings & Suggested Corrections
          </h2>
          <p className="text-xs text-silver/60 font-mono">
            Directly apply approved corrections to your draft with 1-click
          </p>
        </div>

        <div className="space-y-3">
          {passport.findings.map((finding) => {
            const isApplied = appliedFixes[finding.id];
            return (
              <div
                key={finding.id}
                className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-3 hover:border-teal-muted/40 transition-all shadow-elevation"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold ${
                      finding.severity === "critical"
                        ? "bg-signal-crimsonLight text-signal-crimson"
                        : finding.severity === "warning"
                        ? "bg-signal-amberLight text-signal-amber"
                        : "bg-teal-muted/20 text-teal-muted"
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs uppercase font-mono text-silver/60">
                      {finding.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-offwhite">
                      {finding.issue_title}
                    </span>
                  </div>

                  {finding.evidence_source && (
                    <span className="text-[10px] text-teal-muted font-mono flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-muted" />
                      <span>{finding.evidence_source}</span>
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-[4px] bg-midnight border border-silver/10 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-silver/50">Flagged Passage:</span>
                  <p className="text-xs text-signal-amber font-mono">&ldquo;{finding.detected_text}&rdquo;</p>
                </div>

                <p className="text-xs text-silver leading-relaxed">
                  {finding.explanation}
                </p>

                {finding.suggested_correction && (
                  <div className="p-3 rounded-[4px] bg-charcoal border border-teal-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-teal-muted font-mono">Suggested Phrasing: </span>
                      <span className="text-offwhite font-mono">{finding.suggested_correction}</span>
                    </div>

                    <button
                      onClick={() => handleApplyFix(finding)}
                      disabled={isApplied || isRevising}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                        isApplied
                          ? "bg-signal-emerald text-offwhite"
                          : "bg-offwhite text-midnight hover:bg-silver"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Correction Applied</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply Correction</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Governance Disclaimer */}
      <div className="p-4 rounded-[4px] bg-charcoal border border-silver/15 flex items-start space-x-3 text-xs text-silver/70">
        <Info className="w-4 h-4 text-teal-muted flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-offwhite font-mono uppercase text-[10px]">Governance Policy Disclaimer</p>
          <p className="leading-relaxed">{passport.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
