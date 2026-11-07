from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class FindingResponse(BaseModel):
    id: str
    analysis_id: str
    category: str
    severity: str
    detected_text: str
    issue_title: str
    explanation: str
    suggested_correction: Optional[str]
    claim_classification: Optional[str]
    confidence_score: float
    evidence_source: Optional[str]
    evidence_ref_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisResultResponse(BaseModel):
    id: str
    submission_id: str
    overall_score: float
    overall_status: str
    summary: Optional[str]
    execution_mode: str
    disclaimer: str
    total_issues: int
    critical_count: int
    warning_count: int
    info_count: int
    supported_claims_count: int
    conflicting_claims_count: int
    unverified_claims_count: int
    brand_voice_score: float
    terminology_score: float
    claim_integrity_score: float
    visual_compliance_score: float
    created_at: datetime
    findings: List[FindingResponse] = []

    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    brand_id: str
    title: str
    content_type: str = "marketing_copy"  # text, marketing_copy, social_post, document, image
    raw_text: Optional[str] = None
    file_path: Optional[str] = None
    file_url: Optional[str] = None

class SubmissionUpdate(BaseModel):
    title: Optional[str] = None
    raw_text: Optional[str] = None
    status: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: str
    brand_id: str
    creator_id: str
    title: str
    content_type: str
    raw_text: Optional[str]
    file_path: Optional[str]
    file_url: Optional[str]
    status: str
    version: int
    current_analysis_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    latest_analysis: Optional[AnalysisResultResponse] = None

    class Config:
        from_attributes = True

