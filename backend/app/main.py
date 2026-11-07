from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_service import seed_database
from app.services.gemini_service import gemini_service

# Routers
from app.routers import auth, brands, brand_dna, submissions, trust_passport, workflow, insights, upload

# Initialize DB tables and seed data immediately on load
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Gold Standard of Brand Integrity. AI Brand Governance Platform.",
    version=settings.VERSION
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
upload_dir_path = Path(settings.UPLOAD_DIR)
upload_dir_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir_path)), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(brands.router, prefix=settings.API_V1_PREFIX)
app.include_router(brand_dna.router, prefix=settings.API_V1_PREFIX)
app.include_router(submissions.router, prefix=settings.API_V1_PREFIX)
app.include_router(trust_passport.router, prefix=settings.API_V1_PREFIX)
app.include_router(workflow.router, prefix=settings.API_V1_PREFIX)
app.include_router(insights.router, prefix=settings.API_V1_PREFIX)
app.include_router(upload.router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION
    }

@app.get(f"{settings.API_V1_PREFIX}/system-status")
def system_status():
    has_gemini = gemini_service.is_available()
    return {
        "ai_engine": "Gemini Live Multimodal RAG" if has_gemini else "Deterministic Brand Governance Engine (Demo/Local Mode)",
        "gemini_api_configured": has_gemini,
        "model": settings.GEMINI_MODEL if has_gemini else "Local Rule-Based NLP & Evidence Matcher",
        "database": "Operational (SQLite / PostgreSQL ready)",
        "rag_retrieval": "Operational (Semantic Vector & Lexical Matching)",
        "evidence_traceability": "Active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
