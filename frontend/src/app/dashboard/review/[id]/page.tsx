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
      <div className="p-16 text-center text-xs font-mono text-teal-muted flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-signal-emerald animate-pulse" />
        <span>Initializing Sovereign Review Station...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-silver/60">
        <Link href="/dashboard/submissions" className="hover:text-offwhite transition-colors">
          Submissions
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/dashboard/trust-passport/${submissionId}`} className="hover:text-offwhite transition-colors">
          Trust Passport
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-offwhite font-bold">Review Station</span>
      </div>

      {/* Header */}
      <div className="p-6 md:p-8 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(submission.status)}`}>
                CURRENT STATUS: {submission.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-silver/60">v{submission.version}.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">{submission.title}</h1>
            <p className="text-xs font-mono text-silver/70">
              Author: <strong className="text-offwhite">{passport.creator_name}</strong> • Brand: <strong className="text-teal-muted">{passport.brand.name}</strong>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-mono text-silver/60">Governance Trust Score</p>
            <p className={`text-3xl font-mono font-extrabold ${passport.governance_score >= 90 ? "text-signal-emerald" : passport.governance_score >= 70 ? "text-signal-amber" : "text-signal-crimson"}`}>
              {passport.governance_score.toFixed(1)} / 100
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-silver/10 space-x-6 pt-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab("decision")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "decision" ? "border-teal-muted text-teal-muted font-bold" : "border-transparent text-silver/60 hover:text-offwhite"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Review Authority</span>
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "discussion" ? "border-teal-muted text-teal-muted font-bold" : "border-transparent text-silver/60 hover:text-offwhite"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion ({comments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "history" ? "border-teal-muted text-teal-muted font-bold" : "border-transparent text-silver/60 hover:text-offwhite"
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
            <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-3 shadow-elevation">
              <h3 className="text-xs font-mono uppercase tracking-wider text-offwhite">Submitted Copy Draft</h3>
              <div className="p-4 rounded-[4px] bg-midnight border border-silver/15 text-xs text-silver font-mono leading-relaxed whitespace-pre-wrap">
                {submission.raw_text}
              </div>
            </div>

            {/* Past Review Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-silver/60">Review History & Decisions</h3>
              {reviews.length === 0 ? (
                <div className="p-4 rounded-[4px] bg-slate-deep border border-silver/15 text-xs text-silver/60 font-mono">
                  No official reviewer determinations recorded yet.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-[4px] bg-slate-deep border border-silver/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold uppercase ${
                          r.action === "approve" ? "bg-signal-emeraldLight text-signal-emerald" : r.action === "request_changes" ? "bg-signal-amberLight text-signal-amber" : "bg-signal-crimsonLight text-signal-crimson"
                        }`}>
                          {r.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-offwhite">by {r.reviewer_name}</span>
                      </div>
                      <span className="text-[11px] text-silver/60 font-mono">{formatDate(r.created_at)}</span>
                    </div>
                    {r.notes && (
                      <p className="text-xs text-silver leading-relaxed font-sans italic">&ldquo;{r.notes}&rdquo;</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Station Panel */}
          <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/20 space-y-5 h-fit shadow-elevation">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-teal-muted tracking-wider">Final Authority</div>
              <h3 className="text-base font-extrabold text-offwhite">Human Sovereign Sign-off</h3>
              <p className="text-xs text-silver/70 leading-relaxed font-normal">
                As a designated brand reviewer, your determination dictates whether this asset is released to market.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
                Determination Notes & Directives
              </label>
              <textarea
                rows={3}
                placeholder="Specify requirements or reason for approval/changes..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full rounded-[4px] bg-midnight border border-silver/20 p-3 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted font-mono"
              />
            </div>

            {actionSuccess && (
              <div className="p-3 rounded-[4px] bg-signal-emeraldLight border border-signal-emerald/40 text-signal-emerald text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="p-3 rounded-[4px] bg-signal-crimsonLight border border-signal-crimson/40 text-signal-crimson text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleReviewAction("approve")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-signal-emerald hover:opacity-90 text-offwhite font-mono text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Publication</span>
              </button>

              <button
                onClick={() => handleReviewAction("request_changes")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-charcoal border border-signal-amber/50 text-signal-amber hover:bg-slate-deep font-mono text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Revisions</span>
              </button>

              <button
                onClick={() => handleReviewAction("reject")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-charcoal border border-signal-crimson/50 text-signal-crimson hover:bg-slate-deep font-mono text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Submission</span>
              </button>
            </div>

            <p className="text-[10px] text-silver/50 text-center font-mono pt-2 border-t border-silver/10">
              Decisions are permanently logged with SHA-256 HMAC stamps.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Discussion */}
      {activeTab === "discussion" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-[6px] bg-slate-deep border border-silver/15 space-y-4 shadow-elevation">
            <h3 className="text-sm font-extrabold text-offwhite">Collaborative Review Discussion</h3>
            <div className="space-y-3 divide-y divide-silver/10">
              {comments.length === 0 ? (
                <p className="text-xs text-silver/60 py-4 font-mono">No comments yet. Start the thread below.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-muted font-mono">{c.user_name}</span>
                      <span className="text-[10px] text-silver/50 font-mono">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-silver leading-relaxed font-normal">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-4 border-t border-silver/10 flex gap-2">
              <input
                type="text"
                placeholder="Add review feedback or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === "history" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-sm font-extrabold text-offwhite">Revision Diffs & Version History</h3>
          {revisions.length === 0 ? (
            <div className="p-6 rounded-[4px] bg-slate-deep border border-silver/15 text-xs text-silver/60 text-center font-mono">
              This is version 1.0. No previous revisions logged yet.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="p-5 rounded-[4px] bg-slate-deep border border-silver/15 space-y-3 shadow-elevation">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-teal-muted">Version {rev.version}.0 Snapshot</span>
                  <span className="text-silver/50">{formatDate(rev.created_at)}</span>
                </div>
                {rev.summary_of_changes && (
                  <p className="text-xs text-silver italic font-mono">{rev.summary_of_changes}</p>
                )}
                <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15 text-xs font-mono text-silver max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
