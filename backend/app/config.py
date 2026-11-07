import os
import secrets
import logging
from pathlib import Path
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AUREX AI"
    TAGLINE: str = "The Gold Standard of Brand Integrity"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment mode: 'development', 'staging', 'production'
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/aurex_ai.db")
    
    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Gemini AI Configuration (Server-side only)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_EMBEDDING_MODEL: str = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")
    
    # Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", str(BASE_DIR.parent / "uploads"))
    MAX_UPLOAD_SIZE_MB: int = 25
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://aurex-ai-ruddy.vercel.app",
        
    ]

    class Config:
        env_file = [str(BASE_DIR / ".env"), str(BASE_DIR.parent / ".env"), ".env"]
        extra = "allow"

    def model_post_init(self, __context):
        # Validate JWT_SECRET_KEY - reject empty, default, or weak keys (< 32 chars)
        insecure_placeholders = {
            "",
            "CHANGE_ME_GENERATE_A_SECURE_RANDOM_SECRET",
            "YOUR_SECRET_KEY_HERE",
            "YOUR_JWT_SECRET_KEY_HERE",
        }
        
        is_insecure = (
            not self.JWT_SECRET_KEY
            or self.JWT_SECRET_KEY in insecure_placeholders
            or "change_me" in self.JWT_SECRET_KEY.lower()
            or "secret_key" in self.JWT_SECRET_KEY.lower()
            or len(self.JWT_SECRET_KEY) < 32
        )
        
        if self.ENVIRONMENT.lower() == "production":
            if is_insecure or len(self.JWT_SECRET_KEY) < 32:
                raise RuntimeError(
                    "CRITICAL SECURITY CONFIGURATION ERROR: A cryptographically secure "
                    "JWT_SECRET_KEY (minimum 32 characters / 256 bits) must be configured "
                    "in environment variables for production deployments."
                )
        elif is_insecure:
            logger.warning(
                "SECURITY WARNING: No secure JWT_SECRET_KEY found in environment. "
                "Generating an ephemeral in-memory secret for this development session. "
                "Please configure JWT_SECRET_KEY in your local .env file."
            )
            self.JWT_SECRET_KEY = secrets.token_hex(32)

settings = Settings()

