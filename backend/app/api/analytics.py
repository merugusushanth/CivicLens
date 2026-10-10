from fastapi import APIRouter
from app.api.issues import SEED_ISSUES

router = APIRouter(prefix="/analytics", tags=["Analytics & Spatial Hotspots"])

@router.get("/summary")
def get_analytics_summary():
    total = len(SEED_ISSUES)
    pending = len([i for i in SEED_ISSUES if i["status"] == "Pending"])
    in_progress = len([i for i in SEED_ISSUES if i["status"] == "In Progress"])
    resolved = len([i for i in SEED_ISSUES if i["status"] == "Resolved"])
    
    categories = {}
    for issue in SEED_ISSUES:
        cat = issue["category"]
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_issues": total,
        "pending_count": pending,
        "in_progress_count": in_progress,
        "resolved_count": resolved,
        "avg_ai_confidence": 0.93,
        "resolution_rate_percent": round((resolved / max(total, 1)) * 100),
        "category_breakdown": categories,
        "hotspots_detected": [
            {
                "cluster_name": "Cyberabad / HITEC City Corridor",
                "center": [17.4435, 78.3772],
                "count": 2,
                "dominant_hazard": "Pothole"
            },
            {
                "cluster_name": "Charminar Old City Cluster",
                "center": [17.3616, 78.4747],
                "count": 1,
                "dominant_hazard": "Garbage Accumulation"
            },
            {
                "cluster_name": "Warangal Highway Zone",
                "center": [17.9689, 79.5941],
                "count": 1,
                "dominant_hazard": "Road Erosion"
            }
        ]
    }
