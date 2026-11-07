# AUREX AI — The Gold Standard of Brand Integrity

> **AI recommends. Evidence explains. Humans decide.**

**AUREX AI** is an enterprise-grade AI-powered Brand Governance & Intelligence Platform that guarantees every piece of marketing copy, social campaign, product description, document, and visual creative adheres strictly to approved brand identity, certified facts, prohibited/approved terminology, and visual design standards before publication.

AUREX does not simply identify mistakes or output ungrounded numbers. It **explains why** content deviates from guidelines, provides **verifiable supporting evidence receipts**, and offers **intent-preserving corrections** while ensuring human reviewers retain ultimate publishing authority.

---

## 🏛️ Key Differentiators

1. **Evidence-Linked Trust Passport™**:
   Every content evaluation generates an official Trust Passport report. Claims are categorized into `SUPPORTED`, `CONFLICTING`, and `UNVERIFIED` (never prematurely assumed false), with each finding directly linked to official citations (audits, SEC 10-K, technical benchmarks) and downloadable as an audit-ready PDF.
2. **Multimodal Brand Forensics**:
   Evaluates both textual messaging and creative assets (images, logos, color hex deviations, typography, and WCAG AA accessibility contrast ratios).
3. **Adaptive Brand Intelligence**:
   Aggregates organization-wide evaluation telemetry into Governance Insights—identifying recurring terminology slips, unverified claim habits, and guideline gaps to iteratively fortify brand rules.

---

## 🚀 System Architecture & Tech Stack

```
                          ┌─────────────────────────────────────┐
                          │         Next.js 15 Frontend         │
                          │  React 19, TypeScript, Tailwind CSS │
                          │  (Deep Charcoal & Metallic Gold)    │
                          └──────────────────┬──────────────────┘
                                             │ REST API / JWT
                                             ▼
                          ┌─────────────────────────────────────┐
                          │         FastAPI Backend Core        │
                          │   Pydantic v2, SQLAlchemy ORM       │
                          └──────┬───────────┬────────────┬─────┘
                                 │           │            │
             ┌───────────────────┘           │            └───────────────────┐
             ▼                               ▼                                ▼
   ┌──────────────────┐            ┌──────────────────┐             ┌──────────────────┐
   │ Semantic RAG &   │            │ Google Gemini    │             │  PostgreSQL /    │
   │ Deterministic    │            │ GenAI SDK        │             │  SQLite Database │
   │ Evidence Matcher │            │ (Live AI Mode)   │             │  + PDF Engine    │
   └──────────────────┘            └──────────────────┘             └──────────────────┘
```

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Uvicorn, Pydantic Settings, PyPDF, Pillow, ReportLab.
- **AI & RAG**: Google Gemini API (`gemini-2.5-flash` via official `google-genai` SDK) with automatic dual-mode fallback to deterministic local semantic governance when running without an external API key.
- **Database**: SQLite (zero-configuration out of the box) with seamless PostgreSQL / `pgvector` compatibility via `DATABASE_URL`.

---

## ⚡ Quickstart Guide

### Option 1: One-Click Startup (Windows)
Double-click `start_all.bat` or run:
```powershell
.\start_all.ps1
```
This automatically launches both the FastAPI backend on port 8000 and the Next.js frontend on port 3000!

---

### Option 2: Manual Terminal Execution

#### 1. Backend Setup:
```bash
cd backend
# The virtual environment is pre-configured in backend/venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at: `http://127.0.0.1:8000` (Interactive Swagger Docs at `http://127.0.0.1:8000/docs`)*

