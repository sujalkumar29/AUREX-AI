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
  Layers
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
    <aside className="w-64 border-r border-silver/10 bg-midnight text-offwhite flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* New Submission Action CTA */}
        <Link
          href="/dashboard/submissions/new"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors shadow-technical group"
        >
          <PlusCircle className="w-4 h-4 text-midnight transition-transform group-hover:rotate-90" />
          <span>New Analysis</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-silver/50">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-medium transition-all ${
                  isActive
                    ? "bg-slate-deep text-offwhite border border-teal-muted/40 font-semibold"
                    : "text-silver/70 hover:text-offwhite hover:bg-charcoal/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-muted" : "text-silver/50"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.2 rounded bg-teal-muted/15 text-teal-muted border border-teal-muted/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Human-in-the-Loop Philosophy Box */}
      <div className="rounded-[4px] p-3.5 bg-slate-deep border border-silver/15">
        <div className="flex items-center space-x-2 text-teal-muted mb-1.5">
          <ShieldCheck className="w-4 h-4 text-signal-emerald" />
          <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
            Aurex Integrity Creed
          </span>
        </div>
        <p className="text-[11px] text-silver leading-relaxed font-sans">
          &quot;AI recommends. Evidence explains. Humans decide.&quot;
        </p>
        <div className="mt-2 text-[9px] font-mono text-silver/50 uppercase tracking-widest">
          ACTIVE ROLE: {role}
        </div>
      </div>
    </aside>
  );
}
