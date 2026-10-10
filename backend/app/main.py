from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.issues import router as issues_router
from app.api.ai import router as ai_router
from app.api.analytics import router as analytics_router

app = FastAPI(
    title="CivicLens API",
    description="AI-Powered Urban Infrastructure Tracking and Spatial Clustering System API",
    version="1.0.0"
)

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(issues_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CivicLens AI Vision & Spatial Backend",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "spatial_db": "PostGIS Ready",
        "ai_vision": "PyTorch Active"
    }