#### 2. Frontend Setup:
```bash
cd frontend
pnpm install
pnpm dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 🔑 Demo Personas for Quick Evaluation

The application includes an instant **Persona Switcher** on the login page (`/login`) for evaluation:

| Role | Email | Password | Responsibility |
| :--- | :--- | :--- | :--- |
| **Brand Admin** | `admin@aurex.ai` | `aurex123` | Configures Brand DNA, Guidelines, Facts & Vocab |
| **Content Creator** | `creator@aurex.ai` | `aurex123` | Drafts campaigns, runs analysis, applies suggested fixes |
| **Brand Reviewer** | `reviewer@aurex.ai` | `aurex123` | Examines Trust Passports, reviews comments, grants signoff |

---

## 📦 Core Feature Walkthrough

### 1. Brand DNA Workspace (`/dashboard/brand-dna`)
- **Brand Guidelines**: Mission, personality, voice rules, approved and prohibited messaging.
- **Brand Facts**: Official quantitative claims, SLA uptime figures, regulatory certifications, and references.
- **Brand Terminology**: Vocabulary dictionary mapping prohibited phrasing to approved enterprise terms.
- **Visual Assets**: Design tokens, color swatches with HEX codes, typography systems.
- **Document Ingestion**: Upload PDF or TXT guideline files with automatic semantic extraction.

### 2. AI Content Submission Studio (`/dashboard/submissions/new`)
- Submit text, marketing copy, social media captions, or upload documents/images.
- Includes preset test buttons:
  - **Load Compliant Copy**: Demonstrates high-scoring (~96/100) verified claims.
  - **Load Violation Copy**: Triggers prohibited terms (`cheap settlement`), SLA conflicts (`99.999%` vs `99.995%`), and voice slips.

### 3. The Signature Trust Passport™ (`/dashboard/trust-passport/[id]`)
- **Executive Governance Score**: 0 to 100 with official governance status badge.
- **Four Core Pillars**: Brand Voice, Terminology Compliance, Claim Integrity, and Visual Standards.
- **Three-Tier Claim Matrix**: Categorizes assertions into `SUPPORTED`, `CONFLICTING`, or `UNVERIFIED`.
- **Traceable Receipts**: Links findings to exact audited records.
- **Apply Fix**: One-click correction directly modifies the draft and re-evaluates compliance.
- **Official PDF Export**: Generates tamper-evident PDF certificates.

### 4. Human-in-the-Loop Review Station (`/dashboard/review/[id]`)
- Review actions: `Approve Publication`, `Request Revisions`, or `Reject Content`.
- Decision rationale logging and audit trail.
- Multi-user threaded discussion between creators and reviewers.
- Version history and revision diff snapshots.

### 5. Governance Insights & Adaptive Policies (`/dashboard/insights`)
- Top recurring brand violations chart.
- Prohibited vocabulary leaderboard.
- Recurring unverified claim patterns.
- Adaptive policy recommendations to improve company guidelines based on writer habits.

---

## 🛡️ Environment Variables (`backend/.env`)

```ini
PROJECT_NAME="AUREX AI"
TAGLINE="The Gold Standard of Brand Integrity"
VERSION="1.0.0"

# Database: SQLite by default; set to postgresql://user:pass@host:5432/db for PostgreSQL
DATABASE_URL="sqlite:///./aurex_ai.db"

# JWT Authentication
JWT_SECRET_KEY="aurex_super_secret_jwt_key_2026_enterprise_brand_integrity"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google Gemini API (Optional)
# If provided, AUREX AI enables live Gemini 2.5 Flash RAG & visual forensics.
# If omitted, AUREX AI smoothly operates on its deterministic local governance engine.
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_EMBEDDING_MODEL="text-embedding-004"

# Uploads
UPLOAD_DIR="./uploads"
```

---

## 🧪 Verification & Testing

To execute the backend verification test suite:
```powershell
cd backend
.\venv\Scripts\python.exe test_direct.py
```
Output:
```
Health: {'status': 'healthy', 'app': 'AUREX AI', 'version': '1.0.0'}
System Status: {'ai_engine': 'Deterministic Brand Governance Engine (Demo/Local Mode)'}
Auth Login: Success!
Brands: Retrieved 2 brands. Primary: AuraPay Global
Brand DNA: 4 facts, 5 terms, 3 guidelines
Submissions: Retrieved 2 submissions.
Trust Passport: Score 58.5/100, Status: 'Changes Required', Total Findings: 4
Insights: Avg Score 77.2%, Violations: 4
>>> ALL BACKEND CORE LOGIC & ROUTERS VERIFIED 100% SUCCESFUL! <<<
```

---

## 📜 Compliance Disclaimer

AUREX AI is an assistive governance recommendation engine. AI evaluations do not constitute a legal guarantee of factual accuracy. Final publishing decisions are reserved for designated human reviewers.

