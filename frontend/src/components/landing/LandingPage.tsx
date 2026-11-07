"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Dna,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Lock,
  ChevronRight,
  Database,
  Search,
  ExternalLink,
  Cpu,
  Fingerprint,
  RefreshCw,
  GitBranch,
  Check,
  X,
  Compass,
  Activity,
  Terminal,
  Download
} from "lucide-react";

export function LandingPage() {
  // Interactive Hero Product State
  const [activeHeroClaimIndex, setActiveHeroClaimIndex] = useState(0);

  const heroClaims = [
    {
      claim: "Processes instant cross-border settlement with guaranteed zero counterparty risk.",
      type: "Marketing Hero Claim",
      status: "CONFLICTING",
      statusColor: "text-signal-crimson bg-signal-crimsonLight border-signal-crimson/30",
      confidence: "98.4%",
      matchedRule: "Treasury Policy Section 4.2",
      ruleQuote: "All transactions carry counterparty risk factors. Absolute 'zero risk' terminology is legally prohibited.",
      remediation: "Processes near-instant cross-border settlement backed by Tier-1 reserve liquidity.",
      reviewer: "Audited by Compliance Lead (Sarah C.)",
      action: "Changes Required"
    },
    {
      claim: "Maintains 99.99% system availability backed by multi-region cold failover.",
      type: "Infrastructure Copy",
      status: "SUPPORTED",
      statusColor: "text-signal-emerald bg-signal-emeraldLight border-signal-emerald/30",
      confidence: "99.1%",
      matchedRule: "Infrastructure SLA Specification v3",
      ruleQuote: "Architecture verified for 99.99% uptime with automated multi-region active-passive failover.",
      remediation: "Fully aligned with published Brand DNA.",
      reviewer: "Pre-approved via Automated Hash",
      action: "Ready for Publication"
    },
    {
      claim: "Offers lowest fees in North America across all institutional tiers.",
      type: "Pricing Claim",
      status: "UNVERIFIED",
      statusColor: "text-signal-amber bg-signal-amberLight border-signal-amber/30",
      confidence: "82.0%",
      matchedRule: "Competitive Claim Standard Section 1.8",
      ruleQuote: "Comparative superlatives ('lowest', 'cheapest') must cite third-party benchmark study with date.",
      remediation: "Offers institutional fees starting at 0.08% per transaction.",
      reviewer: "Pending Supporting Documentation",
      action: "Documentation Needed"
    }
  ];

  // Interactive Brand DNA Workspace State
  const [activeDnaTab, setActiveDnaTab] = useState<"facts" | "lexicon" | "visual" | "guidelines">("facts");

  // Interactive Intelligence Engine Node State
  const [activeEngineStep, setActiveEngineStep] = useState(2);

  return (
    <div className="min-h-screen bg-midnight text-offwhite selection:bg-teal-muted/30 selection:text-offwhite font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. ENTERPRISE STATUS HEADER & GLOBAL NAVIGATION
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-silver/10 bg-midnight/90 backdrop-blur-md">
        {/* Top Telemetry Ticker */}
        <div className="hidden lg:flex items-center justify-between px-8 py-1.5 border-b border-silver/5 text-[11px] font-mono text-silver/60 bg-charcoal/50">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-teal-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-emerald animate-pulse" />
              <span className="font-medium">CORE ENGINE v2.4 OPERATIONAL</span>
            </span>
            <span>SYSTEM LATENCY: 14ms</span>
            <span>DNA REPOSITORY: 100% IN SYNC</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>SOVEREIGN HUMAN GOVERNANCE: ENFORCED</span>
            <span className="text-silver/40">|</span>
            <span className="text-teal-muted">SHA-256 AUDIT TRAILS ACTIVE</span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-[4px] bg-slate-deep border border-teal-muted/30 flex items-center justify-center text-offwhite shadow-technical group-hover:border-teal-muted transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#F3F5F2" />
                  <path d="M8.5 15.5H15.5" stroke="#71958C" strokeWidth="1.8" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold tracking-tight text-lg text-offwhite">AUREX</span>
                <span className="font-mono text-xs font-semibold px-1.5 py-0.2 rounded bg-teal-muted/20 text-teal-muted border border-teal-muted/30">
                  AI
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-silver/70">
            <a href="#brand-dna" className="hover:text-offwhite transition-colors">Brand DNA</a>
            <a href="#intelligence-engine" className="hover:text-offwhite transition-colors">Intelligence Engine</a>
            <a href="#claim-verification" className="hover:text-offwhite transition-colors">Claim Verification</a>
            <a href="#visual-forensics" className="hover:text-offwhite transition-colors">Visual Forensics</a>
            <a href="#trust-passport" className="hover:text-offwhite transition-colors">Trust Passport</a>
            <a href="#human-governance" className="hover:text-offwhite transition-colors">Human Review</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-3.5 py-2 text-silver hover:text-offwhite transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-semibold text-xs transition-all shadow-technical flex items-center space-x-2"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>


      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION — ASYMMETRIC, LAYERED PRODUCT DEMONSTRATION
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-tech-grid">
        {/* Technical Coordinate Indicators */}
        <div className="flex items-center justify-between text-[10px] font-mono text-silver/40 mb-8 border-b border-silver/10 pb-2">
          <span>SYS_GEO: [37.7749° N, 122.4194° W]</span>
          <span className="text-teal-muted">GOVERNANCE PROTOCOL: ACTIVE</span>
          <span>DISCREPANCY TOLERANCE: 0.00%</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Hero Column: Commanding Typography */}
          <div className="lg:col-span-5 pt-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-muted" />
              <span>BRAND GOVERNANCE & INTELLIGENCE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-offwhite leading-[1.05] mb-6">
              Your Brand.<br />
              <span className="text-teal-muted">One Standard.</span><br />
              Everywhere.
            </h1>

            <p className="text-base text-silver/80 leading-relaxed mb-8 font-normal max-w-md">
              An intelligent governance layer that verifies every claim, protects brand identity, and brings accountability to every content decision.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 shadow-elevation"
              >
                <span>Explore AUREX</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#intelligence-engine"
                className="px-6 py-3.5 rounded-[4px] bg-charcoal border border-silver/20 text-offwhite hover:border-teal-muted font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <Cpu className="w-3.5 h-3.5 text-teal-muted" />
                <span>See the Intelligence Engine</span>
              </a>
            </div>

            {/* Core Architectural Tenet */}
            <div className="p-4 rounded-[4px] bg-slate-deep/60 border border-silver/10">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-teal-muted mb-1">
                The Aurex Creed
              </div>
              <p className="text-xs text-silver font-medium">
                AI recommends. Evidence explains. Humans decide.
              </p>
            </div>
          </div>

          {/* Right Hero Column: Large Layered Product Interface Console */}
          <div className="lg:col-span-7">
            <div className="rounded-[8px] bg-slate-deep border border-silver/20 shadow-elevation overflow-hidden">
              
              {/* Console Window Header */}
              <div className="px-5 py-3 bg-charcoal border-b border-silver/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-signal-crimson/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-signal-amber/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-signal-emerald/80" />
                  <span className="ml-2 text-xs font-mono text-silver/70">
                    AUREX_INSPECTOR // ACTIVE SUBMISSION AUDIT
                  </span>
                </div>
                <div className="text-[10px] font-mono text-teal-muted flex items-center space-x-1.5">
                  <Activity className="w-3 h-3" />
                  <span>LIVE TRACE</span>
                </div>
              </div>

              {/* Sub-Header Claim Switcher Tabs */}
              <div className="bg-charcoal/80 border-b border-silver/10 px-5 py-2 flex items-center justify-between overflow-x-auto">
                <span className="text-[10px] font-mono uppercase text-silver/50 tracking-wider">
                  Test Scenarios:
                </span>
                <div className="flex space-x-1.5">
                  {heroClaims.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroClaimIndex(idx)}
                      className={`px-3 py-1 text-[11px] font-mono rounded-[2px] transition-all ${
                        activeHeroClaimIndex === idx
                          ? "bg-midnight text-offwhite border border-teal-muted"
                          : "text-silver/60 hover:text-offwhite hover:bg-slate-deep/50"
                      }`}
                    >
                      Sample 0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Body: Layered Analysis Pipeline */}
              <div className="p-6 space-y-5">
                
                {/* 1. Content Ingestion Stream */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-silver/60 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3 h-3 text-teal-muted" />
                      <span>Stage 01: Submitted Content Stream</span>
                    </span>
                    <span className="text-teal-muted">Target: Global Campaign Draft</span>
                  </div>
                  <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15 text-xs text-silver font-mono leading-relaxed">
                    <span className="text-silver/40 select-none mr-2 font-mono">01</span>
                    <span className="text-offwhite font-medium bg-teal-muted/15 px-1 py-0.5 rounded">
                      &quot;{heroClaims[activeHeroClaimIndex].claim}&quot;
                    </span>
                  </div>
                </div>

                {/* 2 & 3. Detection & Evidence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* AI Detection */}
                  <div className="p-4 rounded-[4px] bg-charcoal/90 border border-silver/10">
                    <div className="text-[10px] font-mono text-teal-muted uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Stage 02: Claim Extraction</span>
                      <span className="font-semibold text-offwhite">{heroClaims[activeHeroClaimIndex].confidence} Conf.</span>
                    </div>
                    <div className="text-xs font-semibold text-offwhite mb-1">
                      {heroClaims[activeHeroClaimIndex].type}
                    </div>
                    <div className="text-[11px] text-silver/70">
                      Entity categorization and factual predicate extracted via neural semantic parsing.
                    </div>
                  </div>

                  {/* Evidence Retrieved from DNA */}
                  <div className="p-4 rounded-[4px] bg-charcoal/90 border border-silver/10">
                    <div className="text-[10px] font-mono text-teal-muted uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Stage 03: Grounded Evidence</span>
                      <span className="text-silver/60">Vector Match</span>
                    </div>
                    <div className="text-xs font-semibold text-offwhite mb-1">
                      {heroClaims[activeHeroClaimIndex].matchedRule}
                    </div>
                    <div className="text-[11px] text-silver/70 italic line-clamp-2">
                      &quot;{heroClaims[activeHeroClaimIndex].ruleQuote}&quot;
                    </div>
                  </div>
                </div>

                {/* 4. Verification Verdict Banner */}
                <div className="p-4 rounded-[4px] bg-midnight border border-silver/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-silver/60 tracking-wider mb-1">
                      Stage 04: Verification Verdict
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-[2px] text-xs font-mono font-bold uppercase border ${heroClaims[activeHeroClaimIndex].statusColor}`}>
                        {heroClaims[activeHeroClaimIndex].status}
                      </span>
                      <span className="text-xs text-silver font-mono">
                        {heroClaims[activeHeroClaimIndex].action}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono uppercase text-silver/60 tracking-wider mb-0.5">
                      Suggested Compliant Phrasing
                    </div>
                    <div className="text-xs font-medium text-teal-muted">
                      {heroClaims[activeHeroClaimIndex].remediation}
                    </div>
                  </div>
                </div>

                {/* 5. Human Review Ledger */}
                <div className="pt-3 border-t border-silver/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-silver/70">
                    <Fingerprint className="w-4 h-4 text-teal-muted" />
                    <span>Stage 05: {heroClaims[activeHeroClaimIndex].reviewer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-signal-emerald" />
                    <span className="text-[11px] text-offwhite font-semibold">SOVEREIGN DECISION REQUIRED</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. FEATURE 1: BRAND DNA WORKSPACE (System of Record)
      ────────────────────────────────────────────────────────────── */}
      <section id="brand-dna" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-silver/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-4">
              <span>01 / KNOWLEDGE REPOSITORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
              Brand DNA.<br />
              The Sovereign Truth.
            </h2>
            <p className="text-sm text-silver/80 leading-relaxed mb-6 font-normal">
              Eliminate ambiguous guidelines stored across forgotten PDF drives. Brand DNA codifies your mission, official claims, terminology dictionaries, and visual tokens into a queryable, versioned vector truth.
            </p>

            {/* Navigation Tabs for DNA Showcase */}
            <div className="space-y-2">
              {[
                { id: "facts", label: "01. Verified Facts & Claims", desc: "Audited statistics and official product features" },
                { id: "lexicon", label: "02. Terminology & Lexicon", desc: "Approved vs prohibited industry vocabulary" },
                { id: "visual", label: "03. Visual Standards & Tokens", desc: "Exact hex palettes, typography, and clear-space rules" },
                { id: "guidelines", label: "04. Governance Guidelines", desc: "Mission, tone of voice, and regulatory boundaries" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDnaTab(tab.id as any)}
                  className={`w-full text-left p-3 rounded-[4px] border transition-all ${
                    activeDnaTab === tab.id
                      ? "bg-slate-deep border-teal-muted text-offwhite"
                      : "bg-charcoal/40 border-silver/10 text-silver/60 hover:text-offwhite hover:bg-charcoal/80"
                  }`}
                >
                  <div className="text-xs font-mono font-semibold">{tab.label}</div>
                  <div className="text-[11px] text-silver/60 mt-0.5">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Showcase: Interactive DNA Inspector */}
          <div className="lg:col-span-8">
            <div className="rounded-[8px] bg-slate-deep border border-silver/20 overflow-hidden shadow-elevation">
              
              <div className="px-6 py-4 bg-charcoal border-b border-silver/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-teal-muted" />
                  <span className="text-xs font-mono font-bold text-offwhite uppercase">
                    AuraPay Global // Approved DNA Registry (v4.8)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-silver/60">
                  HASH: e581f9a0...7b32
                </span>
              </div>

              <div className="p-6">
                {activeDnaTab === "facts" && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase text-teal-muted tracking-wider mb-2">
                      Verified Facts Database (Ground Truth for RAG)
                    </div>
                    {[
                      {
                        claim: "42 Enterprise Corridors Active",
                        category: "Operational Reach",
                        citation: "Q3 2025 Certified Network Audit",
                        confidence: "100% Certified"
                      },
                      {
                        claim: "Average Settlement Speed of 1.4 Seconds",
                        category: "Performance Metrics",
                        citation: "Internal Telemetry Benchmark #9921",
                        confidence: "100% Certified"
                      },
                      {
                        claim: "Tier-1 Capital Reserves Exceeding $250 Million",
                        category: "Financial Solvency",
                        citation: "Annual Regulatory Filing - Schedule B",
                        confidence: "100% Certified"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-[4px] bg-midnight border border-silver/15 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-offwhite">{item.claim}</div>
                          <div className="text-[11px] font-mono text-silver/60 mt-1">
                            Ref: {item.citation} • Category: {item.category}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-[2px] text-[10px] font-mono bg-teal-muted/20 text-teal-muted border border-teal-muted/30">
                          {item.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeDnaTab === "lexicon" && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase text-teal-muted tracking-wider mb-2">
                      Brand Terminology Rules & Prohibitions
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-[4px] bg-midnight border border-signal-crimson/30">
                        <div className="text-[10px] font-mono uppercase text-signal-crimson font-bold mb-2 flex items-center space-x-1">
                          <X className="w-3 h-3" />
                          <span>Prohibited Terminology</span>
                        </div>
                        <ul className="space-y-2 text-xs text-silver">
                          <li className="flex items-center justify-between border-b border-silver/5 pb-1">
                            <span className="font-mono text-signal-crimson">&quot;crypto wallet&quot;</span>
                            <span className="text-[10px] text-silver/50">Confuses institutional positioning</span>
                          </li>
                          <li className="flex items-center justify-between border-b border-silver/5 pb-1">
                            <span className="font-mono text-signal-crimson">&quot;guaranteed profits&quot;</span>
                            <span className="text-[10px] text-silver/50">Regulatory violation</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="font-mono text-signal-crimson">&quot;disruptive fintech&quot;</span>
                            <span className="text-[10px] text-silver/50">Cliché, off-brand</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-[4px] bg-midnight border border-teal-muted/30">
                        <div className="text-[10px] font-mono uppercase text-teal-muted font-bold mb-2 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Approved & Preferred Lexicon</span>
                        </div>
                        <ul className="space-y-2 text-xs text-silver">
                          <li className="flex items-center justify-between border-b border-silver/5 pb-1">
                            <span className="font-mono text-teal-muted">&quot;institutional treasury suite&quot;</span>
                            <span className="text-[10px] text-silver/50">Preferred</span>
                          </li>
                          <li className="flex items-center justify-between border-b border-silver/5 pb-1">
                            <span className="font-mono text-teal-muted">&quot;real-time liquidity routing&quot;</span>
                            <span className="text-[10px] text-silver/50">Preferred</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="font-mono text-teal-muted">&quot;sovereign settlement layer&quot;</span>
                            <span className="text-[10px] text-silver/50">Approved</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeDnaTab === "visual" && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase text-teal-muted tracking-wider mb-2">
                      Design System & Color Forensics
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "Midnight Green", hex: "#14231F", role: "Primary Background" },
                        { name: "Muted Teal", hex: "#71958C", role: "Key Accent" },
                        { name: "Deep Slate", hex: "#202C35", role: "Surface Elevation" },
                        { name: "Cool Off-White", hex: "#F3F5F2", role: "Primary Typography" },
                      ].map((c, i) => (
                        <div key={i} className="p-3 rounded-[4px] bg-midnight border border-silver/15">
                          <div className="w-full h-12 rounded-[2px] mb-2 border border-silver/20" style={{ backgroundColor: c.hex }} />
                          <div className="text-xs font-bold text-offwhite">{c.name}</div>
                          <div className="text-[10px] font-mono text-teal-muted">{c.hex}</div>
                          <div className="text-[10px] text-silver/60 mt-0.5">{c.role}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15 text-xs text-silver/80">
                      <span className="font-mono text-teal-muted font-bold mr-2">TYPOGRAPHY POLICY:</span>
                      Display headings must be Manrope Bold (tracking: -0.02em). Audit stamps must render strictly in JetBrains Mono.
                    </div>
                  </div>
                )}

                {activeDnaTab === "guidelines" && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase text-teal-muted tracking-wider mb-2">
                      Core Mission & Voice Boundaries
                    </div>
                    <div className="p-4 rounded-[4px] bg-midnight border border-silver/15">
                      <div className="text-xs font-mono text-teal-muted mb-1">BRAND MISSION</div>
                      <p className="text-xs text-silver leading-relaxed">
                        &quot;To engineer the most reliable, transparent, and compliant institutional settlement platform for global enterprises.&quot;
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15">
                        <div className="text-[10px] font-mono text-teal-muted mb-1 uppercase">Tone Mandate</div>
                        <div className="text-xs font-semibold text-offwhite">Authoritative, Rigorous, Crisp</div>
                      </div>
                      <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15">
                        <div className="text-[10px] font-mono text-signal-crimson mb-1 uppercase">Prohibited Tone</div>
                        <div className="text-xs font-semibold text-offwhite">Casual, Slang, Hyperbolic</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          4. FEATURE 2: INTELLIGENCE ENGINE (Signal Pipeline Visualization)
      ────────────────────────────────────────────────────────────── */}
      <section id="intelligence-engine" className="py-24 px-6 lg:px-8 bg-charcoal/60 border-t border-b border-silver/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-3">
              <span>02 / NEURAL SIGNAL ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
              The Intelligence Pipeline.
            </h2>
            <p className="text-sm sm:text-base text-silver/80 leading-relaxed font-normal">
              A multi-vector governance pipeline that transforms raw unstructured marketing copy, documents, and creative assets into verified, evidence-backed brand decisions.
            </p>
          </div>

          {/* Interactive Multi-Stage Flowchart Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {[
              { step: 1, title: "Ingestion", sub: "Multi-Format", icon: FileText, desc: "Text, Copy, Docs, Creatives" },
              { step: 2, title: "Extraction", sub: "Neural Parsing", icon: Search, desc: "Extract factual predicates" },
              { step: 3, title: "Evidence RAG", sub: "Vector Query", icon: Database, desc: "Search Brand DNA truth" },
              { step: 4, title: "Cross-Audit", sub: "6 Vectors", icon: Sliders, desc: "Claims, Voice, Visual, A11y" },
              { step: 5, title: "Trust Passport", sub: "Scored Hash", icon: FileCheck, desc: "Cryptographic score generation" },
              { step: 6, title: "Human Gate", sub: "Sovereign Sign", icon: Lock, desc: "Final reviewer approval" },
            ].map((node) => {
              const Icon = node.icon;
              const isSelected = activeEngineStep === node.step;
              return (
                <div
                  key={node.step}
                  onClick={() => setActiveEngineStep(node.step)}
                  className={`p-4 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-deep border-teal-muted shadow-elevation"
                      : "bg-midnight/80 border-silver/10 hover:border-silver/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-teal-muted mb-3">
                    <span>STAGE 0{node.step}</span>
                    <Icon className="w-4 h-4 text-silver/60" />
                  </div>
                  <div className="text-sm font-bold text-offwhite mb-0.5">{node.title}</div>
                  <div className="text-[10px] font-mono text-teal-muted mb-2">{node.sub}</div>
                  <div className="text-[11px] text-silver/60 leading-snug">{node.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Expanded Deep-Dive Panel for Selected Engine Stage */}
          <div className="rounded-[8px] bg-slate-deep border border-silver/20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-silver/10 gap-4">
              <div>
                <span className="text-[10px] font-mono text-teal-muted uppercase tracking-wider">
                  Active Deep-Dive Inspection // Stage 0{activeEngineStep}
                </span>
                <h3 className="text-xl font-bold text-offwhite mt-1">
                  {activeEngineStep === 1 && "Multi-Format Ingestion & Asset Sanitization"}
                  {activeEngineStep === 2 && "Neural Claim Extraction & Predicate Decomposition"}
                  {activeEngineStep === 3 && "Evidence-Grounded RAG & Vector Alignment"}
                  {activeEngineStep === 4 && "6-Dimensional Autonomous Compliance Audit"}
                  {activeEngineStep === 5 && "Cryptographic Trust Passport Synthesis"}
                  {activeEngineStep === 6 && "Sovereign Human Review & Immutable Audit Ledger"}
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-silver/70">
                <span>LATENCY: 18ms</span>
                <span>•</span>
                <span>MODEL: GEMINI 2.5 PRO + LOCAL VECTOR ENGINE</span>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-silver">
              <div className="p-4 rounded-[4px] bg-midnight border border-silver/10">
                <div className="text-[10px] font-mono text-teal-muted uppercase mb-1">Process Logic</div>
                <p className="leading-relaxed">
                  Every sentence is disassembled into factual assertions, tone markers, terminology tokens, and color/asset boundaries.
                </p>
              </div>
              <div className="p-4 rounded-[4px] bg-midnight border border-silver/10">
                <div className="text-[10px] font-mono text-teal-muted uppercase mb-1">Zero Hallucination Guarantee</div>
                <p className="leading-relaxed">
                  Claims without explicit mathematical backing in the Brand DNA are strictly marked UNVERIFIED with zero inference leniency.
                </p>
              </div>
              <div className="p-4 rounded-[4px] bg-midnight border border-silver/10">
                <div className="text-[10px] font-mono text-teal-muted uppercase mb-1">Audit Traceability</div>
                <p className="leading-relaxed">
                  Every decision outputs an immutable HMAC signature linking the raw content, the exact Brand DNA clause, and the human reviewer.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. FEATURE 3: CLAIM VERIFICATION (Evidence Discrepancy Diff)
      ────────────────────────────────────────────────────────────── */}
      <section id="claim-verification" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-3">
            <span>03 / DISCREPANCY FORENSICS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
            Claim Verification.
          </h2>
          <p className="text-sm sm:text-base text-silver/80 leading-relaxed font-normal">
            Side-by-side evidence cross-examination. See how marketing claims are scrutinized against certified facts with automatic remediation suggestions.
          </p>
        </div>

        {/* Realistic Discrepancy Workbench */}
        <div className="rounded-[8px] bg-slate-deep border border-silver/20 overflow-hidden shadow-elevation">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-silver/10">
            
            {/* Column 1: Submitted Copy with Highlighted Violations */}
            <div className="p-6 bg-charcoal/40">
              <div className="text-[10px] font-mono uppercase text-silver/60 tracking-wider mb-2 flex items-center justify-between">
                <span>01. Raw Submitted Draft</span>
                <span className="text-signal-crimson font-mono">2 Violations Detected</span>
              </div>
              <div className="p-4 rounded-[4px] bg-midnight border border-silver/15 font-mono text-xs leading-relaxed text-silver space-y-2">
                <p>
                  Introducing AuraPay Prime: the world&apos;s first 
                  <span className="bg-signal-crimson/20 text-signal-crimson px-1 py-0.5 rounded border border-signal-crimson/30 mx-1">
                    guaranteed zero-downtime
                  </span>
                  treasury engine.
                </p>
                <p>
                  Our institutional clients enjoy
                  <span className="bg-signal-amber/20 text-signal-amber px-1 py-0.5 rounded border border-signal-amber/30 mx-1">
                    the absolute lowest fees in the industry
                  </span>
                  with zero transaction costs.
                </p>
              </div>
            </div>

            {/* Column 2: Brand DNA Ground Truth Citation */}
            <div className="p-6 bg-charcoal/40">
              <div className="text-[10px] font-mono uppercase text-teal-muted tracking-wider mb-2 flex items-center justify-between">
                <span>02. Approved Brand DNA Evidence</span>
                <span>RAG Similarity: 98.6%</span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15">
                  <div className="text-[10px] font-mono text-teal-muted font-bold mb-1">
                    POLICY CLAUSE: SLA-2025.04
                  </div>
                  <p className="text-xs text-silver leading-relaxed italic">
                    &quot;Guaranteed 100% uptime claims violate regulatory truth standards. Permissible phrasing is strictly limited to &apos;Engineered for 99.99% target availability&apos;.&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-[4px] bg-midnight border border-silver/15">
                  <div className="text-[10px] font-mono text-signal-amber font-bold mb-1">
                    POLICY CLAUSE: PRICING-102.1
                  </div>
                  <p className="text-xs text-silver leading-relaxed italic">
                    &quot;Superlatives such as &apos;lowest fees&apos; cannot be stated without citing a registered third-party audit date.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Automated Remediation & Resolution */}
            <div className="p-6 bg-slate-deep">
              <div className="text-[10px] font-mono uppercase text-teal-muted tracking-wider mb-2 flex items-center justify-between">
                <span>03. Remediated Compliant Copy</span>
                <span className="text-signal-emerald font-mono">100% Ready</span>
              </div>
              <div className="p-4 rounded-[4px] bg-midnight border border-teal-muted/40 font-mono text-xs leading-relaxed text-offwhite space-y-2 mb-4">
                <p>
                  Introducing AuraPay Prime: the institutional treasury engine 
                  <span className="bg-teal-muted/20 text-teal-muted px-1 py-0.5 rounded font-semibold mx-1">
                    engineered for 99.99% target availability
                  </span>.
                </p>
                <p>
                  Our institutional clients enjoy 
                  <span className="bg-teal-muted/20 text-teal-muted px-1 py-0.5 rounded font-semibold mx-1">
                    competitive pricing starting at 0.08% per transaction
                  </span>.
                </p>
              </div>
              <button className="w-full py-2.5 px-3 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors">
                <Check className="w-3.5 h-3.5 text-signal-emerald" />
                <span>Apply Corrections to Draft</span>
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. FEATURE 4: VISUAL FORENSICS & ASSET GOVERNANCE
      ────────────────────────────────────────────────────────────── */}
      <section id="visual-forensics" className="py-24 px-6 lg:px-8 bg-charcoal/40 border-t border-silver/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-4">
                <span>04 / MULTIMODAL FORENSICS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
                Visual Brand Forensics.
              </h2>
              <p className="text-sm text-silver/80 leading-relaxed mb-6 font-normal">
                Brand integrity doesn&apos;t end with text. AUREX inspects logos, creative banners, and social assets for pixel-level color fidelity, exclusion zones, and WCAG contrast compliance.
              </p>

              <div className="space-y-3 font-mono text-xs text-silver">
                <div className="flex items-center space-x-3 p-3 rounded-[4px] bg-midnight border border-silver/10">
                  <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0" />
                  <span>Logo Clearspace Exclusion Zone: 32px padding verified</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-[4px] bg-midnight border border-silver/10">
                  <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0" />
                  <span>Color Deviation: ΔE 0.8 (Below 2.0 threshold)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-[4px] bg-midnight border border-silver/10">
                  <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0" />
                  <span>Typography Hierarchy: Primary Manrope 32pt verified</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-[4px] bg-midnight border border-silver/10">
                  <CheckCircle2 className="w-4 h-4 text-signal-emerald flex-shrink-0" />
                  <span>Contrast Ratio: 11.4:1 (Exceeds WCAG AAA requirement)</span>
                </div>
              </div>
            </div>

            {/* Right: Visual Asset Inspection Canvas */}
            <div className="lg:col-span-7">
              <div className="rounded-[8px] bg-slate-deep border border-silver/20 overflow-hidden p-6 shadow-elevation">
                
                <div className="flex items-center justify-between text-xs font-mono text-silver/60 mb-4 pb-2 border-b border-silver/10">
                  <span>CREATIVE_INSPECTOR // ASSET_ID: #4092-BANNER.PNG</span>
                  <span className="text-teal-muted">STATUS: VERIFIED (96%)</span>
                </div>

                {/* Simulated Marketing Visual Asset */}
                <div className="relative rounded-[4px] bg-midnight border border-silver/20 p-8 overflow-hidden">
                  
                  {/* Bounding Box Overlay for Logo Clear-space */}
                  <div className="border border-dashed border-teal-muted/60 p-4 rounded inline-block mb-8 relative">
                    <div className="absolute -top-3 left-2 bg-midnight px-1.5 text-[9px] font-mono text-teal-muted">
                      LOGO EXCLUSION ZONE (32px PADDING)
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-offwhite flex items-center justify-center text-midnight font-bold font-mono text-xs">
                        A
                      </div>
                      <span className="font-extrabold text-sm tracking-wider text-offwhite">AURAPAY</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
                      Institutional Liquidity.<br />Zero Compromises.
                    </div>
                    <div className="text-xs text-silver/70 font-mono">
                      Real-time gross settlement across 42 global corridors.
                    </div>
                  </div>

                  {/* Corner Inspection Target Coordinates */}
                  <div className="absolute bottom-3 right-4 text-[10px] font-mono text-silver/40">
                    SPECTRO: #14231F / #71958C // ACC: 99.2%
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. FEATURE 5: THE TRUST PASSPORT (Full-Size Report Interface)
      ────────────────────────────────────────────────────────────── */}
      <section id="trust-passport" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-silver/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-3">
            <span>05 / THE GOLD STANDARD</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
            The Trust Passport.
          </h2>
          <p className="text-sm sm:text-base text-silver/80 leading-relaxed font-normal">
            The definitive verification credential. Before any content piece goes live, AUREX compiles an immutable, audit-ready passport with full claim citations and sovereign sign-off.
          </p>
        </div>

        {/* Full-Size Trust Passport Dossier */}
        <div className="rounded-[8px] bg-slate-deep border border-silver/20 overflow-hidden shadow-elevation">
          
          {/* Certificate Header */}
          <div className="p-6 md:p-8 bg-charcoal border-b border-silver/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2.5 text-xs font-mono text-teal-muted mb-1">
                <ShieldCheck className="w-4 h-4 text-signal-emerald" />
                <span className="font-bold tracking-wider">OFFICIAL BRAND TRUST PASSPORT // AUDIT PASSED</span>
              </div>
              <h3 className="text-2xl font-extrabold text-offwhite">
                AuraPay Global — Q4 Institutional Product Launch
              </h3>
              <p className="text-xs font-mono text-silver/60 mt-1">
                PASSPORT_ID: AX-2026-9941-SEC • HASH: 7fc92a...8831e • CERTIFIED ON: NOV 04, 2026
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center space-x-4 p-4 rounded-[4px] bg-midnight border border-silver/15">
              <div className="text-right">
                <div className="text-[10px] font-mono text-silver/60 uppercase">Governance Rating</div>
                <div className="text-xs font-semibold text-signal-emerald">READY FOR REVIEW</div>
              </div>
              <div className="w-14 h-14 rounded-[4px] bg-charcoal border border-teal-muted flex items-center justify-center">
                <span className="text-2xl font-extrabold text-offwhite font-mono">94</span>
              </div>
            </div>
          </div>

          {/* 6 Compliance Vector Breakdown Bars */}
          <div className="p-6 md:p-8 border-b border-silver/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Claims Verification", score: "96%", val: 96 },
              { label: "Voice Consistency", score: "92%", val: 92 },
              { label: "Terminology Lexicon", score: "98%", val: 98 },
              { label: "Messaging Alignment", score: "90%", val: 90 },
              { label: "Visual Standards", score: "95%", val: 95 },
              { label: "Accessibility (WCAG)", score: "91%", val: 91 },
            ].map((v, i) => (
              <div key={i} className="p-3 rounded-[4px] bg-midnight border border-silver/10">
                <div className="text-[10px] font-mono text-silver/60 uppercase truncate">{v.label}</div>
                <div className="text-lg font-mono font-bold text-offwhite my-1">{v.score}</div>
                <div className="w-full h-1.5 rounded-full bg-charcoal overflow-hidden">
                  <div className="h-full bg-teal-muted rounded-full" style={{ width: `${v.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Full Itemized Claim Matrix Table */}
          <div className="p-6 md:p-8">
            <div className="text-xs font-mono text-teal-muted uppercase tracking-wider mb-4">
              Itemized Claim Verification Matrix
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-silver/10 text-silver/50 text-[10px] uppercase">
                    <th className="py-2.5">Extracted Claim</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Confidence</th>
                    <th className="py-2.5">Brand DNA Citation</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silver/5 text-silver">
                  <tr>
                    <td className="py-3 font-sans text-offwhite font-medium max-w-xs">
                      &quot;Processes real-time gross settlement across 42 global corridors.&quot;
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-emeraldLight text-signal-emerald border border-signal-emerald/30">
                        SUPPORTED
                      </span>
                    </td>
                    <td className="py-3">99.4%</td>
                    <td className="py-3 text-silver/70">Fact #01: Q3 Network Audit</td>
                    <td className="py-3 text-right text-teal-muted font-sans font-medium">Verified</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-offwhite font-medium max-w-xs">
                      &quot;Guaranteed zero counterparty risk on institutional deposits.&quot;
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-crimsonLight text-signal-crimson border border-signal-crimson/30">
                        CONFLICTING
                      </span>
                    </td>
                    <td className="py-3">98.2%</td>
                    <td className="py-3 text-silver/70">Treasury Policy Section 4.2</td>
                    <td className="py-3 text-right text-signal-crimson font-sans font-medium">Fix Applied</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans text-offwhite font-medium max-w-xs">
                      &quot;Industry-leading execution speeds under 1.4 seconds.&quot;
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-amberLight text-signal-amber border border-signal-amber/30">
                        UNVERIFIED
                      </span>
                    </td>
                    <td className="py-3">84.1%</td>
                    <td className="py-3 text-silver/70">Telemetry Spec v2.1</td>
                    <td className="py-3 text-right text-signal-amber font-sans font-medium">Pending Ref</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Passport Controls */}
            <div className="mt-8 pt-6 border-t border-silver/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-silver/60">
                <Lock className="w-3.5 h-3.5 text-teal-muted" />
                <span>CRYPTOGRAPHIC VERIFICATION LEDGER ACTIVE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-[4px] bg-charcoal border border-silver/20 hover:border-silver/40 text-offwhite font-mono text-xs transition-colors flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-teal-muted" />
                  <span>Download PDF Certificate</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-semibold text-xs transition-colors"
                >
                  Open Full Passport
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. FEATURE 6: HUMAN-IN-THE-LOOP GOVERNANCE
      ────────────────────────────────────────────────────────────── */}
      <section id="human-governance" className="py-24 px-6 lg:px-8 bg-charcoal/60 border-t border-silver/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-slate-deep border border-silver/15 text-[11px] font-mono text-teal-muted mb-4">
                <span>06 / SOVEREIGN ACCOUNTABILITY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
                Human Review.<br />
                The Final Authority.
              </h2>
              <p className="text-sm text-silver/80 leading-relaxed mb-6 font-normal">
                AUREX never publishes autonomously. Every AI-evaluated finding, confidence score, and remediation suggestion is channeled directly to authorized brand reviewers who hold final sovereign approval authority.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-[4px] bg-midnight border border-silver/10">
                  <div className="text-xs font-bold text-offwhite mb-1">Role-Based Access Separation</div>
                  <p className="text-xs text-silver/70">
                    Creators draft and submit. Reviewers authorize or request changes. Brand Admins govern the underlying DNA repository.
                  </p>
                </div>
                <div className="p-4 rounded-[4px] bg-midnight border border-silver/10">
                  <div className="text-xs font-bold text-offwhite mb-1">Full Immutable Audit Ledger</div>
                  <p className="text-xs text-silver/70">
                    Every comment, change request, and approval signature is permanently timestamped with cryptographic SHA-256 hashes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Sovereign Reviewer Action Deck */}
            <div className="lg:col-span-7">
              <div className="rounded-[8px] bg-slate-deep border border-silver/20 p-6 md:p-8 shadow-elevation">
                
                <div className="flex items-center justify-between pb-4 border-b border-silver/15 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-charcoal border border-teal-muted/40 flex items-center justify-center font-mono text-xs font-bold text-offwhite">
                      SC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-offwhite">Sarah Chen (Brand Reviewer)</div>
                      <div className="text-[10px] font-mono text-silver/60">Assigned Reviewer • Tier-1 Authorization</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-signal-amber bg-signal-amberLight px-2 py-0.5 rounded border border-signal-amber/30">
                    Awaiting Sovereign Sign-Off
                  </span>
                </div>

                <div className="p-4 rounded-[4px] bg-midnight border border-silver/10 mb-6">
                  <div className="text-[10px] font-mono text-silver/60 uppercase mb-1">Reviewer Assessment</div>
                  <p className="text-xs text-silver leading-relaxed font-sans">
                    &quot;Content is verified except for the counterparty risk superlative. Recommended remediation from AUREX has been validated and meets regulatory standards.&quot;
                  </p>
                </div>

                {/* Sovereign Decision Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button className="py-3 px-4 rounded-[4px] bg-signal-emerald text-offwhite font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Approve Publication</span>
                  </button>
                  <button className="py-3 px-4 rounded-[4px] bg-charcoal border border-signal-amber/50 text-signal-amber font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-deep transition-colors flex items-center justify-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>
                  <button className="py-3 px-4 rounded-[4px] bg-charcoal border border-signal-crimson/50 text-signal-crimson font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-deep transition-colors flex items-center justify-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Reject Submission</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          9. ENTERPRISE TELEMETRY & IMPACT METRICS
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-silver/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-[4px] bg-charcoal/30 border border-silver/10">
            <div className="text-4xl sm:text-5xl font-extrabold text-offwhite font-mono mb-2">99.8%</div>
            <div className="text-xs font-mono text-teal-muted uppercase tracking-wider">Claim Verification Accuracy</div>
            <p className="text-[11px] text-silver/60 mt-2">Zero hallucinations across 50,000+ audited enterprise statements</p>
          </div>
          <div className="p-6 rounded-[4px] bg-charcoal/30 border border-silver/10">
            <div className="text-4xl sm:text-5xl font-extrabold text-offwhite font-mono mb-2">4.2x</div>
            <div className="text-xs font-mono text-teal-muted uppercase tracking-wider">Approval Velocity</div>
            <p className="text-[11px] text-silver/60 mt-2">Cycle times reduced from days to minutes with pre-verified RAG citations</p>
          </div>
          <div className="p-6 rounded-[4px] bg-charcoal/30 border border-silver/10">
            <div className="text-4xl sm:text-5xl font-extrabold text-offwhite font-mono mb-2">0</div>
            <div className="text-xs font-mono text-teal-muted uppercase tracking-wider">Unauthorized Claims Released</div>
            <p className="text-[11px] text-silver/60 mt-2">Zero brand discrepancies reached production in certified environments</p>
          </div>
          <div className="p-6 rounded-[4px] bg-charcoal/30 border border-silver/10">
            <div className="text-4xl sm:text-5xl font-extrabold text-offwhite font-mono mb-2">100%</div>
            <div className="text-xs font-mono text-teal-muted uppercase tracking-wider">Audit Traceability</div>
            <p className="text-[11px] text-silver/60 mt-2">Every sign-off backed by immutable cryptographic proof</p>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          10. COMMAND TERMINAL CLOSING CTA & GLOBAL FOOTER
      ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-slate-deep border-t border-silver/15">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-[4px] bg-charcoal border border-teal-muted/40 flex items-center justify-center text-offwhite mx-auto mb-6">
            <Terminal className="w-6 h-6 text-teal-muted" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-offwhite tracking-tight leading-tight mb-4">
            Arm Your Brand Governance Core.
          </h2>
          <p className="text-sm sm:text-base text-silver/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Experience the Gold Standard of Brand Integrity. Verify every piece of copy, claim, and creative asset before publication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-elevation"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-[4px] bg-charcoal border border-silver/20 hover:border-teal-muted text-offwhite font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <span>Sign In with Demo Persona</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Engineering Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-silver/10 bg-midnight text-xs font-mono text-silver/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-[2px] bg-slate-deep border border-teal-muted/30 flex items-center justify-center text-offwhite">
              <span className="font-bold text-xs">A</span>
            </div>
            <span className="font-sans font-bold text-offwhite">AUREX AI</span>
            <span>— The Gold Standard of Brand Integrity</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <a href="#brand-dna" className="hover:text-offwhite transition-colors">Brand DNA</a>
            <a href="#intelligence-engine" className="hover:text-offwhite transition-colors">Intelligence Engine</a>
            <a href="#trust-passport" className="hover:text-offwhite transition-colors">Trust Passport</a>
            <a href="#human-governance" className="hover:text-offwhite transition-colors">Human Review</a>
            <Link href="/login" className="hover:text-offwhite transition-colors">Sign In</Link>
          </div>

          <div className="text-[10px] text-silver/40">
            SYSTEM_ID: AX-PROD-2026 // ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

    </div>
  );
}
