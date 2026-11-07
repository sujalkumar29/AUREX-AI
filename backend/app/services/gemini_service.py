import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path
from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are AUREX AI - The Gold Standard of Brand Integrity.
You are an expert Brand Governance & Intelligence AI.
Your purpose: Verify submitted content against approved Brand DNA before release.

Core Principles:
1. "AI recommends. Evidence explains. Humans decide."
2. Claim Verification Rule:
   - Extract all factual, statistical, performance, or capability claims.
   - Compare each against the provided APPROVED BRAND EVIDENCE.
   - Classify as:
     * SUPPORTED: Verifiably backed by an approved brand fact or source.
     * CONFLICTING: Directly contradicts approved facts (e.g. wrong numbers, inaccurate capabilities).
     * UNVERIFIED: Cannot be proven from the approved brand knowledge base.
   - CRITICAL: NEVER automatically classify an unverified claim as false or fabricated! Mark it UNVERIFIED and explain what proof is missing.
3. Brand Voice & Tone:
   - Check if tone matches the approved brand personality (e.g., Authoritative, Trustworthy, Innovative).
   - Flag if too informal, too aggressive, or missing brand voice pillars.
4. Terminology Compliance:
   - Identify prohibited terms and replace with approved/preferred brand terms.
5. Suggestions:
   - Actionable corrections MUST preserve the creator's original intent while enforcing compliance.
6. Return purely valid JSON adhering strictly to the requested schema.
"""

ANALYSIS_SCHEMA_PROMPT = """
Analyze the submitted content against the Brand DNA and Retrieved Evidence.
Return a single JSON object with this exact structure:
{
  "summary": "Brief executive summary of governance findings",
  "overall_score": 85.0,
  "overall_status": "Ready for Review" | "Changes Required" | "Approved" | "Rejected",
  "brand_voice_score": 90.0,
  "terminology_score": 80.0,
  "claim_integrity_score": 85.0,
  "visual_compliance_score": 100.0,
  "claims_matrix": [
    {
      "statement": "Claim extracted from text",
      "classification": "SUPPORTED" | "CONFLICTING" | "UNVERIFIED",
      "explanation": "Why it is classified as such",
      "supporting_source": "Exact source title from evidence or null",
      "severity": "critical" | "warning" | "info",
      "suggested_correction": "Intent-preserving compliant rewrite"
    }
  ],
  "findings": [
    {
      "category": "claim_verification" | "brand_voice" | "terminology" | "messaging_alignment" | "visual_consistency" | "accessibility",
      "severity": "critical" | "warning" | "info",
      "detected_text": "Exact text or phrase flagged",
      "issue_title": "Short title describing the issue",
      "explanation": "Detailed explanation of why it violates brand guidelines",
      "suggested_correction": "Actionable correction",
      "claim_classification": "SUPPORTED" | "CONFLICTING" | "UNVERIFIED" | null,
      "confidence_score": 0.95,
      "evidence_source": "Source reference name or null"
    }
  ]
}
"""

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Google GenAI Client: {e}")

    def is_available(self) -> bool:
        return bool(self.client and self.api_key)

    def analyze_content(
        self,
        submission_text: str,
        brand_dna: Dict[str, Any],
        retrieved_evidence: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            return None

        from google.genai import types

        user_content = f"""
BRAND CONTEXT:
Brand Name: {brand_dna.get('name')}
Industry: {brand_dna.get('industry')}
Mission & Values: {brand_dna.get('mission')} | {brand_dna.get('values')}
Brand Personality: {brand_dna.get('personality')}

APPROVED BRAND EVIDENCE (Retrieved via RAG):
{json.dumps(retrieved_evidence, indent=2)}

APPROVED TERMINOLOGY RULES:
{json.dumps(brand_dna.get('terminologies', []), indent=2)}

SUBMITTED CONTENT TO ANALYZE:
\"\"\"
{submission_text}
\"\"\"

{ANALYSIS_SCHEMA_PROMPT}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            
            raw_text = response.text.strip()
            # Clean JSON markdown if wrapped
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()

            parsed = json.loads(raw_text)
            return parsed
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {e}")
            return None

    def analyze_visual_asset(
        self,
        image_path: str,
        brand_dna: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            return None

        from google.genai import types
        from PIL import Image

        path = Path(image_path)
        if not path.exists():
            return None

        try:
            image = Image.open(str(path))
            
            visual_rules = brand_dna.get('visual_assets', [])
            palette = [a for a in visual_rules if a.get('asset_type') == 'color_palette']

            prompt = f"""
You are AUREX AI performing Visual Forensics on this brand asset.
Brand: {brand_dna.get('name')}
Approved Visual Assets / Palettes:
{json.dumps(palette, indent=2)}

Analyze this creative asset for:
1. Brand color palette alignment (are approved colors present, are forbidden/clashing tones used?)
2. Logo consistency and placement
3. Typography hierarchy and legibility
4. Basic accessibility (contrast ratio, clarity)

Return valid JSON:
{{
  "visual_score": 88.0,
  "summary": "Visual analysis summary",
  "findings": [
    {{
      "category": "visual_consistency",
      "severity": "warning" | "critical" | "info",
      "detected_text": "Visual element",
      "issue_title": "Issue title",
      "explanation": "Why it deviates",
      "suggested_correction": "How to fix"
    }}
  ]
}}
"""
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[image, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )

            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()

            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Gemini Visual Forensics failed: {e}")
            return None

gemini_service = GeminiService()

