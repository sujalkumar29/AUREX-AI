"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Check,
  User,
  Info,
  Activity
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
      <div className="p-16 text-center text-xs font-mono text-[#77738F] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-[#5B4BFF] animate-pulse" />
        <span>Synthesizing Cryptographic Trust Passport from Evidence Vault...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-[#17143A]">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#77738F]">
          <Link href="/dashboard/submissions" className="hover:text-[#5B4BFF] transition-colors">
            Submissions
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0D0B2D] font-bold">Trust Passport</span>
          <span className="text-[#77738F]">[{passport.submission_id.substring(0, 8)}]</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/review/${passport.submission_id}`}
            className="glass-button px-4 py-2 rounded-[8px] text-[#0D0B2D] hover:text-[#5B4BFF] text-xs font-bold font-mono transition-all flex items-center space-x-2 shadow-sm border border-[#E5E1F2] bg-white hover:bg-[#F0EDFF]"
          >
            <User className="w-3.5 h-3.5 text-[#5B4BFF]" />
            <span>Review & Approve</span>
          </Link>
          <button
            onClick={handlePdfDownload}
            className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)] flex items-center space-x-2 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Header Card - Floating Glassmorphic Certificate */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[16px] border border-[#E5E1F2] bg-white/85 shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E1F2]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-[4px] text-xs font-mono uppercase font-bold border ${getStatusColor(passport.overall_status)}`}>
                GOVERNANCE STATUS: {passport.overall_status.replace('_', ' ')}
              </span>
              <span className="glass-pill text-[11px] font-mono text-[#5B4BFF] bg-[#E6E0FF] px-2 py-0.5 rounded-[4px] border border-[#5B4BFF]/20 font-bold">
                v{passport.version}.0
              </span>
              <span className="glass-pill text-[11px] font-mono text-[#77738F] bg-[#F0EDFF] px-2 py-0.5 rounded-[4px] border border-[#E5E1F2]">
                MODE: {passport.execution_mode.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
              {passport.submission_title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#77738F]">
              <span>Brand: <strong className="text-[#0D0B2D]">{passport.brand.name}</strong></span>
              <span>•</span>
              <span>Author: <strong className="text-[#0D0B2D]">{passport.creator_name}</strong></span>
              <span>•</span>
              <span>Evaluated: <strong>{formatDate(passport.analyzed_at)}</strong></span>
            </div>
          </div>

          {/* Governance Score Badge */}
          <div className="glass-card flex items-center space-x-4 p-4 rounded-[12px] border border-[#5B4BFF]/20 bg-[#F0EDFF]/80 shadow-md">
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#77738F] font-semibold">
                Governance Index
              </p>
              <p className="text-4xl font-mono font-extrabold text-[#0D0B2D] tracking-tight">
                {passport.governance_score.toFixed(1)}
                <span className="text-xs text-[#77738F] font-normal"> / 100</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#5B4BFF] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(91,75,255,0.35)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6">
          <div className="glass-card p-3.5 rounded-[10px] border border-[#E5E1F2] bg-white/70 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#77738F] font-semibold">Brand Voice</span>
            <p className="text-xl font-bold font-mono text-[#0D0B2D]">{passport.brand_voice_score}%</p>
            <p className="text-[11px] text-[#77738F]">Tone & personality</p>
          </div>
          <div className="glass-card p-3.5 rounded-[10px] border border-[#E5E1F2] bg-white/70 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#77738F] font-semibold">Terminology</span>
            <p className="text-xl font-bold font-mono text-[#0D0B2D]">{passport.terminology_score}%</p>
            <p className="text-[11px] text-[#77738F]">Approved vocabulary</p>
          </div>
          <div className="glass-card p-3.5 rounded-[10px] border border-[#E5E1F2] bg-white/70 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#77738F] font-semibold">Claim Integrity</span>
            <p className="text-xl font-bold font-mono text-[#0D0B2D]">{passport.claim_integrity_score}%</p>
            <p className="text-[11px] text-[#77738F]">Grounding & facts</p>
          </div>
          <div className="glass-card p-3.5 rounded-[10px] border border-[#E5E1F2] bg-white/70 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#77738F] font-semibold">Visual Standards</span>
            <p className="text-xl font-bold font-mono text-[#0D0B2D]">{passport.visual_compliance_score}%</p>
            <p className="text-[11px] text-[#77738F]">Palette & typography</p>
          </div>
        </div>
      </div>

      {/* Evaluated Copy Viewer */}
      {passport.raw_text && (
        <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-3 shadow-sm bg-white/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] flex items-center space-x-2 font-bold">
              <FileText className="w-3.5 h-3.5 text-[#5B4BFF]" />
              <span>Evaluated Content Draft</span>
            </h3>
            <span className="glass-pill text-[11px] text-[#77738F] font-mono px-2 py-0.5 rounded-[4px] bg-[#F0EDFF] border border-[#E5E1F2]">
              VERSION: {passport.version}.0
            </span>
          </div>
          <div className="glass-inner p-4 rounded-[10px] border border-[#E5E1F2] text-xs text-[#17143A] font-mono leading-relaxed whitespace-pre-wrap bg-[#F7F8FF]">
            {passport.raw_text}
          </div>
        </div>
      )}

      {/* Claim Verification Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#0D0B2D]">
              Three-Tier Claim Verification Matrix
            </h2>
            <p className="text-xs text-[#77738F] font-mono">
              Factual assertions cross-examined against official Brand DNA
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-[6px] bg-[#E6E0FF] text-[#5B4BFF] font-bold shadow-sm border border-[#5B4BFF]/20">
              {passport.supported_claims} Supported
            </span>
            <span className="px-2.5 py-1 rounded-[6px] bg-red-50 border border-red-200 text-red-700 font-bold">
              {passport.conflicting_claims} Conflicting
            </span>
            <span className="glass-pill px-2.5 py-1 rounded-[6px] text-[#77738F] bg-[#F0EDFF] border border-[#E5E1F2]">
              {passport.unverified_claims} Unverified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {passport.claims_matrix.length === 0 ? (
            <div className="glass-panel p-6 rounded-[10px] border border-[#E5E1F2] text-center text-xs text-[#77738F] font-mono bg-white/60">
              No quantitative or superlative claims detected in this copy.
            </div>
          ) : (
            passport.claims_matrix.map((c, idx) => {
              const isSupported = c.classification === "SUPPORTED";
              const isConflicting = c.classification === "CONFLICTING";
              return (
                <div
                  key={idx}
                  className={`glass-card p-4 rounded-[12px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    isSupported
                      ? "border-[#5B4BFF]/30 bg-[#F0EDFF]/40 shadow-sm"
                      : isConflicting
                      ? "border-red-200 bg-red-50/40"
                      : "border-[#E5E1F2] bg-white/80"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                        isSupported
                          ? "bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/30"
                          : isConflicting
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "glass-pill text-[#77738F] bg-[#F0EDFF] border border-[#E5E1F2]"
                      }`}>
                        {c.classification}
                      </span>
                      <span className="text-xs font-semibold text-[#0D0B2D]">&ldquo;{c.statement}&rdquo;</span>
                    </div>
                    <p className="text-xs text-[#77738F] leading-relaxed">{c.explanation}</p>
                    {c.supporting_source && (
                      <p className="text-[11px] text-[#5B4BFF] font-mono flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3 text-[#5B4BFF]" />
                        <span>Source: {c.supporting_source}</span>
                      </p>
                    )}
                  </div>

                  {c.suggested_correction && (
                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className="glass-inner text-[11px] text-[#0D0B2D] px-3 py-1.5 rounded-[8px] border border-[#E5E1F2] max-w-xs text-left font-mono bg-white">
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
          <h2 className="text-base font-extrabold text-[#0D0B2D]">
            Traceable Findings & Suggested Corrections
          </h2>
          <p className="text-xs text-[#77738F] font-mono">
            Directly apply approved corrections to your draft with 1-click
          </p>
        </div>

        <div className="space-y-3.5">
          {passport.findings.map((finding) => {
            const isApplied = appliedFixes[finding.id];
            return (
              <div
                key={finding.id}
                className="glass-card p-5 rounded-[14px] border border-[#E5E1F2] bg-white/85 space-y-3.5 hover:border-[#5B4BFF]/40 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold ${
                      finding.severity === "critical"
                        ? "bg-red-50 border border-red-200 text-red-700"
                        : finding.severity === "warning"
                        ? "bg-amber-50 border border-amber-200 text-amber-700"
                        : "glass-pill text-[#77738F] bg-[#F0EDFF] border border-[#E5E1F2]"
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs uppercase font-mono text-[#77738F]">
                      {finding.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-[#0D0B2D]">
                      {finding.issue_title}
                    </span>
                  </div>

                  {finding.evidence_source && (
                    <span className="text-[10px] text-[#5B4BFF] font-mono flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5B4BFF]" />
                      <span>{finding.evidence_source}</span>
                    </span>
                  )}
                </div>

                <div className="glass-inner p-3 rounded-[8px] border border-[#E5E1F2] bg-[#F7F8FF] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#77738F]">Flagged Passage:</span>
                  <p className="text-xs text-[#0D0B2D] font-mono border-l-2 border-[#5B4BFF] pl-2">&ldquo;{finding.detected_text}&rdquo;</p>
                </div>

                <p className="text-xs text-[#77738F] leading-relaxed">
                  {finding.explanation}
                </p>

                {finding.suggested_correction && (
                  <div className="glass-inner p-3 rounded-[10px] border border-[#E5E1F2] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-[#0D0B2D] font-mono">Suggested Phrasing: </span>
                      <span className="text-[#5B4BFF] font-mono font-medium">{finding.suggested_correction}</span>
                    </div>

                    <button
                      onClick={() => handleApplyFix(finding)}
                      disabled={isApplied || isRevising}
                      className={`px-3.5 py-1.5 rounded-[8px] text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-all whitespace-nowrap shadow-sm ${
                        isApplied
                          ? "bg-[#E6E0FF] border border-[#5B4BFF]/30 text-[#5B4BFF]"
                          : "bg-[#5B4BFF] text-white hover:bg-[#4d3df5] shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#5B4BFF]" />
                          <span>Correction Applied</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-white" />
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
      <div className="glass-inner p-4 rounded-[12px] border border-[#E5E1F2] bg-[#F0EDFF]/80 flex items-start space-x-3 text-xs text-[#77738F]">
        <Info className="w-4 h-4 text-[#5B4BFF] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-[#0D0B2D] font-mono uppercase text-[10px]">Governance Policy Disclaimer</p>
          <p className="leading-relaxed">{passport.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
