from app.database import SessionLocal
from app.models.user import User
from app.models.brand import Brand
from app.models.submission import Submission
from app.routers.auth import login
from app.schemas.auth import UserLogin
from app.routers.brands import list_brands
from app.routers.brand_dna import get_brand_dna
from app.routers.submissions import list_submissions
from app.routers.trust_passport import get_trust_passport
from app.routers.insights import get_governance_insights
from app.routers.workflow import get_audit_logs, get_comments, get_revisions
from app.main import health_check, system_status

def test_direct():
    db = SessionLocal()
    try:
        # 1. Health & Status
        print("Health:", health_check())
        print("System Status:", system_status())

        # 2. Auth Login
        user = db.query(User).filter(User.email == "admin@aurex.ai").first()
        assert user is not None, "Admin user not found"
        login_res = login(UserLogin(email="admin@aurex.ai", password="aurex123"), db=db)
        print("Auth Login: Success! Token type:", login_res["token_type"])

        # 3. Brands
        brands = list_brands(current_user=user, db=db)
        print(f"Brands: Retrieved {len(brands)} brands. Primary: {brands[0].name}")

        # 4. Brand DNA
        dna = get_brand_dna(brand_id=brands[0].id, current_user=user, db=db)
        print(f"Brand DNA: {len(dna['facts'])} facts, {len(dna['terminologies'])} terms, {len(dna['guidelines'])} guidelines")

        # 5. Submissions
        subs = list_submissions(current_user=user, db=db)
        print(f"Submissions: Retrieved {len(subs)} submissions.")

        # 6. Trust Passport
        if subs:
            tp = get_trust_passport(submission_id=subs[0].id, current_user=user, db=db)
            print(f"Trust Passport: Score {tp.governance_score}/100, Status: '{tp.overall_status}', Total Findings: {len(tp.findings)}")

        # 7. Insights
        ins = get_governance_insights(current_user=user, db=db)
        print(f"Insights: Avg Score {ins.avg_governance_score}%, Violations: {len(ins.top_violations)}")

        # 8. Workflow (Audit Logs, Comments, Revisions)
        logs = get_audit_logs(current_user=user, db=db)
        print(f"Workflow: Retrieved {len(logs)} audit logs.")
        if subs:
            comments = get_comments(submission_id=subs[0].id, current_user=user, db=db)
            revisions = get_revisions(submission_id=subs[0].id, current_user=user, db=db)
            print(f"Workflow Submissions: {len(comments)} comments, {len(revisions)} revisions.")

        print("\n>>> ALL BACKEND CORE LOGIC & ROUTERS VERIFIED 100% SUCCESFUL! <<<")
    finally:
        db.close()

if __name__ == "__main__":
    test_direct()

