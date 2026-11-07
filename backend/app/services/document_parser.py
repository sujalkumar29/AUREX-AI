import uuid
from pathlib import Path
from typing import Tuple, Dict, Any
from PIL import Image
import pypdf
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_EXTENSIONS = {
    "text": [".txt", ".md", ".csv"],
    "pdf": [".pdf"],
    "image": [".png", ".jpg", ".jpeg", ".webp", ".svg"]
}

def ensure_upload_dir():
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

async def save_uploaded_file(file: UploadFile) -> Tuple[str, str, str]:
    """
    Saves an uploaded file safely, returns (file_path, file_url, content_type)
    """
    ensure_upload_dir()
    file_ext = Path(file.filename).suffix.lower()
    
    # Identify type
    content_type = "unknown"
    for cat, exts in ALLOWED_EXTENSIONS.items():
        if file_ext in exts:
            content_type = cat
            break
            
    if content_type == "unknown":
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{file_ext}'")

    unique_filename = f"{uuid.uuid4().hex}_{Path(file.filename).name}"
    save_path = Path(settings.UPLOAD_DIR) / unique_filename

    # Read and validate size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB")

    with open(save_path, "wb") as f:
        f.write(content)

    file_url = f"/uploads/{unique_filename}"
    return str(save_path), file_url, content_type

def extract_text_from_file(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        return ""

    ext = path.suffix.lower()
    if ext in [".txt", ".md", ".csv"]:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    elif ext == ".pdf":
        text_content = []
        try:
            reader = pypdf.PdfReader(str(path))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content.append(extracted)
            return "\n\n".join(text_content)
        except Exception as e:
            return f"[Error parsing PDF: {str(e)}]"

    return ""

def analyze_image_properties(file_path: str) -> Dict[str, Any]:
    """
    Extracts image metadata, dimensions, and dominant color palette.
    """
    path = Path(file_path)
    if not path.exists():
        return {}

    try:
        with Image.open(str(path)) as img:
            width, height = img.size
            format_name = img.format
            
            # Convert to RGB to extract dominant colors
            rgb_img = img.convert("RGB")
            # Resize for fast color quantization
            small_img = rgb_img.resize((50, 50))
            colors = small_img.getcolors(maxcolors=2500)
            
            dominant_hexes = []
            if colors:
                # Sort by count descending
                sorted_colors = sorted(colors, key=lambda x: x[0], reverse=True)
                for count, col in sorted_colors[:5]:
                    hex_val = "#{:02x}{:02x}{:02x}".format(col[0], col[1], col[2]).upper()
                    dominant_hexes.append(hex_val)

            return {
                "width": width,
                "height": height,
                "aspect_ratio": round(width / height, 2) if height > 0 else 1.0,
                "format": format_name,
                "dominant_colors": dominant_hexes
            }
    except Exception as e:
        return {"error": str(e)}

