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
          Register Organization
        </h2>
        <p className="mt-1 text-xs text-[#A1A1A1] font-mono">
          Initialize institutional Brand Governance workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#090909] py-8 px-6 sm:px-10 rounded-[8px] border border-[#292929] shadow-technical">
          {error && (
            <div className="mb-4 p-3 rounded-[4px] bg-[#181818] border-2 border-[#D4D4D4] text-xs text-white font-mono">
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
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
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
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white placeholder-[#777777] focus:outline-none focus:border-white font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1A1] mb-1">
                Initial Role Persona
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-[4px] bg-[#111111] border border-[#292929] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono transition-colors"
              >
                <option value="admin">Brand Admin — Manage DNA & Policies</option>
                <option value="creator">Content Creator — Draft & Submit</option>
                <option value="reviewer">Reviewer — Authorize & Audit</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-mono shadow-technical"
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
