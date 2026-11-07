import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=False)
    creator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content_type = Column(String(50), default="text")  # text, marketing_copy, social_post, document, image
    raw_text = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=True)
    status = Column(String(50), default="ready_for_review")  # draft, analyzing, ready_for_review, changes_required, approved, rejected
    version = Column(Integer, default=1)
    current_analysis_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    brand = relationship("Brand", back_populates="submissions")
    creator = relationship("User", back_populates="submissions")
    analyses = relationship("AnalysisResult", back_populates="submission", cascade="all, delete-orphan", foreign_keys="AnalysisResult.submission_id")
    reviews = relationship("Review", back_populates="submission", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="submission", cascade="all, delete-orphan")
    revisions = relationship("RevisionHistory", back_populates="submission", cascade="all, delete-orphan")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    overall_score = Column(Float, default=100.0)  # 0 to 100
    overall_status = Column(String(50), default="Ready for Review")  # Ready for Review, Changes Required, Approved, Rejected
    summary = Column(Text, nullable=True)
    execution_mode = Column(String(50), default="gemini_live")  # gemini_live or deterministic_local
    disclaimer = Column(String(500), default="AI analysis is an assistive governance recommendation and does not constitute a legal guarantee of factual accuracy.")
    
    total_issues = Column(Integer, default=0)
    critical_count = Column(Integer, default=0)
    warning_count = Column(Integer, default=0)
    info_count = Column(Integer, default=0)
    
    supported_claims_count = Column(Integer, default=0)
    conflicting_claims_count = Column(Integer, default=0)
    unverified_claims_count = Column(Integer, default=0)
    
    brand_voice_score = Column(Float, default=100.0)
    terminology_score = Column(Float, default=100.0)
    claim_integrity_score = Column(Float, default=100.0)
    visual_compliance_score = Column(Float, default=100.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    submission = relationship("Submission", back_populates="analyses", foreign_keys=[submission_id])
    findings = relationship("Finding", back_populates="analysis", cascade="all, delete-orphan")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analysis_results.id"), nullable=False)
    category = Column(String(100), nullable=False)  # claim_verification, brand_voice, terminology, messaging_alignment, visual_consistency, accessibility
    severity = Column(String(50), default="warning")  # critical, warning, info
    detected_text = Column(Text, nullable=False)
    issue_title = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)
    suggested_correction = Column(Text, nullable=True)
    claim_classification = Column(String(50), nullable=True)  # SUPPORTED, CONFLICTING, UNVERIFIED
    confidence_score = Column(Float, default=0.90)
    evidence_source = Column(String(255), nullable=True)
    evidence_ref_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("AnalysisResult", back_populates="findings")

