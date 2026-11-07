from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class TopViolationItem(BaseModel):
    category: str
    issue_title: str
    count: int
    severity: str
    sample_detection: Optional[str] = None

class TerminologyMistakeItem(BaseModel):
    prohibited_term: str
    replacement_suggestion: Optional[str]
    occurrence_count: int

class RecurringClaimIssue(BaseModel):
    claim_text: str
    classification: str
    count: int
    suggested_fix: Optional[str]

class ComplianceTrendPoint(BaseModel):
    date: str
    average_score: float
    total_submissions: int = 0
    approved_count: int = 0
    changes_required_count: int = 0

class CategoryBreakdownItem(BaseModel):
    category_name: str
    total_issues: int
    percentage: float

class GovernanceInsightsResponse(BaseModel):
    total_submissions: int = 0
    overall_compliance_rate: float = 0.0
    approved_percentage: float = 0.0
    avg_governance_score: float = 0.0
    top_violations: List[TopViolationItem] = []
    frequent_terminology_mistakes: List[TerminologyMistakeItem] = []
    recurring_unverified_claims: List[RecurringClaimIssue] = []
    category_breakdown: List[CategoryBreakdownItem] = []
    compliance_timeline: List[ComplianceTrendPoint] = []
    recent_governance_actions: List[Dict[str, Any]] = []

