"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Building2, UserCircle, LogOut, ChevronDown, Check, Activity, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full h-16 border-b border-silver/10 bg-midnight/95 backdrop-blur-md px-6 flex items-center justify-between text-offwhite">
      {/* Brand & Workspace Indicator */}
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-[4px] bg-slate-deep border border-teal-muted/30 flex items-center justify-center text-offwhite shadow-technical group-hover:border-teal-muted transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#F3F5F2" />
              <path d="M8.5 15.5H15.5" stroke="#71958C" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-offwhite">AUREX</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-muted/20 text-teal-muted font-mono font-semibold border border-teal-muted/30">
                AI
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-silver/60 font-mono">
              Brand Governance Core
            </p>
          </div>
        </Link>

        {/* Brand Selector Dropdown */}
        {brands.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/15 text-xs text-silver transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-muted" />
              <span className="font-medium max-w-[150px] truncate text-offwhite">
                {selectedBrand ? selectedBrand.name : "Select Brand"}
              </span>
              <ChevronDown className="w-3 h-3 text-silver/60" />
            </button>

            {brandDropdownOpen && (
              <div className="absolute left-0 mt-2 w-60 rounded-[4px] bg-slate-deep border border-silver/20 shadow-elevation py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-teal-muted">
                  Switch Active DNA
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (onSelectBrand) onSelectBrand(b);
                      setBrandDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-charcoal text-silver hover:text-offwhite transition-colors"
                  >
                    <span className="truncate">{b.name}</span>
                    {selectedBrand?.id === b.id && <Check className="w-3.5 h-3.5 text-teal-muted" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Engine Status & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Engine Status Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-[4px] bg-charcoal border border-silver/15 text-xs">
          <span className={`w-2 h-2 rounded-full ${isGeminiActive ? "bg-signal-emerald animate-pulse" : "bg-teal-muted"}`} />
          <span className="text-silver/80 text-[11px] font-mono">
            {isGeminiActive ? "LIVE GEMINI 2.5 PRO" : "LOCAL VECTOR ENGINE"}
          </span>
        </div>

        {/* User Info & Role Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-[4px] bg-charcoal hover:bg-slate-deep border border-silver/15 transition-colors"
            >
              <div className="w-6 h-6 rounded-[2px] bg-slate-deep border border-teal-muted/40 flex items-center justify-center text-teal-muted text-xs font-bold font-mono">
                {user.full_name?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-offwhite leading-none">{user.full_name}</div>
                <div className="text-[10px] font-mono uppercase text-teal-muted mt-0.5 leading-none">
                  {role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-silver/60" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-[4px] bg-slate-deep border border-silver/20 shadow-elevation py-1.5 z-50">
                <div className="px-3 py-2 border-b border-silver/10 text-xs">
                  <div className="font-semibold text-offwhite">{user.full_name}</div>
                  <div className="text-[10px] text-silver/60 truncate font-mono">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-charcoal text-signal-crimson transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-[4px] bg-offwhite text-midnight font-bold text-xs hover:bg-silver transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
