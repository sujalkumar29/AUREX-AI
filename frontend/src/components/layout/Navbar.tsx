"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Building2, UserCircle, LogOut, ChevronDown, Check, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { Brand } from "@/types";

interface NavbarProps {
  brands?: Brand[];
  selectedBrand?: Brand | null;
  onSelectBrand?: (b: Brand) => void;
}

export function Navbar({ brands = [], selectedBrand, onSelectBrand }: NavbarProps) {
  const { user, role, logout, systemStatus } = useAuth();
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isGeminiActive = systemStatus?.gemini_api_configured;

  return (
    <header className="glass-nav sticky top-0 z-40 w-full h-16 px-6 flex items-center justify-between text-white font-sans">
      {/* Brand & Workspace Indicator */}
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-[6px] bg-white/5 border border-white/15 flex items-center justify-center text-white shadow-technical group-hover:border-white/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-white transition-colors">
                AUREX
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-white/10 text-white font-mono font-bold border border-white/15">
                AI
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-[#A1A1A1] font-mono">
              Brand Governance Core
            </p>
          </div>
        </Link>

        {/* Brand Selector Dropdown */}
        {brands.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="glass-button flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-xs font-mono"
            >
              <Building2 className="w-3.5 h-3.5 text-white/90" />
              <span className="font-medium max-w-[150px] truncate text-white">
                {selectedBrand ? selectedBrand.name : "Select Brand"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#A1A1A1]" />
            </button>

            {brandDropdownOpen && (
              <div className="glass-modal absolute left-0 mt-2 w-64 rounded-[8px] py-2 z-50 font-mono">
                <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-[#777777] border-b border-white/5 mb-1">
                  Active Truth Repository
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (onSelectBrand) onSelectBrand(b);
                      setBrandDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-white/10 text-[#D4D4D4] hover:text-white transition-colors"
                  >
                    <span className="truncate">{b.name}</span>
                    {selectedBrand?.id === b.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Engine Status & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Engine Status Badge (Monochrome Glass) */}
        <div className="glass-pill hidden md:flex items-center space-x-2 px-3 py-1 rounded-[6px] text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isGeminiActive ? "bg-white animate-pulse shadow-[0_0_8px_#ffffff]" : "bg-[#777777]"}`} />
          <span className="text-[#D4D4D4] text-[11px]">
            {isGeminiActive ? "GEMINI 2.5 PRO ACTIVE" : "DETERMINISTIC VECTOR CORE"}
          </span>
        </div>

        {/* User Info & Role Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="glass-button flex items-center space-x-2.5 px-3 py-1.5 rounded-[6px]"
            >
              <div className="w-6 h-6 rounded-[4px] bg-white text-black font-mono font-bold text-[11px] flex items-center justify-center">
                {user.full_name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-white leading-tight truncate max-w-[120px]">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-[#A1A1A1] font-mono capitalize">
                  {role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#A1A1A1]" />
            </button>

            {userDropdownOpen && (
              <div className="glass-modal absolute right-0 mt-2 w-56 rounded-[8px] py-1.5 z-50 text-xs font-mono">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="font-bold text-white truncate">{user.full_name}</p>
                  <p className="text-[10px] text-[#A1A1A1] truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-white font-bold">
                    {role} Persona
                  </span>
                </div>

                <div className="p-1">
                  <Link
                    href="/dashboard/brand-dna"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-[4px] hover:bg-white/10 text-[#D4D4D4] hover:text-white transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>Brand DNA Workspace</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-[4px] hover:bg-white/10 text-[#D4D4D4] hover:text-white transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-semibold text-xs uppercase tracking-wider font-mono transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
