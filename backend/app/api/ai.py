from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.classifier import classifier_service

router = APIRouter(prefix="/ai", tags=["AI Vision Classifier"])

@router.post("/classify")
async def classify_infrastructure_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (PNG, JPG, WEBP).")

    contents = await file.read()
    result = classifier_service.classify(contents)
    return result
