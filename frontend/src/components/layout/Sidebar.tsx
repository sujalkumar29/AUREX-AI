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
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
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
    <aside className="w-64 border-r border-white/10 glass-panel text-white flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] font-sans backdrop-blur-2xl">
      <div className="space-y-6">
        {/* New Submission Action CTA */}
        <Link
          href="/dashboard/submissions/new"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_28px_rgba(255,255,255,0.3)] font-mono group"
        >
          <PlusCircle className="w-4 h-4 text-black transition-transform group-hover:rotate-90" />
          <span>New Analysis</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#777777]">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white border border-white/25 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md"
                    : "text-[#A1A1A1] hover:text-white hover:bg-white/5 hover:border hover:border-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#777777]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-[4px] bg-white/5 text-[#D4D4D4] border border-white/10">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Human-in-the-Loop Philosophy Box */}
      <div className="glass-inner rounded-[8px] p-4 border border-white/10 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-white mb-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
            Aurex Creed
          </span>
        </div>
        <p className="text-[11px] text-[#A1A1A1] leading-relaxed font-sans italic">
          &ldquo;AI recommends. Evidence explains. Humans decide.&rdquo;
        </p>
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#777777]">
          <span>SOVEREIGNTY</span>
          <span>ENFORCED</span>
        </div>
      </div>
    </aside>
  );
}
