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
      <div className="p-16 text-center text-xs font-mono text-[#A1A1A1] flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4 text-white animate-pulse" />
        <span>Synchronizing Brand DNA Vault...</span>
      </div>
    );
  }

  if (!selectedBrand || !dna) {
    return (
      <div className="glass-panel p-12 text-center max-w-xl mx-auto rounded-[12px] space-y-4">
        <Building2 className="w-12 h-12 text-[#777777] mx-auto" />
        <h2 className="text-xl font-bold text-white">No Brand Found</h2>
        <p className="text-xs text-[#A1A1A1]">Create a brand to initialize your Brand DNA knowledge repository.</p>
        {isAdmin && (
          <button
            onClick={() => setShowCreateBrandModal(true)}
            className="px-5 py-2.5 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Create First Brand
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#F5F5F5]">
      {/* Toast Feedback */}
      {successMsg && (
        <div className="glass-card p-3 rounded-[6px] border-white/30 text-white text-xs font-mono flex items-center justify-between shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="glass-card p-3 rounded-[6px] border-2 border-[#D4D4D4] text-white text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Role Banner if not admin */}
      {!isAdmin && (
        <div className="glass-inner p-3 rounded-[6px] border border-white/10 text-[#A1A1A1] text-xs font-mono flex items-center space-x-2">
          <Info className="w-4 h-4 text-white flex-shrink-0" />
          <span>Governance Mode: Viewing active Brand DNA as <strong className="text-white">{role}</strong>. Only Administrators can mutate brand rules and identity assets.</span>
        </div>
      )}

      {/* Workspace Header - Glassmorphic Elevated Container */}
      <div className="glass-card-elevated shimmer-sweep p-6 md:p-8 rounded-[12px] border border-white/15 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#D4D4D4] px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
            <Database className="w-3.5 h-3.5 text-white" />
            <span>FOUNDATIONAL KNOWLEDGE VAULT</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Brand DNA: <span className="text-[#D4D4D4]">{dna.brand.name}</span>
            </h1>
            {dna.brand.is_default && (
              <span className="glass-pill text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] text-white border border-white/15">
                Primary Brand
              </span>
            )}
          </div>
          <p className="text-xs text-[#A1A1A1] max-w-2xl font-normal leading-relaxed">
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
              className="glass-input px-3.5 py-2 rounded-[6px] text-xs font-mono text-white"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-black text-white">
                  {b.name} {b.is_default ? "(Default)" : ""}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <>
              <button
                onClick={() => setShowEditBrandModal(true)}
                className="glass-button px-3.5 py-2 rounded-[6px] text-xs font-mono flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowCreateBrandModal(true)}
                className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_18px_rgba(255,255,255,0.2)] flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>New Brand</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Metric Telemetry - Translucent Glass Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="glass-card p-3.5 rounded-[8px] flex items-center justify-between">
          <span className="text-[#A1A1A1]">VERIFIED FACTS</span>
          <span className="font-bold text-white text-base">{dna.facts.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[8px] flex items-center justify-between">
          <span className="text-[#A1A1A1]">VOCABULARY RULES</span>
          <span className="font-bold text-white text-base">{dna.terminologies.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[8px] flex items-center justify-between">
          <span className="text-[#A1A1A1]">GUIDELINE RULES</span>
          <span className="font-bold text-white text-base">{dna.guidelines.length}</span>
        </div>
        <div className="glass-card p-3.5 rounded-[8px] flex items-center justify-between">
          <span className="text-[#A1A1A1]">VISUAL ASSETS</span>
          <span className="font-bold text-white text-base">{dna.assets.length + 5}</span>
        </div>
      </div>

      {/* Workspace Tabs - Floating Glass Strip */}
      <div className="glass-pill p-1.5 rounded-[8px] flex space-x-1.5 overflow-x-auto text-xs font-mono border border-white/10">
        <button
          onClick={() => setActiveTab("identity")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "identity"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Core Identity</span>
        </button>
        <button
          onClick={() => setActiveTab("guidelines")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "guidelines"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Brand Guidelines ({dna.guidelines.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("facts")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "facts"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Facts ({dna.facts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("terminology")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "terminology"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Vocabulary ({dna.terminologies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("visuals")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "visuals"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Visual Tokens</span>
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`py-2 px-3.5 rounded-[6px] flex items-center space-x-2 transition-all whitespace-nowrap uppercase tracking-wider ${
            activeTab === "upload"
              ? "bg-white text-black font-bold shadow-sm"
              : "text-[#A1A1A1] hover:text-white hover:bg-white/5"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Document Ingestion</span>
        </button>
      </div>

      {/* Tab 0: Core Identity */}
      {activeTab === "identity" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-white" />
                <span>Foundational Profile</span>
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setShowEditBrandModal(true)}
                  className="text-xs font-mono text-[#A1A1A1] hover:text-white flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-white" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Brand Name</span>
                <p className="text-white font-bold text-sm mt-0.5">{dna.brand.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Industry Sector</span>
                <p className="text-white font-medium mt-0.5">{dna.brand.industry || "Enterprise Software"}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Official Website</span>
                <p className="text-[#D4D4D4] font-mono mt-0.5">{dna.brand.website || "https://aurex.ai"}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Brand Personality Traits</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(dna.brand.personality || "authoritative, precise, institutional").split(",").map((trait, i) => (
                    <span key={i} className="glass-pill px-2.5 py-0.5 rounded-[4px] text-[#D4D4D4] text-[11px] font-mono">
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[12px] border border-white/12 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Mission & Core Values</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Brand Mission Statement</span>
                <p className="text-[#D4D4D4] leading-relaxed mt-1 italic border-l-2 border-white/40 pl-3">
                  &ldquo;{dna.brand.mission || "To establish undeniable institutional trust through autonomous governance and uncompromising evidence standards."}&rdquo;
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#777777] block">Guiding Institutional Values</span>
                <p className="text-[#D4D4D4] leading-relaxed mt-1">
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
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">
              Active Brand Guidelines ({dna.guidelines.length})
            </h3>
            {dna.guidelines.length === 0 ? (
              <p className="glass-panel p-4 rounded-[8px] text-xs text-[#777777] font-mono">
                No guidelines defined. Add the first rule using the form on the right.
              </p>
            ) : (
              dna.guidelines.map((g) => (
                <div key={g.id} className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{g.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] font-bold ${
                        g.rule_type === "prohibited" 
                          ? "bg-[#181818] border border-white/20 text-white" 
                          : "bg-white text-black font-bold shadow-sm"
                      }`}>
                        {g.rule_type}
                      </span>
                      <span className="glass-pill text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-[4px] text-[#A1A1A1]">
                        {g.severity}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteGuideline(g.id)}
                          className="text-[#777777] hover:text-white transition-colors p-1"
                          title="Delete Guideline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#D4D4D4] leading-relaxed">{g.content}</p>
                  <span className="text-[10px] text-[#777777] font-mono">Category: {g.category.replace('_', ' ')}</span>
                </div>
              ))
            )}
          </div>

          {/* Add Guideline Form */}
          {isAdmin ? (
            <div className="glass-panel p-5 rounded-[12px] border border-white/12 space-y-4 h-fit shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Add Governance Rule</h3>
              <form onSubmit={handleAddGuideline} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Rule Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyperbole Prohibition"
                    value={newGuideline.title}
                    onChange={(e) => setNewGuideline({ ...newGuideline, title: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Category</label>
                  <select
                    value={newGuideline.category}
                    onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  >
                    <option value="messaging_rule" className="bg-black text-white">Messaging & Positioning</option>
                    <option value="voice_tone" className="bg-black text-white">Voice & Tone</option>
                    <option value="visual_identity" className="bg-black text-white">Visual Identity Rule</option>
                    <option value="regulatory_compliance" className="bg-black text-white">Regulatory / Legal</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Rule Type</label>
                    <select
                      value={newGuideline.rule_type}
                      onChange={(e) => setNewGuideline({ ...newGuideline, rule_type: e.target.value as any })}
                      className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                    >
                      <option value="approved" className="bg-black text-white">Approved</option>
                      <option value="prohibited" className="bg-black text-white">Prohibited</option>
                      <option value="general" className="bg-black text-white">General Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Severity</label>
                    <select
                      value={newGuideline.severity}
                      onChange={(e) => setNewGuideline({ ...newGuideline, severity: e.target.value as any })}
                      className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                    >
                      <option value="critical" className="bg-black text-white">Critical</option>
                      <option value="warning" className="bg-black text-white">Warning</option>
                      <option value="info" className="bg-black text-white">Info</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Rule Description & Criteria</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain the constraint and what violations look like..."
                    value={newGuideline.content}
                    onChange={(e) => setNewGuideline({ ...newGuideline, content: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Save Guideline Rule
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[12px] border border-white/10 text-xs text-[#777777] font-mono">
              Administrator credentials required to create or modify brand guidelines.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Facts */}
      {activeTab === "facts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">
              Verified Brand Facts & Proof Points ({dna.facts.length})
            </h3>
            {dna.facts.length === 0 ? (
              <p className="glass-panel p-4 rounded-[8px] text-xs text-[#777777] font-mono">
                No verified facts in vault. Register official claims to power RAG claim verification.
              </p>
            ) : (
              dna.facts.map((f) => (
                <div key={f.id} className="glass-card p-4 rounded-[8px] border border-white/10 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="glass-pill text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] text-white font-bold">
                      {f.category}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteFact(f.id)}
                        className="text-[#777777] hover:text-white transition-colors p-1"
                        title="Delete Fact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white font-mono leading-relaxed">&ldquo;{f.claim_text}&rdquo;</p>
                  <div className="flex items-center space-x-3 text-[10px] text-[#A1A1A1] font-mono pt-1 border-t border-white/10">
                    <span>Source: <strong className="text-white">{f.source_name}</strong></span>
                    {f.source_url_or_ref && (
                      <span className="text-[#D4D4D4] truncate max-w-[200px]">{f.source_url_or_ref}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Fact Form */}
          {isAdmin ? (
            <div className="glass-panel p-5 rounded-[12px] border border-white/12 space-y-4 h-fit shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Register Verified Fact</h3>
              <form onSubmit={handleAddFact} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Authoritative Claim Statement</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Over $14.2B in annual settlement volume across 42 sovereign jurisdictions"
                    value={newFact.claim_text}
                    onChange={(e) => setNewFact({ ...newFact, claim_text: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Fact Category</label>
                  <select
                    value={newFact.category}
                    onChange={(e) => setNewFact({ ...newFact, category: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  >
                    <option value="statistic" className="bg-black text-white">Quantitative Metric / Statistic</option>
                    <option value="certification" className="bg-black text-white">Certification / Audit</option>
                    <option value="partnership" className="bg-black text-white">Institutional Partnership</option>
                    <option value="sla" className="bg-black text-white">Uptime SLA / Technical Benchmark</option>
                    <option value="milestone" className="bg-black text-white">Historical Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Verification Source Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 Financial Audit Report"
                    value={newFact.source_name}
                    onChange={(e) => setNewFact({ ...newFact, source_name: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Source Reference / URL</label>
                  <input
                    type="text"
                    placeholder="e.g. SEC Filing 10-K / Audit Sec. 4.2"
                    value={newFact.source_url_or_ref}
                    onChange={(e) => setNewFact({ ...newFact, source_url_or_ref: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Add to Evidence Vault
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[12px] border border-white/10 text-xs text-[#777777] font-mono">
              Administrator credentials required to register facts in the evidence vault.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Terminology */}
      {activeTab === "terminology" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">
              Brand Vocabulary Rules ({dna.terminologies.length})
            </h3>
            {dna.terminologies.length === 0 ? (
              <p className="glass-panel p-4 rounded-[8px] text-xs text-[#777777] font-mono">
                No vocabulary rules defined. Add approved or prohibited terms using the form on the right.
              </p>
            ) : (
              <div className="glass-panel divide-y divide-white/5 rounded-[12px] border border-white/12 overflow-hidden shadow-xl">
                {dna.terminologies.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-[4px] font-bold ${
                          t.term_type === "prohibited" 
                            ? "bg-[#181818] border border-white/20 text-white" 
                            : "bg-white text-black font-bold shadow-sm"
                        }`}>
                          {t.term_type}
                        </span>
                        <span className="font-bold text-white text-xs font-mono">&apos;{t.term}&apos;</span>
                      </div>
                      {t.replacement_suggestion && (
                        <p className="text-xs text-[#D4D4D4] font-mono">
                          Replace with: <span className="font-bold text-white underline underline-offset-2">{t.replacement_suggestion}</span>
                        </p>
                      )}
                      {t.explanation && (
                        <p className="text-[11px] text-[#A1A1A1] font-sans">{t.explanation}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTerm(t.id)}
                        className="text-[#777777] hover:text-white p-2 transition-colors"
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
            <div className="glass-panel p-5 rounded-[12px] border border-white/12 space-y-4 h-fit shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Add Vocabulary Rule</h3>
              <form onSubmit={handleAddTerm} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Target Term</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. cheap settlement"
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Classification</label>
                  <select
                    value={newTerm.term_type}
                    onChange={(e) => setNewTerm({ ...newTerm, term_type: e.target.value as any })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  >
                    <option value="prohibited" className="bg-black text-white">Strictly Prohibited</option>
                    <option value="approved" className="bg-black text-white">Official / Approved</option>
                    <option value="preferred" className="bg-black text-white">Preferred Phrasing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Approved Replacement</label>
                  <input
                    type="text"
                    placeholder="e.g. capital-efficient institutional clearing"
                    value={newTerm.replacement_suggestion}
                    onChange={(e) => setNewTerm({ ...newTerm, replacement_suggestion: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Brand Rationale</label>
                  <textarea
                    rows={2}
                    placeholder="Why this vocabulary matters..."
                    value={newTerm.explanation}
                    onChange={(e) => setNewTerm({ ...newTerm, explanation: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Save Terminology Rule
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-[12px] border border-white/10 text-xs text-[#777777] font-mono">
              Administrator credentials required to enforce brand vocabulary.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Visuals */}
      {activeTab === "visuals" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">Approved Visual Design Tokens</h3>
            <p className="text-xs text-[#A1A1A1]">
              The AI Visual Forensics engine audits uploaded creatives and images against these certified monochromatic hexadecimal values and minimum clear-space thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card p-4 rounded-[10px] space-y-3">
              <div className="w-full h-14 rounded-[6px] bg-[#000000] border border-white/15" />
              <div>
                <p className="text-xs font-bold text-white">Pure Black</p>
                <p className="text-[11px] text-[#A1A1A1] font-mono">HEX: #000000</p>
                <p className="text-[10px] text-[#777777] mt-0.5">Primary Canvas Base</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[10px] space-y-3">
              <div className="w-full h-14 rounded-[6px] bg-[#111111] border border-white/15" />
              <div>
                <p className="text-xs font-bold text-white">Dark Surface</p>
                <p className="text-[11px] text-[#A1A1A1] font-mono">HEX: #111111</p>
                <p className="text-[10px] text-[#777777] mt-0.5">Panels & Workspaces</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[10px] space-y-3">
              <div className="w-full h-14 rounded-[6px] bg-[#181818] border border-white/15" />
              <div>
                <p className="text-xs font-bold text-white">Elevated Surface</p>
                <p className="text-[11px] text-[#A1A1A1] font-mono">HEX: #181818</p>
                <p className="text-[10px] text-[#777777] mt-0.5">Floating Cards & Tables</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[10px] space-y-3">
              <div className="w-full h-14 rounded-[6px] bg-[#D4D4D4] border border-white/15" />
              <div>
                <p className="text-xs font-bold text-black">Light Gray</p>
                <p className="text-[11px] text-[#A1A1A1] font-mono">HEX: #D4D4D4</p>
                <p className="text-[10px] text-[#777777] mt-0.5">Secondary Signals & Highlights</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[10px] space-y-3">
              <div className="w-full h-14 rounded-[6px] bg-[#FFFFFF] border border-white/15" />
              <div>
                <p className="text-xs font-bold text-black">Pure White</p>
                <p className="text-[11px] text-[#A1A1A1] font-mono">HEX: #FFFFFF</p>
                <p className="text-[10px] text-[#777777] mt-0.5">Primary Actions & Headings</p>
              </div>
            </div>
          </div>

          {/* Custom Brand Assets */}
          {dna.assets.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A1]">Registered Custom Assets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dna.assets.map((asset) => (
                  <div key={asset.id} className="glass-card p-4 rounded-[8px] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{asset.name}</p>
                      <p className="text-[10px] font-mono text-[#D4D4D4] uppercase">{asset.asset_type.replace('_', ' ')}</p>
                      {asset.metadata_json && (
                        <p className="text-[11px] text-[#A1A1A1] font-mono mt-1 truncate max-w-[200px]">{asset.metadata_json}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-[#777777] hover:text-white p-1 transition-colors"
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
            <div className="glass-panel p-5 rounded-[12px] border border-white/12 space-y-4 max-w-xl shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Register Custom Brand Token</h3>
              <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Asset Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Official Monochrome Wordmark"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                      className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Asset Category</label>
                    <select
                      value={newAsset.asset_type}
                      onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value as any })}
                      className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                    >
                      <option value="color_palette" className="bg-black text-white">Color Palette</option>
                      <option value="logo" className="bg-black text-white">Official Logo</option>
                      <option value="typography" className="bg-black text-white">Typography Spec</option>
                      <option value="imagery" className="bg-black text-white">Imagery Standard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Specification / Hex Code / Clear Space</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #FFFFFF or min-clear-space: 24px"
                    value={newAsset.metadata_json}
                    onChange={(e) => setNewAsset({ ...newAsset, metadata_json: e.target.value })}
                    className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
        <div className="glass-panel p-8 rounded-[14px] border border-white/15 space-y-6 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-[8px] bg-white/5 border border-white/20 text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Upload Brand Guidelines Document</h3>
            <p className="text-xs text-[#A1A1A1] mt-1">
              Supports .pdf, .txt, and .md files. Extracted text is automatically indexed into the Brand DNA RAG pipeline for autonomous retrieval during content verification.
            </p>
          </div>

          {isAdmin ? (
            <label className="inline-block cursor-pointer px-6 py-3 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all">
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
            <p className="text-xs text-[#777777] font-mono">
              Administrator credentials required to upload guideline documents.
            </p>
          )}

          {uploadText && (
            <div className="text-left mt-6 p-4 rounded-[8px] glass-inner border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-white font-bold">Extracted & Ingested into Brand DNA:</p>
              <p className="text-xs text-[#D4D4D4] font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {uploadText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create New Brand */}
      {showCreateBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[14px] glass-modal p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Establish New Brand Identity</h3>
              </div>
              <button onClick={() => setShowCreateBrandModal(false)} className="text-[#A1A1A1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Liquidity"
                  value={newBrandForm.name}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Institutional Finance / Web3"
                  value={newBrandForm.industry}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, industry: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Mission Statement</label>
                <textarea
                  rows={2}
                  placeholder="What is this brand's sovereign purpose?"
                  value={newBrandForm.mission}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, mission: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Personality Traits (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. authoritative, precise, institutional"
                  value={newBrandForm.personality}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, personality: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Official Website</label>
                <input
                  type="url"
                  placeholder="https://brand.domain"
                  value={newBrandForm.website}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, website: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateBrandModal(false)}
                  className="glass-button px-4 py-2 rounded-[6px] text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[14px] glass-modal p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Update Brand Profile</h3>
              </div>
              <button onClick={() => setShowEditBrandModal(false)} className="text-[#A1A1A1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBrand} className="space-y-3 text-xs">
              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editBrandForm.name}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, name: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Industry</label>
                <input
                  type="text"
                  required
                  value={editBrandForm.industry}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, industry: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Mission Statement</label>
                <textarea
                  rows={2}
                  value={editBrandForm.mission}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, mission: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Core Values</label>
                <textarea
                  rows={2}
                  value={editBrandForm.values}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, values: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Personality Traits</label>
                <input
                  type="text"
                  value={editBrandForm.personality}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, personality: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="text-[#A1A1A1] block mb-1 font-mono uppercase text-[10px]">Website</label>
                <input
                  type="url"
                  value={editBrandForm.website}
                  onChange={(e) => setEditBrandForm({ ...editBrandForm, website: e.target.value })}
                  className="glass-input w-full rounded-[6px] px-3 py-2 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditBrandModal(false)}
                  className="glass-button px-4 py-2 rounded-[6px] text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-white text-black hover:bg-[#D4D4D4] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
