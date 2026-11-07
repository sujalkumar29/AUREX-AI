"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Building2, LogOut, ChevronDown, Check } from "lucide-react";
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
    <header className="glass-nav sticky top-0 z-40 w-full h-16 px-6 flex items-center justify-between text-[#17143A] font-sans">
      {/* Brand & Workspace Indicator */}
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-[8px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(91,75,255,0.35)] group-hover:scale-105 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-[#0D0B2D] group-hover:text-[#5B4BFF] transition-colors">
                AUREX
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#E6E0FF] text-[#5B4BFF] font-mono font-bold border border-[#5B4BFF]/30">
                AI
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-[#77738F] font-mono font-medium">
              Brand Governance Core
            </p>
          </div>
        </Link>

        {/* Brand Selector Dropdown */}
        {brands.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="glass-button flex items-center space-x-2 px-3 py-1.5 rounded-[8px] text-xs font-mono"
            >
              <Building2 className="w-3.5 h-3.5 text-[#5B4BFF]" />
              <span className="font-medium max-w-[150px] truncate text-[#0D0B2D]">
                {selectedBrand ? selectedBrand.name : "Select Brand"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#77738F]" />
            </button>

            {brandDropdownOpen && (
              <div className="glass-modal absolute left-0 mt-2 w-64 rounded-[12px] py-2 z-50 font-mono shadow-xl">
                <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-[#77738F] border-b border-[#E5E1F2] mb-1">
                  Active Truth Repository
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (onSelectBrand) onSelectBrand(b);
                      setBrandDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F0EDFF] text-[#17143A] hover:text-[#5B4BFF] transition-colors"
                  >
                    <span className="truncate font-medium">{b.name}</span>
                    {selectedBrand?.id === b.id && <Check className="w-3.5 h-3.5 text-[#5B4BFF]" />}
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
        <div className="glass-pill hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-[8px] text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isGeminiActive ? "bg-[#5B4BFF] animate-pulse shadow-[0_0_8px_#5B4BFF]" : "bg-[#A78BFA]"}`} />
          <span className="text-[#0D0B2D] text-[11px] font-bold">
            {isGeminiActive ? "GEMINI 2.5 PRO ACTIVE" : "DETERMINISTIC VECTOR CORE"}
          </span>
        </div>

        {/* User Info & Role Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="glass-button flex items-center space-x-2.5 px-3 py-1.5 rounded-[8px]"
            >
              <div className="w-6 h-6 rounded-[6px] bg-[#5B4BFF] text-white font-mono font-bold text-[11px] flex items-center justify-center shadow-sm">
                {user.full_name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-[#0D0B2D] leading-tight truncate max-w-[120px]">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-[#77738F] font-mono capitalize">
                  {role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#77738F]" />
            </button>

            {userDropdownOpen && (
              <div className="glass-modal absolute right-0 mt-2 w-56 rounded-[12px] py-1.5 z-50 text-xs font-mono shadow-xl">
                <div className="px-3 py-2 border-b border-[#E5E1F2]">
                  <p className="font-bold text-[#0D0B2D] truncate">{user.full_name}</p>
                  <p className="text-[10px] text-[#77738F] truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#E6E0FF] border border-[#5B4BFF]/30 text-[#5B4BFF] font-bold">
                    {role} Persona
                  </span>
                </div>

                <div className="p-1">
                  <Link
                    href="/dashboard/brand-dna"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#F0EDFF] text-[#17143A] hover:text-[#5B4BFF] transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#5B4BFF]" />
                    <span>Brand DNA Workspace</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-[6px] hover:bg-[#F0EDFF] text-[#17143A] hover:text-[#5B4BFF] transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#5B4BFF]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="glass-button-primary px-4 py-2 rounded-[8px] font-semibold text-xs uppercase tracking-wider font-mono transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
