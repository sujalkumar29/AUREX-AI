from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel

class ReviewCreate(BaseModel):
    submission_id: str
    action: str  # approve, request_changes, reject
    notes: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    submission_id: str
    reviewer_id: str
    reviewer_name: Optional[str] = None
    action: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    submission_id: str
    content: str

class CommentResponse(BaseModel):
    id: str
    submission_id: str
    user_id: str
    user_name: Optional[str] = None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class RevisionCreate(BaseModel):
    submission_id: str
    raw_text: str
    summary_of_changes: Optional[str] = None

class RevisionResponse(BaseModel):
    id: str
    submission_id: str
    version: int
    raw_text: str
    changed_by_user_id: str
    summary_of_changes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: str
    organization_id: str
    user_id: str
    user_email: Optional[str]
    user_name: Optional[str]
    action: str
    entity_type: str
    entity_id: str
    details_json: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

