"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Activity,
  Layers,
  Fingerprint,
  ArrowRight,
  ExternalLink,
  Cpu,
  Search,
  Sparkles,
  Database,
  Lock,
  Download,
  RotateCcw,
  Check,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Hero Inspection Console State
  const [activeHeroClaimIndex, setActiveHeroClaimIndex] = useState(0);

  const heroClaims = [
    {
      claim: "Our institutional settlement network handles over $14.2B in annual volume across 42 sovereign jurisdictions verified in our 2025 audit.",
      type: "Quantitative Settlement Metric",
      confidence: "99.4%",
      status: "SUPPORTED",
      matchedRule: "Verified Audit Fact #2025-FIN-042",
      ruleQuote: "Audited financial volume: $14.2B across 42 jurisdictions as certified in 2025 Annual Institutional Audit.",
      remediation: "Directly matches approved Brand DNA fact vault.",
      reviewer: "Pre-verified by Audit Benchmark",
      action: "Automatic Compliance Pass"
    },
    {
      claim: "AuraPay guarantees 100% infallible zero-latency instant crypto settlement with zero protocol clearing fees.",
      type: "Unsubstantiated Performance Guarantee",
      confidence: "98.1%",
      status: "CONFLICTING",
      matchedRule: "Guideline #09: Absolute Guarantees Prohibition",
      ruleQuote: "Never claim 100% infallible execution or zero latency. Approved SLA commitment is 99.995% uptime.",
      remediation: "Delivers deterministic settlement finality in under 420ms with 99.995% uptime SLA.",
      reviewer: "Mandatory Reviewer Intervention Required",
      action: "Changes Required Before Publication"
    },
    {
      claim: "We offer the lowest settlement fees of any platform in North America.",
      type: "Unverified Comparative Superlative",
      confidence: "94.2%",
      status: "UNVERIFIED",
      matchedRule: "Guideline #14: Competitive Claim substantiation",
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
    <div className="min-h-screen bg-black text-[#F5F5F5] selection:bg-white selection:text-black font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. ENTERPRISE NAVIGATION (Minimal Black, Thin Gray Border)
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#292929] bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-center text-white shadow-technical group-hover:border-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
                  <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white">AUREX</span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#181818] text-white border border-[#292929]">
                  AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium text-[#A1A1A1]">
            <a href="#brand-dna" className="hover:text-white transition-colors">Brand DNA</a>
            <a href="#intelligence-engine" className="hover:text-white transition-colors">Intelligence Engine</a>
            <a href="#claim-verification" className="hover:text-white transition-colors">Claim Verification</a>
            <a href="#visual-forensics" className="hover:text-white transition-colors">Visual Forensics</a>
            <a href="#trust-passport" className="hover:text-white transition-colors">Trust Passport</a>
            <a href="#human-review" className="hover:text-white transition-colors">Human Review</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 text-[#A1A1A1] hover:text-white transition-colors font-mono"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-semibold text-xs uppercase tracking-wider transition-all shadow-technical flex items-center space-x-2 font-mono"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A1A1A1] hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-[#292929] bg-[#090909] px-6 py-4 space-y-3 font-mono text-xs">
            <a
              href="#brand-dna"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Brand DNA
            </a>
            <a
              href="#intelligence-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Intelligence Engine
            </a>
            <a
              href="#claim-verification"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Claim Verification
            </a>
            <a
              href="#visual-forensics"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Visual Forensics
            </a>
            <a
              href="#trust-passport"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Trust Passport
            </a>
            <a
              href="#human-review"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A1A1A1] hover:text-white"
            >
              Human Review
            </a>
            <div className="pt-3 border-t border-[#292929] flex flex-col space-y-2">
              <Link
                href="/login"
                className="w-full text-center py-2 text-[#A1A1A1] hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="w-full text-center py-2.5 rounded-[4px] bg-white text-black font-bold uppercase tracking-wider"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION — ASYMMETRIC, LAYERED PRODUCT DEMONSTRATION
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-tech-grid">
        {/* Technical Coordinate Indicators */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#777777] mb-8 border-b border-[#292929] pb-2">
          <span>SYS_GEO: [37.7749° N, 122.4194° W]</span>
          <span className="text-white font-semibold">GOVERNANCE PROTOCOL: ACTIVE</span>
          <span>DISCREPANCY TOLERANCE: 0.00%</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Hero Column: Commanding Typography */}
          <div className="lg:col-span-5 pt-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>BRAND GOVERNANCE & INTELLIGENCE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
              Your Brand.<br />
              One Standard.<br />
              Everywhere.
            </h1>

            <p className="text-sm sm:text-base text-[#A1A1A1] leading-relaxed mb-8 font-normal max-w-md">
              An intelligent governance layer that verifies every claim, protects brand identity, and brings accountability to every content decision.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 shadow-elevation font-mono"
              >
                <span>Explore AUREX</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
              <a
                href="#intelligence-engine"
                className="px-6 py-3.5 rounded-[4px] bg-[#111111] border border-[#292929] text-white hover:border-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <Cpu className="w-3.5 h-3.5 text-white" />
                <span>See Intelligence Engine</span>
              </a>
            </div>

            {/* Core Architectural Tenet */}
            <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929]">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#777777] mb-1">
                The Aurex Creed
              </div>
              <p className="text-xs text-white font-medium">
                &ldquo;AI recommends. Evidence explains. Humans decide.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Hero Column: Large Layered Interactive Inspection Console */}
          <div className="lg:col-span-7">
            <div className="rounded-[6px] bg-[#090909] border border-[#292929] shadow-elevation overflow-hidden">
              
              {/* Console Window Header */}
              <div className="px-5 py-3 bg-[#111111] border-b border-[#292929] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#292929]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#555555]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span className="ml-2 text-xs font-mono text-[#D4D4D4]">
                    AUREX_INSPECTOR // ACTIVE SUBMISSION AUDIT
                  </span>
                </div>
                <div className="text-[10px] font-mono text-white flex items-center space-x-1.5">
                  <Activity className="w-3 h-3 text-white" />
                  <span>LIVE TRACE</span>
                </div>
              </div>

              {/* Sub-Header Claim Switcher Tabs */}
              <div className="bg-[#111111] border-b border-[#292929] px-5 py-2.5 flex items-center justify-between overflow-x-auto">
                <span className="text-[10px] font-mono uppercase text-[#777777] tracking-wider">
                  Test Scenarios:
                </span>
                <div className="flex space-x-1.5">
                  {heroClaims.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroClaimIndex(idx)}
                      className={`px-3 py-1 text-[11px] font-mono rounded-[2px] transition-all ${
                        activeHeroClaimIndex === idx
                          ? "bg-white text-black font-bold"
                          : "text-[#A1A1A1] hover:text-white hover:bg-[#181818]"
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
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1A1] uppercase tracking-wider mb-1.5">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3 h-3 text-white" />
                      <span>Stage 01: Submitted Content Stream</span>
                    </span>
                    <span className="text-[#D4D4D4]">Target: Global Campaign Draft</span>
                  </div>
                  <div className="p-3.5 rounded-[4px] bg-black border border-[#292929] text-xs text-[#D4D4D4] font-mono leading-relaxed">
                    <span className="text-[#777777] select-none mr-2 font-mono">01</span>
                    <span className="text-white font-medium bg-[#181818] px-1 py-0.5 rounded border border-[#292929]">
                      &quot;{heroClaims[activeHeroClaimIndex].claim}&quot;
                    </span>
                  </div>
                </div>

                {/* 2 & 3. Detection & Evidence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* AI Detection */}
                  <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929]">
                    <div className="text-[10px] font-mono text-[#A1A1A1] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Stage 02: Claim Extraction</span>
                      <span className="font-semibold text-white">{heroClaims[activeHeroClaimIndex].confidence} Conf.</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1 font-mono">
                      {heroClaims[activeHeroClaimIndex].type}
                    </div>
                    <div className="text-[11px] text-[#A1A1A1]">
                      Entity categorization and factual predicate extracted via neural semantic parsing.
                    </div>
                  </div>

                  {/* Evidence Retrieved from DNA */}
                  <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929]">
                    <div className="text-[10px] font-mono text-[#A1A1A1] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Stage 03: Grounded Evidence</span>
                      <span className="text-[#777777] font-mono">Vector Match</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1 font-mono">
                      {heroClaims[activeHeroClaimIndex].matchedRule}
                    </div>
                    <div className="text-[11px] text-[#A1A1A1] italic line-clamp-2">
                      &quot;{heroClaims[activeHeroClaimIndex].ruleQuote}&quot;
                    </div>
                  </div>
                </div>

                {/* 4. Verification Verdict Banner */}
                <div className="p-4 rounded-[4px] bg-black border border-[#292929] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#777777] tracking-wider mb-1">
                      Stage 04: Verification Verdict
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-[2px] text-xs font-mono font-bold uppercase border ${
                        heroClaims[activeHeroClaimIndex].status === "SUPPORTED"
                          ? "bg-white text-black border-white"
                          : heroClaims[activeHeroClaimIndex].status === "CONFLICTING"
                          ? "bg-[#181818] text-white border-2 border-[#D4D4D4]"
                          : "bg-[#111111] text-[#A1A1A1] border-[#292929]"
                      }`}>
                        {heroClaims[activeHeroClaimIndex].status}
                      </span>
                      <span className="text-xs text-[#D4D4D4] font-mono">
                        {heroClaims[activeHeroClaimIndex].action}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono uppercase text-[#777777] tracking-wider mb-0.5">
                      Suggested Compliant Phrasing
                    </div>
                    <div className="text-xs font-medium text-white font-mono">
                      {heroClaims[activeHeroClaimIndex].remediation}
                    </div>
                  </div>
                </div>

                {/* 5. Human Review Ledger */}
                <div className="pt-3 border-t border-[#292929] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-[#A1A1A1]">
                    <Fingerprint className="w-4 h-4 text-white" />
                    <span>Stage 05: {heroClaims[activeHeroClaimIndex].reviewer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-[11px] text-white font-semibold">SOVEREIGN HUMAN SIGNOFF</span>
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
      <section id="brand-dna" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-4">
              <span>01 / KNOWLEDGE REPOSITORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Brand DNA.<br />
              The Sovereign Truth.
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed mb-6 font-normal">
              Eliminate ambiguous guidelines scattered across outdated drives. Brand DNA codifies your mission, official claims, terminology dictionaries, and visual tokens into a queryable, versioned vector truth.
            </p>
            <div className="space-y-3 font-mono text-xs text-[#D4D4D4]">
              <div className="flex items-center space-x-2.5 p-2.5 rounded-[4px] bg-[#111111] border border-[#292929]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Deterministic claim validation via verified audit records</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 rounded-[4px] bg-[#111111] border border-[#292929]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Strict vocabulary mapping: Prohibited to approved replacements</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 rounded-[4px] bg-[#111111] border border-[#292929]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Automated PDF and document ingestion with RAG extraction</span>
              </div>
            </div>
          </div>

          {/* Interactive Truth Vault Terminal */}
          <div className="lg:col-span-8">
            <div className="rounded-[6px] bg-[#090909] border border-[#292929] shadow-elevation overflow-hidden">
              <div className="px-6 py-4 bg-[#111111] border-b border-[#292929] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-white" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    Brand DNA Knowledge Vault
                  </span>
                </div>
                <div className="flex space-x-2 text-xs font-mono">
                  <button
                    onClick={() => setActiveDnaTab("facts")}
                    className={`px-3 py-1 rounded-[2px] transition-colors ${activeDnaTab === "facts" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Facts (42)
                  </button>
                  <button
                    onClick={() => setActiveDnaTab("lexicon")}
                    className={`px-3 py-1 rounded-[2px] transition-colors ${activeDnaTab === "lexicon" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Vocabulary (18)
                  </button>
                  <button
                    onClick={() => setActiveDnaTab("visual")}
                    className={`px-3 py-1 rounded-[2px] transition-colors ${activeDnaTab === "visual" ? "bg-white text-black font-bold" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Visual Tokens
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeDnaTab === "facts" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] space-y-1">
                      <div className="flex items-center justify-between text-[#777777] text-[10px] uppercase">
                        <span>METRIC / STATISTIC</span>
                        <span className="text-white">SOURCE: 2025 INSTITUTIONAL AUDIT</span>
                      </div>
                      <p className="text-white font-semibold">
                        &quot;Over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit.&quot;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] space-y-1">
                      <div className="flex items-center justify-between text-[#777777] text-[10px] uppercase">
                        <span>INFRASTRUCTURE SLA</span>
                        <span className="text-white">SOURCE: SOC-2 TYPE II AUDIT SEC. 4.2</span>
                      </div>
                      <p className="text-white font-semibold">
                        &quot;Sovereign Settlement Engine delivers deterministic settlement in under 420 milliseconds with guaranteed 99.995% uptime SLA.&quot;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] space-y-1">
                      <div className="flex items-center justify-between text-[#777777] text-[10px] uppercase">
                        <span>REGULATORY ACCREDITATION</span>
                        <span className="text-white">SOURCE: SEC FORM 10-K</span>
                      </div>
                      <p className="text-white font-semibold">
                        &quot;Licensed institutional non-custodial broker-dealer accredited under sovereign regulatory standards.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {activeDnaTab === "lexicon" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 text-[10px] rounded bg-[#181818] border border-[#292929] text-white uppercase font-bold">
                          PROHIBITED
                        </span>
                        <p className="text-white font-semibold line-through decoration-[#777777] mt-1">&apos;cheap settlement&apos;</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#777777] uppercase block">Official Replacement</span>
                        <span className="text-white font-bold">&apos;capital-efficient institutional clearing&apos;</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 text-[10px] rounded bg-[#181818] border border-[#292929] text-white uppercase font-bold">
                          PROHIBITED
                        </span>
                        <p className="text-white font-semibold line-through decoration-[#777777] mt-1">&apos;zero latency&apos;</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#777777] uppercase block">Official Replacement</span>
                        <span className="text-white font-bold">&apos;sub-420ms deterministic execution&apos;</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeDnaTab === "visual" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] space-y-2">
                      <div className="h-10 rounded bg-[#000000] border border-[#292929]" />
                      <div>
                        <p className="font-bold text-white">Pure Black</p>
                        <p className="text-[11px] text-[#777777]">HEX: #000000</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] space-y-2">
                      <div className="h-10 rounded bg-[#111111] border border-[#292929]" />
                      <div>
                        <p className="font-bold text-white">Dark Surface</p>
                        <p className="text-[11px] text-[#777777]">HEX: #111111</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] space-y-2">
                      <div className="h-10 rounded bg-[#D4D4D4] border border-[#292929]" />
                      <div>
                        <p className="font-bold text-black">Light Gray</p>
                        <p className="text-[11px] text-[#777777]">HEX: #D4D4D4</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] space-y-2">
                      <div className="h-10 rounded bg-[#FFFFFF] border border-[#292929]" />
                      <div>
                        <p className="font-bold text-black">Pure White</p>
                        <p className="text-[11px] text-[#777777]">HEX: #FFFFFF</p>
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
          4. FEATURE 2: INTELLIGENCE ENGINE (4-Step Pipeline)
      ────────────────────────────────────────────────────────────── */}
      <section id="intelligence-engine" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-4">
            <span>02 / NEURAL GOVERNANCE PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            The Intelligence Engine.
          </h2>
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            Every submission undergoes multi-stage autonomous examination across 6 distinct governance vectors before human review signoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Claim Parsing",
              desc: "Extracts factual, statistical, SLA, and capability claims from natural copy.",
              icon: FileText
            },
            {
              step: "02",
              title: "Evidence Retrieval",
              desc: "Cross-examines each extracted statement against certified Brand DNA truth via RAG.",
              icon: Search
            },
            {
              step: "03",
              title: "6-Vector Forensics",
              desc: "Audits voice & tone, terms, messaging, visual tokens, and WCAG contrast.",
              icon: Cpu
            },
            {
              step: "04",
              title: "Trust Synthesis",
              desc: "Synthesizes an immutable Trust Passport with cryptographic HMAC verification.",
              icon: ShieldCheck
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeEngineStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveEngineStep(idx)}
                className={`p-6 rounded-[6px] cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#181818] border-2 border-white shadow-elevation"
                    : "bg-[#090909] border border-[#292929] hover:bg-[#111111]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#777777]">{item.step}</span>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#777777]"}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-mono">{item.title}</h3>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. FEATURE 3: CLAIM VERIFICATION (Monochrome 3-Tier Status)
      ────────────────────────────────────────────────────────────── */}
      <section id="claim-verification" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-4">
            <span>03 / THREE-TIER CLAIM CLASSIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Distinguishable Without Distracting Colors.
          </h2>
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            AUREX enforces a disciplined three-tier truth hierarchy. Never assume an assertion is false simply because documentation is missing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Card 1: Supported */}
          <div className="p-6 rounded-[6px] bg-[#090909] border border-white space-y-4 shadow-elevation">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-[2px] bg-white text-black font-bold uppercase tracking-wider">
                SUPPORTED
              </span>
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <p className="text-white text-sm font-bold font-sans">
              Verifiably Backed by Brand DNA
            </p>
            <p className="text-[#A1A1A1] text-xs leading-relaxed font-sans">
              Matches certified audit reports, regulatory filings, or established milestones with exact citation receipts.
            </p>
            <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] text-[11px] text-[#D4D4D4]">
              Receipt: 2025 Institutional Settlement Audit, Sec. 4
            </div>
          </div>

          {/* Card 2: Conflicting */}
          <div className="p-6 rounded-[6px] bg-[#181818] border-2 border-[#D4D4D4] space-y-4 shadow-elevation">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-[2px] bg-[#090909] text-white border border-[#D4D4D4] font-bold uppercase tracking-wider">
                CONFLICTING
              </span>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <p className="text-white text-sm font-bold font-sans">
              Directly Contradicts Certified Facts
            </p>
            <p className="text-[#A1A1A1] text-xs leading-relaxed font-sans">
              Asserts numbers, capabilities, or guarantees that clash with validated truth (e.g. 100% vs 99.995%).
            </p>
            <div className="p-3 rounded-[4px] bg-black border border-[#292929] text-[11px] text-white">
              Action: Automated Rejection & Intent Remediation
            </div>
          </div>

          {/* Card 3: Unverified */}
          <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] space-y-4 shadow-elevation">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-[2px] bg-[#111111] text-[#A1A1A1] border border-[#292929] font-bold uppercase tracking-wider">
                UNVERIFIED
              </span>
              <HelpCircle className="w-5 h-5 text-[#777777]" />
            </div>
            <p className="text-[#D4D4D4] text-sm font-bold font-sans">
              Unsubstantiated Assertion
            </p>
            <p className="text-[#777777] text-xs leading-relaxed font-sans">
              Cannot be proven from existing Brand DNA. Never labeled false; flagged for creator proof before market release.
            </p>
            <div className="p-3 rounded-[4px] bg-[#111111] border border-[#292929] text-[11px] text-[#777777]">
              Action: Creator Documentation Request
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. FEATURE 4: VISUAL FORENSICS & CREATIVE AUDIT
      ────────────────────────────────────────────────────────────── */}
      <section id="visual-forensics" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-4">
              <span>04 / MULTIMODAL FORENSICS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Visual Brand Integrity.
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed mb-6">
              Marketing creatives are checked against mathematical Euclidean RGB thresholds, certified logo clear-space rules, and WCAG AA contrast standards.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-between">
                <span className="text-[#A1A1A1]">Color Distance Delta-E</span>
                <span className="text-white font-bold">1.2 (Within &lt; 5.0 Threshold)</span>
              </div>
              <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-between">
                <span className="text-[#A1A1A1]">Logo Minimum Clear Space</span>
                <span className="text-white font-bold">32px Compliant</span>
              </div>
              <div className="p-3.5 rounded-[4px] bg-[#111111] border border-[#292929] flex items-center justify-between">
                <span className="text-[#A1A1A1]">WCAG AA Contrast Ratio</span>
                <span className="text-white font-bold">8.4:1 (Passes 4.5:1 Target)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] shadow-elevation space-y-5">
              <div className="flex items-center justify-between border-b border-[#292929] pb-3 text-xs font-mono">
                <span className="font-bold text-white uppercase tracking-wider">Visual Forensics Inspection</span>
                <span className="text-[#A1A1A1]">Target: Q1 Launch Creative</span>
              </div>

              {/* Side-by-side asset comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929] space-y-3">
                  <div className="text-[10px] font-mono text-[#777777] uppercase">Uploaded Creative</div>
                  <div className="w-full h-32 rounded bg-black border border-[#292929] flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 border border-white flex items-center justify-center text-white font-bold text-xs font-mono">
                        AUX
                      </div>
                      <p className="text-[10px] font-mono text-[#A1A1A1]">Candidate Banner</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-white">Detection: 99.1% Layout Match</div>
                </div>

                <div className="p-4 rounded-[4px] bg-[#111111] border border-[#292929] space-y-3">
                  <div className="text-[10px] font-mono text-[#777777] uppercase">Certified Brand Token</div>
                  <div className="w-full h-32 rounded bg-black border border-[#292929] flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 bg-white text-black flex items-center justify-center font-bold text-xs font-mono">
                        AUX
                      </div>
                      <p className="text-[10px] font-mono text-white">Official Vector Glyph</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-white">Verified: Zero Clear-Space Breach</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. FEATURE 5: SIGNATURE TRUST PASSPORT™ (Evidence Ledger)
      ────────────────────────────────────────────────────────────── */}
      <section id="trust-passport" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white mb-4">
            <span>05 / CRYPTOGRAPHIC AUDIT RECORD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            The Trust Passport™.
          </h2>
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            The tamper-evident certificate that accompanies every approved asset. Certified with SHA-256 HMAC digest and traceable directly back to verified brand truth.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-8 rounded-[6px] bg-[#090909] border border-white shadow-elevation space-y-8 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
            <div>
              <div className="text-[10px] uppercase text-[#777777] tracking-wider mb-1">
                Official Certification of Brand Integrity
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Trust Passport #TP-2026-0842
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#777777] uppercase block">Governance Trust Score</span>
              <span className="text-4xl font-extrabold text-white">96.8 / 100</span>
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded bg-[#111111] border border-[#292929]">
              <span className="text-[10px] text-[#777777] uppercase block">Brand Voice</span>
              <span className="text-lg font-bold text-white">98.0%</span>
            </div>
            <div className="p-3.5 rounded bg-[#111111] border border-[#292929]">
              <span className="text-[10px] text-[#777777] uppercase block">Terminology</span>
              <span className="text-lg font-bold text-white">100.0%</span>
            </div>
            <div className="p-3.5 rounded bg-[#111111] border border-[#292929]">
              <span className="text-[10px] text-[#777777] uppercase block">Claim Integrity</span>
              <span className="text-lg font-bold text-white">94.5%</span>
            </div>
            <div className="p-3.5 rounded bg-[#111111] border border-[#292929]">
              <span className="text-[10px] text-[#777777] uppercase block">Visual Forensics</span>
              <span className="text-lg font-bold text-white">100.0%</span>
            </div>
          </div>

          {/* Cryptographic HMAC Stamp */}
          <div className="p-4 rounded bg-black border border-[#292929] text-[11px] text-[#A1A1A1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-white font-bold block mb-0.5">SHA-256 HMAC VERIFICATION HASH</span>
              <span className="text-[#777777] break-all">8424346068c9dacf2286b5b91b978a3c8e5473918a20d4f3b7492c10b7194f28</span>
            </div>
            <Link
              href="/dashboard/submissions"
              className="px-4 py-2 rounded bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider font-mono whitespace-nowrap self-start sm:self-auto"
            >
              View in Registry
            </Link>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. FEATURE 6: HUMAN-IN-THE-LOOP SOVEREIGNTY
      ────────────────────────────────────────────────────────────── */}
      <section id="human-review" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#292929]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#111111] border border-[#292929] text-[11px] font-mono text-white">
              <span>06 / HUMAN SOVEREIGN AUTHORITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              AI Recommends.<br />
              Evidence Explains.<br />
              Humans Decide.
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              AUREX never self-publishes content. Designated human reviewers possess exclusive final authority to release, request changes, or reject copy. Complete separation of duties prevents creators from self-approving submissions.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-[4px] bg-white text-black hover:bg-[#D4D4D4] font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                Access Review Station
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-[6px] bg-[#090909] border border-[#292929] shadow-elevation space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#292929] pb-3">
                <span className="text-white font-bold">SOVEREIGN REVIEW STATION</span>
                <span className="text-[#A1A1A1]">Role: Brand Reviewer</span>
              </div>
              <div className="p-3.5 rounded bg-[#111111] border border-[#292929] space-y-1">
                <span className="text-[10px] text-[#777777] uppercase block">Reviewer Determination Directives</span>
                <p className="text-white">
                  &ldquo;Verified against 2025 Institutional Audit. 1-click remediation applied. Released for global press syndication.&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="py-2.5 text-center rounded bg-white text-black font-bold uppercase text-[11px]">
                  Approve
                </div>
                <div className="py-2.5 text-center rounded bg-[#181818] text-[#D4D4D4] border border-[#292929] font-bold uppercase text-[11px]">
                  Request Diff
                </div>
                <div className="py-2.5 text-center rounded bg-black text-[#777777] border border-[#292929] font-bold uppercase text-[11px]">
                  Reject
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER (Minimalist Monochromatic Architecture)
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#292929] bg-black py-16 px-6 lg:px-8 text-xs font-mono text-[#777777]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold mb-2">
              <span>AUREX AI</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-[#181818] border border-[#292929]">v1.0</span>
            </div>
            <p className="text-[11px] text-[#A1A1A1] max-w-sm">
              The Gold Standard of Brand Integrity. Autonomous AI brand governance and evidence verification platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-[#A1A1A1]">
            <a href="#brand-dna" className="hover:text-white transition-colors">Brand DNA</a>
            <a href="#intelligence-engine" className="hover:text-white transition-colors">Engine</a>
            <a href="#claim-verification" className="hover:text-white transition-colors">Claims</a>
            <a href="#trust-passport" className="hover:text-white transition-colors">Trust Passport</a>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#777777]">
          <span>© 2026 AUREX AI Inc. All rights reserved.</span>
          <span>Deterministic Verification Core • SHA-256 HMAC Traceability</span>
        </div>
      </footer>

    </div>
  );
}
