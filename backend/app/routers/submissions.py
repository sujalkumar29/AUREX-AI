from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.brand import Brand
from app.models.submission import Submission, AnalysisResult, Finding
from app.models.workflow import RevisionHistory, AuditLog
from app.schemas.submission import SubmissionCreate, SubmissionUpdate, SubmissionResponse, AnalysisResultResponse
from app.services.auth_service import get_current_user
from app.services.analysis_engine import analysis_engine

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.get("", response_model=List[SubmissionResponse])
def list_submissions(
    brand_id: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce organization isolation
    query = db.query(Submission).join(Brand).filter(Brand.organization_id == current_user.organization_id)
    if brand_id:
        query = query.filter(Submission.brand_id == brand_id)
    if status:
        query = query.filter(Submission.status == status)
    if search:
        query = query.filter(Submission.title.ilike(f"%{search}%"))

    submissions = query.order_by(Submission.created_at.desc()).all()
    
    # Attach latest analysis
    result = []
    for s in submissions:
        sub_resp = SubmissionResponse.from_orm(s)
        if s.current_analysis_id:
            latest = db.query(AnalysisResult).filter(AnalysisResult.id == s.current_analysis_id).first()
            if latest:
                findings = db.query(Finding).filter(Finding.analysis_id == latest.id).all()
                analysis_dict = AnalysisResultResponse.from_orm(latest)
                analysis_dict.findings = findings
                sub_resp.latest_analysis = analysis_dict
        result.append(sub_resp)

    return result

@router.post("", response_model=SubmissionResponse)
def create_submission(
    item: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify brand belongs to current organization
    brand = db.query(Brand).filter(
        Brand.id == item.brand_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found or access denied."
        )

    submission = Submission(
        brand_id=brand.id,
        creator_id=current_user.id,
        title=item.title,
        content_type=item.content_type,
        raw_text=item.raw_text,
        file_path=item.file_path,
        file_url=item.file_url,
        status="analyzing",
        version=1
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Automatically run brand governance analysis
    try:
        analysis = analysis_engine.analyze_submission(db, submission)
    except Exception as e:
        # Fallback status if analysis encounters error
        submission.status = "ready_for_review"
        db.commit()

    db.refresh(submission)
    sub_resp = SubmissionResponse.from_orm(submission)
    if submission.current_analysis_id:
        latest = db.query(AnalysisResult).filter(AnalysisResult.id == submission.current_analysis_id).first()
        if latest:
            findings = db.query(Finding).filter(Finding.analysis_id == latest.id).all()
            analysis_dict = AnalysisResultResponse.from_orm(latest)
            analysis_dict.findings = findings
            sub_resp.latest_analysis = analysis_dict

    return sub_resp

@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
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

    sub_resp = SubmissionResponse.from_orm(submission)
    if submission.current_analysis_id:
        latest = db.query(AnalysisResult).filter(AnalysisResult.id == submission.current_analysis_id).first()
        if latest:
            findings = db.query(Finding).filter(Finding.analysis_id == latest.id).all()
            analysis_dict = AnalysisResultResponse.from_orm(latest)
            analysis_dict.findings = findings
            sub_resp.latest_analysis = analysis_dict

    return sub_resp

@router.post("/{submission_id}/analyze", response_model=AnalysisResultResponse)
def reanalyze_submission(
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

    analysis = analysis_engine.analyze_submission(db, submission)
    findings = db.query(Finding).filter(Finding.analysis_id == analysis.id).all()
    resp = AnalysisResultResponse.from_orm(analysis)
    resp.findings = findings
    return resp

@router.put("/{submission_id}", response_model=SubmissionResponse)
def update_and_revise_submission(
    submission_id: str,
    update_in: SubmissionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    is_text_changed = update_in.raw_text and update_in.raw_text != submission.raw_text

    if is_text_changed:
        # Create RevisionHistory entry
        revision = RevisionHistory(
            submission_id=submission.id,
            version=submission.version,
            raw_text=submission.raw_text or "",
            changed_by_user_id=current_user.id,
            summary_of_changes="Creator applied revisions based on Trust Passport findings."
        )
        db.add(revision)
        submission.version += 1
        submission.raw_text = update_in.raw_text

    if update_in.title:
        submission.title = update_in.title
    if update_in.status:
        submission.status = update_in.status

    db.commit()
    db.refresh(submission)

    # If text was revised, re-analyze automatically
    if is_text_changed:
        analysis_engine.analyze_submission(db, submission)
        db.refresh(submission)

    sub_resp = SubmissionResponse.from_orm(submission)
    if submission.current_analysis_id:
        latest = db.query(AnalysisResult).filter(AnalysisResult.id == submission.current_analysis_id).first()
        if latest:
            findings = db.query(Finding).filter(Finding.analysis_id == latest.id).all()
            analysis_dict = AnalysisResultResponse.from_orm(latest)
            analysis_dict.findings = findings
            sub_resp.latest_analysis = analysis_dict

    return sub_resp
