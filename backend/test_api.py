import asyncio
import httpx
from app.main import app

async def run_tests():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Health check
        h = await client.get("/health")
        assert h.status_code == 200, f"Health check failed: {h.text}"
        print("[PASS] Health Check:", h.json())

        # System Status
        st = await client.get("/api/v1/system-status")
        assert st.status_code == 200, f"Status check failed: {st.text}"
        print("[PASS] System Status:", st.json())

        # Auth Login
        login_resp = await client.post("/api/v1/auth/login", json={"email": "admin@aurex.ai", "password": "aurex123"})
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        token = login_resp.json()["access_token"]
        print("[PASS] Auth Login successful. Token received.")

        headers = {"Authorization": f"Bearer {token}"}

        # Brands List
        b_resp = await client.get("/api/v1/brands", headers=headers)
        assert b_resp.status_code == 200
        brands = b_resp.json()
        print(f"[PASS] Retrieved {len(brands)} Brands: {[b['name'] for b in brands]}")
        brand_id = brands[0]["id"]

        # Brand DNA
        dna_resp = await client.get(f"/api/v1/brand-dna/{brand_id}", headers=headers)
        assert dna_resp.status_code == 200
        dna = dna_resp.json()
        print(f"[PASS] Brand DNA: {len(dna['facts'])} facts, {len(dna['terminologies'])} terms, {len(dna['guidelines'])} guidelines")

        # Submissions List
        subs_resp = await client.get("/api/v1/submissions", headers=headers)
        assert subs_resp.status_code == 200
        subs = subs_resp.json()
        print(f"[PASS] Retrieved {len(subs)} Submissions.")

        # Trust Passport for first submission
        if subs:
            sub_id = subs[0]["id"]
            tp_resp = await client.get(f"/api/v1/trust-passport/{sub_id}", headers=headers)
            assert tp_resp.status_code == 200
            tp = tp_resp.json()
            print(f"[PASS] Trust Passport generated: Score {tp['governance_score']}/100, Status: '{tp['overall_status']}', Issues: {tp['total_issues']}")

        # Insights
        ins_resp = await client.get("/api/v1/insights", headers=headers)
        assert ins_resp.status_code == 200
        ins = ins_resp.json()
        print(f"[PASS] Governance Insights: Avg Score {ins['avg_governance_score']}, Top Violations: {len(ins['top_violations'])}")

        print("\n>>> ALL BACKEND API TESTS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    asyncio.run(run_tests())
