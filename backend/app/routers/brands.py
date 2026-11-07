from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate, BrandResponse
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.get("", response_model=List[BrandResponse])
def list_brands(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    brands = db.query(Brand).filter(Brand.organization_id == current_user.organization_id).all()
    return brands

@router.post("", response_model=BrandResponse)
def create_brand(
    brand_in: BrandCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    slug = (brand_in.slug or brand_in.name.lower().replace(" ", "-"))[:100]
    
    # Check if first brand
    count = db.query(Brand).filter(Brand.organization_id == current_user.organization_id).count()
    is_default = brand_in.is_default or (count == 0)

    brand = Brand(
        organization_id=current_user.organization_id,
        name=brand_in.name,
        slug=slug,
        industry=brand_in.industry or "Enterprise SaaS",
        description=brand_in.description,
        mission=brand_in.mission,
        values=brand_in.values,
        personality=brand_in.personality or "Authoritative, Precise, Innovative, Trustworthy",
        logo_url=brand_in.logo_url,
        website=brand_in.website,
        is_default=is_default
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand

@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(
    brand_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(
        Brand.id == brand_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found or access denied."
        )
    return brand

@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: str,
    update_in: BrandUpdate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(
        Brand.id == brand_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found or access denied."
        )

    for field, value in update_in.dict(exclude_unset=True).items():
        setattr(brand, field, value)

    db.commit()
    db.refresh(brand)
    return brand

@router.delete("/{brand_id}")
def delete_brand(
    brand_id: str,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(
        Brand.id == brand_id,
        Brand.organization_id == current_user.organization_id
    ).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found or access denied."
        )

    db.delete(brand)
    db.commit()
    return {"message": f"Brand '{brand.name}' deleted successfully"}
