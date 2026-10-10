import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper for coordinate validation (latitude between -90 and 90, longitude between -180 and 180)
export const isValidCoordinates = (lat, lng) => {
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return !isNaN(numLat) && !isNaN(numLng) && numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180;
};

// Realistic sample dataset for Hyderabad & Telangana, India
export const MOCK_ISSUES = [
  {
    id: "iss-101",
    title: "Hazardous Pothole on HITEC City Main Rd",
    category: "Pothole",
    severity: 4,
    status: "Pending",
    confidence: 0.94,
    latitude: 17.4435,
    longitude: 78.3772,
    address: "HITEC City Main Rd, Cyberabad, Hyderabad, Telangana",
    description: "Deep asphalt crater near Cyber Towers causing severe traffic slowdown and commuter rim damage risk.",
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-10T14:30:00Z",
    ai_tags: ["asphalt_crack", "vehicle_hazard", "high_depth"]
  },
  {
    id: "iss-102",
    title: "Overflowing Waste Bin at Charminar Plaza",
    category: "Garbage Accumulation",
    severity: 3,
    status: "In Progress",
    confidence: 0.89,
    latitude: 17.3616,
    longitude: 78.4747,
    address: "Charminar Pedestrian Zone, Old City, Hyderabad, Telangana",
    description: "Excess commercial waste spilling onto historic pedestrian walkway near transit stop.",
    image_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-10T11:15:00Z",
    ai_tags: ["overflow", "plastics", "sanitation_risk"]
  },
  {
    id: "iss-103",
    title: "Non-Functional Streetlight at Banjara Hills",
    category: "Damaged Streetlight",
    severity: 5,
    status: "Pending",
    confidence: 0.92,
    latitude: 17.4156,
    longitude: 78.4347,
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana",
    description: "Damaged luminaire fixture causing complete pitch black bend at night near residential junction.",
    image_url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-09T22:45:00Z",
    ai_tags: ["electrical_hazard", "dark_intersection"]
  },
  {
    id: "iss-104",
    title: "Storm Drain Waterlogging at Gachibowli",
    category: "Waterlogging / Flooding",
    severity: 4,
    status: "Resolved",
    confidence: 0.96,
    latitude: 17.4401,
    longitude: 78.3489,
    address: "Gachibowli ORR Underpass, Hyderabad, Telangana",
    description: "Clogged catch basin resulting in 8-inch standing rainwater accumulation after monsoonal downpour.",
    image_url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-08T09:20:00Z",
    ai_tags: ["drain_blockage", "pedestrian_obstacle"]
  },
  {
    id: "iss-105",
    title: "Buckled Sidewalk Pavement in Secunderabad",
    category: "Broken Sidewalk / Pavement",
    severity: 2,
    status: "Pending",
    confidence: 0.88,
    latitude: 17.4334,
    longitude: 78.5017,
    address: "Station Road, Near Secunderabad Junction, Telangana",
    description: "Tree root expansion raised concrete walkway slabs, creating trip hazard for train commuters.",
    image_url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-10T08:00:00Z",
    ai_tags: ["pavement_lift", "ada_compliance_risk"]
  },
  {
    id: "iss-106",
    title: "Road Erosion on Hunter Road, Warangal",
    category: "Pothole",
    severity: 3,
    status: "Pending",
    confidence: 0.91,
    latitude: 17.9689,
    longitude: 79.5941,
    address: "Hunter Road, Hanamkonda, Warangal, Telangana",
    description: "Severe asphalt shoulder erosion along state highway corridor.",
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-10-10T06:30:00Z",
    ai_tags: ["highway_erosion", "shoulder_hazard"]
  }
];

export const getIssues = async () => {
  try {
    const response = await apiClient.get('/issues');
    return response.data;
  } catch (error) {
    console.warn('Backend server offline, falling back to local dataset.', error.message);
    return MOCK_ISSUES;
  }
};

export const createIssue = async (issueData) => {
  if (!isValidCoordinates(issueData.latitude, issueData.longitude)) {
    throw new Error(`Invalid geographic coordinates: lat=${issueData.latitude}, lng=${issueData.longitude}`);
  }

  try {
    const response = await apiClient.post('/issues', issueData);
    return response.data;
  } catch (error) {
    console.warn('Backend offline, saving locally to active session.', error.message);
    const newIssue = {
      id: `iss-${Date.now()}`,
      ...issueData,
      created_at: new Date().toISOString(),
      status: 'Pending'
    };
    MOCK_ISSUES.unshift(newIssue);
    return newIssue;
  }
};

export const classifyImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await apiClient.post('/ai/classify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn('Backend AI service offline, using client-side AI Vision Simulation.', error.message);
    
    const categories = [
      { category: "Pothole", confidence: 0.95, severity: 4, tags: ["asphalt_damage", "road_safety"] },
      { category: "Garbage Accumulation", confidence: 0.91, severity: 3, tags: ["waste_management", "overflow"] },
      { category: "Damaged Streetlight", confidence: 0.89, severity: 5, tags: ["lighting_failure", "dark_street"] },
      { category: "Waterlogging / Flooding", confidence: 0.94, severity: 4, tags: ["water_accumulation", "drainage"] },
      { category: "Broken Sidewalk / Pavement", confidence: 0.87, severity: 2, tags: ["pedestrian_danger", "crack"] }
    ];
    
    const result = categories[Math.floor(Math.random() * categories.length)];
    return {
      success: true,
      ...result,
      detected_features: ["high_contrast_edges", "surface_irregularity", "localized_hazard"]
    };
  }
};

export const getAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics/summary');
    return response.data;
  } catch (error) {
    const total = MOCK_ISSUES.length;
    const pending = MOCK_ISSUES.filter(i => i.status === 'Pending').length;
    const inProgress = MOCK_ISSUES.filter(i => i.status === 'In Progress').length;
    const resolved = MOCK_ISSUES.filter(i => i.status === 'Resolved').length;

    return {
      total_issues: total,
      pending_count: pending,
      in_progress_count: inProgress,
      resolved_count: resolved,
      avg_ai_confidence: 0.92,
      resolution_rate_percent: Math.round((resolved / total) * 100),
      category_breakdown: {
        "Pothole": 2,
        "Garbage Accumulation": 1,
        "Damaged Streetlight": 1,
        "Waterlogging / Flooding": 1,
        "Broken Sidewalk / Pavement": 1
      }
    };
  }
};
