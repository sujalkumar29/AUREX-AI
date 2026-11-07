"""
AUREX AI - Comprehensive End-to-End Test Suite
Validates all 10 mandatory governance, security, and verification scenarios.
Philosophy: "AI recommends. Evidence explains. Humans decide."
"""

import os
import sys
import uuid
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.database import get_db, SessionLocal
from app.models import User, Brand, Submission, AnalysisResult, Finding, Review, Comment, RevisionHistory, AuditLog, Organization

client = TestClient(app)

class TestColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log_test(num: int, title: str):
    print(f"\n{TestColors.BOLD}{TestColors.OKCYAN}=== RUNNING TEST {num}: {title} ==={TestColors.ENDC}")

def log_pass(num: int, details: str):
    print(f"{TestColors.OKGREEN}✓ TEST {num} PASSED:{TestColors.ENDC} {details}")

def log_fail(num: int, details: str):
    print(f"{TestColors.FAIL}✗ TEST {num} FAILED:{TestColors.ENDC} {details}")


def run_full_e2e_suite():
    print(f"\n{TestColors.BOLD}{TestColors.HEADER}=======================================================================")
    print("        AUREX AI - AUTOMATED E2E GOVERNANCE AUDIT SUITE               ")
    print(f"======================================================================={TestColors.ENDC}\n")

    results = []

    # Helper: Register and authenticate a user
    def create_user(role="admin", email=None, org_name="TestOrg"):
        u_email = email or f"user_{uuid.uuid4().hex[:8]}@example.com"
        reg_resp = client.post("/api/v1/auth/register", json={
            "email": u_email,
            "password": "Password123!",
            "full_name": f"Test {role.capitalize()}",
            "role": role,
            "organization_name": org_name,
        })
        assert reg_resp.status_code == 200, f"Registration failed: {reg_resp.text}"
        data = reg_resp.json()
        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        return data["user"], headers

    # -------------------------------------------------------------
    # TEST 1: Full Submission Pipeline
    # -------------------------------------------------------------
    try:
        log_test(1, "Create brand -> Add approved facts -> Submit content -> Analyze -> Generate Trust Passport")
        user, headers = create_user("admin", org_name="Apex Global Corp")

        # 1. Create Brand
        brand_resp = client.post("/api/v1/brands", headers=headers, json={
            "name": "Apex Core",
            "industry": "FinTech",
            "personality": "authoritative, precise, institutional",
            "mission": "Empowering sovereign finance.",
            "is_default": True
        })
        assert brand_resp.status_code == 200, f"Brand creation failed: {brand_resp.text}"
        brand = brand_resp.json()
        brand_id = brand["id"]

        # 2. Add Approved Fact
        fact_resp = client.post(f"/api/v1/brand-dna/{brand_id}/facts", headers=headers, json={
            "claim_text": "Over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit",
            "category": "statistic",
            "source_name": "2025 Institutional Settlement Audit",
            "source_url_or_ref": "https://apex.corp/audit-2025.pdf"
        })
        assert fact_resp.status_code == 200, f"Fact creation failed: {fact_resp.text}"

        # 3. Submit Content
        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Q1 2026 Sovereign Settlement Report",
            "content_type": "press_release",
            "raw_text": "Apex Core settled over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit with 99.995% SLA."
        })
        assert sub_resp.status_code == 200, f"Submission failed: {sub_resp.text}"
        sub = sub_resp.json()
        sub_id = sub["id"]

        # 4. Analyze Submission
        analysis_resp = client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        assert analysis_resp.status_code == 200, f"Analysis failed: {analysis_resp.text}"
        analysis = analysis_resp.json()
        assert "overall_score" in analysis
        assert "overall_status" in analysis

        # 5. Retrieve Trust Passport
        passport_resp = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers)
        assert passport_resp.status_code == 200, f"Passport fetch failed: {passport_resp.text}"
        passport = passport_resp.json()
        assert passport["governance_score"] is not None
        assert "claims_matrix" in passport
        assert passport["hmac_sha256"] is not None
        assert len(passport["hmac_sha256"]) == 64
        assert passport["brand"]["name"] == "Apex Core"

        log_pass(1, f"Submission {sub_id} evaluated with score {passport['governance_score']} and HMAC {passport['hmac_sha256'][:16]}...")
        results.append(("TEST 1: Full Submission Pipeline", True, ""))
    except Exception as e:
        log_fail(1, str(e))
        results.append(("TEST 1: Full Submission Pipeline", False, str(e)))

    # -------------------------------------------------------------
    # TEST 2: Supported Claim Verification
    # -------------------------------------------------------------
    try:
        log_test(2, "Submit supported claim -> Verify against approved evidence (classification = SUPPORTED)")
        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Exact Match Claim Test",
            "content_type": "marketing_copy",
            "raw_text": "We have achieved over $14.2B in annual settlement volume across 42 sovereign jurisdictions verified in our 2025 audit."
        })
        sub_id = sub_resp.json()["id"]
        client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        passport = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers).json()

        supported_claims = [c for c in passport["claims_matrix"] if c["classification"] == "SUPPORTED"]
        assert len(supported_claims) >= 1, "Expected at least 1 SUPPORTED claim in claims matrix"
        assert "14.2B" in supported_claims[0]["statement"] or "jurisdictions" in supported_claims[0]["statement"]

        log_pass(2, f"Claim correctly classified as SUPPORTED with source: '{supported_claims[0].get('supporting_source')}'")
        results.append(("TEST 2: Supported Claim Verification", True, ""))
    except Exception as e:
        log_fail(2, str(e))
        results.append(("TEST 2: Supported Claim Verification", False, str(e)))

    # -------------------------------------------------------------
    # TEST 3: Conflicting Claim Detection
    # -------------------------------------------------------------
    try:
        log_test(3, "Submit conflicting claim -> Detect contradiction (classification = CONFLICTING)")
        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Conflicting Volume Claim",
            "content_type": "marketing_copy",
            "raw_text": "Apex Core annual settlement volume is only $5B across 10 jurisdictions."
        })
        sub_id = sub_resp.json()["id"]
        client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        passport = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers).json()

        conflicting_claims = [c for c in passport["claims_matrix"] if c["classification"] == "CONFLICTING"]
        assert len(conflicting_claims) >= 1, f"Expected at least 1 CONFLICTING claim, got {passport['claims_matrix']}"

        log_pass(3, f"Contradiction detected: '{conflicting_claims[0]['statement']}' flagged as CONFLICTING. Explanation: {conflicting_claims[0]['explanation']}")
        results.append(("TEST 3: Conflicting Claim Detection", True, ""))
    except Exception as e:
        log_fail(3, str(e))
        results.append(("TEST 3: Conflicting Claim Detection", False, str(e)))

    # -------------------------------------------------------------
    # TEST 4: Unverified Claim Handling (Never False)
    # -------------------------------------------------------------
    try:
        log_test(4, "Submit claim without evidence -> Mark UNVERIFIED (Never marked False)")
        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Novel Future Claim",
            "content_type": "blog_post",
            "raw_text": "Apex Core is developing revolutionary zero-gravity biometric security modules for space stations."
        })
        sub_id = sub_resp.json()["id"]
        client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        passport = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers).json()

        unverified_claims = [c for c in passport["claims_matrix"] if c["classification"] == "UNVERIFIED"]
        assert len(unverified_claims) >= 1, f"Expected UNVERIFIED claim, got {passport['claims_matrix']}"
        # Ensure it was not classified as CONFLICTING
        assert all(c["classification"] != "CONFLICTING" for c in unverified_claims)

        log_pass(4, f"Claim appropriately designated as UNVERIFIED without premature rejection: '{unverified_claims[0]['statement']}'")
        results.append(("TEST 4: Unverified Claim Handling", True, ""))
    except Exception as e:
        log_fail(4, str(e))
        results.append(("TEST 4: Unverified Claim Handling", False, str(e)))

    # -------------------------------------------------------------
    # TEST 5: Prohibited Terminology Enforcement
    # -------------------------------------------------------------
    try:
        log_test(5, "Submit content with prohibited terminology -> Flag violation and provide replacement")
        # Add prohibited terminology
        client.post(f"/api/v1/brand-dna/{brand_id}/terminologies", headers=headers, json={
            "term": "cheap settlement",
            "term_type": "prohibited",
            "replacement_suggestion": "capital-efficient institutional clearing",
            "explanation": "'Cheap' degrades our enterprise institutional perception."
        })

        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Ad Copy With Prohibited Term",
            "content_type": "marketing_copy",
            "raw_text": "Switch to Apex Core today for cheap settlement and reliable financial routing."
        })
        sub_id = sub_resp.json()["id"]
        client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        passport = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers).json()

        term_findings = [f for f in passport["findings"] if f["category"] == "terminology"]
        assert len(term_findings) >= 1, f"Expected terminology finding, got {passport['findings']}"
        assert "cheap settlement" in term_findings[0]["detected_text"].lower()
        assert "capital-efficient institutional clearing" in term_findings[0]["suggested_correction"]

        log_pass(5, f"Prohibited term '{term_findings[0]['detected_text']}' intercepted; suggested '{term_findings[0]['suggested_correction']}'")
        results.append(("TEST 5: Prohibited Terminology Enforcement", True, ""))
    except Exception as e:
        log_fail(5, str(e))
        results.append(("TEST 5: Prohibited Terminology Enforcement", False, str(e)))

    # -------------------------------------------------------------
    # TEST 6: Inconsistent Brand Voice Suggestion
    # -------------------------------------------------------------
    try:
        log_test(6, "Submit content with informal/hyperbolic phrasing -> Detect voice violation & suggest remedy")
        sub_resp = client.post("/api/v1/submissions", headers=headers, json={
            "brand_id": brand_id,
            "title": "Informal Social Blast",
            "content_type": "social_post",
            "raw_text": "Hey folks, tired of insane legacy banking lags? Trade every crypto coin with zero latency and crush legacy rails!"
        })
        sub_id = sub_resp.json()["id"]
        client.post(f"/api/v1/submissions/{sub_id}/analyze", headers=headers)
        passport = client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers).json()

        voice_findings = [f for f in passport["findings"] if f["category"] == "brand_voice"]
        assert len(voice_findings) >= 1, f"Expected brand_voice finding, got {passport['findings']}"

        log_pass(6, f"Voice penalty applied: {voice_findings[0]['issue_title']} - Suggestion: {voice_findings[0]['suggested_correction']}")
        results.append(("TEST 6: Brand Voice Inconsistency", True, ""))
    except Exception as e:
        log_fail(6, str(e))
        results.append(("TEST 6: Brand Voice Inconsistency", False, str(e)))

    # -------------------------------------------------------------
    # TEST 7: Human Sovereign Review Workflow & Duty Separation
    # -------------------------------------------------------------
    try:
        log_test(7, "Creator submits -> Reviewer requests changes -> Creator revises -> Reviewer approves. Creator cannot self-approve.")
        # Create a dedicated creator and a dedicated reviewer in the same organization
        org_title = f"Workflow Org {uuid.uuid4().hex[:6]}"
        creator_user, creator_headers = create_user("creator", org_name=org_title)
        
        # Add a reviewer to the same organization in the DB
        db = SessionLocal()
        rev_email = f"reviewer_{uuid.uuid4().hex[:6]}@example.com"
        reviewer_user, reviewer_headers = create_user("reviewer", email=rev_email, org_name=org_title)
        # Point reviewer to the same org_id
        db_rev = db.query(User).filter(User.id == reviewer_user["id"]).first()
        db_rev.organization_id = creator_user["organization_id"]
        db.commit()
        db.close()

        # Creator submits content
        brand_id_wf = creator_user["organization_id"] # default brand was created during register
        # Get brand
        brands_wf = client.get("/api/v1/brands", headers=creator_headers).json()
        wf_brand_id = brands_wf[0]["id"]

        wf_sub = client.post("/api/v1/submissions", headers=creator_headers, json={
            "brand_id": wf_brand_id,
            "title": "Q2 Launch Campaign Draft",
            "content_type": "marketing_copy",
            "raw_text": "Draft content waiting for institutional reviewer approval."
        }).json()
        wf_sub_id = wf_sub["id"]

        # Step A: Creator attempts to self-approve -> MUST BE REJECTED (HTTP 403)
        self_approve_resp = client.post("/api/v1/workflow/reviews", headers=creator_headers, json={
            "submission_id": wf_sub_id,
            "action": "approve",
            "notes": "I approve my own copy!"
        })
        assert self_approve_resp.status_code == 403, f"Expected 403 self-approval block, got {self_approve_resp.status_code}: {self_approve_resp.text}"

        # Step B: Reviewer requests changes
        req_change_resp = client.post("/api/v1/workflow/reviews", headers=reviewer_headers, json={
            "submission_id": wf_sub_id,
            "action": "request_changes",
            "notes": "Please specify the exact settlement speed benchmark."
        })
        assert req_change_resp.status_code == 200, f"Request changes failed: {req_change_resp.text}"
        sub_state = client.get(f"/api/v1/submissions/{wf_sub_id}", headers=creator_headers).json()
        assert sub_state["status"] == "changes_required"

        # Step C: Creator revises content
        revise_resp = client.put(f"/api/v1/submissions/{wf_sub_id}", headers=creator_headers, json={
            "raw_text": "Draft content with settlement speed certified at under 420ms worldwide."
        })
        assert revise_resp.status_code == 200, f"Revision failed: {revise_resp.text}"
        sub_state = client.get(f"/api/v1/submissions/{wf_sub_id}", headers=creator_headers).json()
        assert sub_state["status"] == "ready_for_review"
        assert sub_state["version"] == 2

        # Step D: Reviewer approves
        approve_resp = client.post("/api/v1/workflow/reviews", headers=reviewer_headers, json={
            "submission_id": wf_sub_id,
            "action": "approve",
            "notes": "Verified against SLA benchmark. Approved for release."
        })
        assert approve_resp.status_code == 200, f"Approval failed: {approve_resp.text}"
        sub_state = client.get(f"/api/v1/submissions/{wf_sub_id}", headers=creator_headers).json()
        assert sub_state["status"] == "approved"

        log_pass(7, "Workflow complete: Separation of duties enforced, revision cycle tracked to version 2, and approval recorded.")
        results.append(("TEST 7: Human Sovereign Review Workflow", True, ""))
    except Exception as e:
        log_fail(7, str(e))
        results.append(("TEST 7: Human Sovereign Review Workflow", False, str(e)))

    # -------------------------------------------------------------
    # TEST 8: Multi-Tenant Organization Data Isolation
    # -------------------------------------------------------------
    try:
        log_test(8, "Cross-Organization Tenant Isolation: User B cannot access Org A's submissions/data")
        user_a, headers_a = create_user("admin", org_name="Enterprise Alpha")
        user_b, headers_b = create_user("admin", org_name="Enterprise Beta")

        # Org A creates submission
        brand_a = client.get("/api/v1/brands", headers=headers_a).json()[0]
        sub_a = client.post("/api/v1/submissions", headers=headers_a, json={
            "brand_id": brand_a["id"],
            "title": "Confidential Alpha Document",
            "content_type": "press_release",
            "raw_text": "Strictly confidential Alpha metrics."
        }).json()

        # Org B attempts to read Org A's submission -> MUST BE 404
        leak_sub_resp = client.get(f"/api/v1/submissions/{sub_a['id']}", headers=headers_b)
        assert leak_sub_resp.status_code == 404, f"Tenant leakage! Expected 404, got {leak_sub_resp.status_code}"

        # Org B attempts to read Org A's Brand DNA -> MUST BE 404
        leak_dna_resp = client.get(f"/api/v1/brand-dna/{brand_a['id']}", headers=headers_b)
        assert leak_dna_resp.status_code == 404, f"Brand DNA leakage! Expected 404, got {leak_dna_resp.status_code}"

        # Org B attempts to add fact to Org A's brand -> MUST BE 404
        leak_post_resp = client.post(f"/api/v1/brand-dna/{brand_a['id']}/facts", headers=headers_b, json={
            "claim_text": "Malicious claim injected into Org A",
            "category": "statistic",
            "source_name": "Attacker"
        })
        assert leak_post_resp.status_code == 404, f"Mutation leakage! Expected 404, got {leak_post_resp.status_code}"

        log_pass(8, "Multi-tenant barrier confirmed: HTTP 404 safely returned on all cross-tenant access attempts.")
        results.append(("TEST 8: Cross-Organization Tenant Isolation", True, ""))
    except Exception as e:
        log_fail(8, str(e))
        results.append(("TEST 8: Cross-Organization Tenant Isolation", False, str(e)))

    # -------------------------------------------------------------
    # TEST 9: Unsupported File Format Rejection (HTTP 400)
    # -------------------------------------------------------------
    try:
        log_test(9, "Upload unsupported file format (.exe, .bin) -> Confirm HTTP 400 rejection")
        bad_file = ("malicious_payload.exe", b"\x4D\x5A\x90\x00\x03\x00\x00\x00", "application/octet-stream")
        upload_resp = client.post(
            "/api/v1/upload",
            headers=headers,
            files={"file": bad_file}
        )
        assert upload_resp.status_code == 400, f"Expected HTTP 400 for .exe file, got {upload_resp.status_code}: {upload_resp.text}"
        assert "unsupported file" in upload_resp.json()["detail"].lower()

        log_pass(9, f"Unsupported format rejected with HTTP 400: '{upload_resp.json()['detail']}'")
        results.append(("TEST 9: Unsupported File Format Rejection", True, ""))
    except Exception as e:
        log_fail(9, str(e))
        results.append(("TEST 9: Unsupported File Format Rejection", False, str(e)))

    # -------------------------------------------------------------
    # TEST 10: Database State Persistence
    # -------------------------------------------------------------
    try:
        log_test(10, "Direct Database State Persistence Verification")
        db = SessionLocal()
        # Verify users exist
        user_count = db.query(User).count()
        brand_count = db.query(Brand).count()
        sub_count = db.query(Submission).count()
        analysis_count = db.query(AnalysisResult).count()
        audit_count = db.query(AuditLog).count()
        db.close()

        assert user_count > 0, "No users persisted"
        assert brand_count > 0, "No brands persisted"
        assert sub_count > 0, "No submissions persisted"
        assert analysis_count > 0, "No analysis results persisted"
        assert audit_count > 0, "No audit logs persisted"

        log_pass(10, f"Database verified: {user_count} users, {brand_count} brands, {sub_count} submissions, {analysis_count} analysis results, {audit_count} audit logs persisted.")
        results.append(("TEST 10: Database State Persistence", True, ""))
    except Exception as e:
        log_fail(10, str(e))
        results.append(("TEST 10: Database State Persistence", False, str(e)))

    # -------------------------------------------------------------
    # SUMMARY
    # -------------------------------------------------------------
    print(f"\n{TestColors.BOLD}{TestColors.HEADER}=======================================================================")
    print("                      E2E TEST SUITE SUMMARY                          ")
    print(f"======================================================================={TestColors.ENDC}\n")

    passed_count = sum(1 for _, ok, _ in results if ok)
    total_count = len(results)

    for name, ok, err in results:
        status_str = f"{TestColors.OKGREEN}[PASSED]{TestColors.ENDC}" if ok else f"{TestColors.FAIL}[FAILED]{TestColors.ENDC}"
        print(f"{status_str} {name}")
        if not ok:
            print(f"         Reason: {err}")

    print(f"\n{TestColors.BOLD}Final Score: {passed_count}/{total_count} Tests Passed ({passed_count/total_count*100:.1f}%){TestColors.ENDC}\n")

    if passed_count != total_count:
        sys.exit(1)

if __name__ == "__main__":
    run_full_e2e_suite()
