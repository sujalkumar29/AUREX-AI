import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # approve, request_changes, reject
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="comments")
    user = relationship("User", back_populates="comments")

class RevisionHistory(Base):
    __tablename__ = "revision_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    version = Column(Integer, nullable=False)
    raw_text = Column(Text, nullable=False)
    changed_by_user_id = Column(String(36), nullable=False)
    summary_of_changes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="revisions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(String(36), nullable=False)
    user_email = Column(String(255), nullable=True)
    user_name = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)  # SUBMISSION_CREATED, ANALYSIS_RUN, REVIEW_APPROVED, GUIDELINE_UPDATED, etc.
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=False)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="audit_logs")

