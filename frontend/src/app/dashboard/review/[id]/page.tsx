"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  History,
  Send,
  ChevronRight,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";
import { Submission, TrustPassportDetail, Comment, Review } from "@/types";
import { getStatusColor, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function HumanReviewStationPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  const { user, role } = useAuth();

  const [passport, setPassport] = useState<TrustPassportDetail | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"decision" | "discussion" | "history">("decision");

  const loadData = async () => {
    try {
      const [p, s, c, r, rev] = await Promise.all([
        api.getTrustPassport(submissionId),
        api.getSubmission(submissionId),
        api.getComments(submissionId),
        api.getReviews(submissionId),
        api.getRevisions(submissionId),
      ]);
      setPassport(p);
      setSubmission(s);
      setComments(c);
      setReviews(r);
      setRevisions(rev);
    } catch (e) {
      console.error("Error loading review station:", e);
    }
  };

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const handleReviewAction = async (action: "approve" | "request_changes" | "reject") => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.submitReview({
        submission_id: submissionId,
        action,
        notes: reviewNotes,
      });
      setReviewNotes("");
      setActionSuccess(`Determination "${action.replace('_', ' ')}" recorded successfully.`);
      await loadData();
    } catch (e: any) {
      console.error("Review action error:", e);
      setActionError(e.message || "Failed to record determination");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.addComment({
        submission_id: submissionId,
        content: newComment,
      });
      setNewComment("");
      const updated = await api.getComments(submissionId);
      setComments(updated);
    } catch (e) {
      console.error("Add comment error:", e);
    }
  };

  if (!passport || !submission) {
    return (
      <div className="p-16 text-center text-xs font-mono text-[#77738F] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-[#5B4BFF] animate-pulse" />
        <span>Initializing Sovereign Review Station...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-[#17143A]">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-[#77738F]">
        <Link href="/dashboard/submissions" className="hover:text-[#5B4BFF] transition-colors">
          Submissions
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/dashboard/trust-passport/${submissionId}`} className="hover:text-[#5B4BFF] transition-colors">
          Trust Passport
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0D0B2D] font-bold">Review Station</span>
      </div>

      {/* Header - Glassmorphic Sovereign Banner */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[16px] border border-[#E5E1F2] bg-white/85 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(submission.status)}`}>
                CURRENT STATUS: {submission.status.replace('_', ' ')}
              </span>
              <span className="glass-pill text-xs font-mono text-[#5B4BFF] bg-[#E6E0FF] px-2 py-0.5 rounded-[4px] border border-[#5B4BFF]/20 font-bold">
                v{submission.version}.0
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">{submission.title}</h1>
            <p className="text-xs font-mono text-[#77738F]">
              Author: <strong className="text-[#0D0B2D]">{passport.creator_name}</strong> • Brand: <strong className="text-[#0D0B2D]">{passport.brand.name}</strong>
            </p>
          </div>

          <div className="glass-card p-4 rounded-[12px] border border-[#5B4BFF]/20 bg-[#F0EDFF]/80 text-right shadow-md">
            <p className="text-[10px] uppercase font-mono text-[#77738F] font-semibold">Governance Trust Score</p>
            <p className="text-3xl font-mono font-extrabold text-[#0D0B2D] tracking-tight">
              {passport.governance_score.toFixed(1)} <span className="text-xs text-[#77738F] font-normal">/ 100</span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="glass-pill p-1.5 rounded-[10px] flex space-x-2 pt-1 text-xs font-mono border border-[#E5E1F2] bg-[#F0EDFF]/80 w-fit">
          <button
            onClick={() => setActiveTab("decision")}
            className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "decision" ? "bg-[#5B4BFF] text-white font-bold shadow-sm" : "text-[#77738F] hover:text-[#0D0B2D]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Review Authority</span>
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "discussion" ? "bg-[#5B4BFF] text-white font-bold shadow-sm" : "text-[#77738F] hover:text-[#0D0B2D]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion ({comments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "history" ? "bg-[#5B4BFF] text-white font-bold shadow-sm" : "text-[#77738F] hover:text-[#0D0B2D]"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Revision Diffs ({revisions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Decision Center */}
      {activeTab === "decision" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-3 shadow-sm bg-white/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Submitted Copy Draft</h3>
              <div className="glass-inner p-4 rounded-[10px] border border-[#E5E1F2] text-xs text-[#17143A] font-mono leading-relaxed whitespace-pre-wrap bg-[#F7F8FF]">
                {submission.raw_text}
              </div>
            </div>

            {/* Past Review Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">Review History & Decisions</h3>
              {reviews.length === 0 ? (
                <div className="glass-panel p-4 rounded-[10px] border border-[#E5E1F2] text-xs text-[#77738F] font-mono bg-white/60">
                  No official reviewer determinations recorded yet.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="glass-card p-4 rounded-[12px] border border-[#E5E1F2] bg-white/80 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                          r.action === "approve" 
                            ? "bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/30 shadow-sm" 
                            : r.action === "request_changes" 
                            ? "bg-amber-100 text-amber-800 border border-amber-200" 
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                          {r.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-[#0D0B2D]">by {r.reviewer_name}</span>
                      </div>
                      <span className="text-[11px] text-[#77738F] font-mono">{formatDate(r.created_at)}</span>
                    </div>
                    {r.notes && (
                      <p className="text-xs text-[#17143A] leading-relaxed font-sans italic">&ldquo;{r.notes}&rdquo;</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Station Panel */}
          <div className="glass-card-elevated p-6 rounded-[16px] border border-[#E5E1F2] bg-white/85 space-y-5 h-fit shadow-xl backdrop-blur-2xl">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#5B4BFF] tracking-wider font-semibold">Final Authority</div>
              <h3 className="text-base font-extrabold text-[#0D0B2D]">Human Sovereign Sign-off</h3>
              <p className="text-xs text-[#77738F] leading-relaxed font-normal">
                As a designated brand reviewer, your determination dictates whether this asset is released to market.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
                Determination Notes & Directives
              </label>
              <textarea
                rows={3}
                placeholder="Specify requirements or reason for approval/changes..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="glass-input w-full rounded-[8px] p-3 text-xs placeholder-[#77738F]/60 font-mono bg-white border border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
              />
            </div>

            {actionSuccess && (
              <div className="glass-card p-3 rounded-[8px] border border-[#5B4BFF]/30 bg-[#F0EDFF] text-[#0D0B2D] text-xs font-mono flex items-center space-x-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#5B4BFF]" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="glass-card p-3 rounded-[8px] border-2 border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleReviewAction("approve")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[8px] bg-[#5B4BFF] hover:bg-[#4d3df5] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(91,75,255,0.3)] hover:shadow-[0_6px_20px_rgba(91,75,255,0.45)] flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Approve Publication</span>
              </button>

              <button
                onClick={() => handleReviewAction("request_changes")}
                disabled={actionLoading}
                className="glass-button w-full py-3 px-4 rounded-[8px] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50 bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Request Revisions</span>
              </button>

              <button
                onClick={() => handleReviewAction("reject")}
                disabled={actionLoading}
                className="glass-card w-full py-3 px-4 rounded-[8px] border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject Submission</span>
              </button>
            </div>

            <p className="text-[10px] text-[#77738F] text-center font-mono pt-2 border-t border-[#E5E1F2]">
              Decisions are permanently logged with SHA-256 HMAC stamps.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Discussion */}
      {activeTab === "discussion" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
            <h3 className="text-sm font-extrabold text-[#0D0B2D]">Collaborative Review Discussion</h3>
            <div className="space-y-3 divide-y divide-[#E5E1F2]">
              {comments.length === 0 ? (
                <p className="text-xs text-[#77738F] py-4 font-mono">No comments yet. Start the thread below.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0D0B2D] font-mono">{c.user_name}</span>
                      <span className="text-[10px] text-[#77738F] font-mono">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-[#17143A] leading-relaxed font-normal">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-4 border-t border-[#E5E1F2] flex gap-2">
              <input
                type="text"
                placeholder="Add review feedback or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="glass-input flex-1 rounded-[8px] px-3.5 py-2 text-xs font-mono bg-white border border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1 font-mono shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === "history" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-sm font-extrabold text-[#0D0B2D]">Revision Diffs & Version History</h3>
          {revisions.length === 0 ? (
            <div className="glass-panel p-6 rounded-[10px] border border-[#E5E1F2] text-xs text-[#77738F] text-center font-mono bg-white/60">
              This is version 1.0. No previous revisions logged yet.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="glass-card p-5 rounded-[12px] border border-[#E5E1F2] bg-white/80 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0D0B2D]">Version {rev.version}.0 Snapshot</span>
                  <span className="text-[#77738F]">{formatDate(rev.created_at)}</span>
                </div>
                {rev.summary_of_changes && (
                  <p className="text-xs text-[#5B4BFF] italic font-mono">{rev.summary_of_changes}</p>
                )}
                <div className="glass-inner p-3.5 rounded-[10px] border border-[#E5E1F2] text-xs font-mono text-[#17143A] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed bg-[#F7F8FF]">
                  {rev.raw_text}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
