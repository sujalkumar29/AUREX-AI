import re
import json
import math
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models.brand import Brand, BrandGuideline, BrandFact, BrandTerminology, BrandAsset
from app.models.submission import Submission, AnalysisResult, Finding
from app.models.workflow import AuditLog
from app.services.rag_service import rag_service
from app.services.gemini_service import gemini_service
from app.services.document_parser import analyze_image_properties

def hex_to_rgb(hex_code: str):
    hex_code = hex_code.lstrip('#')
    if len(hex_code) == 3:
        hex_code = ''.join([c*2 for c in hex_code])
    if len(hex_code) != 6:
        return (0, 0, 0)
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def color_distance(c1: tuple, c2: tuple) -> float:
    # Euclidean distance in RGB space (normalized 0 to 100)
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2))) / 4.4167

def relative_luminance(rgb: tuple) -> float:
    # WCAG relative luminance
    srgb = [v / 255.0 for v in rgb]
    lum = []
    for c in srgb:
        if c <= 0.03928:
            lum.append(c / 12.92)
        else:
            lum.append(((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2]

def contrast_ratio(rgb1: tuple, rgb2: tuple) -> float:
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

class AnalysisEngine:
    def analyze_submission(self, db: Session, submission: Submission) -> AnalysisResult:
        """
        Orchestrates full brand governance analysis:
        1. RAG retrieval of approved Brand DNA
        2. Gemini API (live) with structured output
        3. Deterministic Local Brand Governance fallback if Gemini not configured
        4. Persists findings and updates submission status
        """
        brand = db.query(Brand).filter(Brand.id == submission.brand_id).first()
        if not brand:
            raise ValueError(f"Brand with id {submission.brand_id} not found")

        guidelines = db.query(BrandGuideline).filter(BrandGuideline.brand_id == brand.id).all()
        facts = db.query(BrandFact).filter(BrandFact.brand_id == brand.id, BrandFact.is_active == True).all()
        terminologies = db.query(BrandTerminology).filter(BrandTerminology.brand_id == brand.id).all()
        assets = db.query(BrandAsset).filter(BrandAsset.brand_id == brand.id).all()

        text_to_analyze = submission.raw_text or ""
        
        # 1. RAG Knowledge Retrieval
        retrieved_evidence = rag_service.retrieve_relevant_brand_knowledge(
            submission_text=text_to_analyze,
            facts=facts,
            guidelines=guidelines,
            terminologies=terminologies,
            top_k=8
        )

        brand_dna_context = {
            "name": brand.name,
            "industry": brand.industry,
            "mission": brand.mission,
            "values": brand.values,
            "personality": brand.personality,
            "terminologies": [
                {
                    "term": t.term,
                    "term_type": t.term_type,
                    "replacement": t.replacement_suggestion,
                    "explanation": t.explanation
                }
                for t in terminologies
            ],
            "visual_assets": [
                {
                    "name": a.name,
                    "asset_type": a.asset_type,
                    "metadata": a.metadata_json
                }
                for a in assets
            ]
        }

        # 2. Try Gemini API
        analysis_data = None
        execution_mode = "deterministic_local"

        if gemini_service.is_available() and text_to_analyze:
            try:
                gemini_result = gemini_service.analyze_content(
                    submission_text=text_to_analyze,
                    brand_dna=brand_dna_context,
                    retrieved_evidence=retrieved_evidence
                )
                if gemini_result and "findings" in gemini_result:
                    analysis_data = gemini_result
                    execution_mode = "gemini_live"
            except Exception as e:
                analysis_data = None

        # 3. Deterministic Engine if Gemini didn't run or wasn't available
        if not analysis_data:
            analysis_data = self._run_deterministic_governance(
                submission=submission,
                brand=brand,
                guidelines=guidelines,
                facts=facts,
                terminologies=terminologies,
                assets=assets,
                retrieved_evidence=retrieved_evidence
            )
            execution_mode = "deterministic_local"

        # 4. Handle Visual Forensics if image submission
        if submission.content_type == "image" and submission.file_path:
            visual_findings = self._analyze_image_asset(submission.file_path, assets, brand_dna_context)
            analysis_data["findings"].extend(visual_findings.get("findings", []))
            analysis_data["visual_compliance_score"] = visual_findings.get("visual_score", 90.0)

        # 5. Calculate Metrics & Status
        findings_list = analysis_data.get("findings", [])
        critical_count = sum(1 for f in findings_list if f.get("severity") == "critical")
        warning_count = sum(1 for f in findings_list if f.get("severity") == "warning")
        info_count = sum(1 for f in findings_list if f.get("severity") == "info")

        claims_matrix = analysis_data.get("claims_matrix", [])
        supported_claims = sum(1 for c in claims_matrix if c.get("classification") == "SUPPORTED")
        conflicting_claims = sum(1 for c in claims_matrix if c.get("classification") == "CONFLICTING")
        unverified_claims = sum(1 for c in claims_matrix if c.get("classification") == "UNVERIFIED")

        # Overall Status Logic (Human always retains final authority)
        if critical_count > 0 or conflicting_claims > 0:
            overall_status = "Changes Required"
            submission_status = "changes_required"
        elif warning_count > 2 or unverified_claims > 2:
            overall_status = "Changes Required"
            submission_status = "changes_required"
        else:
            overall_status = "Ready for Review"
            submission_status = "ready_for_review"

        overall_score = float(analysis_data.get("overall_score", 85.0))
        overall_score = max(10.0, min(100.0, overall_score))

        # 6. Save Analysis Result
        analysis_result = AnalysisResult(
            submission_id=submission.id,
            overall_score=overall_score,
            overall_status=overall_status,
            summary=analysis_data.get("summary", "Brand governance analysis complete."),
            execution_mode=execution_mode,
            total_issues=len(findings_list),
            critical_count=critical_count,
            warning_count=warning_count,
            info_count=info_count,
            supported_claims_count=supported_claims,
            conflicting_claims_count=conflicting_claims,
            unverified_claims_count=unverified_claims,
            brand_voice_score=float(analysis_data.get("brand_voice_score", 90.0)),
            terminology_score=float(analysis_data.get("terminology_score", 85.0)),
            claim_integrity_score=float(analysis_data.get("claim_integrity_score", 85.0)),
            visual_compliance_score=float(analysis_data.get("visual_compliance_score", 95.0))
        )
        db.add(analysis_result)
        db.flush()

        # 7. Save Findings
        for f in findings_list:
            finding = Finding(
                analysis_id=analysis_result.id,
                category=f.get("category", "brand_voice"),
                severity=f.get("severity", "warning"),
                detected_text=f.get("detected_text", "")[:500],
                issue_title=f.get("issue_title", "Brand Finding")[:255],
                explanation=f.get("explanation", ""),
                suggested_correction=f.get("suggested_correction"),
                claim_classification=f.get("claim_classification"),
                confidence_score=float(f.get("confidence_score", 0.90)),
                evidence_source=f.get("evidence_source"),
                evidence_ref_id=f.get("evidence_ref_id")
            )
            db.add(finding)

        # Update Submission
        submission.status = submission_status
        submission.current_analysis_id = analysis_result.id
        db.commit()
        db.refresh(analysis_result)

        # Audit Log
        audit = AuditLog(
            organization_id=brand.organization_id,
            user_id=submission.creator_id,
            action="ANALYSIS_EXECUTED",
            entity_type="SUBMISSION",
            entity_id=submission.id,
            details_json=f'{{"overall_score": {overall_score}, "status": "{overall_status}", "mode": "{execution_mode}", "issues": {len(findings_list)}}}'
        )
        db.add(audit)
        db.commit()

        return analysis_result

    def _run_deterministic_governance(
        self,
        submission: Submission,
        brand: Brand,
        guidelines: List[BrandGuideline],
        facts: List[BrandFact],
        terminologies: List[BrandTerminology],
        assets: List[BrandAsset],
        retrieved_evidence: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        High-fidelity deterministic brand governance engine covering all 6 categories:
        1. Claim Verification (SUPPORTED, CONFLICTING, UNVERIFIED)
        2. Brand Voice & Tone
        3. Terminology Compliance
        4. Messaging Alignment
        5. Visual Brand Consistency
        6. Accessibility & Readability
        """
        text = submission.raw_text or ""
        findings = []
        claims_matrix = []

        voice_penalties = 0.0
        terminology_penalties = 0.0
        claim_penalties = 0.0
        messaging_penalties = 0.0
        accessibility_penalties = 0.0

        # --- Category 1: Terminology Compliance ---
        for term_rule in terminologies:
            pattern = rf'\b{re.escape(term_rule.term)}\b'
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            if matches:
                if term_rule.term_type == "prohibited":
                    terminology_penalties += 15.0
                    for m in matches:
                        findings.append({
                            "category": "terminology",
                            "severity": "critical",
                            "detected_text": m.group(0),
                            "issue_title": f"Prohibited Term Detected: '{term_rule.term}'",
                            "explanation": term_rule.explanation or f"The term '{term_rule.term}' is strictly prohibited under {brand.name} brand guidelines.",
                            "suggested_correction": f"Replace '{m.group(0)}' with approved terminology: '{term_rule.replacement_suggestion}'." if term_rule.replacement_suggestion else "Remove or replace with an approved brand term.",
                            "claim_classification": None,
                            "confidence_score": 0.99,
                            "evidence_source": f"Brand Terminology Rule: {term_rule.term}"
                        })
                elif term_rule.term_type == "preferred":
                    pass

        # --- Category 2: Claim Verification Engine ---
        sentences = re.split(r'(?<=[.!?])\s+', text)
        claim_patterns = [
            r'\d+(?:\.\d+)?%?',
            r'\b(?:guarantee|guaranteed|fastest|first|leader|only|best|zero|uptime|certified|accredited|compliance|sla|annual|millisecond|benchmark)\b'
        ]

        for s in sentences:
            s_clean = s.strip()
            if not s_clean or len(s_clean) < 10:
                continue

            is_potential_claim = any(re.search(p, s_clean, re.IGNORECASE) for p in claim_patterns)
            if not is_potential_claim:
                continue

            matched_fact = None
            is_conflicting = False
            
            for fact in facts:
                nums_in_sentence = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', s_clean))
                nums_in_fact = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', fact.claim_text))

                s_words = set(s_clean.lower().split())
                f_words = set(fact.claim_text.lower().split())
                overlap = len(s_words & f_words)

                if nums_in_sentence and nums_in_fact:
                    if nums_in_sentence == nums_in_fact and overlap >= 2:
                        matched_fact = fact
                        break
                    elif nums_in_sentence != nums_in_fact and overlap >= 3:
                        matched_fact = fact
                        is_conflicting = True
                        break
                elif overlap >= 4:
                    matched_fact = fact
                    break

            if matched_fact and not is_conflicting:
                # SUPPORTED CLAIM
                claims_matrix.append({
                    "statement": s_clean,
                    "classification": "SUPPORTED",
                    "explanation": f"Claim verified against official brand source: {matched_fact.source_name}.",
                    "supporting_source": f"{matched_fact.source_name} ({matched_fact.source_url_or_ref or 'Internal Record'})",
                    "severity": "info",
                    "suggested_correction": None
                })
                findings.append({
                    "category": "claim_verification",
                    "severity": "info",
                    "detected_text": s_clean,
                    "issue_title": "Verified Brand Claim",
                    "explanation": f"This claim is substantiated by {matched_fact.source_name}.",
                    "suggested_correction": None,
                    "claim_classification": "SUPPORTED",
                    "confidence_score": 0.96,
                    "evidence_source": matched_fact.source_name,
                    "evidence_ref_id": str(matched_fact.id)
                })
            elif matched_fact and is_conflicting:
                # CONFLICTING CLAIM (Critical)
                claim_penalties += 25.0
                claims_matrix.append({
                    "statement": s_clean,
                    "classification": "CONFLICTING",
                    "explanation": f"Contradicts approved brand fact: '{matched_fact.claim_text}' from {matched_fact.source_name}.",
                    "supporting_source": matched_fact.source_name,
                    "severity": "critical",
                    "suggested_correction": f"Adjust claim to reflect verified fact: '{matched_fact.claim_text}'."
                })
                findings.append({
                    "category": "claim_verification",
                    "severity": "critical",
                    "detected_text": s_clean,
                    "issue_title": "Conflicting Brand Claim Detected",
                    "explanation": f"The submitted statement directly contradicts approved brand records ({matched_fact.source_name}).",
                    "suggested_correction": f"Align statement with verified fact: \"{matched_fact.claim_text}\"",
                    "claim_classification": "CONFLICTING",
                    "confidence_score": 0.94,
                    "evidence_source": matched_fact.source_name,
                    "evidence_ref_id": str(matched_fact.id)
                })
            else:
                # UNVERIFIED CLAIM (Never classify as false!)
                claim_penalties += 8.0
                claims_matrix.append({
                    "statement": s_clean,
                    "classification": "UNVERIFIED",
                    "explanation": "No verified source found in the Brand DNA workspace. This claim is not verified, but not assumed false. Creator should provide validation.",
                    "supporting_source": None,
                    "severity": "warning",
                    "suggested_correction": "Add supporting citation or obtain Brand Admin verification before public release."
                })
                findings.append({
                    "category": "claim_verification",
                    "severity": "warning",
                    "detected_text": s_clean,
                    "issue_title": "Unverified Factual Claim",
                    "explanation": "This factual assertion could not be traced to any approved brand source in Brand DNA. Human review is required to verify.",
                    "suggested_correction": "Provide a verifiable source citation or request Brand Admin addition to Brand Facts.",
                    "claim_classification": "UNVERIFIED",
                    "confidence_score": 0.88,
                    "evidence_source": "Pending Verification"
                })

        # --- Category 3: Brand Voice & Tone ---
        informal_phrases = [
            "super cool", "cheap", "no brainer", "insane", "insane deal", "insane speed", "gonna", "wanna",
            "crush", "crush competitors", "crush legacy rails", "destroy rivals", "magic button", "free money",
            "hey folks", "folks", "crypto coin", "killing it", "game changer"
        ]
        for p in informal_phrases:
            if re.search(rf'\b{re.escape(p)}\b', text, re.IGNORECASE):
                voice_penalties += 10.0
                findings.append({
                    "category": "brand_voice",
                    "severity": "warning",
                    "detected_text": p,
                    "issue_title": f"Inconsistent Tone: '{p}'",
                    "explanation": f"{brand.name} maintains an authoritative, sophisticated enterprise voice. Casual colloquialisms detract from enterprise trust.",
                    "suggested_correction": "Refactor phrasing to reflect precision and professional authority.",
                    "claim_classification": None,
                    "confidence_score": 0.92,
                    "evidence_source": "Brand Voice & Personality Guidelines"
                })

        # --- Category 4: Messaging Alignment ---
        prohibited_guidelines = [g for g in guidelines if g.rule_type == "prohibited"]
        for g in prohibited_guidelines:
            # Check for key prohibition triggers
            if "risk-free" in g.content.lower() and re.search(r'\b(risk[- ]free|zero risk|guaranteed profit)\b', text, re.IGNORECASE):
                messaging_penalties += 15.0
                match = re.search(r'\b(risk[- ]free|zero risk|guaranteed profit)\b', text, re.IGNORECASE).group(0)
                findings.append({
                    "category": "messaging_alignment",
                    "severity": "critical",
                    "detected_text": match,
                    "issue_title": f"Prohibited Messaging: {g.title}",
                    "explanation": g.content,
                    "suggested_correction": "State performance advantages objectively while including standard risk disclosures.",
                    "confidence_score": 0.95,
                    "evidence_source": f"Guideline: {g.title}"
                })
            elif "competitor" in g.content.lower() and re.search(r'\b(crush|destroy|obliterate|inferior legacy)\b', text, re.IGNORECASE):
                messaging_penalties += 10.0
                match = re.search(r'\b(crush|destroy|obliterate|inferior legacy)\b', text, re.IGNORECASE).group(0)
                findings.append({
                    "category": "messaging_alignment",
                    "severity": "warning",
                    "detected_text": match,
                    "issue_title": f"Disparagement Rule: {g.title}",
                    "explanation": g.content,
                    "suggested_correction": "Frame superiority strictly around technical throughput and architectural latency without attacking competitors.",
                    "confidence_score": 0.91,
                    "evidence_source": f"Guideline: {g.title}"
                })

        # --- Category 5: Accessibility Checks ---
        # Analyze sentence complexity and average sentence length
        long_sentences = [s.strip() for s in sentences if len(s.strip().split()) > 35]
        if long_sentences:
            accessibility_penalties += 8.0
            findings.append({
                "category": "accessibility",
                "severity": "info",
                "detected_text": long_sentences[0][:150] + "...",
                "issue_title": "High Sentence Complexity (Readability)",
                "explanation": f"Sentence contains {len(long_sentences[0].split())} words. Long, multi-clause sentences reduce cognitive accessibility and comprehension.",
                "suggested_correction": "Break long sentences into shorter, active statements under 25 words.",
                "confidence_score": 0.89,
                "evidence_source": "WCAG & Plain Language Standards"
            })

        # Calculate Scores
        voice_score = max(40.0, 100.0 - voice_penalties)
        terminology_score = max(40.0, 100.0 - terminology_penalties)
        claim_score = max(40.0, 100.0 - claim_penalties)
        messaging_score = max(40.0, 100.0 - messaging_penalties)
        
        overall_score = round(
            (voice_score * 0.20) + 
            (terminology_score * 0.30) + 
            (claim_score * 0.35) + 
            (messaging_score * 0.15), 
            1
        )

        summary_parts = []
        if terminology_penalties > 0:
            summary_parts.append("Identified terminology deviations requiring correction.")
        if claim_penalties > 0:
            summary_parts.append("Detected unverified or conflicting claims needing human verification.")
        if messaging_penalties > 0:
            summary_parts.append("Flagged messaging statements that violate brand policy boundaries.")
        if not summary_parts:
            summary_parts.append("Content adheres cleanly to established Brand DNA standards.")

        return {
            "summary": " ".join(summary_parts),
            "overall_score": overall_score,
            "brand_voice_score": voice_score,
            "terminology_score": terminology_score,
            "claim_integrity_score": claim_score,
            "visual_compliance_score": 95.0,
            "claims_matrix": claims_matrix,
            "findings": findings
        }

    def _analyze_image_asset(self, file_path: str, assets: List[BrandAsset], brand_dna_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Visual forensics on image files: verifies format, dimensions, dominant color palette,
        color distance against approved tokens, and contrast ratios.
        """
        if gemini_service.is_available():
            gemini_visual = gemini_service.analyze_visual_asset(file_path, brand_dna_context)
            if gemini_visual:
                return gemini_visual

        props = analyze_image_properties(file_path)
        findings = []
        score = 92.0

        if "dominant_colors" in props:
            detected_hexes = props["dominant_colors"]
            
            # Check against approved brand palettes in assets
            approved_palettes = [a for a in assets if a.asset_type == "color_palette"]
            approved_hexes = []
            for a in approved_palettes:
                if a.metadata_json:
                    try:
                        meta = json.loads(a.metadata_json)
                        for val in meta.values():
                            if isinstance(val, str) and val.startswith("#"):
                                approved_hexes.append(val.upper())
                    except Exception:
                        pass

            if not approved_hexes:
                # Default brand colors
                approved_hexes = ["#14231F", "#202C35", "#71958C", "#DCE2DE", "#F3F5F2"]

            # Compute color distance from nearest approved color
            deviant_colors = []
            for d_hex in detected_hexes[:3]:
                d_rgb = hex_to_rgb(d_hex)
                min_dist = min([color_distance(d_rgb, hex_to_rgb(a_hex)) for a_hex in approved_hexes])
                if min_dist > 40.0:  # Noticeable color deviation
                    deviant_colors.append((d_hex, round(min_dist, 1)))

            if deviant_colors:
                score -= 10.0
                findings.append({
                    "category": "visual_consistency",
                    "severity": "warning",
                    "detected_text": f"Deviant Palette: {', '.join([c[0] for c in deviant_colors])}",
                    "issue_title": "Visual Forensics: Non-Approved Brand Colors Detected",
                    "explanation": f"Detected colors ({', '.join([f'{c[0]} (ΔE {c[1]})' for c in deviant_colors])}) deviate from approved brand color tokens.",
                    "suggested_correction": f"Adjust asset colors to align with approved palette tokens ({', '.join(approved_hexes[:4])}).",
                    "confidence_score": 0.94,
                    "evidence_source": "Visual Asset Standards"
                })
            else:
                findings.append({
                    "category": "visual_consistency",
                    "severity": "info",
                    "detected_text": f"Approved Palette: {', '.join(detected_hexes[:3])}",
                    "issue_title": "Visual Forensics: Color Palette Compliant",
                    "explanation": f"Dominant colors align within acceptable tolerance of approved brand tokens.",
                    "suggested_correction": None,
                    "confidence_score": 0.96,
                    "evidence_source": "Visual Asset Standards"
                })

            # Check Contrast Ratio between darkest and brightest detected colors
            if len(detected_hexes) >= 2:
                darkest_rgb = hex_to_rgb(detected_hexes[0])
                brightest_rgb = hex_to_rgb(detected_hexes[-1])
                ratio = contrast_ratio(darkest_rgb, brightest_rgb)
                if ratio < 3.0:
                    score -= 8.0
                    findings.append({
                        "category": "accessibility",
                        "severity": "warning",
                        "detected_text": f"Contrast Ratio: {round(ratio, 2)}:1",
                        "issue_title": "WCAG Visual Contrast Warning",
                        "explanation": f"Calculated contrast ratio ({round(ratio, 2)}:1) is below WCAG AA minimum standard (4.5:1 for body, 3:1 for large text).",
                        "suggested_correction": "Increase luminance difference between foreground text and background canvas.",
                        "confidence_score": 0.92,
                        "evidence_source": "WCAG 2.1 AA Standards"
                    })

        return {
            "visual_score": max(50.0, score),
            "findings": findings
        }

analysis_engine = AnalysisEngine()
