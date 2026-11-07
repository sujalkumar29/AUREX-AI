"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Building2, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    organization_name: "",
    full_name: "",
    email: "",
    password: "",
    role: "creator"
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F5F5F5] flex flex-col justify-center py-12 px-6 lg:px-8 relative selection:bg-white selection:text-black font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 glow-ambient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-tech-grid opacity-60 pointer-events-none z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-9 h-9 rounded-[6px] bg-white/5 border border-white/20 flex items-center justify-center text-white shadow-technical group-hover:border-white/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            AUREX <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-white/10 border border-white/15">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Register Organization
        </h2>
        <p className="mt-1 text-xs text-[#A1A1A1] font-mono">
          Initialize institutional Brand Governance workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card-elevated shimmer-sweep py-8 px-6 sm:px-10 rounded-[14px] border border-white/20 shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-[6px] bg-[#181818] border-2 border-[#D4D4D4] text-xs text-white font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="Vanguard Capital"
                className="glass-input w-full rounded-[6px] px-3.5 py-2.5 text-xs placeholder-[#777777] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Eleanor Vance"
                className="glass-input w-full rounded-[6px] px-3.5 py-2.5 text-xs placeholder-[#777777] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="eleanor@vanguard.com"
                className="glass-input w-full rounded-[6px] px-3.5 py-2.5 text-xs placeholder-[#777777] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="glass-input w-full rounded-[6px] px-3.5 py-2.5 text-xs placeholder-[#777777] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Initial Role Persona
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="glass-input w-full rounded-[6px] px-3.5 py-2.5 text-xs font-mono"
              >
                <option value="admin" className="bg-black text-white">Brand Admin — Manage DNA & Policies</option>
                <option value="creator" className="bg-black text-white">Content Creator — Draft & Submit</option>
                <option value="reviewer" className="bg-black text-white">Reviewer — Authorize & Audit</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50 font-mono shadow-[0_0_20px_rgba(255,255,255,0.22)] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]"
            >
              <span>{loading ? "Initializing..." : "Create Organization"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#A1A1A1]">
            <span>Already have credentials? </span>
            <Link href="/login" className="text-white hover:underline font-semibold font-mono">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
