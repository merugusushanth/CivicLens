from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import datetime

router = APIRouter(prefix="/issues", tags=["Issues"])

# In-Memory Spatial Issue Repository with India / Telangana sample coordinates
SEED_ISSUES = [
    {
        "id": "iss-101",
        "title": "Hazardous Pothole on HITEC City Main Rd",
        "category": "Pothole",
        "severity": 4,
        "status": "Pending",
        "confidence": 0.94,
        "latitude": 17.4435,
        "longitude": 78.3772,
        "address": "HITEC City Main Rd, Cyberabad, Hyderabad, Telangana",
        "description": "Deep asphalt crater near Cyber Towers causing severe traffic slowdown and commuter rim damage risk.",
        "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-10T14:30:00Z",
        "ai_tags": ["asphalt_crack", "vehicle_hazard", "high_depth"]
    },
    {
        "id": "iss-102",
        "title": "Overflowing Waste Bin at Charminar Plaza",
        "category": "Garbage Accumulation",
        "severity": 3,
        "status": "In Progress",
        "confidence": 0.89,
        "latitude": 17.3616,
        "longitude": 78.4747,
        "address": "Charminar Pedestrian Zone, Old City, Hyderabad, Telangana",
        "description": "Excess commercial waste spilling onto historic pedestrian walkway near transit stop.",
        "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-10T11:15:00Z",
        "ai_tags": ["overflow", "plastics", "sanitation_risk"]
    },
    {
        "id": "iss-103",
        "title": "Non-Functional Streetlight at Banjara Hills",
        "category": "Damaged Streetlight",
        "severity": 5,
        "status": "Pending",
        "confidence": 0.92,
        "latitude": 17.4156,
        "longitude": 78.4347,
        "address": "Road No. 12, Banjara Hills, Hyderabad, Telangana",
        "description": "Damaged luminaire fixture causing complete pitch black bend at night near residential junction.",
        "image_url": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-09T22:45:00Z",
        "ai_tags": ["electrical_hazard", "dark_intersection"]
    },
    {
        "id": "iss-104",
        "title": "Storm Drain Waterlogging at Gachibowli",
        "category": "Waterlogging / Flooding",
        "severity": 4,
        "status": "Resolved",
        "confidence": 0.96,
        "latitude": 17.4401,
        "longitude": 78.3489,
        "address": "Gachibowli ORR Underpass, Hyderabad, Telangana",
        "description": "Clogged catch basin resulting in 8-inch standing rainwater accumulation after monsoonal downpour.",
        "image_url": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-08T09:20:00Z",
        "ai_tags": ["drain_blockage", "pedestrian_obstacle"]
    },
    {
        "id": "iss-105",
        "title": "Buckled Sidewalk Pavement in Secunderabad",
        "category": "Broken Sidewalk / Pavement",
        "severity": 2,
        "status": "Pending",
        "confidence": 0.88,
        "latitude": 17.4334,
        "longitude": 78.5017,
        "address": "Station Road, Near Secunderabad Junction, Telangana",
        "description": "Tree root expansion raised concrete walkway slabs, creating trip hazard for train commuters.",
        "image_url": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-10T08:00:00Z",
        "ai_tags": ["pavement_lift", "ada_compliance_risk"]
    },
    {
        "id": "iss-106",
        "title": "Road Erosion on Hunter Road, Warangal",
        "category": "Pothole",
        "severity": 3,
        "status": "Pending",
        "confidence": 0.91,
        "latitude": 17.9689,
        "longitude": 79.5941,
        "address": "Hunter Road, Hanamkonda, Warangal, Telangana",
        "description": "Severe asphalt shoulder erosion along state highway corridor.",
        "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
        "created_at": "2026-10-10T06:30:00Z",
        "ai_tags": ["highway_erosion", "shoulder_hazard"]
    }
]

class IssueCreateSchema(BaseModel):
    title: str
    category: str
    severity: int = Field(ge=1, le=5)
    latitude: float = Field(ge=-90.0, le=90.0)
    longitude: float = Field(ge=-180.0, le=180.0)
    address: str
    description: str
    image_url: Optional[str] = None
    ai_tags: Optional[List[str]] = []
    confidence: Optional[float] = 0.90

@router.get("", response_model=List[dict])
def get_all_issues(status: Optional[str] = None, category: Optional[str] = None):
    results = SEED_ISSUES
    if status:
        results = [i for i in results if i["status"].lower() == status.lower()]
    if category:
        results = [i for i in results if category.lower() in i["category"].lower()]
    return results

@router.get("/geojson")
def get_geojson_feature_collection():
    """
    Returns RFC 7946 GeoJSON FeatureCollection compatible with Leaflet & Mapbox.
    Coordinates order: [longitude, latitude] per RFC 7946 specification.
    """
    features = []
    for issue in SEED_ISSUES:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [issue["longitude"], issue["latitude"]]
            },
            "properties": {
                "id": issue["id"],
                "title": issue["title"],
                "category": issue["category"],
                "severity": issue["severity"],
                "status": issue["status"],
                "confidence": issue["confidence"],
                "address": issue["address"],
                "image_url": issue["image_url"]
            }
        })
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.post("", response_model=dict)
def create_new_issue(payload: IssueCreateSchema):
    new_id = f"iss-{len(SEED_ISSUES) + 101}"
    new_issue = {
        "id": new_id,
        "title": payload.title,
        "category": payload.category,
        "severity": payload.severity,
        "status": "Pending",
        "confidence": payload.confidence,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "address": payload.address,
        "description": payload.description,
        "image_url": payload.image_url,
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        "ai_tags": payload.ai_tags
    }
    SEED_ISSUES.insert(0, new_issue)
    return new_issue

@router.patch("/{issue_id}/status")
def update_issue_status(issue_id: str, status: str):
    for issue in SEED_ISSUES:
        if issue["id"] == issue_id:
            issue["status"] = status
            return issue
    raise HTTPException(status_code=404, detail="Issue not found")
