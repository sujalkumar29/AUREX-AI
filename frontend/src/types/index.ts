export type UserRole = 'admin' | 'creator' | 'reviewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  industry: string;
  description?: string;
  mission?: string;
  values?: string;
  personality: string;
  logo_url?: string;
  website?: string;
  is_default: boolean;
  created_at: string;
}

export interface BrandGuideline {
  id: string;
  brand_id: string;
  title: string;
  category: string;
  content: string;
  rule_type: 'approved' | 'prohibited' | 'general';
  severity: 'critical' | 'warning' | 'info';
  created_at: string;
}

export interface BrandFact {
  id: string;
  brand_id: string;
  claim_text: string;
  category: string;
  source_name: string;
  source_url_or_ref?: string;
  verified_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface BrandTerminology {
  id: string;
  brand_id: string;
  term: string;
  term_type: 'approved' | 'prohibited' | 'preferred';
  replacement_suggestion?: string;
  explanation?: string;
  context_category?: string;
  created_at: string;
}

export interface BrandAsset {
  id: string;
  brand_id: string;
  asset_type: 'logo' | 'color_palette' | 'typography' | 'imagery' | 'guideline_doc';
  name: string;
  file_path?: string;
  file_url?: string;
  metadata_json?: string;
  created_at: string;
}

export interface BrandDNA {
  brand: Brand;
  guidelines: BrandGuideline[];
  facts: BrandFact[];
  terminologies: BrandTerminology[];
  assets: BrandAsset[];
}

export type ClaimClassification = 'SUPPORTED' | 'CONFLICTING' | 'UNVERIFIED';

export interface ClaimMatrixItem {
  statement: string;
  classification: ClaimClassification;
  explanation: string;
  supporting_source?: string;
  severity: 'critical' | 'warning' | 'info';
  suggested_correction?: string;
}

export interface Finding {
  id: string;
  analysis_id: string;
  category: 'claim_verification' | 'brand_voice' | 'terminology' | 'messaging_alignment' | 'visual_consistency' | 'accessibility';
  severity: 'critical' | 'warning' | 'info';
  detected_text: string;
  issue_title: string;
  explanation: string;
  suggested_correction?: string;
  claim_classification?: ClaimClassification;
  confidence_score: number;
  evidence_source?: string;
  evidence_ref_id?: string;
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  submission_id: string;
  overall_score: number;
  overall_status: 'Ready for Review' | 'Changes Required' | 'Approved' | 'Rejected';
  summary?: string;
  execution_mode: 'gemini_live' | 'deterministic_local';
  disclaimer: string;
  total_issues: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  supported_claims_count: number;
  conflicting_claims_count: number;
  unverified_claims_count: number;
  brand_voice_score: number;
  terminology_score: number;
  claim_integrity_score: number;
  visual_compliance_score: number;
  created_at: string;
  findings: Finding[];
}

export interface Submission {
  id: string;
  brand_id: string;
  creator_id: string;
  title: string;
  content_type: 'text' | 'marketing_copy' | 'social_post' | 'document' | 'image';
  raw_text?: string;
  file_path?: string;
  file_url?: string;
  status: 'draft' | 'analyzing' | 'ready_for_review' | 'changes_required' | 'approved' | 'rejected';
  version: number;
  current_analysis_id?: string;
  created_at: string;
  updated_at: string;
  latest_analysis?: AnalysisResult;
}

export interface TrustPassportDetail {
  submission_id: string;
  submission_title: string;
  brand: Brand;
  creator_name: string;
  creator_email: string;
  version: number;
  content_type: string;
  raw_text?: string;
  file_url?: string;
  overall_status: 'Ready for Review' | 'Changes Required' | 'Approved' | 'Rejected';
  governance_score: number;
  execution_mode: string;
  disclaimer: string;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  supported_claims: number;
  conflicting_claims: number;
  unverified_claims: number;
  brand_voice_score: number;
  terminology_score: number;
  claim_integrity_score: number;
  visual_compliance_score: number;
  findings: Finding[];
  claims_matrix: ClaimMatrixItem[];
  final_approval_status: string;
  review_notes?: string;
  reviewer_name?: string;
  reviewed_at?: string;
  created_at: string;
  analyzed_at: string;
}

export interface Review {
  id: string;
  submission_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  action: 'approve' | 'request_changes' | 'reject';
  notes?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  submission_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
}

export interface RevisionHistory {
  id: string;
  submission_id: string;
  version: number;
  raw_text: string;
  changed_by_user_id: string;
  summary_of_changes?: string;
  created_at: string;
}

export interface GovernanceInsights {
  total_submissions: number;
  overall_compliance_rate: number;
  approved_percentage: number;
  avg_governance_score: number;
  top_violations: {
    category: string;
    issue_title: string;
    count: number;
    severity: string;
    sample_detection?: string;
  }[];
  frequent_terminology_mistakes: {
    prohibited_term: string;
    replacement_suggestion?: string;
    occurrence_count: number;
  }[];
  recurring_unverified_claims: {
    claim_text: string;
    classification: string;
    count: number;
    suggested_fix?: string;
  }[];
  category_breakdown: {
    category_name: string;
    total_issues: number;
    percentage: number;
  }[];
  compliance_timeline: {
    date: string;
    average_score: number;
    total_submissions: number;
    approved_count: number;
    changes_required_count: number;
  }[];
  recent_governance_actions: {
    action: string;
    target: string;
    timestamp: string;
  }[];
}
