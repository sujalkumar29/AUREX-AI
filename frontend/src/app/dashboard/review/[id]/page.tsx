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
  User,
  ChevronRight,
  Clock,
  Sparkles,
  ExternalLink,
  Activity,
  Layers,
  Lock
} from "lucide-react";
import { api } from "@/lib/api";
import { Submission, TrustPassportDetail, Comment, Review, RevisionHistory } from "@/types";
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
      <div className="p-16 text-center text-xs font-mono text-[#A1A1A1] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-white animate-pulse" />
        <span>Initializing Sovereign Review Station...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-[#F5F5F5]">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-[#777777]">
        <Link href="/dashboard/submissions" className="hover:text-white transition-colors">
          Submissions
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/dashboard/trust-passport/${submissionId}`} className="hover:text-white transition-colors">
          Trust Passport
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-bold">Review Station</span>
      </div>

      {/* Header - Glassmorphic Sovereign Banner */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[14px] border border-white/18 space-y-4 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(submission.status)}`}>
                CURRENT STATUS: {submission.status.replace('_', ' ')}
              </span>
              <span className="glass-pill text-xs font-mono text-[#D4D4D4] px-2 py-0.5 rounded-[4px]">
                v{submission.version}.0
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{submission.title}</h1>
            <p className="text-xs font-mono text-[#A1A1A1]">
              Author: <strong className="text-white">{passport.creator_name}</strong> • Brand: <strong className="text-white">{passport.brand.name}</strong>
            </p>
          </div>

          <div className="glass-card p-4 rounded-[10px] border border-white/15 text-right shadow-xl">
            <p className="text-[10px] uppercase font-mono text-[#A1A1A1] font-semibold">Governance Trust Score</p>
            <p className="text-3xl font-mono font-extrabold text-white tracking-tight">
              {passport.governance_score.toFixed(1)} <span className="text-xs text-[#777777] font-normal">/ 100</span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="glass-pill p-1.5 rounded-[8px] flex space-x-2 pt-1 text-xs font-mono border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab("decision")}
            className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "decision" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Review Authority</span>
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "discussion" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion ({comments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all uppercase tracking-wider ${
              activeTab === "history" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"
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
            <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-3 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Submitted Copy Draft</h3>
              <div className="glass-inner p-4 rounded-[8px] border border-white/10 text-xs text-[#D4D4D4] font-mono leading-relaxed whitespace-pre-wrap">
                {submission.raw_text}
              </div>
            </div>

            {/* Past Review Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">Review History & Decisions</h3>
              {reviews.length === 0 ? (
                <div className="glass-panel p-4 rounded-[8px] border border-white/10 text-xs text-[#777777] font-mono">
                  No official reviewer determinations recorded yet.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                          r.action === "approve" 
                            ? "bg-white text-black shadow-sm" 
                            : r.action === "request_changes" 
                            ? "glass-pill text-white" 
                            : "bg-[#181818] border border-[#D4D4D4] text-white"
                        }`}>
                          {r.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">by {r.reviewer_name}</span>
                      </div>
                      <span className="text-[11px] text-[#A1A1A1] font-mono">{formatDate(r.created_at)}</span>
                    </div>
                    {r.notes && (
                      <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans italic">&ldquo;{r.notes}&rdquo;</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Station Panel */}
          <div className="glass-card-elevated p-6 rounded-[14px] border border-white/18 space-y-5 h-fit shadow-2xl backdrop-blur-2xl">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#A1A1A1] tracking-wider font-semibold">Final Authority</div>
              <h3 className="text-base font-extrabold text-white">Human Sovereign Sign-off</h3>
              <p className="text-xs text-[#A1A1A1] leading-relaxed font-normal">
                As a designated brand reviewer, your determination dictates whether this asset is released to market.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Determination Notes & Directives
              </label>
              <textarea
                rows={3}
                placeholder="Specify requirements or reason for approval/changes..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="glass-input w-full rounded-[6px] p-3 text-xs placeholder-[#777777] font-mono"
              />
            </div>

            {actionSuccess && (
              <div className="glass-card p-3 rounded-[6px] border border-white/30 text-white text-xs font-mono flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-white" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="glass-card p-3 rounded-[6px] border-2 border-[#D4D4D4] text-white text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-white" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleReviewAction("approve")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[6px] bg-white hover:bg-[#D4D4D4] text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Approve Publication</span>
              </button>

              <button
                onClick={() => handleReviewAction("request_changes")}
                disabled={actionLoading}
                className="glass-button w-full py-3 px-4 rounded-[6px] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>Request Revisions</span>
              </button>

              <button
                onClick={() => handleReviewAction("reject")}
                disabled={actionLoading}
                className="glass-card w-full py-3 px-4 rounded-[6px] border-2 border-[#D4D4D4] hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-white" />
                <span>Reject Submission</span>
              </button>
            </div>

            <p className="text-[10px] text-[#777777] text-center font-mono pt-2 border-t border-white/10">
              Decisions are permanently logged with SHA-256 HMAC stamps.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Discussion */}
      {activeTab === "discussion" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white">Collaborative Review Discussion</h3>
            <div className="space-y-3 divide-y divide-white/5">
              {comments.length === 0 ? (
                <p className="text-xs text-[#777777] py-4 font-mono">No comments yet. Start the thread below.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">{c.user_name}</span>
                      <span className="text-[10px] text-[#777777] font-mono">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-[#D4D4D4] leading-relaxed font-normal">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Add review feedback or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="glass-input flex-1 rounded-[6px] px-3.5 py-2 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1 font-mono shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === "history" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-sm font-extrabold text-white">Revision Diffs & Version History</h3>
          {revisions.length === 0 ? (
            <div className="glass-panel p-6 rounded-[8px] border border-white/10 text-xs text-[#777777] text-center font-mono">
              This is version 1.0. No previous revisions logged yet.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="glass-card p-5 rounded-[10px] border border-white/12 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">Version {rev.version}.0 Snapshot</span>
                  <span className="text-[#A1A1A1]">{formatDate(rev.created_at)}</span>
                </div>
                {rev.summary_of_changes && (
                  <p className="text-xs text-[#D4D4D4] italic font-mono">{rev.summary_of_changes}</p>
                )}
                <div className="glass-inner p-3.5 rounded-[8px] border border-white/10 text-xs font-mono text-[#D4D4D4] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
