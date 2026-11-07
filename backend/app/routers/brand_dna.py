from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.brand import Brand, BrandGuideline, BrandFact, BrandTerminology, BrandAsset
from app.schemas.brand import (
    BrandDNAResponse,
    BrandGuidelineCreate, BrandGuidelineResponse,
    BrandFactCreate, BrandFactResponse,
    BrandTerminologyCreate, BrandTerminologyResponse,
    BrandAssetCreate, BrandAssetResponse
)
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/brand-dna", tags=["Brand DNA Workspace"])

def _get_verified_brand(brand_id: str, organization_id: str, db: Session) -> Brand:
    brand = db.query(Brand).filter(
        Brand.id == brand_id,
        Brand.organization_id == organization_id
    ).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found or access denied."
        )
    return brand

@router.get("/{brand_id}", response_model=BrandDNAResponse)
def get_brand_dna(
    brand_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    brand = _get_verified_brand(brand_id, current_user.organization_id, db)

    guidelines = db.query(BrandGuideline).filter(BrandGuideline.brand_id == brand.id).all()
    facts = db.query(BrandFact).filter(BrandFact.brand_id == brand.id).all()
    terminologies = db.query(BrandTerminology).filter(BrandTerminology.brand_id == brand.id).all()
    assets = db.query(BrandAsset).filter(BrandAsset.brand_id == brand.id).all()

    return {
        "brand": brand,
        "guidelines": guidelines,
        "facts": facts,
        "terminologies": terminologies,
        "assets": assets
    }

# --- Guidelines ---
@router.post("/{brand_id}/guidelines", response_model=BrandGuidelineResponse)
def add_guideline(
    brand_id: str,
    item: BrandGuidelineCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = _get_verified_brand(brand_id, current_user.organization_id, db)
    guideline = BrandGuideline(
        brand_id=brand.id,
        title=item.title,
        category=item.category,
        content=item.content,
        rule_type=item.rule_type,
        severity=item.severity
    )
    db.add(guideline)
    db.commit()
    db.refresh(guideline)
    return guideline

@router.delete("/guidelines/{guideline_id}")
def delete_guideline(
    guideline_id: str,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    item = db.query(BrandGuideline).join(Brand).filter(
        BrandGuideline.id == guideline_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guideline not found or access denied.")
    db.delete(item)
    db.commit()
    return {"message": "Guideline removed successfully"}

# --- Facts ---
@router.post("/{brand_id}/facts", response_model=BrandFactResponse)
def add_fact(
    brand_id: str,
    item: BrandFactCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = _get_verified_brand(brand_id, current_user.organization_id, db)
    fact = BrandFact(
        brand_id=brand.id,
        claim_text=item.claim_text,
        category=item.category,
        source_name=item.source_name,
        source_url_or_ref=item.source_url_or_ref,
        verified_date=item.verified_date,
        is_active=item.is_active
    )
    db.add(fact)
    db.commit()
    db.refresh(fact)
    return fact

@router.delete("/facts/{fact_id}")
def delete_fact(
    fact_id: str,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    item = db.query(BrandFact).join(Brand).filter(
        BrandFact.id == fact_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fact not found or access denied.")
    db.delete(item)
    db.commit()
    return {"message": "Fact removed successfully"}

# --- Terminology ---
@router.post("/{brand_id}/terminologies", response_model=BrandTerminologyResponse)
def add_terminology(
    brand_id: str,
    item: BrandTerminologyCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = _get_verified_brand(brand_id, current_user.organization_id, db)
    term = BrandTerminology(
        brand_id=brand.id,
        term=item.term,
        term_type=item.term_type,
        replacement_suggestion=item.replacement_suggestion,
        explanation=item.explanation,
        context_category=item.context_category or "general"
    )
    db.add(term)
    db.commit()
    db.refresh(term)
    return term

@router.delete("/terminologies/{term_id}")
def delete_terminology(
    term_id: str,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    item = db.query(BrandTerminology).join(Brand).filter(
        BrandTerminology.id == term_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Terminology rule not found or access denied.")
    db.delete(item)
    db.commit()
    return {"message": "Terminology rule removed"}

# --- Visual Assets ---
@router.post("/{brand_id}/assets", response_model=BrandAssetResponse)
def add_asset(
    brand_id: str,
    item: BrandAssetCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = _get_verified_brand(brand_id, current_user.organization_id, db)
    asset = BrandAsset(
        brand_id=brand.id,
        asset_type=item.asset_type,
        name=item.name,
        file_path=item.file_path,
        file_url=item.file_url,
        metadata_json=item.metadata_json
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset

@router.delete("/assets/{asset_id}")
def delete_asset(
    asset_id: str,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    item = db.query(BrandAsset).join(Brand).filter(
        BrandAsset.id == asset_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found or access denied.")
    db.delete(item)
    db.commit()
    return {"message": "Asset deleted successfully"}
