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
      <div className="p-16 text-center text-xs font-mono text-[#A1A1A1] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-white animate-pulse" />
        <span>Synthesizing Cryptographic Trust Passport from Evidence Vault...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-[#F5F5F5]">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#777777]">
          <Link href="/dashboard/submissions" className="hover:text-white transition-colors">
            Submissions
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold">Trust Passport</span>
          <span className="text-[#A1A1A1]">[{passport.submission_id.substring(0, 8)}]</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/review/${passport.submission_id}`}
            className="glass-button px-4 py-2 rounded-[6px] text-white text-xs font-bold font-mono transition-all flex items-center space-x-2 shadow-lg"
          >
            <User className="w-3.5 h-3.5 text-white" />
            <span>Review & Approve</span>
          </Link>
          <button
            onClick={handlePdfDownload}
            className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] flex items-center space-x-2 font-mono"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Header Card - Floating Glassmorphic Certificate */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[14px] border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-[4px] text-xs font-mono uppercase font-bold border ${getStatusColor(passport.overall_status)}`}>
                GOVERNANCE STATUS: {passport.overall_status.replace('_', ' ')}
              </span>
              <span className="glass-pill text-[11px] font-mono text-[#D4D4D4] px-2 py-0.5 rounded-[4px]">
                v{passport.version}.0
              </span>
              <span className="glass-pill text-[11px] font-mono text-white px-2 py-0.5 rounded-[4px]">
                MODE: {passport.execution_mode.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {passport.submission_title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A1A1A1]">
              <span>Brand: <strong className="text-white">{passport.brand.name}</strong></span>
              <span>•</span>
              <span>Author: <strong className="text-white">{passport.creator_name}</strong></span>
              <span>•</span>
              <span>Evaluated: <strong>{formatDate(passport.analyzed_at)}</strong></span>
            </div>
          </div>

          {/* Governance Score Badge */}
          <div className="glass-card flex items-center space-x-4 p-4 rounded-[10px] border border-white/15 shadow-xl">
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1A1] font-semibold">
                Governance Index
              </p>
              <p className="text-4xl font-mono font-extrabold text-white tracking-tight">
                {passport.governance_score.toFixed(1)}
                <span className="text-xs text-[#777777] font-normal"> / 100</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-[8px] bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6">
          <div className="glass-card p-3.5 rounded-[8px] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#A1A1A1]">Brand Voice</span>
            <p className="text-xl font-bold font-mono text-white">{passport.brand_voice_score}%</p>
            <p className="text-[11px] text-[#777777]">Tone & personality</p>
          </div>
          <div className="glass-card p-3.5 rounded-[8px] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#A1A1A1]">Terminology</span>
            <p className="text-xl font-bold font-mono text-white">{passport.terminology_score}%</p>
            <p className="text-[11px] text-[#777777]">Approved vocabulary</p>
          </div>
          <div className="glass-card p-3.5 rounded-[8px] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#A1A1A1]">Claim Integrity</span>
            <p className="text-xl font-bold font-mono text-white">{passport.claim_integrity_score}%</p>
            <p className="text-[11px] text-[#777777]">Grounding & facts</p>
          </div>
          <div className="glass-card p-3.5 rounded-[8px] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#A1A1A1]">Visual Standards</span>
            <p className="text-xl font-bold font-mono text-white">{passport.visual_compliance_score}%</p>
            <p className="text-[11px] text-[#777777]">Palette & contrast</p>
          </div>
        </div>
      </div>

      {/* Evaluated Copy Viewer */}
      {passport.raw_text && (
        <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Evaluated Content Draft</span>
            </h3>
            <span className="glass-pill text-[11px] text-[#A1A1A1] font-mono px-2 py-0.5 rounded-[4px]">
              VERSION: {passport.version}.0
            </span>
          </div>
          <div className="glass-inner p-4 rounded-[8px] border border-white/10 text-xs text-[#D4D4D4] font-mono leading-relaxed whitespace-pre-wrap">
            {passport.raw_text}
          </div>
        </div>
      )}

      {/* Claim Verification Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">
              Three-Tier Claim Verification Matrix
            </h2>
            <p className="text-xs text-[#A1A1A1] font-mono">
              Factual assertions cross-examined against official Brand DNA
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-[4px] bg-white text-black font-bold shadow-sm">
              {passport.supported_claims} Supported
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#181818] border-2 border-[#D4D4D4] text-white font-bold">
              {passport.conflicting_claims} Conflicting
            </span>
            <span className="glass-pill px-2.5 py-1 rounded-[4px] text-[#A1A1A1]">
              {passport.unverified_claims} Unverified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {passport.claims_matrix.length === 0 ? (
            <div className="glass-panel p-6 rounded-[8px] border border-white/10 text-center text-xs text-[#777777] font-mono">
              No quantitative or superlative claims detected in this copy.
            </div>
          ) : (
            passport.claims_matrix.map((c, idx) => {
              const isSupported = c.classification === "SUPPORTED";
              const isConflicting = c.classification === "CONFLICTING";
              return (
                <div
                  key={idx}
                  className={`glass-card p-4 rounded-[10px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    isSupported
                      ? "border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.06)]"
                      : isConflicting
                      ? "border-2 border-[#D4D4D4]"
                      : "border-white/12"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                        isSupported
                          ? "bg-white text-black shadow-sm"
                          : isConflicting
                          ? "bg-[#181818] border border-white/20 text-white"
                          : "glass-pill text-[#A1A1A1]"
                      }`}>
                        {c.classification}
                      </span>
                      <span className="text-xs font-semibold text-white">&ldquo;{c.statement}&rdquo;</span>
                    </div>
                    <p className="text-xs text-[#A1A1A1] leading-relaxed">{c.explanation}</p>
                    {c.supporting_source && (
                      <p className="text-[11px] text-[#D4D4D4] font-mono flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3 text-white" />
                        <span>Source: {c.supporting_source}</span>
                      </p>
                    )}
                  </div>

                  {c.suggested_correction && (
                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className="glass-inner text-[11px] text-[#D4D4D4] px-3 py-1.5 rounded-[6px] border border-white/10 max-w-xs text-left font-mono">
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
          <h2 className="text-base font-extrabold text-white">
            Traceable Findings & Suggested Corrections
          </h2>
          <p className="text-xs text-[#A1A1A1] font-mono">
            Directly apply approved corrections to your draft with 1-click
          </p>
        </div>

        <div className="space-y-3.5">
          {passport.findings.map((finding) => {
            const isApplied = appliedFixes[finding.id];
            return (
              <div
                key={finding.id}
                className="glass-card p-5 rounded-[12px] border border-white/12 space-y-3.5 hover:border-white/35 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold ${
                      finding.severity === "critical"
                        ? "bg-[#181818] border border-white/30 text-white"
                        : finding.severity === "warning"
                        ? "bg-white/10 border border-white/20 text-white"
                        : "glass-pill text-[#A1A1A1]"
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs uppercase font-mono text-[#A1A1A1]">
                      {finding.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {finding.issue_title}
                    </span>
                  </div>

                  {finding.evidence_source && (
                    <span className="text-[10px] text-[#A1A1A1] font-mono flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      <span>{finding.evidence_source}</span>
                    </span>
                  )}
                </div>

                <div className="glass-inner p-3 rounded-[6px] border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#777777]">Flagged Passage:</span>
                  <p className="text-xs text-white font-mono border-l-2 border-white pl-2">&ldquo;{finding.detected_text}&rdquo;</p>
                </div>

                <p className="text-xs text-[#A1A1A1] leading-relaxed">
                  {finding.explanation}
                </p>

                {finding.suggested_correction && (
                  <div className="glass-inner p-3 rounded-[8px] border border-white/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-bold text-white font-mono">Suggested Phrasing: </span>
                      <span className="text-[#D4D4D4] font-mono">{finding.suggested_correction}</span>
                    </div>

                    <button
                      onClick={() => handleApplyFix(finding)}
                      disabled={isApplied || isRevising}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-all whitespace-nowrap shadow-md ${
                        isApplied
                          ? "bg-white/15 border border-white/40 text-white"
                          : "bg-white text-black hover:bg-[#D4D4D4] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Correction Applied</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-black" />
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
      <div className="glass-inner p-4 rounded-[10px] border border-white/10 flex items-start space-x-3 text-xs text-[#A1A1A1]">
        <Info className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-white font-mono uppercase text-[10px]">Governance Policy Disclaimer</p>
          <p className="leading-relaxed">{passport.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
