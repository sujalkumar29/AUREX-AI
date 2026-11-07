"use client";

import React, { useState, useEffect } from "react";
import {
  Dna,
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  Palette,
  Hash,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Activity,
  Layers,
  Database,
  Building2,
  Edit3,
  Globe,
  Tag,
  Check,
  Info,
  AlertTriangle,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { useBrand } from "@/lib/brand-context";
import { useAuth } from "@/lib/auth-context";
import { BrandDNA, BrandGuideline, BrandFact, BrandTerminology, BrandAsset, Brand } from "@/types";

export default function BrandDNAWorkspacePage() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const { brands, selectedBrand, setSelectedBrand, refreshBrands, isLoadingBrands } = useBrand();

  const [dna, setDna] = useState<BrandDNA | null>(null);
  const [activeTab, setActiveTab] = useState<"identity" | "guidelines" | "facts" | "terminology" | "visuals" | "upload">("identity");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false);
  const [showEditBrandModal, setShowEditBrandModal] = useState(false);

  // Create Brand Form
  const [newBrandForm, setNewBrandForm] = useState({
    name: "",
    industry: "Enterprise Technology",
    mission: "",
    values: "",
    personality: "authoritative, precise, institutional",
    website: "",
  });

  // Edit Brand Form
  const [editBrandForm, setEditBrandForm] = useState({
    name: "",
    industry: "",
    mission: "",
    values: "",
    personality: "",
    website: "",
  });

  // Rule Forms
  const [newGuideline, setNewGuideline] = useState({
    title: "",
    category: "messaging_rule",
    content: "",
    rule_type: "approved" as "approved" | "prohibited" | "general",
    severity: "warning" as "critical" | "warning" | "info",
  });
  const [newFact, setNewFact] = useState({
    claim_text: "",
    category: "statistic",
    source_name: "",
    source_url_or_ref: "",
  });
  const [newTerm, setNewTerm] = useState({
    term: "",
    term_type: "prohibited" as "prohibited" | "approved" | "preferred",
    replacement_suggestion: "",
    explanation: "",
  });
  const [newAsset, setNewAsset] = useState({
    name: "",
    asset_type: "color_palette" as "color_palette" | "logo" | "typography" | "imagery",
    metadata_json: "",
  });

  const [uploadText, setUploadText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Load DNA for currently selected brand
  const loadDNA = async (brandId?: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const targetBrandId = brandId || selectedBrand?.id;
      const data = await api.getBrandDNA(targetBrandId);
      setDna(data);
      if (data?.brand) {
        setEditBrandForm({
          name: data.brand.name || "",
          industry: data.brand.industry || "",
          mission: data.brand.mission || "",
          values: data.brand.values || "",
          personality: data.brand.personality || "",
          website: data.brand.website || "",
        });
      }
    } catch (err: any) {
      console.error("Error loading DNA:", err);
      setErrorMsg(err.message || "Failed to load Brand DNA knowledge vault");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBrand) {
      loadDNA(selectedBrand.id);
    }
  }, [selectedBrand?.id]);

  const showFeedback = (success?: string | null, error?: string | null) => {
    if (success) {
      setSuccessMsg(success);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(null), 6000);
    }
  };

  // Brand Creation
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createBrand(newBrandForm);
      showFeedback(`Brand "${created.name}" established successfully.`);
      setShowCreateBrandModal(false);
      setNewBrandForm({
        name: "",
        industry: "Enterprise Technology",
        mission: "",
        values: "",
        personality: "authoritative, precise, institutional",
        website: "",
      });
      await refreshBrands();
      setSelectedBrand(created);
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to create brand");
    }
  };

  // Brand Update
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dna?.brand?.id) return;
    try {
      const updated = await api.updateBrand(dna.brand.id, editBrandForm);
      showFeedback(`Brand profile "${updated.name}" updated.`);
      setShowEditBrandModal(false);
      await refreshBrands();
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to update brand profile");
    }
  };

  // Guidelines
  const handleAddGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dna) return;
    try {
      await api.addGuideline(dna.brand.id, newGuideline);
      setNewGuideline({
        title: "",
        category: "messaging_rule",
        content: "",
        rule_type: "approved",
        severity: "warning",
      });
      showFeedback("Guideline rule enrolled into governance pipeline.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to add guideline");
    }
  };

  const handleDeleteGuideline = async (id: string) => {
    try {
      await api.deleteGuideline(id);
      showFeedback("Guideline removed.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to delete guideline");
    }
  };

  // Facts
  const handleAddFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dna) return;
    try {
      await api.addFact(dna.brand.id, newFact);
      setNewFact({ claim_text: "", category: "statistic", source_name: "", source_url_or_ref: "" });
      showFeedback("Verified fact registered in evidence vault.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to add fact");
    }
  };

  const handleDeleteFact = async (id: string) => {
    try {
      await api.deleteFact(id);
      showFeedback("Fact removed from vault.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to delete fact");
    }
  };

  // Terminology
  const handleAddTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dna) return;
    try {
      await api.addTerminology(dna.brand.id, newTerm);
      setNewTerm({ term: "", term_type: "prohibited", replacement_suggestion: "", explanation: "" });
      showFeedback("Vocabulary rule enforced.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to add terminology");
    }
  };

  const handleDeleteTerm = async (id: string) => {
    try {
      await api.deleteTerminology(id);
      showFeedback("Vocabulary rule removed.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to delete terminology");
    }
  };

  // Asset
  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dna) return;
    try {
      await api.addAsset(dna.brand.id, newAsset);
      setNewAsset({ name: "", asset_type: "color_palette", metadata_json: "" });
      showFeedback("Visual asset token saved.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to add asset");
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await api.deleteAsset(id);
      showFeedback("Asset token removed.");
      loadDNA();
    } catch (err: any) {
      showFeedback(null, err.message || "Failed to delete asset");
    }
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !dna) return;
    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setUploadText(res.extracted_text);
      if (res.extracted_text) {
        await api.addGuideline(dna.brand.id, {
          title: `Uploaded Document: ${file.name}`,
          category: "document_ingestion",
          content: res.extracted_text.substring(0, 2000),
          rule_type: "approved",
          severity: "info",
        });
        showFeedback(`Document "${file.name}" ingested into Brand DNA.`);
        loadDNA();
      }
    } catch (err: any) {
      showFeedback(null, err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || isLoadingBrands) {
    return (
      <div className="p-16 text-center text-xs font-mono text-[#77738F] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-[#5B4BFF] animate-pulse" />
        <span>Synchronizing Brand DNA Vault...</span>
      </div>
    );
  }

  if (!selectedBrand || !dna) {
    return (
      <div className="glass-panel p-12 text-center max-w-xl mx-auto rounded-[16px] space-y-4 bg-white/80 border border-[#E5E1F2] shadow-lg">
        <Building2 className="w-12 h-12 text-[#5B4BFF] mx-auto" />
        <h2 className="text-xl font-bold text-[#0D0B2D]">No Brand Found</h2>
        <p className="text-xs text-[#77738F]">Create a brand to initialize your Brand DNA knowledge repository.</p>
        {isAdmin && (
          <button
            onClick={() => setShowCreateBrandModal(true)}
            className="px-5 py-2.5 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
          >
            Create First Brand
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#17143A]">
      {/* Toast Feedback */}
      {successMsg && (
        <div className="glass-card p-3 rounded-[8px] border-[#5B4BFF]/30 bg-[#F0EDFF] text-[#0D0B2D] text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#5B4BFF]" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}><X className="w-3.5 h-3.5 text-[#77738F]" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="glass-card p-3 rounded-[8px] border-2 border-red-300 bg-red-50 text-red-700 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}><X className="w-3.5 h-3.5 text-red-600" /></button>
        </div>
      )}

      {/* Role Banner if not admin */}
      {!isAdmin && (
        <div className="glass-inner p-3 rounded-[8px] border border-[#E5E1F2] bg-[#F0EDFF]/80 text-[#77738F] text-xs font-mono flex items-center space-x-2">
          <Info className="w-4 h-4 text-[#5B4BFF] flex-shrink-0" />
          <span>Governance Mode: Viewing active Brand DNA as <strong className="text-[#0D0B2D]">{role}</strong>. Only Administrators can mutate brand rules and identity assets.</span>
        </div>
      )}

      {/* Workspace Header - Glassmorphic Elevated Container */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[16px] border border-[#E5E1F2] bg-white/80 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#5B4BFF] px-2.5 py-1 rounded-[6px] bg-[#E6E0FF] border border-[#5B4BFF]/25">
            <Database className="w-3.5 h-3.5 text-[#5B4BFF]" />
            <span>FOUNDATIONAL KNOWLEDGE VAULT</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
              Brand DNA: <span className="text-[#5B4BFF]">{dna.brand.name}</span>
            </h1>
            {dna.brand.is_default && (
              <span className="glass-pill text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] text-[#5B4BFF] bg-[#E6E0FF] border border-[#5B4BFF]/20 font-bold">
                Primary Brand
              </span>
            )}
          </div>
          <p className="text-xs text-[#77738F] max-w-2xl font-normal leading-relaxed">
            {dna.brand.description || "The authoritative source of truth against which every piece of copy, claim, and visual asset is verified by the AI governance engine."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="relative">
            <select
              value={selectedBrand.id}
              onChange={(e) => {
                const b = brands.find((item) => item.id === e.target.value);
                if (b) setSelectedBrand(b);
              }}
              className="glass-input px-3.5 py-2 rounded-[8px] text-xs font-mono text-[#17143A] bg-white border border-[#E5E1F2] focus:border-[#5B4BFF] focus:outline-none"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-white text-[#17143A]">
                  {b.name} {b.is_default ? "(Default)" : ""}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <>
              <button
                onClick={() => setShowEditBrandModal(true)}
                className="glass-button px-3.5 py-2 rounded-[8px] text-xs font-mono flex items-center space-x-1.5 border border-[#E5E1F2] bg-white text-[#0D0B2D] hover:bg-[#F0EDFF] hover:text-[#5B4BFF] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#5B4BFF]" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowCreateBrandModal(true)}
                className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)] flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>New Brand</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Metric Telemetry - Translucent Glass Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="glass-card p-3.5 rounded-[12px] flex items-center justify-between border border-[#E5E1F2] bg-white/70 shadow-sm">
          <span className="text-[#77738F]">VERIFIED FACTS</span>
          <span className="font-bold text-[#0D0B2D] text-base">{dna.facts.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[12px] flex items-center justify-between border border-[#E5E1F2] bg-white/70 shadow-sm">
          <span className="text-[#77738F]">VOCABULARY RULES</span>
          <span className="font-bold text-[#0D0B2D] text-base">{dna.terminologies.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[12px] flex items-center justify-between border border-[#E5E1F2] bg-white/70 shadow-sm">
          <span className="text-[#77738F]">GUIDELINE RULES</span>
          <span className="font-bold text-[#0D0B2D] text-base">{dna.guidelines.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[12px] flex items-center justify-between border border-[#E5E1F2] bg-white/70 shadow-sm">
          <span className="text-[#77738F]">VISUAL ASSETS</span>
          <span className="font-bold text-[#0D0B2D] text-base">{dna.assets.length + 5}</span>
        </div>
      </div>

      {/* Workspace Tabs - Floating Glass Strip */}
      <div className="glass-pill p-1.5 rounded-[10px] flex space-x-1.5 overflow-x-auto text-xs font-mono border border-[#E5E1F2] bg-[#F0EDFF]/80">
        <button
          onClick={() => setActiveTab("identity")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "identity"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Core Identity</span>
        </button>
        <button
          onClick={() => setActiveTab("guidelines")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "guidelines"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Brand Guidelines ({dna.guidelines.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("facts")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "facts"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Facts ({dna.facts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("terminology")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "terminology"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Vocabulary ({dna.terminologies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("visuals")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "visuals"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Visual Tokens</span>
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`py-2 px-3.5 rounded-[8px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "upload"
              ? "bg-[#5B4BFF] text-white font-bold shadow-sm"
              : "text-[#77738F] hover:text-[#0D0B2D] hover:bg-white/60"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Document Ingestion</span>
        </button>
      </div>

      {/* Tab 0: Core Identity */}
      {activeTab === "identity" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] flex items-center space-x-2 font-bold">
                <Building2 className="w-4 h-4 text-[#5B4BFF]" />
                <span>Foundational Profile</span>
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowEditBrandModal(true)}
                  className="text-xs font-mono text-[#77738F] hover:text-[#5B4BFF] flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#5B4BFF]" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Brand Name</span>
                <p className="text-[#0D0B2D] font-bold text-sm mt-0.5">{dna.brand.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Industry Sector</span>
                <p className="text-[#17143A] font-medium mt-0.5">{dna.brand.industry || "Enterprise Software"}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Official Website</span>
                <p className="text-[#5B4BFF] font-mono mt-0.5">{dna.brand.website || "https://aurex.ai"}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Brand Personality Traits</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(dna.brand.personality || "authoritative, precise, institutional").split(",").map((trait, i) => (
                    <span key={i} className="glass-pill px-2.5 py-0.5 rounded-[6px] text-[#5B4BFF] bg-[#E6E0FF] text-[11px] font-mono border border-[#5B4BFF]/20 font-medium">
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[14px] border border-[#E5E1F2] space-y-4 shadow-sm bg-white/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] flex items-center space-x-2 font-bold">
              <Sparkles className="w-4 h-4 text-[#5B4BFF]" />
              <span>Mission & Core Values</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Brand Mission Statement</span>
                <p className="text-[#17143A] leading-relaxed mt-1 italic border-l-2 border-[#5B4BFF] pl-3">
                  &ldquo;{dna.brand.mission || "To establish undeniable institutional trust through autonomous governance and uncompromising evidence standards."}&rdquo;
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#77738F] block font-semibold">Guiding Institutional Values</span>
                <p className="text-[#77738F] leading-relaxed mt-1">
                  {dna.brand.values || "Deterministic precision, full auditability, zero compromise on claim truth, human oversight sovereignty."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Guidelines */}
      {activeTab === "guidelines" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">
              Active Brand Guidelines ({dna.guidelines.length})
            </h3>
            {dna.guidelines.length === 0 ? (
              <p className="glass-panel p-4 rounded-[10px] text-xs text-[#77738F] font-mono bg-white/60 border border-[#E5E1F2]">
                No guidelines defined. Add the first rule using the form on the right.
              </p>
            ) : (
              dna.guidelines.map((g) => (
                <div key={g.id} className="glass-card p-4 rounded-[12px] border border-[#E5E1F2] bg-white/80 space-y-2 relative group shadow-sm hover:border-[#5B4BFF]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D0B2D]">{g.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] font-bold ${
                        g.rule_type === "prohibited" 
                          ? "bg-red-50 border border-red-200 text-red-700" 
                          : "bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/25"
                      }`}>
                        {g.rule_type}
                      </span>
                      <span className="glass-pill text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-[4px] text-[#77738F] bg-[#F0EDFF] border border-[#E5E1F2]">
                        {g.severity}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteGuideline(g.id)}
                          className="text-[#77738F] hover:text-red-600 transition-colors p-1"
                          title="Delete Guideline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#17143A] leading-relaxed">{g.content}</p>
                  <span className="text-[10px] text-[#77738F] font-mono">Category: {g.category.replace('_', ' ')}</span>
                </div>
              ))
            )}
          </div>

          {/* Add Guideline Form */}
          {isAdmin ? (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] space-y-4 h-fit shadow-md bg-white/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Add Governance Rule</h3>
              <form onSubmit={handleAddGuideline} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Rule Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyperbole Prohibition"
                    value={newGuideline.title}
                    onChange={(e) => setNewGuideline({ ...newGuideline, title: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Category</label>
                  <select
                    value={newGuideline.category}
                    onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  >
                    <option value="messaging_rule">Messaging & Positioning</option>
                    <option value="voice_tone">Voice & Tone</option>
                    <option value="visual_identity">Visual Identity Rule</option>
                    <option value="regulatory_compliance">Regulatory / Legal</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Rule Type</label>
                    <select
                      value={newGuideline.rule_type}
                      onChange={(e) => setNewGuideline({ ...newGuideline, rule_type: e.target.value as any })}
                      className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                    >
                      <option value="approved">Approved</option>
                      <option value="prohibited">Prohibited</option>
                      <option value="general">General Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Severity</label>
                    <select
                      value={newGuideline.severity}
                      onChange={(e) => setNewGuideline({ ...newGuideline, severity: e.target.value as any })}
                      className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                    >
                      <option value="critical">Critical</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Rule Description & Criteria</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain the constraint and what violations look like..."
                    value={newGuideline.content}
                    onChange={(e) => setNewGuideline({ ...newGuideline, content: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Save Guideline Rule
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] text-xs text-[#77738F] font-mono bg-white/70">
              Administrator credentials required to create or modify brand guidelines.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Facts */}
      {activeTab === "facts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">
              Verified Brand Facts & Proof Points ({dna.facts.length})
            </h3>
            {dna.facts.length === 0 ? (
              <p className="glass-panel p-4 rounded-[10px] text-xs text-[#77738F] font-mono bg-white/60 border border-[#E5E1F2]">
                No verified facts in vault. Register official claims to power RAG claim verification.
              </p>
            ) : (
              dna.facts.map((f) => (
                <div key={f.id} className="glass-card p-4 rounded-[12px] border border-[#E5E1F2] bg-white/80 space-y-2 relative group shadow-sm hover:border-[#5B4BFF]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="glass-pill text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] text-[#5B4BFF] bg-[#E6E0FF] border border-[#5B4BFF]/25 font-bold">
                      {f.category}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteFact(f.id)}
                        className="text-[#77738F] hover:text-red-600 transition-colors p-1"
                        title="Delete Fact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#0D0B2D] font-mono leading-relaxed">&ldquo;{f.claim_text}&rdquo;</p>
                  <div className="flex items-center space-x-3 text-[10px] text-[#77738F] font-mono pt-1 border-t border-[#E5E1F2]">
                    <span>Source: <strong className="text-[#0D0B2D]">{f.source_name}</strong></span>
                    {f.source_url_or_ref && (
                      <span className="text-[#5B4BFF] truncate max-w-[200px]">{f.source_url_or_ref}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Fact Form */}
          {isAdmin ? (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] space-y-4 h-fit shadow-md bg-white/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Register Verified Fact</h3>
              <form onSubmit={handleAddFact} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Authoritative Claim Statement</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Over $14.2B in annual settlement volume across 42 sovereign jurisdictions"
                    value={newFact.claim_text}
                    onChange={(e) => setNewFact({ ...newFact, claim_text: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Fact Category</label>
                  <select
                    value={newFact.category}
                    onChange={(e) => setNewFact({ ...newFact, category: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  >
                    <option value="statistic">Quantitative Metric / Statistic</option>
                    <option value="certification">Certification / Audit</option>
                    <option value="partnership">Institutional Partnership</option>
                    <option value="sla">Uptime SLA / Technical Benchmark</option>
                    <option value="milestone">Historical Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Verification Source Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 Financial Audit Report"
                    value={newFact.source_name}
                    onChange={(e) => setNewFact({ ...newFact, source_name: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Source Reference / URL</label>
                  <input
                    type="text"
                    placeholder="e.g. SEC Filing 10-K / Audit Sec. 4.2"
                    value={newFact.source_url_or_ref}
                    onChange={(e) => setNewFact({ ...newFact, source_url_or_ref: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Add to Evidence Vault
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] text-xs text-[#77738F] font-mono bg-white/70">
              Administrator credentials required to register facts in the evidence vault.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Terminology */}
      {activeTab === "terminology" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">
              Brand Vocabulary Rules ({dna.terminologies.length})
            </h3>
            {dna.terminologies.length === 0 ? (
              <p className="glass-panel p-4 rounded-[10px] text-xs text-[#77738F] font-mono bg-white/60 border border-[#E5E1F2]">
                No vocabulary rules defined. Add approved or prohibited terms using the form on the right.
              </p>
            ) : (
              <div className="glass-panel divide-y divide-[#E5E1F2] rounded-[14px] border border-[#E5E1F2] overflow-hidden shadow-sm bg-white/80">
                {dna.terminologies.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-[#F0EDFF]/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] font-bold ${
                          t.term_type === "prohibited" 
                            ? "bg-red-50 border border-red-200 text-red-700" 
                            : "bg-[#E6E0FF] text-[#5B4BFF] border border-[#5B4BFF]/25 font-bold"
                        }`}>
                          {t.term_type}
                        </span>
                        <span className="font-bold text-[#0D0B2D] text-xs font-mono">&apos;{t.term}&apos;</span>
                      </div>
                      {t.replacement_suggestion && (
                        <p className="text-xs text-[#5B4BFF] font-mono">
                          Replace with: <span className="font-bold text-[#0D0B2D] underline underline-offset-2">{t.replacement_suggestion}</span>
                        </p>
                      )}
                      {t.explanation && (
                        <p className="text-[11px] text-[#77738F] font-sans">{t.explanation}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTerm(t.id)}
                        className="text-[#77738F] hover:text-red-600 p-2 transition-colors"
                        title="Delete Term"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Term Form */}
          {isAdmin ? (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] space-y-4 h-fit shadow-md bg-white/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Add Vocabulary Rule</h3>
              <form onSubmit={handleAddTerm} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Target Term</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. cheap settlement"
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Classification</label>
                  <select
                    value={newTerm.term_type}
                    onChange={(e) => setNewTerm({ ...newTerm, term_type: e.target.value as any })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  >
                    <option value="prohibited">Strictly Prohibited</option>
                    <option value="approved">Official / Approved</option>
                    <option value="preferred">Preferred Phrasing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Approved Replacement</label>
                  <input
                    type="text"
                    placeholder="e.g. capital-efficient institutional clearing"
                    value={newTerm.replacement_suggestion}
                    onChange={(e) => setNewTerm({ ...newTerm, replacement_suggestion: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Brand Rationale</label>
                  <textarea
                    rows={2}
                    placeholder="Why this vocabulary matters..."
                    value={newTerm.explanation}
                    onChange={(e) => setNewTerm({ ...newTerm, explanation: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Save Terminology Rule
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] text-xs text-[#77738F] font-mono bg-white/70">
              Administrator credentials required to enforce brand vocabulary.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Visuals */}
      {activeTab === "visuals" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">Approved Visual Design Tokens</h3>
            <p className="text-xs text-[#77738F]">
              The AI Visual Forensics engine audits uploaded creatives and images against these certified brand color hexadecimal values and typography standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card p-4 rounded-[12px] space-y-3 border border-[#E5E1F2] bg-white/80 shadow-sm">
              <div className="w-full h-14 rounded-[8px] bg-[#0D0B2D] border border-[#E5E1F2]" />
              <div>
                <p className="text-xs font-bold text-[#0D0B2D]">Primary Midnight</p>
                <p className="text-[11px] text-[#5B4BFF] font-mono font-semibold">HEX: #0D0B2D</p>
                <p className="text-[10px] text-[#77738F] mt-0.5">Brand Identity Base</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[12px] space-y-3 border border-[#E5E1F2] bg-white/80 shadow-sm">
              <div className="w-full h-14 rounded-[8px] bg-[#5B4BFF] border border-[#5B4BFF]" />
              <div>
                <p className="text-xs font-bold text-[#0D0B2D]">Electric Purple</p>
                <p className="text-[11px] text-[#5B4BFF] font-mono font-semibold">HEX: #5B4BFF</p>
                <p className="text-[10px] text-[#77738F] mt-0.5">Primary Accent & Actions</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[12px] space-y-3 border border-[#E5E1F2] bg-white/80 shadow-sm">
              <div className="w-full h-14 rounded-[8px] bg-[#A78BFA] border border-[#A78BFA]" />
              <div>
                <p className="text-xs font-bold text-[#0D0B2D]">Soft Violet</p>
                <p className="text-[11px] text-[#5B4BFF] font-mono font-semibold">HEX: #A78BFA</p>
                <p className="text-[10px] text-[#77738F] mt-0.5">Secondary Highlights</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[12px] space-y-3 border border-[#E5E1F2] bg-white/80 shadow-sm">
              <div className="w-full h-14 rounded-[8px] bg-[#E6E0FF] border border-[#E5E1F2]" />
              <div>
                <p className="text-xs font-bold text-[#0D0B2D]">Lavender Surface</p>
                <p className="text-[11px] text-[#5B4BFF] font-mono font-semibold">HEX: #E6E0FF</p>
                <p className="text-[10px] text-[#77738F] mt-0.5">Subtle Card & Badge Fill</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[12px] space-y-3 border border-[#E5E1F2] bg-white/80 shadow-sm">
              <div className="w-full h-14 rounded-[8px] bg-[#F7F8FF] border border-[#E5E1F2]" />
              <div>
                <p className="text-xs font-bold text-[#0D0B2D]">Cloud Background</p>
                <p className="text-[11px] text-[#5B4BFF] font-mono font-semibold">HEX: #F7F8FF</p>
                <p className="text-[10px] text-[#77738F] mt-0.5">Main Canvas Base</p>
              </div>
            </div>
          </div>

          {/* Custom Brand Assets */}
          {dna.assets.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">Registered Custom Assets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dna.assets.map((asset) => (
                  <div key={asset.id} className="glass-card p-4 rounded-[10px] flex items-center justify-between border border-[#E5E1F2] bg-white/80 shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-[#0D0B2D]">{asset.name}</p>
                      <p className="text-[10px] font-mono text-[#5B4BFF] uppercase">{asset.asset_type.replace('_', ' ')}</p>
                      {asset.metadata_json && (
                        <p className="text-[11px] text-[#77738F] font-mono mt-1 truncate max-w-[200px]">{asset.metadata_json}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-[#77738F] hover:text-red-600 p-1 transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Asset Form */}
          {isAdmin && (
            <div className="glass-panel p-5 rounded-[14px] border border-[#E5E1F2] space-y-4 max-w-xl shadow-md bg-white/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0D0B2D] font-bold">Register Custom Brand Token</h3>
              <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Asset Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Official Primary Wordmark"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Asset Category</label>
                    <select
                      value={newAsset.asset_type}
                      onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value as any })}
                      className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                    >
                      <option value="color_palette">Color Palette</option>
                      <option value="logo">Official Logo</option>
                      <option value="typography">Typography Spec</option>
                      <option value="imagery">Imagery Standard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Specification / Hex Code / Clear Space</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #5B4BFF or min-clear-space: 24px"
                    value={newAsset.metadata_json}
                    onChange={(e) => setNewAsset({ ...newAsset, metadata_json: e.target.value })}
                    className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Save Visual Token
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Document Upload */}
      {activeTab === "upload" && (
        <div className="glass-panel p-8 rounded-[16px] border border-[#E5E1F2] space-y-6 text-center max-w-2xl mx-auto shadow-xl bg-white/80">
          <div className="w-14 h-14 rounded-[12px] bg-[#E6E0FF] border border-[#5B4BFF]/30 text-[#5B4BFF] flex items-center justify-center mx-auto shadow-sm">
            <Upload className="w-6 h-6 text-[#5B4BFF]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0D0B2D]">Upload Brand Guidelines Document</h3>
            <p className="text-xs text-[#77738F] mt-1">
              Supports .pdf, .txt, and .md files. Extracted text is automatically indexed into the Brand DNA RAG pipeline for autonomous retrieval during content verification.
            </p>
          </div>

          {isAdmin ? (
            <label className="inline-block cursor-pointer px-6 py-3 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(91,75,255,0.3)] transition-all">
              <span>{isUploading ? "Extracting Text..." : "Choose Brand File to Ingest"}</span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          ) : (
            <p className="text-xs text-[#77738F] font-mono">
              Administrator credentials required to upload guideline documents.
            </p>
          )}

          {uploadText && (
            <div className="text-left mt-6 p-4 rounded-[10px] glass-inner border border-[#E5E1F2] bg-[#F7F8FF] space-y-2">
              <p className="text-xs font-mono uppercase text-[#0D0B2D] font-bold">Extracted & Ingested into Brand DNA:</p>
              <p className="text-xs text-[#17143A] font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {uploadText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create New Brand */}
      {showCreateBrandModal && (
        <div className="fixed inset-0 z-50 bg-[#0D0B2D]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[16px] glass-modal bg-white p-6 space-y-4 border border-[#E5E1F2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E1F2] pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#5B4BFF]" />
                <h3 className="text-base font-bold text-[#0D0B2D]">Establish New Brand Identity</h3>
              </div>
              <button onClick={() => setShowCreateBrandModal(false)} className="text-[#77738F] hover:text-[#0D0B2D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Liquidity"
                  value={newBrandForm.name}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Institutional Finance / Web3"
                  value={newBrandForm.industry}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, industry: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Mission Statement</label>
                <textarea
                  rows={2}
                  placeholder="What is this brand's sovereign purpose?"
                  value={newBrandForm.mission}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, mission: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Personality Traits (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. authoritative, precise, institutional"
                  value={newBrandForm.personality}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, personality: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Official Website</label>
                <input
                  type="url"
                  placeholder="https://brand.domain"
                  value={newBrandForm.website}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, website: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E1F2]">
                <button
                  type="button"
                  onClick={() => setShowCreateBrandModal(false)}
                  className="glass-button px-4 py-2 rounded-[8px] text-xs font-mono border border-[#E5E1F2] text-[#77738F] hover:text-[#0D0B2D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Create Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Brand Profile */}
      {showEditBrandModal && (
        <div className="fixed inset-0 z-50 bg-[#0D0B2D]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[16px] glass-modal bg-white p-6 space-y-4 border border-[#E5E1F2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E1F2] pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#5B4BFF]" />
                <h3 className="text-base font-bold text-[#0D0B2D]">Update Brand Profile</h3>
              </div>
              <button onClick={() => setShowEditBrandModal(false)} className="text-[#77738F] hover:text-[#0D0B2D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editBrandForm.name}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, name: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Industry</label>
                <input
                  type="text"
                  required
                  value={editBrandForm.industry}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, industry: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Mission Statement</label>
                <textarea
                  rows={2}
                  value={editBrandForm.mission}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, mission: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Core Values</label>
                <textarea
                  rows={2}
                  value={editBrandForm.values}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, values: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Personality Traits</label>
                <input
                  type="text"
                  value={editBrandForm.personality}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, personality: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#77738F] block mb-1 font-mono uppercase text-[10px] font-semibold">Website</label>
                <input
                  type="url"
                  value={editBrandForm.website}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, website: e.target.value })}
                  className="glass-input w-full rounded-[8px] px-3 py-2 font-mono bg-white border-[#E5E1F2] text-[#17143A] focus:border-[#5B4BFF] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E1F2]">
                <button
                  type="button"
                  onClick={() => setShowEditBrandModal(false)}
                  className="glass-button px-4 py-2 rounded-[8px] text-xs font-mono border border-[#E5E1F2] text-[#77738F] hover:text-[#0D0B2D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(91,75,255,0.3)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
