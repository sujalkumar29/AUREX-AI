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
    <div className="min-h-screen bg-midnight text-offwhite flex flex-col justify-center py-12 px-6 lg:px-8 relative bg-tech-grid">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-[4px] bg-slate-deep border border-teal-muted/40 flex items-center justify-center text-offwhite shadow-technical">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#F3F5F2" />
              <path d="M8.5 15.5H15.5" stroke="#71958C" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-offwhite">
            AUREX <span className="text-teal-muted font-mono text-sm">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-offwhite tracking-tight">
          Enterprise Sign In
        </h2>
        <p className="mt-1 text-xs text-silver/70 font-mono">
          Brand Governance & Intelligence Instrument
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-deep py-8 px-6 sm:px-10 rounded-[8px] border border-silver/20 shadow-elevation">
          {error && (
            <div className="mb-4 p-3 rounded-[4px] bg-signal-crimson/15 border border-signal-crimson/40 text-xs text-signal-crimson">
              {error}
            </div>
          )}

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6 pb-6 border-b border-silver/10">
            <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-teal-muted mb-2.5">
              Instant Persona Switcher (For Evaluation)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("admin")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-charcoal hover:bg-midnight border border-silver/15 text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-teal-muted">Role 01</div>
                <div className="text-xs font-bold text-offwhite mt-0.5">Admin</div>
                <div className="text-[10px] text-silver/60">Governance</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("creator")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-charcoal hover:bg-midnight border border-silver/15 text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-teal-muted">Role 02</div>
                <div className="text-xs font-bold text-offwhite mt-0.5">Creator</div>
                <div className="text-[10px] text-silver/60">Copywriter</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("reviewer")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-charcoal hover:bg-midnight border border-silver/15 text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-teal-muted">Role 03</div>
                <div className="text-xs font-bold text-offwhite mt-0.5">Reviewer</div>
                <div className="text-[10px] text-silver/60">Auditor</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurex.ai"
                className="w-full rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2.5 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2.5 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-silver/70">
            <span>Need a brand workspace? </span>
            <Link href="/register" className="text-teal-muted hover:underline font-medium">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
