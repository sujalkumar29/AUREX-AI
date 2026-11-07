from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.brand import Brand
from app.models.submission import Submission
from app.models.workflow import Review, Comment, RevisionHistory, AuditLog
from app.schemas.workflow import (
    ReviewCreate, ReviewResponse,
    CommentCreate, CommentResponse,
    RevisionResponse, AuditLogResponse
)
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/workflow", tags=["Workflow & Human-in-the-Loop"])

@router.post("/reviews", response_model=ReviewResponse)
def submit_review(
    item: ReviewCreate,
    current_user: User = Depends(require_role(["reviewer", "admin"])),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == item.submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    # Separation of duties: Creator cannot approve their own submission unless they are an admin
    if current_user.role != "admin" and submission.creator_id == current_user.id and item.action == "approve":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conflict of interest: Content creators cannot approve their own submissions. A designated reviewer or admin must approve."
        )

    # Map review action to submission status
    if item.action == "approve":
        submission.status = "approved"
    elif item.action == "request_changes":
        submission.status = "changes_required"
    elif item.action == "reject":
        submission.status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Choose approve, request_changes, or reject.")

    review = Review(
        submission_id=submission.id,
        reviewer_id=current_user.id,
        action=item.action,
        notes=item.notes
    )
    db.add(review)

    # Log to audit history
    audit = AuditLog(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        user_email=current_user.email,
        user_name=current_user.full_name,
        action=f"REVIEW_{item.action.upper()}",
        entity_type="SUBMISSION",
        entity_id=submission.id,
        details_json=f'{{"reviewer": "{current_user.full_name}", "action": "{item.action}", "notes": "{item.notes or ""}"}}'
    )
    db.add(audit)
    db.commit()
    db.refresh(review)

    resp = ReviewResponse.from_orm(review)
    resp.reviewer_name = current_user.full_name
    return resp

@router.get("/reviews/{submission_id}", response_model=List[ReviewResponse])
def get_reviews_for_submission(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    reviews = db.query(Review).filter(Review.submission_id == submission.id).order_by(Review.created_at.desc()).all()
    res = []
    for r in reviews:
        reviewer = db.query(User).filter(User.id == r.reviewer_id).first()
        item = ReviewResponse.from_orm(r)
        item.reviewer_name = reviewer.full_name if reviewer else "Reviewer"
        res.append(item)
    return res

@router.post("/comments", response_model=CommentResponse)
def add_comment(
    item: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == item.submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    comment = Comment(
        submission_id=submission.id,
        user_id=current_user.id,
        content=item.content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    resp = CommentResponse.from_orm(comment)
    resp.user_name = current_user.full_name
    return resp

@router.get("/comments/{submission_id}", response_model=List[CommentResponse])
def get_comments(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    comments = db.query(Comment).filter(Comment.submission_id == submission.id).order_by(Comment.created_at.asc()).all()
    res = []
    for c in comments:
        user = db.query(User).filter(User.id == c.user_id).first()
        item = CommentResponse.from_orm(c)
        item.user_name = user.full_name if user else "Collaborator"
        res.append(item)
    return res

@router.get("/revisions/{submission_id}", response_model=List[RevisionResponse])
def get_revisions(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    revisions = db.query(RevisionHistory).filter(RevisionHistory.submission_id == submission.id).order_by(RevisionHistory.version.desc()).all()
    return revisions

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).filter(
        AuditLog.organization_id == current_user.organization_id
    ).order_by(AuditLog.created_at.desc()).limit(100).all()
    return logs
