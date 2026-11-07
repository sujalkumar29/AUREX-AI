import uuid
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Organization
from app.models.brand import Brand
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Generate unique organization
    org_name = user_in.organization_name.strip() if user_in.organization_name else f"{user_in.full_name}'s Organization"
    base_slug = re.sub(r'[^a-zA-Z0-9]+', '-', org_name.lower()).strip('-')[:40] or "org"
    slug = base_slug
    counter = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    org = Organization(name=org_name, slug=slug)
    db.add(org)
    db.flush()

    new_user = User(
        organization_id=org.id,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "creator"
    )
    db.add(new_user)
    db.flush()

    # Automatically initialize a primary Brand for the new organization
    default_brand = Brand(
        organization_id=org.id,
        name=f"{org_name} Brand",
        slug=f"{slug}-brand",
        industry="Enterprise Technology",
        description=f"Primary brand identity for {org_name}",
        mission=f"Deliver verified enterprise excellence with unyielding brand integrity.",
        values="Integrity, Transparency, Trust, Precision.",
        personality="Authoritative, Rigorous, Sophisticated, Enterprise-grade.",
        is_default=True
    )
    db.add(default_brand)

    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
