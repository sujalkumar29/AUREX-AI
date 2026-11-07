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

      {/* Header */}
      <div className="p-6 md:p-8 rounded-[6px] bg-[#090909] border border-[#292929] space-y-4 shadow-technical">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold border ${getStatusColor(submission.status)}`}>
                CURRENT STATUS: {submission.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-[#A1A1A1]">v{submission.version}.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{submission.title}</h1>
            <p className="text-xs font-mono text-[#A1A1A1]">
              Author: <strong className="text-white">{passport.creator_name}</strong> • Brand: <strong className="text-white">{passport.brand.name}</strong>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-mono text-[#777777]">Governance Trust Score</p>
            <p className="text-3xl font-mono font-extrabold text-white">
              {passport.governance_score.toFixed(1)} <span className="text-xs text-[#777777] font-normal">/ 100</span>
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#292929] space-x-6 pt-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab("decision")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "decision" ? "border-white text-white font-bold" : "border-transparent text-[#777777] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Review Authority</span>
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "discussion" ? "border-white text-white font-bold" : "border-transparent text-[#777777] hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion ({comments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors uppercase tracking-wider ${
              activeTab === "history" ? "border-white text-white font-bold" : "border-transparent text-[#777777] hover:text-white"
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
            <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] space-y-3 shadow-technical">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Submitted Copy Draft</h3>
              <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929] text-xs text-[#D4D4D4] font-mono leading-relaxed whitespace-pre-wrap">
                {submission.raw_text}
              </div>
            </div>

            {/* Past Review Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">Review History & Decisions</h3>
              {reviews.length === 0 ? (
                <div className="p-4 rounded-[4px] bg-[#090909] border border-[#292929] text-xs text-[#777777] font-mono">
                  No official reviewer determinations recorded yet.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-[4px] bg-[#090909] border border-[#292929] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold uppercase ${
                          r.action === "approve" 
                            ? "bg-white text-black" 
                            : r.action === "request_changes" 
                            ? "bg-[#181818] border border-[#292929] text-white" 
                            : "bg-[#181818] border-2 border-[#D4D4D4] text-white"
                        }`}>
                          {r.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">by {r.reviewer_name}</span>
                      </div>
                      <span className="text-[11px] text-[#777777] font-mono">{formatDate(r.created_at)}</span>
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
          <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] space-y-5 h-fit shadow-technical">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#A1A1A1] tracking-wider">Final Authority</div>
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
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] p-3 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
              />
            </div>

            {actionSuccess && (
              <div className="p-3 rounded-[4px] bg-[#111111] border border-white text-white text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-white" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {actionError && (
              <div className="p-3 rounded-[4px] bg-[#181818] border-2 border-[#D4D4D4] text-white text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-white" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleReviewAction("approve")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-white hover:bg-[#D4D4D4] text-black font-mono text-xs font-bold uppercase tracking-wider shadow-technical flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Approve Publication</span>
              </button>

              <button
                onClick={() => handleReviewAction("request_changes")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-[#111111] hover:bg-[#181818] border border-[#292929] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-technical flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>Request Revisions</span>
              </button>

              <button
                onClick={() => handleReviewAction("reject")}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-[4px] bg-[#181818] hover:bg-[#222222] border-2 border-[#D4D4D4] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-technical flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-white" />
                <span>Reject Submission</span>
              </button>
            </div>

            <p className="text-[10px] text-[#777777] text-center font-mono pt-2 border-t border-[#292929]">
              Decisions are permanently logged with SHA-256 HMAC stamps.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Discussion */}
      {activeTab === "discussion" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] space-y-4 shadow-technical">
            <h3 className="text-sm font-extrabold text-white">Collaborative Review Discussion</h3>
            <div className="space-y-3 divide-y divide-[#292929]">
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

            <form onSubmit={handleAddComment} className="pt-4 border-t border-[#292929] flex gap-2">
              <input
                type="text"
                placeholder="Add review feedback or note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1 font-mono shadow-technical"
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
            <div className="p-6 rounded-[4px] bg-[#090909] border border-[#292929] text-xs text-[#777777] text-center font-mono">
              This is version 1.0. No previous revisions logged yet.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="p-5 rounded-[4px] bg-[#090909] border border-[#292929] space-y-3 shadow-technical">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">Version {rev.version}.0 Snapshot</span>
                  <span className="text-[#777777]">{formatDate(rev.created_at)}</span>
                </div>
                {rev.summary_of_changes && (
                  <p className="text-xs text-[#D4D4D4] italic font-mono">{rev.summary_of_changes}</p>
                )}
                <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] text-xs font-mono text-[#D4D4D4] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
