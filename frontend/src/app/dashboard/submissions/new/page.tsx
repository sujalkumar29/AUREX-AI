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
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.16em] text-teal-muted">
          <Activity className="w-3.5 h-3.5 text-signal-emerald animate-pulse" />
          <span>CONTENT VERIFICATION STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-offwhite tracking-tight">
          Submit Content for Brand Analysis
        </h1>
        <p className="text-xs text-silver/70 font-normal">
          Your content will be cross-referenced across 6 governance dimensions against the brand&apos;s approved DNA knowledge base.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-[4px] bg-signal-crimson/15 border border-signal-crimson/40 text-xs text-signal-crimson flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Fill Buttons for Quick Testing */}
      <div className="p-4 rounded-[4px] bg-slate-deep border border-silver/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-silver/60 font-mono text-[11px] uppercase tracking-wider">Demo Presets:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleSampleFill("compliant")}
            className="px-3 py-1.5 rounded-[2px] bg-charcoal border border-teal-muted/40 text-teal-muted hover:bg-midnight font-mono text-xs transition-colors"
          >
            Load Compliant Copy (~96 Score)
          </button>
          <button
            type="button"
            onClick={() => handleSampleFill("violations")}
            className="px-3 py-1.5 rounded-[2px] bg-charcoal border border-signal-crimson/40 text-signal-crimson hover:bg-midnight font-mono text-xs transition-colors"
          >
            Load Violation Copy (~58 Score)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-[6px] bg-slate-deep border border-silver/15 space-y-5 shadow-elevation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
              Select Brand DNA
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2.5 text-xs text-offwhite focus:outline-none focus:border-teal-muted"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.industry})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
              Content Format
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2.5 text-xs text-offwhite focus:outline-none focus:border-teal-muted"
            >
              <option value="marketing_copy">Marketing / Web Copy</option>
              <option value="social_post">Social Media Post</option>
              <option value="product_description">Product Description</option>
              <option value="document">Full Document / Whitepaper</option>
              <option value="image">Visual Asset / Creative</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-silver/70 mb-1">
            Submission Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q1 Global Expansion Announcement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-[4px] bg-midnight border border-silver/20 px-3.5 py-2.5 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-silver/70">
              Content Copy to Evaluate
            </label>
            <span className="text-[11px] font-mono text-silver/50">
              {rawText.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            placeholder="Paste your marketing copy, social caption, or document draft here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full rounded-[4px] bg-midnight border border-silver/20 p-3.5 text-xs text-offwhite placeholder-silver/40 focus:outline-none focus:border-teal-muted font-mono leading-relaxed"
          />
        </div>

        {/* File Drag & Drop / Upload Optional */}
        <div className="p-4 rounded-[4px] bg-midnight border border-dashed border-silver/20 text-center space-y-2">
          <Upload className="w-5 h-5 text-teal-muted mx-auto" />
          <div className="text-xs text-silver">
            <label className="text-teal-muted hover:underline cursor-pointer font-semibold">
              Upload companion asset or document
              <input
                type="file"
                className="hidden"
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-silver/50"> (PDF, TXT, PNG, JPG up to 25MB)</span>
          </div>
          {file && (
            <p className="text-xs text-signal-emerald font-mono">
              Attached: {file.name} ({uploadedFileMeta?.content_type || "file"})
            </p>
          )}
        </div>

        {/* Submission Button / Progress */}
        {isSubmitting ? (
          <div className="p-4 rounded-[4px] bg-midnight border border-teal-muted/40 text-center space-y-2">
            <div className="inline-block animate-spin w-5 h-5 border-2 border-teal-muted border-t-transparent rounded-full" />
            <p className="text-xs font-mono text-teal-muted">{analysisStep}</p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-[4px] bg-offwhite text-midnight hover:bg-silver font-bold text-xs uppercase tracking-wider transition-colors shadow-technical flex items-center justify-center space-x-2"
          >
            <span>Run Brand Integrity Analysis</span>
            <ArrowRight className="w-4 h-4 text-midnight" />
          </button>
        )}
      </form>
    </div>
  );
}
