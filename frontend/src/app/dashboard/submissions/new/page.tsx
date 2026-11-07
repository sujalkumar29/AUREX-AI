"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";
import { useBrand } from "@/lib/brand-context";
import { Brand } from "@/types";

export default function NewSubmissionPage() {
  const router = useRouter();
  const { brands: contextBrands, selectedBrand } = useBrand();
  const [brands, setBrands] = useState<Brand[]>(contextBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(selectedBrand?.id || "");
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("marketing_copy");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contextBrands.length > 0) {
      setBrands(contextBrands);
      if (!selectedBrandId) {
        setSelectedBrandId(selectedBrand?.id || contextBrands[0].id);
      }
    } else {
      api.listBrands().then((data) => {
        setBrands(data);
        if (data.length > 0 && !selectedBrandId) {
          setSelectedBrandId(data[0].id);
        }
      });
    }
  }, [contextBrands, selectedBrand, selectedBrandId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    try {
      const res = await api.uploadFile(selectedFile);
      setUploadedFileMeta(res);
      if (res.extracted_text) {
        setRawText(res.extracted_text);
      }
    } catch (err: any) {
      setError("File upload failed: " + err.message);
    }
  };

  const handleSampleFill = (type: "compliant" | "violations") => {
    if (type === "compliant") {
      setTitle("Q1 Global Settlement Announcement");
      setContentType("marketing_copy");
      setRawText("AuraPay is proud to announce our institutional corridor expansion. With over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit, our Sovereign Settlement Engine delivers deterministic settlement finality in under 420 milliseconds worldwide while guaranteeing our 99.995% uptime SLA.");
    } else {
      setTitle("Promotional Social Campaign Draft");
      setContentType("social_post");
      setRawText("Tired of middleman fees? AuraPay gives institutional clients the ultimate cheap settlement! Our network boasts an insane 99.999% uptime SLA and crushes legacy banking speed with zero latency. Trade every crypto coin without worrying about protocol clearing fees.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId) {
      setError("Please select a brand");
      return;
    }
    if (!title) {
      setError("Please enter a submission title");
      return;
    }
    if (!rawText && !uploadedFileMeta) {
      setError("Please provide content text or upload a file");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      setAnalysisStep("1/4: Retrieving approved Brand DNA via semantic RAG...");
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep("2/4: Grounding factual claims & checking SLA statistics...");
      await new Promise((r) => setTimeout(r, 700));

      setAnalysisStep("3/4: Auditing terminology compliance & voice alignment...");
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep("4/4: Synthesizing official Trust Passport report...");

      const submission = await api.createSubmission({
        brand_id: selectedBrandId,
        title,
        content_type: contentType,
        raw_text: rawText,
        file_path: uploadedFileMeta?.file_path,
        file_url: uploadedFileMeta?.file_url,
      });

      router.push(`/dashboard/trust-passport/${submission.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to execute brand governance analysis");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-[#17143A]">
      {/* Header */}
      <div className="space-y-1">
        <div className="glass-pill inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#5B4BFF] px-2.5 py-1 rounded-[6px] bg-[#E6E0FF] border border-[#5B4BFF]/25">
          <Activity className="w-3.5 h-3.5 text-[#5B4BFF] animate-pulse" />
          <span>CONTENT VERIFICATION STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B2D] tracking-tight">
          Submit Content for Brand Analysis
        </h1>
        <p className="text-xs text-[#77738F] font-normal">
          Your content will be cross-referenced across 6 governance dimensions against the brand&apos;s approved DNA knowledge base.
        </p>
      </div>

      {error && (
        <div className="glass-card p-3.5 rounded-[10px] border-2 border-red-300 bg-red-50/80 text-xs text-red-700 flex items-center space-x-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Fill Buttons for Quick Testing */}
      <div className="glass-panel p-4 rounded-[12px] border border-[#E5E1F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm bg-white/70">
        <span className="text-[#77738F] font-mono text-[11px] uppercase tracking-wider font-semibold">Demo Presets:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSampleFill("compliant")}
            className="glass-button px-3 py-1.5 rounded-[8px] font-mono text-xs text-[#0D0B2D] hover:text-[#5B4BFF] border-[#E5E1F2] hover:bg-[#F0EDFF] transition-colors"
          >
            Load Compliant Copy (~96 Score)
          </button>
          <button
            type="button"
            onClick={() => handleSampleFill("violations")}
            className="glass-button px-3 py-1.5 rounded-[8px] font-mono text-xs text-[#77738F] hover:text-[#5B4BFF] border-[#E5E1F2] hover:bg-[#F0EDFF] transition-colors"
          >
            Load Violation Copy (~58 Score)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card-elevated p-6 md:p-8 rounded-[16px] border border-[#E5E1F2] space-y-6 shadow-xl backdrop-blur-2xl bg-white/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
              Select Brand DNA
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="glass-input w-full rounded-[8px] px-3.5 py-2.5 text-xs text-[#17143A] bg-white border border-[#E5E1F2] focus:border-[#5B4BFF] focus:outline-none"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id} className="bg-white text-[#17143A]">
                  {b.name} ({b.industry})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
              Content Format
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="glass-input w-full rounded-[8px] px-3.5 py-2.5 text-xs text-[#17143A] bg-white border border-[#E5E1F2] focus:border-[#5B4BFF] focus:outline-none"
            >
              <option value="marketing_copy" className="bg-white text-[#17143A]">Marketing / Web Copy</option>
              <option value="social_post" className="bg-white text-[#17143A]">Social Media Post</option>
              <option value="product_description" className="bg-white text-[#17143A]">Product Description</option>
              <option value="document" className="bg-white text-[#17143A]">Full Document / Whitepaper</option>
              <option value="image" className="bg-white text-[#17143A]">Visual Asset / Creative</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] mb-1 font-semibold">
            Submission Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q1 Global Expansion Announcement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input w-full rounded-[8px] px-3.5 py-2.5 text-xs text-[#17143A] placeholder-[#77738F]/60 bg-white border border-[#E5E1F2] focus:border-[#5B4BFF] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#77738F] font-semibold">
              Content Copy to Evaluate
            </label>
            <span className="text-[11px] font-mono text-[#77738F]">
              {rawText.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            placeholder="Paste your marketing copy, social caption, or document draft here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="glass-input w-full rounded-[8px] p-3.5 text-xs text-[#17143A] placeholder-[#77738F]/60 font-mono leading-relaxed bg-white border border-[#E5E1F2] focus:border-[#5B4BFF] focus:outline-none"
          />
        </div>

        {/* File Drag & Drop / Upload Optional */}
        <div className="glass-inner p-5 rounded-[12px] border border-dashed border-[#5B4BFF]/30 text-center space-y-2 bg-[#F7F8FF]/80">
          <Upload className="w-6 h-6 text-[#5B4BFF] mx-auto" />
          <div className="text-xs text-[#77738F]">
            <label className="text-[#5B4BFF] hover:underline cursor-pointer font-semibold">
              Upload companion asset or document
              <input
                type="file"
                className="hidden"
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-[#77738F]"> (PDF, TXT, PNG, JPG up to 25MB)</span>
          </div>
          {file && (
            <p className="text-xs text-[#5B4BFF] font-mono font-bold pt-1">
              Attached: {file.name} ({uploadedFileMeta?.content_type || "file"})
            </p>
          )}
        </div>

        {/* Submission Button / Progress */}
        {isSubmitting ? (
          <div className="glass-inner p-5 rounded-[10px] border border-[#5B4BFF]/30 text-center space-y-2 bg-[#F0EDFF]">
            <div className="inline-block animate-spin w-5 h-5 border-2 border-[#5B4BFF] border-t-transparent rounded-full" />
            <p className="text-xs font-mono text-[#5B4BFF] font-semibold">{analysisStep}</p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-[8px] bg-[#5B4BFF] text-white hover:bg-[#4d3df5] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(91,75,255,0.35)] hover:shadow-[0_6px_20px_rgba(91,75,255,0.45)] flex items-center justify-center space-x-2 font-mono"
          >
            <span>Run Brand Integrity Analysis</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}
      </form>
    </div>
  );
}
