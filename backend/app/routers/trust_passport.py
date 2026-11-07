import io
import hmac
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.brand import Brand
from app.models.submission import Submission, AnalysisResult, Finding
from app.models.workflow import Review
from app.schemas.trust_passport import TrustPassportDetail, ClaimMatrixItem
from app.schemas.brand import BrandResponse
from app.schemas.submission import FindingResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/trust-passport", tags=["Trust Passport"])

@router.get("/{submission_id}", response_model=TrustPassportDetail)
def get_trust_passport(
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

    brand = db.query(Brand).filter(Brand.id == submission.brand_id).first()
    creator = db.query(User).filter(User.id == submission.creator_id).first()

    analysis = None
    if submission.current_analysis_id:
        analysis = db.query(AnalysisResult).filter(AnalysisResult.id == submission.current_analysis_id).first()

    if not analysis:
        analysis = db.query(AnalysisResult).filter(AnalysisResult.submission_id == submission.id).order_by(AnalysisResult.created_at.desc()).first()

    if not analysis:
        raise HTTPException(status_code=400, detail="Submission has not been analyzed yet. Run analysis first.")

    findings = db.query(Finding).filter(Finding.analysis_id == analysis.id).all()
    latest_review = db.query(Review).filter(Review.submission_id == submission.id).order_by(Review.created_at.desc()).first()
    reviewer_user = None
    if latest_review:
        reviewer_user = db.query(User).filter(User.id == latest_review.reviewer_id).first()

    # Reconstruct claims matrix
    claims_matrix = []
    for f in findings:
        if f.claim_classification:
            claims_matrix.append(ClaimMatrixItem(
                statement=f.detected_text,
                classification=f.claim_classification,
                explanation=f.explanation,
                supporting_source=f.evidence_source,
                severity=f.severity,
                suggested_correction=f.suggested_correction
            ))

    # Cryptographic HMAC verification hash
    hmac_payload = f"{submission.id}:{submission.version}:{analysis.overall_score}:{analysis.created_at}"
    passport_hmac = hmac.new(settings.JWT_SECRET_KEY.encode('utf-8'), hmac_payload.encode('utf-8'), hashlib.sha256).hexdigest()

    return TrustPassportDetail(
        submission_id=submission.id,
        submission_title=submission.title,
        brand=BrandResponse.from_orm(brand),
        creator_name=creator.full_name if creator else "Creator",
        creator_email=creator.email if creator else "",
        version=submission.version,
        content_type=submission.content_type,
        raw_text=submission.raw_text,
        file_url=submission.file_url,
        overall_status=analysis.overall_status,
        governance_score=analysis.overall_score,
        execution_mode=analysis.execution_mode,
        disclaimer=analysis.disclaimer,
        total_issues=analysis.total_issues,
        critical_issues=analysis.critical_count,
        warning_issues=analysis.warning_count,
        info_issues=analysis.info_count,
        supported_claims=analysis.supported_claims_count,
        conflicting_claims=analysis.conflicting_claims_count,
        unverified_claims=analysis.unverified_claims_count,
        brand_voice_score=analysis.brand_voice_score,
        terminology_score=analysis.terminology_score,
        claim_integrity_score=analysis.claim_integrity_score,
        visual_compliance_score=analysis.visual_compliance_score,
        findings=[FindingResponse.from_orm(f) for f in findings],
        claims_matrix=claims_matrix,
        hmac_sha256=passport_hmac,
        final_approval_status=submission.status,
        review_notes=latest_review.notes if latest_review else None,
        reviewer_name=reviewer_user.full_name if reviewer_user else None,
        reviewed_at=latest_review.created_at if latest_review else None,
        created_at=submission.created_at,
        analyzed_at=analysis.created_at
    )

@router.get("/{submission_id}/pdf")
def download_trust_passport_pdf(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a high-fidelity PDF Trust Passport Certificate in the Cool-Toned Enterprise Theme.
    """
    submission = db.query(Submission).join(Brand).filter(
        Submission.id == submission_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found or access denied.")

    brand = db.query(Brand).filter(Brand.id == submission.brand_id).first()
    analysis = db.query(AnalysisResult).filter(AnalysisResult.submission_id == submission.id).order_by(AnalysisResult.created_at.desc()).first()
    if not analysis:
        raise HTTPException(status_code=400, detail="Analysis not found")

    findings = db.query(Finding).filter(Finding.analysis_id == analysis.id).all()

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'AurexTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#14231F'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'AurexSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#71958C'),
        spaceAfter=14
    )
    body_style = ParagraphStyle(
        'AurexBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#202C35'),
        spaceAfter=6
    )
    badge_style = ParagraphStyle(
        'AurexBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor('#14231F')
    )

    story = []

    # Header
    story.append(Paragraph("AUREX AI — OFFICIAL TRUST PASSPORT", title_style))
    story.append(Paragraph("The Gold Standard of Brand Integrity & Governance Verification", subtitle_style))
    story.append(Spacer(1, 8))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Brand:</b>", body_style), Paragraph(brand.name if brand else "N/A", body_style),
         Paragraph("<b>Governance Status:</b>", body_style), Paragraph(f"<b>{analysis.overall_status.upper()}</b>", badge_style)],
        [Paragraph("<b>Submission Title:</b>", body_style), Paragraph(submission.title, body_style),
         Paragraph("<b>Governance Score:</b>", body_style), Paragraph(f"<b>{analysis.overall_score}/100</b>", badge_style)],
        [Paragraph("<b>Version:</b>", body_style), Paragraph(f"v{submission.version}.0", body_style),
         Paragraph("<b>Execution Mode:</b>", body_style), Paragraph(analysis.execution_mode.upper(), body_style)],
        [Paragraph("<b>Date Verified:</b>", body_style), Paragraph(analysis.created_at.strftime("%Y-%m-%d %H:%M UTC"), body_style),
         Paragraph("<b>Total Issues:</b>", body_style), Paragraph(str(analysis.total_issues), body_style)]
    ]
    t = Table(meta_data, colWidths=[110, 160, 120, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F3F5F2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#DCE2DE')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#DCE2DE')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # Executive Summary
    story.append(Paragraph("<b>Executive Governance Summary</b>", styles['Heading3']))
    story.append(Paragraph(analysis.summary or "All claims and terminology verified against approved brand identity.", body_style))
    story.append(Spacer(1, 8))

    # Pillar Scores
    score_data = [
        ["Brand Voice & Tone", "Terminology Compliance", "Claim Integrity", "Visual Consistency"],
        [f"{analysis.brand_voice_score}%", f"{analysis.terminology_score}%", f"{analysis.claim_integrity_score}%", f"{analysis.visual_compliance_score}%"]
    ]
    score_table = Table(score_data, colWidths=[132, 132, 132, 134])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#14231F')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#F3F5F2')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F3F5F2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#71958C')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 12))

    # Key Findings & Traceable Evidence
    story.append(Paragraph("<b>Key Findings & Evidence Grounding</b>", styles['Heading3']))
    findings_data = [["Severity", "Category", "Finding / Statement", "Evidence Source / Correction"]]
    for f in findings[:6]:
        findings_data.append([
            f.severity.upper(),
            f.category.replace('_', ' ').title(),
            Paragraph(f.issue_title, body_style),
            Paragraph(f"<b>Source:</b> {f.evidence_source or 'Pending'}<br/><b>Fix:</b> {f.suggested_correction or 'None'}", body_style)
        ])

    if len(findings_data) > 1:
        f_table = Table(findings_data, colWidths=[65, 95, 170, 200])
        f_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EAEFEA')),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#DCE2DE')),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(f_table)

    story.append(Spacer(1, 12))
    # Disclaimer
    story.append(Paragraph("<b>LEGAL & GOVERNANCE DISCLAIMER</b>", ParagraphStyle('DisclHead', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#71958C'))))
    story.append(Paragraph(analysis.disclaimer, ParagraphStyle('Discl', fontName='Helvetica', fontSize=7, textColor=colors.gray)))

    doc.build(story)
    buffer.seek(0)

    pdf_bytes = buffer.getvalue()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Trust_Passport_{submission.id[:8]}.pdf"}
    )
