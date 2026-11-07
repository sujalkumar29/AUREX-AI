from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_parser import (
    save_uploaded_file,
    extract_text_from_file,
    analyze_image_properties
)

router = APIRouter(prefix="/upload", tags=["File Upload & Ingestion"])

@router.post("")
async def upload_file(file: UploadFile = File(...)):
    try:
        saved_path, file_url, content_type = await save_uploaded_file(file)
        
        extracted_text = ""
        image_meta = {}

        if content_type in ["text", "pdf"]:
            extracted_text = extract_text_from_file(saved_path)
        elif content_type == "image":
            image_meta = analyze_image_properties(saved_path)

        return {
            "filename": file.filename,
            "content_type": content_type,
            "file_path": saved_path,
            "file_url": file_url,
            "extracted_text": extracted_text,
            "image_metadata": image_meta
        }
    except HTTPException:
        # Re-raise HTTPExceptions (such as 400 for unsupported extension or oversized file)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {str(e)}")
