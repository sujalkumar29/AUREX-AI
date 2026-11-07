import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False)
    industry = Column(String(100), default="Enterprise SaaS")
    description = Column(Text, nullable=True)
    mission = Column(Text, nullable=True)
    values = Column(Text, nullable=True)
    personality = Column(String(255), default="Authoritative, Precise, Innovative, Trustworthy")
    logo_url = Column(String(500), nullable=True)
    website = Column(String(255), nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="brands")
    guidelines = relationship("BrandGuideline", back_populates="brand", cascade="all, delete-orphan")
    facts = relationship("BrandFact", back_populates="brand", cascade="all, delete-orphan")
    terminologies = relationship("BrandTerminology", back_populates="brand", cascade="all, delete-orphan")
    assets = relationship("BrandAsset", back_populates="brand", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="brand", cascade="all, delete-orphan")

class BrandGuideline(Base):
    __tablename__ = "brand_guidelines"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # mission, values, personality, messaging_rule, tone_of_voice
    content = Column(Text, nullable=False)
    rule_type = Column(String(50), default="approved")  # approved, prohibited, general
    severity = Column(String(50), default="warning")  # critical, warning, info
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="guidelines")

class BrandFact(Base):
    __tablename__ = "brand_facts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=False)
    claim_text = Column(Text, nullable=False)
    category = Column(String(100), default="statistic")  # statistic, product_spec, award, compliance, capability
    source_name = Column(String(255), nullable=False)  # Official 2025 Audit, SEC 10-K, Whitepaper
    source_url_or_ref = Column(String(500), nullable=True)
    verified_date = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="facts")

class BrandTerminology(Base):
    __tablename__ = "brand_terminologies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=False)
    term = Column(String(255), nullable=False)
    term_type = Column(String(50), nullable=False)  # approved, prohibited, preferred
    replacement_suggestion = Column(String(255), nullable=True)
    explanation = Column(Text, nullable=True)
    context_category = Column(String(100), default="general")
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="terminologies")

class BrandAsset(Base):
    __tablename__ = "brand_assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=False)
    asset_type = Column(String(100), nullable=False)  # logo, color_palette, typography, imagery, guideline_doc
    name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=True)
    metadata_json = Column(Text, nullable=True)  # JSON string storing e.g. hex codes, font rules
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="assets")

