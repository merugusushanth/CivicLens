# CivicLens
AI-Powered Urban Infrastructure Tracking and Spatial Clustering System

CivicLens is a full-stack smart city platform designed to automatically categorize, geolocate, cluster, and track urban infrastructure defects—such as potholes, accumulated garbage, broken streetlights, waterlogging, and damaged sidewalks—using computer vision and spatial GIS technology.

---

## Key Features

- 🤖 **AI Vision Classifier**: Upload or snap a photo of an issue; PyTorch model auto-classifies category, confidence level, and severity.
- 🗺️ **Interactive Leaflet Spatial Map**: View reported civic defects on dynamic maps with custom status markers, density heatmaps, and spatial cluster detection.
- 📊 **City Official Analytics Dashboard**: Real-time stats on resolution rates, spatial hotspot clusters, and issue priority queues.
- ⚡ **FastAPI High-Performance Backend**: RESTful APIs with GeoJSON support, spatial range queries, and async database integration.
- 🗄️ **PostgreSQL + PostGIS Ready**: Production-grade spatial database indexing (`ST_DWithin`, `ST_ClusterDBSCAN`) with local dev database support.

---

## Project Structure

```
CivicLens/
├── backend/                  # Python FastAPI, PyTorch AI Classifier, Spatial Engine
│   ├── app/
│   │   ├── api/              # Issues, AI Classifier, Analytics routes
│   │   ├── db/               # SQLAlchemy Models & GeoJSON schemas
│   │   ├── services/         # PyTorch Vision AI classifier & Spatial Clustering
│   │   └── main.py           # FastAPI entrypoint
│   ├── requirements.txt      # Python dependencies
│   └── seed_data.py          # Spatial mock data generator
└── frontend/                 # React, Vite, Tailwind CSS, Leaflet Maps
    ├── src/
    │   ├── components/       # CivicMap, IssueReporterModal, AnalyticsOverview
    │   ├── services/         # Axios API Client
    │   ├── App.jsx           # Main Application Layout
    │   └── main.jsx          # Entrypoint
    ├── tailwind.config.js    # Custom CivicLens Design System
    └── package.json
```

---

## Quick Start

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Unix:
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
