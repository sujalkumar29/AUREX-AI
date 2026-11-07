from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import Organization, User
from app.models.brand import Brand, BrandGuideline, BrandFact, BrandTerminology, BrandAsset
from app.models.submission import Submission, AnalysisResult, Finding
from app.models.workflow import Review, Comment, AuditLog, RevisionHistory
from app.services.auth_service import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    existing_org = db.query(Organization).first()
    if existing_org:
        return

    # 1. Organization
    org = Organization(
        name="Aurex Global Enterprise",
        slug="aurex-global"
    )
    db.add(org)
    db.flush()

    # 2. Users (Admin, Creator, Reviewer)
    admin_user = User(
        organization_id=org.id,
        email="admin@aurex.ai",
        hashed_password=get_password_hash("aurex123"),
        full_name="Eleanor Vance (Brand Director)",
        role="admin"
    )
    creator_user = User(
        organization_id=org.id,
        email="creator@aurex.ai",
        hashed_password=get_password_hash("aurex123"),
        full_name="Marcus Sterling (Lead Copywriter)",
        role="creator"
    )
    reviewer_user = User(
        organization_id=org.id,
        email="reviewer@aurex.ai",
        hashed_password=get_password_hash("aurex123"),
        full_name="Dr. Julian Thorne (Brand Governance Officer)",
        role="reviewer"
    )
    db.add_all([admin_user, creator_user, reviewer_user])
    db.flush()

    # 3. Brands
    brand1 = Brand(
        organization_id=org.id,
        name="AuraPay Global",
        slug="aurapay-global",
        industry="Enterprise Financial Infrastructure",
        description="Next-generation institutional settlement network engineered for instant global liquidity and mathematical certainty.",
        mission="Democratize sovereign cross-border settlement with mathematical certainty, unyielding security, and zero latency.",
        values="Integrity, Precision, Sovereignty, Transparent Governance, Relentless Excellence.",
        personality="Authoritative, Rigorous, Sophisticated, Enterprise-grade, Trustworthy.",
        website="https://aurapay.aurex.ai",
        is_default=True
    )
    brand2 = Brand(
        organization_id=org.id,
        name="Aurex Cloud Infrastructure",
        slug="aurex-cloud",
        industry="Autonomous AI & Cloud Security",
        description="High-assurance AI infrastructure powering autonomous enterprise workflows with zero-trust isolation.",
        mission="Empower organizations with verifiable AI autonomy safeguarded by cryptographic governance.",
        values="Verifiability, Transparency, Performance, Resilience.",
        personality="Visionary, Ultra-secure, Precise, Uncompromising.",
        website="https://cloud.aurex.ai",
        is_default=False
    )
    db.add_all([brand1, brand2])
    db.flush()

    # 4. Brand Guidelines for AuraPay Global
    guidelines = [
        BrandGuideline(
            brand_id=brand1.id,
            title="Institutional Brand Tone & Voice",
            category="tone_of_voice",
            content="Every external communication must convey institutional precision, quiet confidence, and technical authority. Never use hype-driven adjectives or exaggerated marketing slang.",
            rule_type="approved",
            severity="warning"
        ),
        BrandGuideline(
            brand_id=brand1.id,
            title="Prohibited Marketing Hyperbole",
            category="messaging_rule",
            content="Never promise '100% risk-free outcomes', 'magical automation', or 'free money'. All risk acknowledgments must accompany cross-border liquidity claims.",
            rule_type="prohibited",
            severity="critical"
        ),
        BrandGuideline(
            brand_id=brand1.id,
            title="Competitor Comparison Policy",
            category="messaging_rule",
            content="Do not disparage legacy banking rails or named competitors. Frame AuraPay's advantages strictly around architectural latency, cryptographic settlement, and regulatory compliance.",
            rule_type="prohibited",
            severity="warning"
        )
    ]
    db.add_all(guidelines)

    # 5. Brand Facts for AuraPay Global (RAG Source of Truth)
    facts = [
        BrandFact(
            brand_id=brand1.id,
            claim_text="AuraPay processed over $14.2B in annual settlement volume across 42 sovereign jurisdictions.",
            category="statistic",
            source_name="AuraPay Q4 2025 Audited Financial Statement",
            source_url_or_ref="SEC-FORM-10K-2025-SEC04",
            verified_date="2026-01-15"
        ),
        BrandFact(
            brand_id=brand1.id,
            claim_text="AuraPay maintains an audited 99.995% uptime SLA backed by multi-region autonomous failover.",
            category="capability",
            source_name="Global Infrastructure SLA Report 2025",
            source_url_or_ref="DOC-SLA-99995-2025",
            verified_date="2026-02-01"
        ),
        BrandFact(
            brand_id=brand1.id,
            claim_text="Deterministic settlement finality is achieved in under 420 milliseconds worldwide.",
            category="product_spec",
            source_name="Bell-Labs Network Latency & Finality Benchmark v4.2",
            source_url_or_ref="BENCH-LATENCY-420MS-2025",
            verified_date="2025-11-20"
        ),
        BrandFact(
            brand_id=brand1.id,
            claim_text="SOC-2 Type II and ISO 27001 certifications recertified in January 2026.",
            category="compliance",
            source_name="KPMG Cybersecurity & Compliance Audit 2026",
            source_url_or_ref="CERT-KPMG-SOC2-2026",
            verified_date="2026-01-10"
        )
    ]
    db.add_all(facts)

    # 6. Brand Terminology Rules
    terminologies = [
        BrandTerminology(
            brand_id=brand1.id,
            term="cheap settlement",
            term_type="prohibited",
            replacement_suggestion="capital-efficient institutional clearing",
            explanation="The word 'cheap' devalues the enterprise brand. Use 'capital-efficient' or 'cost-optimized execution'.",
            context_category="pricing"
        ),
        BrandTerminology(
            brand_id=brand1.id,
            term="crypto coin",
            term_type="prohibited",
            replacement_suggestion="sovereign digital asset liquidity unit",
            explanation="Avoid retail crypto colloquialisms. Emphasize institutional-grade sovereign digital assets.",
            context_category="technology"
        ),
        BrandTerminology(
            brand_id=brand1.id,
            term="middleman fee",
            term_type="prohibited",
            replacement_suggestion="protocol clearing tariff",
            explanation="Use precise institutional terminology rather than adversarial terms.",
            context_category="fees"
        ),
        BrandTerminology(
            brand_id=brand1.id,
            term="Sovereign Settlement Engine",
            term_type="approved",
            replacement_suggestion=None,
            explanation="Official trademarked designation for AuraPay's core matching protocol.",
            context_category="product_naming"
        ),
        BrandTerminology(
            brand_id=brand1.id,
            term="Deterministic Finality",
            term_type="approved",
            replacement_suggestion=None,
            explanation="Approved technical phrase for sub-second irreversible transaction settlement.",
            context_category="technology"
        )
    ]
    db.add_all(terminologies)

    # 7. Brand Visual Assets
    assets = [
        BrandAsset(
            brand_id=brand1.id,
            asset_type="color_palette",
            name="AuraPay Sovereign Palette",
            metadata_json='{"primary_gold": "#C5A059", "dark_charcoal": "#0B0D0F", "warm_ivory": "#F7F6F2", "slate_border": "#1E232B", "accent_glow": "#DFC07A"}'
        ),
        BrandAsset(
            brand_id=brand1.id,
            asset_type="typography",
            name="Enterprise Font System",
            metadata_json='{"display_font": "Playfair Display", "body_font": "Inter", "mono_font": "JetBrains Mono"}'
        ),
        BrandAsset(
            brand_id=brand1.id,
            asset_type="logo",
            name="Primary Monogram & Wordmark",
            file_url="/brand-assets/aurapay_logo.svg",
            metadata_json='{"clearspace_ratio": 0.25, "min_height_px": 32}'
        )
    ]
    db.add_all(assets)
    db.flush()

    # 8. Sample Submissions & Analyses for Showcase
    # Submission 1: Near-perfect (Ready for Review)
    sub1 = Submission(
        brand_id=brand1.id,
        creator_id=creator_user.id,
        title="Q1 Global Institutional Liquidity Expansion",
        content_type="marketing_copy",
        raw_text="AuraPay is proud to announce our Q1 expansion into new institutional corridors. Building upon the $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit, our Sovereign Settlement Engine delivers deterministic settlement finality in under 420 milliseconds worldwide. Our infrastructure guarantees 99.995% uptime SLA backed by automated multi-region failover.",
        status="ready_for_review",
        version=1,
        created_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(sub1)
    db.flush()

    analysis1 = AnalysisResult(
        submission_id=sub1.id,
        overall_score=96.0,
        overall_status="Ready for Review",
        summary="Exceptional alignment with AuraPay brand guidelines. All volume and latency metrics match approved financial audits. Tone reflects high institutional authority.",
        execution_mode="deterministic_local",
        total_issues=1,
        critical_count=0,
        warning_count=0,
        info_count=1,
        supported_claims_count=3,
        conflicting_claims_count=0,
        unverified_claims_count=0,
        brand_voice_score=98.0,
        terminology_score=100.0,
        claim_integrity_score=96.0,
        visual_compliance_score=100.0,
        created_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(analysis1)
    db.flush()

    finding1_1 = Finding(
        analysis_id=analysis1.id,
        category="claim_verification",
        severity="info",
        detected_text="$14.2B in annual settlement volume across 42 sovereign jurisdictions",
        issue_title="Verified Brand Fact: Annual Settlement Volume",
        explanation="Claim is substantiated by AuraPay Q4 2025 Audited Financial Statement.",
        claim_classification="SUPPORTED",
        confidence_score=0.99,
        evidence_source="AuraPay Q4 2025 Audited Financial Statement (SEC-FORM-10K-2025-SEC04)",
        created_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(finding1_1)
    sub1.current_analysis_id = analysis1.id

    # Submission 2: Requires Changes (Prohibited terms + conflicting numbers)
    sub2 = Submission(
        brand_id=brand1.id,
        creator_id=creator_user.id,
        title="Social Campaign: Cross-Border Liquidity Launch",
        content_type="social_post",
        raw_text="Tired of middleman fees? AuraPay gives institutional clients the ultimate cheap settlement! Our network boasts an insane 99.999% uptime SLA and crushes legacy banking speed with zero latency. Trade every crypto coin without worrying about protocol clearing fees.",
        status="changes_required",
        version=1,
        created_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(sub2)
    db.flush()

    analysis2 = AnalysisResult(
        submission_id=sub2.id,
        overall_score=58.5,
        overall_status="Changes Required",
        summary="Critical brand governance flags detected: Multiple prohibited terms ('cheap settlement', 'crypto coin', 'middleman fees') and conflicting uptime claim (99.999% vs verified 99.995%). Tone violates institutional standards.",
        execution_mode="deterministic_local",
        total_issues=4,
        critical_count=2,
        warning_count=2,
        info_count=0,
        supported_claims_count=0,
        conflicting_claims_count=1,
        unverified_claims_count=1,
        brand_voice_score=60.0,
        terminology_score=50.0,
        claim_integrity_score=55.0,
        visual_compliance_score=90.0,
        created_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(analysis2)
    db.flush()

    findings2 = [
        Finding(
            analysis_id=analysis2.id,
            category="terminology",
            severity="critical",
            detected_text="cheap settlement",
            issue_title="Prohibited Terminology: 'cheap settlement'",
            explanation="The term 'cheap settlement' violates brand guidelines. AuraPay conveys premium institutional reliability.",
            suggested_correction="Replace with 'capital-efficient institutional clearing'.",
            claim_classification=None,
            confidence_score=0.99,
            evidence_source="Brand Terminology Rule: cheap settlement",
            created_at=datetime.utcnow() - timedelta(days=1)
        ),
        Finding(
            analysis_id=analysis2.id,
            category="claim_verification",
            severity="critical",
            detected_text="99.999% uptime SLA",
            issue_title="Conflicting Claim: SLA Uptime Discrepancy",
            explanation="Submitted copy states 99.999% uptime, which contradicts verified brand SLA of 99.995%. Overpromising five-nines without contractual basis introduces legal exposure.",
            suggested_correction="Correct SLA figure to verified 99.995%.",
            claim_classification="CONFLICTING",
            confidence_score=0.97,
            evidence_source="Global Infrastructure SLA Report 2025 (DOC-SLA-99995-2025)",
            created_at=datetime.utcnow() - timedelta(days=1)
        ),
        Finding(
            analysis_id=analysis2.id,
            category="terminology",
            severity="warning",
            detected_text="crypto coin",
            issue_title="Prohibited Terminology: 'crypto coin'",
            explanation="Colloquial terminology contradicts institutional positioning.",
            suggested_correction="Replace with 'sovereign digital asset liquidity unit'.",
            claim_classification=None,
            confidence_score=0.98,
            evidence_source="Brand Terminology Rule: crypto coin",
            created_at=datetime.utcnow() - timedelta(days=1)
        ),
        Finding(
            analysis_id=analysis2.id,
            category="brand_voice",
            severity="warning",
            detected_text="crushes legacy banking speed",
            issue_title="Inconsistent Brand Voice: Aggressive Tone",
            explanation="Disparaging competitor rails directly violates competitor comparison guidelines.",
            suggested_correction="Reframe objectively around architectural sub-second finality.",
            claim_classification=None,
            confidence_score=0.92,
            evidence_source="Brand Guideline: Competitor Comparison Policy",
            created_at=datetime.utcnow() - timedelta(days=1)
        )
    ]
    db.add_all(findings2)
    sub2.current_analysis_id = analysis2.id

    # 9. Audit Logs
    audit1 = AuditLog(
        organization_id=org.id,
        user_id=creator_user.id,
        user_email=creator_user.email,
        user_name=creator_user.full_name,
        action="SUBMISSION_CREATED",
        entity_type="SUBMISSION",
        entity_id=sub1.id,
        details_json='{"title": "Q1 Global Institutional Liquidity Expansion", "content_type": "marketing_copy"}'
    )
    audit2 = AuditLog(
        organization_id=org.id,
        user_id=reviewer_user.id,
        user_email=reviewer_user.email,
        user_name=reviewer_user.full_name,
        action="ANALYSIS_EVALUATED",
        entity_type="TRUST_PASSPORT",
        entity_id=analysis1.id,
        details_json='{"score": 96.0, "status": "Ready for Review"}'
    )
    db.add_all([audit1, audit2])

    db.commit()


