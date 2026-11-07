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
    <div className="min-h-screen bg-black text-[#F5F5F5] flex flex-col justify-center py-12 px-6 lg:px-8 relative selection:bg-white selection:text-black font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-8 h-8 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-center text-white shadow-technical group-hover:border-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            AUREX <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#181818] border border-[#292929]">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Enterprise Sign In
        </h2>
        <p className="mt-1 text-xs text-[#A1A1A1] font-mono">
          Brand Governance & Intelligence Instrument
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#090909] py-8 px-6 sm:px-10 rounded-[8px] border border-[#292929] shadow-technical">
          {error && (
            <div className="mb-4 p-3 rounded-[4px] bg-[#181818] border-2 border-[#D4D4D4] text-xs text-white font-mono">
              {error}
            </div>
          )}

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6 pb-6 border-b border-[#292929]">
            <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#A1A1A1] mb-2.5">
              Instant Persona Switcher (For Evaluation)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("admin")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-[#111111] hover:bg-[#181818] border border-[#292929] hover:border-white text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-[#777777]">Role 01</div>
                <div className="text-xs font-bold text-white mt-0.5">Admin</div>
                <div className="text-[10px] text-[#A1A1A1]">Governance</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("creator")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-[#111111] hover:bg-[#181818] border border-[#292929] hover:border-white text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-[#777777]">Role 02</div>
                <div className="text-xs font-bold text-white mt-0.5">Creator</div>
                <div className="text-[10px] text-[#A1A1A1]">Copywriter</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("reviewer")}
                disabled={loading}
                className="p-2.5 rounded-[4px] bg-[#111111] hover:bg-[#181818] border border-[#292929] hover:border-white text-left transition-colors"
              >
                <div className="text-[9px] uppercase font-mono text-[#777777]">Role 03</div>
                <div className="text-xs font-bold text-white mt-0.5">Reviewer</div>
                <div className="text-[10px] text-[#A1A1A1]">Auditor</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurex.ai"
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-mono shadow-technical"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#A1A1A1]">
            <span>Need a brand workspace? </span>
            <Link href="/register" className="text-white hover:underline font-semibold font-mono">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
