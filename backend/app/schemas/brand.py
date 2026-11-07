from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

# Brand Schemas
class BrandBase(BaseModel):
    name: str
    slug: Optional[str] = None
    industry: Optional[str] = "Enterprise SaaS"
    description: Optional[str] = None
    mission: Optional[str] = None
    values: Optional[str] = None
    personality: Optional[str] = "Authoritative, Precise, Innovative, Trustworthy"
    logo_url: Optional[str] = None
    website: Optional[str] = None
    is_default: Optional[bool] = False

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    mission: Optional[str] = None
    values: Optional[str] = None
    personality: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    is_default: Optional[bool] = None

class BrandResponse(BrandBase):
    id: str
    organization_id: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

# Brand Guideline Schemas
class BrandGuidelineCreate(BaseModel):
    title: str
    category: str  # mission, values, personality, messaging_rule, tone_of_voice
    content: str
    rule_type: str = "approved"  # approved, prohibited, general
    severity: str = "warning"  # critical, warning, info

class BrandGuidelineResponse(BaseModel):
    id: str
    brand_id: str
    title: str
    category: str
    content: str
    rule_type: str
    severity: str
    created_at: datetime

    class Config:
        from_attributes = True

# Brand Fact Schemas
class BrandFactCreate(BaseModel):
    claim_text: str
    category: str = "statistic"  # statistic, product_spec, award, compliance, capability
    source_name: str
    source_url_or_ref: Optional[str] = None
    verified_date: Optional[str] = None
    is_active: bool = True

class BrandFactResponse(BaseModel):
    id: str
    brand_id: str
    claim_text: str
    category: str
    source_name: str
    source_url_or_ref: Optional[str]
    verified_date: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Brand Terminology Schemas
class BrandTerminologyCreate(BaseModel):
    term: str
    term_type: str  # approved, prohibited, preferred
    replacement_suggestion: Optional[str] = None
    explanation: Optional[str] = None
    context_category: Optional[str] = "general"

class BrandTerminologyResponse(BaseModel):
    id: str
    brand_id: str
    term: str
    term_type: str
    replacement_suggestion: Optional[str]
    explanation: Optional[str]
    context_category: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Brand Asset Schemas
class BrandAssetCreate(BaseModel):
    asset_type: str  # logo, color_palette, typography, imagery, guideline_doc
    name: str
    file_path: Optional[str] = None
    file_url: Optional[str] = None
    metadata_json: Optional[str] = None

class BrandAssetResponse(BaseModel):
    id: str
    brand_id: str
    asset_type: str
    name: str
    file_path: Optional[str]
    file_url: Optional[str]
    metadata_json: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Complete Brand DNA Workspace Response
class BrandDNAResponse(BaseModel):
    brand: BrandResponse
    guidelines: List[BrandGuidelineResponse]
    facts: List[BrandFactResponse]
    terminologies: List[BrandTerminologyResponse]
    assets: List[BrandAssetResponse]

