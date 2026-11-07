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
      sampleName: "Sample 01",
      submittedText: "Our institutional settlement network handles over $14.2B in annual volume across 42 sovereign jurisdictions verified in our 2025 audit.",
      extractedClaim: "$14.2B annual volume across 42 sovereign jurisdictions",
      category: "Quantitative Settlement Metric",
      confidence: "99.4%",
      evidenceSource: "Verified Audit Fact Vault #2025-FIN-042",
      evidenceReference: "Audited financial volume: $14.2B across 42 jurisdictions as certified in 2025 Annual Institutional Audit.",
      supportingContext: "Certified by independent audit ledger. Vector similarity match: 0.982.",
      status: "SUPPORTED",
      verdictExplanation: "The numerical claim and jurisdiction count directly match the approved Brand DNA truth repository.",
      suggestedPhrasing: "Compliant as submitted. No remediation required.",
      reviewer: "Audited by Head of Brand Compliance (Sarah C.)",
      action: "Automatic Compliance Pass",
      humanStatus: "APPROVED FOR SYNDICATION"
    },
    {
      sampleName: "Sample 02",
      submittedText: "AuraPay guarantees 100% infallible zero-latency instant crypto settlement with zero protocol clearing fees.",
      extractedClaim: "100% infallible zero-latency instant settlement",
      category: "Absolute Performance Guarantee",
      confidence: "98.1%",
      evidenceSource: "Brand Policy Guideline #09: Absolute Guarantees Prohibition",
      evidenceReference: "Never claim 100% infallible execution or zero latency. Approved SLA commitment is 99.995% uptime with sub-420ms finality.",
      supportingContext: "Regulatory violation risk: FTC / SEC misleading marketing risk factor.",
      status: "CONFLICTING",
      verdictExplanation: "Claim violates mandatory policy prohibiting absolute superlatives ('100% infallible') and unverified zero-latency claims.",
      suggestedPhrasing: "Delivers deterministic settlement finality in under 420ms backed by a 99.995% uptime SLA.",
      reviewer: "Assigned to Lead Reviewer (Marcus V.)",
      action: "Remediation Enforced Before Release",
      humanStatus: "CHANGES REQUIRED BY HUMAN"
    },
    {
      sampleName: "Sample 03",
      submittedText: "We offer the lowest settlement fees of any platform in North America.",
      extractedClaim: "Lowest settlement fees of any platform in North America",
      category: "Comparative Superlative Assertion",
      confidence: "94.2%",
      evidenceSource: "Brand Guideline #14: Competitive Claim Substantiation",
      evidenceReference: "Comparative superlatives ('lowest', 'cheapest') must cite a verified third-party benchmark study with date.",
      supportingContext: "No third-party study citation found in Brand DNA or submitted references.",
      status: "UNVERIFIED",
      verdictExplanation: "Comparative superlative lacks verifiable benchmark evidence in the active Brand DNA repository.",
      suggestedPhrasing: "Offers competitive institutional clearing fees starting at 0.08% per transaction.",
      reviewer: "Pending Supporting Documentation",
      action: "Proof Citation Required",
      humanStatus: "HELD IN REVIEW QUEUE"
    }
  ];

  // Interactive Brand DNA Workspace State
  const [activeDnaTab, setActiveDnaTab] = useState<"facts" | "lexicon" | "visual">("facts");

  // Interactive Intelligence Engine Node State
  const [activeEngineStep, setActiveEngineStep] = useState(2);

  return (
    <div className="min-h-screen bg-black text-[#F5F5F5] selection:bg-white selection:text-black font-sans relative">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 glow-ambient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-tech-grid opacity-60 pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────
          1. ENTERPRISE NAVIGATION (Frosted Glass Header)
      ────────────────────────────────────────────────────────────── */}
      <header className="glass-nav sticky top-0 z-50 w-full relative z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-[6px] bg-white/5 border border-white/15 flex items-center justify-center text-white shadow-technical group-hover:border-white/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
                  <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white">AUREX</span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-white/10 text-white border border-white/15">
                  AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium text-[#A3A3A3]">
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
              className="text-xs font-semibold px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors font-mono"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#E5E5E5] font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_28px_rgba(255,255,255,0.3)] flex items-center space-x-2 font-mono"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A3A3A3] hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden glass-panel border-b border-white/10 px-6 py-4 space-y-3 font-mono text-xs">
            <a
              href="#brand-dna"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Brand DNA
            </a>
            <a
              href="#intelligence-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Intelligence Engine
            </a>
            <a
              href="#claim-verification"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Claim Verification
            </a>
            <a
              href="#visual-forensics"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Visual Forensics
            </a>
            <a
              href="#trust-passport"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Trust Passport
            </a>
            <a
              href="#human-review"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A3A3A3] hover:text-white"
            >
              Human Review
            </a>
            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-[#A3A3A3] hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-[6px] bg-white text-black font-bold uppercase tracking-wider"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION — ASYMMETRIC, LAYERED GLASSMORPHIC CONSOLE
      ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Hero Column: Commanding Typography */}
          <div className="lg:col-span-5 pt-2 space-y-6">
            <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
              <span>BRAND GOVERNANCE & INTELLIGENCE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Your Brand.<br />
              One Standard.<br />
              Everywhere.
            </h1>

            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed font-normal max-w-md">
              An intelligent governance layer that verifies every claim, protects brand identity, and brings accountability to every content decision.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-[6px] bg-white text-black hover:bg-[#E5E5E5] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 shadow-[0_0_24px_rgba(255,255,255,0.22)] hover:shadow-[0_0_32px_rgba(255,255,255,0.35)] font-mono"
              >
                <span>Explore AUREX</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
              <a
                href="#intelligence-engine"
                className="glass-button px-6 py-3.5 rounded-[6px] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Cpu className="w-3.5 h-3.5 text-white" />
                <span>See the Intelligence Engine</span>
              </a>
            </div>

            {/* Below the buttons: Four compact feature indicators */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="glass-card p-3 rounded-[8px] flex items-center space-x-2.5 border border-white/10 hover:border-white/25">
                <div className="w-6 h-6 rounded-[4px] bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">Verify Claims</div>
                  <div className="text-[10px] text-[#737373] truncate">Ground in DNA facts</div>
                </div>
              </div>
              <div className="glass-card p-3 rounded-[8px] flex items-center space-x-2.5 border border-white/10 hover:border-white/25">
                <div className="w-6 h-6 rounded-[4px] bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">Protect Brand</div>
                  <div className="text-[10px] text-[#737373] truncate">Voice & identity lock</div>
                </div>
              </div>
              <div className="glass-card p-3 rounded-[8px] flex items-center space-x-2.5 border border-white/10 hover:border-white/25">
                <div className="w-6 h-6 rounded-[4px] bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">Detect Issues</div>
                  <div className="text-[10px] text-[#737373] truncate">Misaligned assertions</div>
                </div>
              </div>
              <div className="glass-card p-3 rounded-[8px] flex items-center space-x-2.5 border border-white/10 hover:border-white/25">
                <div className="w-6 h-6 rounded-[4px] bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">Human Review</div>
                  <div className="text-[10px] text-[#737373] truncate">Sovereign authority</div>
                </div>
              </div>
            </div>

            {/* Core Architectural Tenet */}
            <div className="glass-inner rounded-[10px] p-3.5 border border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#737373] mb-1">
                The Aurex Creed
              </div>
              <p className="text-xs text-white font-medium italic">
                &ldquo;AI recommends. Evidence explains. Humans decide.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Hero Column: Large Layered Interactive Inspection Console */}
          <div className="lg:col-span-7">
            <div className="glass-card-elevated shimmer-sweep rounded-[14px] border border-white/18 shadow-2xl overflow-hidden backdrop-blur-3xl">
              
              {/* Console Window Header */}
              <div className="px-5 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  <span className="ml-2 text-xs font-mono text-[#E5E5E5] font-semibold">
                    AUREX_INSPECTOR // ACTIVE SUBMISSION AUDIT
                  </span>
                </div>
                <div className="glass-pill px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono text-white flex items-center space-x-1.5 border border-white/15">
                  <Activity className="w-3 h-3 text-white animate-pulse" />
                  <span>LIVE TRACE</span>
                </div>
              </div>

              {/* Sub-Header Claim Switcher Tabs */}
              <div className="bg-white/5 border-b border-white/10 px-5 py-2.5 flex items-center justify-between overflow-x-auto">
                <span className="text-[10px] font-mono uppercase text-[#A3A3A3] tracking-wider">
                  Sample Scenarios:
                </span>
                <div className="flex space-x-1.5">
                  {heroClaims.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroClaimIndex(idx)}
                      className={`px-3 py-1 text-[11px] font-mono rounded-[4px] transition-all ${
                        activeHeroClaimIndex === idx
                          ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                          : "text-[#A3A3A3] hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {item.sampleName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Body: 5-Stage Visual Hierarchy */}
              <div className="p-6 space-y-4">
                
                {/* Stage 01: Submitted Content Stream */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider mb-1.5">
                    <span className="flex items-center space-x-1.5 text-white">
                      <FileText className="w-3.5 h-3.5 text-white" />
                      <span className="font-bold">Stage 01: Submitted Content Stream</span>
                    </span>
                    <span className="text-[#737373]">Target: Institutional Announcement</span>
                  </div>
                  <div className="glass-inner p-3.5 rounded-[8px] text-xs text-[#E5E5E5] font-mono leading-relaxed border border-white/10">
                    <span className="text-[#737373] select-none mr-2 font-mono font-bold">01</span>
                    <span className="text-white font-medium bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
                      &quot;{heroClaims[activeHeroClaimIndex].submittedText}&quot;
                    </span>
                  </div>
                </div>

                {/* Stage 02 & 03: Claim Extraction & Grounded Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* Stage 02: Claim Extraction */}
                  <div className="glass-card rounded-[8px] p-4 border border-white/12 space-y-1.5">
                    <div className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider flex items-center justify-between">
                      <span className="font-bold text-white">Stage 02: Claim Extraction</span>
                      <span className="font-semibold text-white px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                        {heroClaims[activeHeroClaimIndex].confidence} Conf.
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono pt-1">
                      {heroClaims[activeHeroClaimIndex].category}
                    </div>
                    <div className="text-[11px] text-[#A3A3A3] leading-relaxed">
                      Extracted Claim: <span className="text-white">&quot;{heroClaims[activeHeroClaimIndex].extractedClaim}&quot;</span>
                    </div>
                  </div>

                  {/* Stage 03: Grounded Evidence */}
                  <div className="glass-card rounded-[8px] p-4 border border-white/12 space-y-1.5">
                    <div className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider flex items-center justify-between">
                      <span className="font-bold text-white">Stage 03: Grounded Evidence</span>
                      <span className="text-white text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                        Vector Match
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono pt-1 truncate">
                      {heroClaims[activeHeroClaimIndex].evidenceSource}
                    </div>
                    <div className="text-[11px] text-[#A3A3A3] italic line-clamp-2 leading-relaxed">
                      &quot;{heroClaims[activeHeroClaimIndex].evidenceReference}&quot;
                    </div>
                  </div>
                </div>

                {/* Stage 04: Verification Verdict Banner */}
                <div className="glass-card-elevated rounded-[8px] p-4 border border-white/15 space-y-2 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#A3A3A3] tracking-wider mb-1 font-bold">
                        Stage 04: Verification Verdict
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-[4px] text-xs font-mono font-bold uppercase border ${
                          heroClaims[activeHeroClaimIndex].status === "SUPPORTED"
                            ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                            : heroClaims[activeHeroClaimIndex].status === "CONFLICTING"
                            ? "bg-[#171717] text-white border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                            : "bg-[#101010] text-[#A3A3A3] border-white/15"
                        }`}>
                          {heroClaims[activeHeroClaimIndex].status}
                        </span>
                        <span className="text-xs text-[#E5E5E5] font-mono">
                          {heroClaims[activeHeroClaimIndex].action}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] font-mono uppercase text-[#A3A3A3] tracking-wider mb-0.5">
                        Suggested Compliant Phrasing
                      </div>
                      <div className="text-xs font-medium text-white font-mono">
                        {heroClaims[activeHeroClaimIndex].suggestedPhrasing}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A3A3A3] leading-relaxed pt-1">
                    <span className="text-white font-semibold">Explanation: </span>
                    {heroClaims[activeHeroClaimIndex].verdictExplanation}
                  </p>
                </div>

                {/* Stage 05: Human Review Ledger */}
                <div className="glass-pill rounded-[8px] p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2 text-[#E5E5E5]">
                    <Fingerprint className="w-4 h-4 text-white flex-shrink-0" />
                    <span>Stage 05: {heroClaims[activeHeroClaimIndex].reviewer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                    <span className="text-[11px] text-white font-bold">{heroClaims[activeHeroClaimIndex].humanStatus}</span>
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
      <section id="brand-dna" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
              <span>01 / KNOWLEDGE REPOSITORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Brand DNA.<br />
              The Sovereign Truth.
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed font-normal">
              Eliminate ambiguous guidelines scattered across outdated drives. Brand DNA codifies your mission, official claims, terminology dictionaries, and visual tokens into a queryable, versioned vector truth.
            </p>
            <div className="space-y-2.5 font-mono text-xs text-[#D4D4D4] pt-2">
              <div className="glass-card flex items-center space-x-2.5 p-3 rounded-[6px]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Deterministic claim validation via verified audit records</span>
              </div>
              <div className="glass-card flex items-center space-x-2.5 p-3 rounded-[6px]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Strict vocabulary mapping: Prohibited to approved replacements</span>
              </div>
              <div className="glass-card flex items-center space-x-2.5 p-3 rounded-[6px]">
                <Check className="w-4 h-4 text-white flex-shrink-0" />
                <span>Automated PDF and document ingestion with RAG extraction</span>
              </div>
            </div>
          </div>

          {/* Interactive Truth Vault Terminal */}
          <div className="lg:col-span-8">
            <div className="glass-card-elevated rounded-[12px] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-white" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                    Brand DNA Knowledge Vault
                  </span>
                </div>
                <div className="glass-pill p-1 rounded-[6px] flex space-x-1 text-xs font-mono">
                  <button
                    onClick={() => setActiveDnaTab("facts")}
                    className={`px-3 py-1 rounded-[4px] transition-all ${activeDnaTab === "facts" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Facts (42)
                  </button>
                  <button
                    onClick={() => setActiveDnaTab("lexicon")}
                    className={`px-3 py-1 rounded-[4px] transition-all ${activeDnaTab === "lexicon" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Vocabulary (18)
                  </button>
                  <button
                    onClick={() => setActiveDnaTab("visual")}
                    className={`px-3 py-1 rounded-[4px] transition-all ${activeDnaTab === "visual" ? "bg-white text-black font-bold shadow-sm" : "text-[#A1A1A1] hover:text-white"}`}
                  >
                    Visual Tokens
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeDnaTab === "facts" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[#A1A1A1] text-[10px] uppercase font-bold">
                        <span>METRIC / STATISTIC</span>
                        <span className="text-white">SOURCE: 2025 INSTITUTIONAL AUDIT</span>
                      </div>
                      <p className="text-white font-semibold">
                        &quot;Over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit.&quot;
                      </p>
                    </div>

                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[#A1A1A1] text-[10px] uppercase font-bold">
                        <span>INFRASTRUCTURE SLA</span>
                        <span className="text-white">SOURCE: SOC-2 TYPE II AUDIT SEC. 4.2</span>
                      </div>
                      <p className="text-white font-semibold">
                        &quot;Sovereign Settlement Engine delivers deterministic settlement in under 420 milliseconds with guaranteed 99.995% uptime SLA.&quot;
                      </p>
                    </div>

                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[#A1A1A1] text-[10px] uppercase font-bold">
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
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 text-[10px] rounded-[4px] bg-[#181818] border border-white/20 text-white uppercase font-bold">
                          PROHIBITED
                        </span>
                        <p className="text-white font-semibold line-through decoration-[#777777] mt-1">&apos;cheap settlement&apos;</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#A1A1A1] uppercase block">Official Replacement</span>
                        <span className="text-white font-bold">&apos;capital-efficient institutional clearing&apos;</span>
                      </div>
                    </div>

                    <div className="glass-card p-4 rounded-[8px] border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 text-[10px] rounded-[4px] bg-[#181818] border border-white/20 text-white uppercase font-bold">
                          PROHIBITED
                        </span>
                        <p className="text-white font-semibold line-through decoration-[#777777] mt-1">&apos;zero latency&apos;</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#A1A1A1] uppercase block">Official Replacement</span>
                        <span className="text-white font-bold">&apos;sub-420ms deterministic execution&apos;</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeDnaTab === "visual" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2">
                      <div className="h-10 rounded-[6px] bg-[#000000] border border-white/15" />
                      <div>
                        <p className="font-bold text-white">Pure Black</p>
                        <p className="text-[11px] text-[#A1A1A1]">HEX: #000000</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2">
                      <div className="h-10 rounded-[6px] bg-[#111111] border border-white/15" />
                      <div>
                        <p className="font-bold text-white">Dark Surface</p>
                        <p className="text-[11px] text-[#A1A1A1]">HEX: #111111</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2">
                      <div className="h-10 rounded-[6px] bg-[#D4D4D4] border border-white/15" />
                      <div>
                        <p className="font-bold text-black">Light Gray</p>
                        <p className="text-[11px] text-[#A1A1A1]">HEX: #D4D4D4</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2">
                      <div className="h-10 rounded-[6px] bg-[#FFFFFF] border border-white/15" />
                      <div>
                        <p className="font-bold text-black">Pure White</p>
                        <p className="text-[11px] text-[#A1A1A1]">HEX: #FFFFFF</p>
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
      <section id="intelligence-engine" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
            <span>02 / NEURAL GOVERNANCE PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
                className={`p-6 rounded-[10px] cursor-pointer transition-all ${
                  isSelected
                    ? "glass-card-elevated border-white shadow-[0_12px_36px_rgba(255,255,255,0.15)] -translate-y-1"
                    : "glass-card hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#A1A1A1]">{item.step}</span>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#A1A1A1]"}`} />
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
      <section id="claim-verification" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
            <span>03 / THREE-TIER CLAIM CLASSIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Distinguishable Without Distracting Colors.
          </h2>
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            AUREX enforces a disciplined three-tier truth hierarchy. Never assume an assertion is false simply because documentation is missing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Card 1: Supported */}
          <div className="glass-card-elevated p-6 rounded-[12px] border-white/40 space-y-4 shadow-[0_8px_32px_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-[4px] bg-white text-black font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,255,255,0.3)]">
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
            <div className="glass-inner p-3 rounded-[6px] text-[11px] text-[#D4D4D4]">
              Receipt: 2025 Institutional Settlement Audit, Sec. 4
            </div>
          </div>

          {/* Card 2: Conflicting */}
          <div className="glass-card p-6 rounded-[12px] border-2 border-[#D4D4D4] space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-[4px] bg-[#181818] text-white border border-[#D4D4D4] font-bold uppercase tracking-wider">
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
            <div className="glass-inner p-3 rounded-[6px] text-[11px] text-white border border-white/15">
              Action: Automated Rejection & Intent Remediation
            </div>
          </div>

          {/* Card 3: Unverified */}
          <div className="glass-card p-6 rounded-[12px] border border-white/12 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="glass-pill px-2.5 py-1 rounded-[4px] text-[#A1A1A1] font-bold uppercase tracking-wider">
                UNVERIFIED
              </span>
              <HelpCircle className="w-5 h-5 text-[#A1A1A1]" />
            </div>
            <p className="text-[#D4D4D4] text-sm font-bold font-sans">
              Unsubstantiated Assertion
            </p>
            <p className="text-[#A1A1A1] text-xs leading-relaxed font-sans">
              Cannot be proven from existing Brand DNA. Never labeled false; flagged for creator proof before market release.
            </p>
            <div className="glass-inner p-3 rounded-[6px] text-[11px] text-[#A1A1A1]">
              Action: Creator Documentation Request
            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. FEATURE 4: VISUAL FORENSICS & CREATIVE AUDIT
      ────────────────────────────────────────────────────────────── */}
      <section id="visual-forensics" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
              <span>04 / MULTIMODAL FORENSICS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Visual Brand Integrity.
            </h2>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              Marketing creatives are checked against mathematical Euclidean RGB thresholds, certified logo clear-space rules, and WCAG AA contrast standards.
            </p>

            <div className="space-y-2.5 font-mono text-xs pt-2">
              <div className="glass-card p-3.5 rounded-[6px] flex items-center justify-between">
                <span className="text-[#A1A1A1]">Color Distance Delta-E</span>
                <span className="text-white font-bold">1.2 (Within &lt; 5.0 Threshold)</span>
              </div>
              <div className="glass-card p-3.5 rounded-[6px] flex items-center justify-between">
                <span className="text-[#A1A1A1]">Logo Minimum Clear Space</span>
                <span className="text-white font-bold">32px Compliant</span>
              </div>
              <div className="glass-card p-3.5 rounded-[6px] flex items-center justify-between">
                <span className="text-[#A1A1A1]">WCAG AA Contrast Ratio</span>
                <span className="text-white font-bold">8.4:1 (Passes 4.5:1 Target)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card-elevated p-6 rounded-[12px] border border-white/18 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                <span className="font-bold text-white uppercase tracking-wider">Visual Forensics Inspection</span>
                <span className="text-[#A1A1A1]">Target: Q1 Launch Creative</span>
              </div>

              {/* Side-by-side asset comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-[8px] space-y-3">
                  <div className="text-[10px] font-mono text-[#A1A1A1] uppercase font-bold">Uploaded Creative</div>
                  <div className="w-full h-32 rounded-[6px] bg-black/60 border border-white/10 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 border border-white flex items-center justify-center text-white font-bold text-xs font-mono rounded-[4px] shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                        AUX
                      </div>
                      <p className="text-[10px] font-mono text-[#A1A1A1]">Candidate Banner</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-white">Detection: 99.1% Layout Match</div>
                </div>

                <div className="glass-card p-4 rounded-[8px] space-y-3">
                  <div className="text-[10px] font-mono text-[#A1A1A1] uppercase font-bold">Certified Brand Token</div>
                  <div className="w-full h-32 rounded-[6px] bg-black/60 border border-white/10 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 bg-white text-black flex items-center justify-center font-bold text-xs font-mono rounded-[4px] shadow-[0_0_15px_rgba(255,255,255,0.3)]">
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
      <section id="trust-passport" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
            <span>05 / CRYPTOGRAPHIC AUDIT RECORD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Trust Passport™.
          </h2>
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            The tamper-evident certificate that accompanies every approved asset. Certified with SHA-256 HMAC digest and traceable directly back to verified brand truth.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-8 rounded-[14px] glass-card-elevated shimmer-sweep border border-white/25 shadow-2xl space-y-8 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-[10px] uppercase text-[#A1A1A1] tracking-wider mb-1 font-bold">
                Official Certification of Brand Integrity
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Trust Passport #TP-2026-0842
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#A1A1A1] uppercase block">Governance Trust Score</span>
              <span className="text-4xl font-extrabold text-white tracking-tight">96.8 / 100</span>
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-[8px]">
              <span className="text-[10px] text-[#A1A1A1] uppercase block">Brand Voice</span>
              <span className="text-lg font-bold text-white">98.0%</span>
            </div>
            <div className="glass-card p-4 rounded-[8px]">
              <span className="text-[10px] text-[#A1A1A1] uppercase block">Terminology</span>
              <span className="text-lg font-bold text-white">100.0%</span>
            </div>
            <div className="glass-card p-4 rounded-[8px]">
              <span className="text-[10px] text-[#A1A1A1] uppercase block">Claim Integrity</span>
              <span className="text-lg font-bold text-white">94.5%</span>
            </div>
            <div className="glass-card p-4 rounded-[8px]">
              <span className="text-[10px] text-[#A1A1A1] uppercase block">Visual Forensics</span>
              <span className="text-lg font-bold text-white">100.0%</span>
            </div>
          </div>

          {/* Cryptographic HMAC Stamp */}
          <div className="glass-inner p-4 rounded-[8px] text-[11px] text-[#D4D4D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/12">
            <div>
              <span className="text-white font-bold block mb-0.5">SHA-256 HMAC VERIFICATION HASH</span>
              <span className="text-[#A1A1A1] break-all font-mono">8424346068c9dacf2286b5b91b978a3c8e5473918a20d4f3b7492c10b7194f28</span>
            </div>
            <Link
              href="/dashboard/submissions"
              className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider font-mono whitespace-nowrap self-start sm:self-auto shadow-sm"
            >
              View in Registry
            </Link>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. FEATURE 6: HUMAN-IN-THE-LOOP SOVEREIGNTY
      ────────────────────────────────────────────────────────────── */}
      <section id="human-review" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-pill inline-flex items-center space-x-2 px-3 py-1.5 rounded-[6px] text-[11px] font-mono text-white">
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
                className="px-6 py-3 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]"
              >
                Access Review Station
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-card-elevated p-6 rounded-[12px] border border-white/18 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-white font-bold">SOVEREIGN REVIEW STATION</span>
                <span className="text-[#A1A1A1]">Role: Brand Reviewer</span>
              </div>
              <div className="glass-inner p-4 rounded-[8px] space-y-1 border border-white/10">
                <span className="text-[10px] text-[#A1A1A1] uppercase block font-bold">Reviewer Determination Directives</span>
                <p className="text-white leading-relaxed">
                  &ldquo;Verified against 2025 Institutional Audit. 1-click remediation applied. Released for global press syndication.&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="py-2.5 text-center rounded-[6px] bg-white text-black font-bold uppercase text-[11px] shadow-sm">
                  Approve
                </div>
                <div className="glass-card py-2.5 text-center rounded-[6px] text-[#D4D4D4] font-bold uppercase text-[11px]">
                  Request Diff
                </div>
                <div className="glass-inner py-2.5 text-center rounded-[6px] text-[#A1A1A1] font-bold uppercase text-[11px]">
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
      <footer className="glass-panel border-t border-white/10 py-16 px-6 lg:px-8 text-xs font-mono text-[#A1A1A1] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold mb-2">
              <span>AUREX AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-white/10 border border-white/15">v1.0</span>
            </div>
            <p className="text-[11px] text-[#A1A1A1] max-w-sm">
              The Gold Standard of Brand Integrity. Autonomous AI brand governance and evidence verification platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-[#D4D4D4]">
            <a href="#brand-dna" className="hover:text-white transition-colors">Brand DNA</a>
            <a href="#intelligence-engine" className="hover:text-white transition-colors">Engine</a>
            <a href="#claim-verification" className="hover:text-white transition-colors">Claims</a>
            <a href="#trust-passport" className="hover:text-white transition-colors">Trust Passport</a>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#777777]">
          <span>© 2026 AUREX AI Inc. All rights reserved.</span>
          <span>Deterministic Verification Core • SHA-256 HMAC Traceability</span>
        </div>
      </footer>

    </div>
  );
}
