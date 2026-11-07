from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.submission import FindingResponse
from app.schemas.brand import BrandResponse

class ClaimMatrixItem(BaseModel):
    statement: str
    classification: str  # SUPPORTED, CONFLICTING, UNVERIFIED
    explanation: str
    supporting_source: Optional[str] = None
    severity: str
    suggested_correction: Optional[str] = None

class TrustPassportDetail(BaseModel):
    submission_id: str
    submission_title: str
    brand: BrandResponse
    creator_name: str
    creator_email: str
    version: int
    content_type: str
    raw_text: Optional[str]
    file_url: Optional[str]
    
    # Analysis Metrics
    overall_status: str  # Ready for Review, Changes Required, Approved, Rejected
    governance_score: float  # 0 to 100
    execution_mode: str  # gemini_live or deterministic_local
    disclaimer: str
    
    # Breakdown Counts
    total_issues: int
    critical_issues: int
    warning_issues: int
    info_issues: int
    
    # Claim Verification Counts
    supported_claims: int
    conflicting_claims: int
    unverified_claims: int
    
    # Pillar Scores
    brand_voice_score: float
    terminology_score: float
    claim_integrity_score: float
    visual_compliance_score: float
    
    # Structured Findings & Evidence Trace
    findings: List[FindingResponse]
    claims_matrix: List[ClaimMatrixItem]
    hmac_sha256: Optional[str] = None
    
    # Audit & Approval
    final_approval_status: str
    review_notes: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    analyzed_at: datetime

