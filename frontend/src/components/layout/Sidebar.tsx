"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dna,
  FileText,
  PlusCircle,
  BarChart3,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Brand DNA",
      href: "/dashboard/brand-dna",
      icon: Dna,
      badge: "Truth Vault",
    },
    {
      label: "Submissions",
      href: "/dashboard/submissions",
      icon: FileText,
    },
    {
      label: "Governance Insights",
      href: "/dashboard/insights",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#E5E1F2] glass-panel text-[#17143A] flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] font-sans backdrop-blur-2xl">
      <div className="space-y-6">
        {/* New Submission Action CTA */}
        <Link
          href="/dashboard/submissions/new"
          className="glass-button-primary flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-[10px] font-bold text-xs uppercase tracking-wider transition-all font-mono group shadow-[0_4px_16px_rgba(91,75,255,0.28)]"
        >
          <PlusCircle className="w-4 h-4 text-white transition-transform group-hover:rotate-90" />
          <span>New Analysis</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#77738F] font-bold">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/30 font-bold shadow-sm"
                    : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-[#F0EDFF] hover:border hover:border-[#E5E1F2]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#5B4BFF]" : "text-[#77738F]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-[4px] bg-[#FFFFFF] text-[#5B4BFF] border border-[#5B4BFF]/20 font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Human-in-the-Loop Philosophy Box */}
      <div className="glass-inner rounded-[12px] p-4 border border-[#E5E1F2] relative overflow-hidden">
        <div className="flex items-center space-x-2 text-[#0D0B2D] mb-2">
          <ShieldCheck className="w-4 h-4 text-[#5B4BFF]" />
          <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
            Aurex Creed
          </span>
        </div>
        <p className="text-[11px] text-[#77738F] leading-relaxed font-sans italic">
          &ldquo;AI recommends. Evidence explains. Humans decide.&rdquo;
        </p>
        <div className="mt-3 pt-2 border-t border-[#E5E1F2] flex items-center justify-between text-[9px] font-mono text-[#77738F] font-semibold">
          <span>SOVEREIGNTY</span>
          <span className="text-[#5B4BFF]">ENFORCED</span>
        </div>
      </div>
    </aside>
  );
}
