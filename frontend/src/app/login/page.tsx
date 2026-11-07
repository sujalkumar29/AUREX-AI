"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, UserCheck, ShieldCheck, Lock, Mail } from "lucide-react";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed demo login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#17143A] flex flex-col justify-center py-12 px-6 lg:px-8 relative selection:bg-[#5B4BFF] selection:text-white font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 glow-ambient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-tech-grid opacity-60 pointer-events-none z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-10 h-10 rounded-[10px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(91,75,255,0.35)] group-hover:scale-105 transition-all">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#0D0B2D]">
            AUREX <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/30">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#0D0B2D] tracking-tight">
          Enterprise Sign In
        </h2>
        <p className="mt-1 text-xs text-[#77738F] font-mono">
          Brand Governance & Intelligence Instrument
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card-elevated shimmer-sweep py-8 px-6 sm:px-10 rounded-[16px] border border-[#E5E1F2] bg-white/85 shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-[8px] bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
              {error}
            </div>
          )}

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6 pb-6 border-b border-[#E5E1F2]">
            <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#5B4BFF] mb-2.5 font-bold">
              Instant Persona Switcher (For Evaluation)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("admin")}
                disabled={loading}
                className="glass-button p-2.5 rounded-[10px] text-left transition-all hover:-translate-y-0.5 border border-[#E5E1F2] bg-white/70 hover:bg-[#F0EDFF] hover:border-[#5B4BFF]/40 shadow-sm"
              >
                <div className="text-[9px] uppercase font-mono text-[#77738F]">Role 01</div>
                <div className="text-xs font-bold text-[#0D0B2D] mt-0.5">Admin</div>
                <div className="text-[10px] text-[#77738F]">Governance</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("creator")}
                disabled={loading}
                className="glass-button p-2.5 rounded-[10px] text-left transition-all hover:-translate-y-0.5 border border-[#E5E1F2] bg-white/70 hover:bg-[#F0EDFF] hover:border-[#5B4BFF]/40 shadow-sm"
              >
                <div className="text-[9px] uppercase font-mono text-[#77738F]">Role 02</div>
                <div className="text-xs font-bold text-[#0D0B2D] mt-0.5">Creator</div>
                <div className="text-[10px] text-[#77738F]">Copywriter</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("reviewer")}
                disabled={loading}
                className="glass-button p-2.5 rounded-[10px] text-left transition-all hover:-translate-y-0.5 border border-[#E5E1F2] bg-white/70 hover:bg-[#F0EDFF] hover:border-[#5B4BFF]/40 shadow-sm"
              >
                <div className="text-[9px] uppercase font-mono text-[#77738F]">Role 03</div>
                <div className="text-xs font-bold text-[#0D0B2D] mt-0.5">Reviewer</div>
                <div className="text-[10px] text-[#77738F]">Auditor</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurex.ai"
                className="glass-input w-full rounded-[8px] px-3.5 py-2.5 text-xs placeholder-[#77738F]/60 font-mono bg-white border border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full rounded-[8px] px-3.5 py-2.5 text-xs placeholder-[#77738F]/60 font-mono bg-white border border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50 font-mono shadow-[0_4px_16px_rgba(91,75,255,0.35)] hover:shadow-[0_6px_20px_rgba(91,75,255,0.45)]"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#77738F]">
            <span>Need a brand workspace? </span>
            <Link href="/register" className="text-[#5B4BFF] hover:underline font-semibold font-mono">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
