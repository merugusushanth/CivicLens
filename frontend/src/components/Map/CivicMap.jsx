import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, CheckCircle2, Clock, MapPin, Tag, Sparkles, AlertTriangle, ShieldCheck, Compass, LocateFixed, Shield } from 'lucide-react';
import indiaBoundary from '../../data/indiaBoundary.json';

// Custom SVG map marker generator
const createCustomIcon = (category, severity, status) => {
  let color = '#3b82f6'; // default blue
  if (status === 'Resolved') color = '#22c55e';
  else if (severity >= 5 || category === 'Pothole') color = '#ef4444';
  else if (severity === 4) color = '#f97316';
  else if (severity === 3) color = '#eab308';

  const svgHtml = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${color}; opacity: 0.25; animation: pulse 2s infinite;"></div>
      <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
        ${severity}
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Component to handle map center and zoom updates dynamically
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Component to handle pin location selection when reporting
function LocationPicker({ isSelectingLocation, onLocationSelected }) {
  useMapEvents({
    click(e) {
      if (isSelectingLocation && onLocationSelected) {
        onLocationSelected(e.latlng);
      }
    }
  });
  return null;
}

export default function CivicMap({ issues, selectedLocation, isSelectingLocation, onLocationSelected, onUpdateStatus }) {
  // Official Geographic Center of India (Nagpur / India Center)
  const INDIA_CENTER = [20.5937, 78.9629];
  const HYDERABAD_CENTER = [17.3850, 78.4867];
  
  const [viewState, setViewState] = useState({ center: INDIA_CENTER, zoom: 5 });
  const [showBoundary, setShowBoundary] = useState(true);

  const handleResetToIndia = () => {
    setViewState({ center: INDIA_CENTER, zoom: 5 });
  };

  const handleFocusTelangana = () => {
    setViewState({ center: HYDERABAD_CENTER, zoom: 10 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Location Picker Banner Overlay */}
      {isSelectingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] glass-panel px-6 py-3 rounded-full border border-sky-500/40 shadow-xl flex items-center space-x-3 text-sky-400 text-sm font-medium animate-bounce">
          <MapPin className="w-5 h-5 text-sky-400" />
          <span>Click anywhere on the map of India to set issue coordinates</span>
        </div>
      )}

      {/* Map Control Quick Actions Header Bar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-2">
        <button
          onClick={() => setShowBoundary(!showBoundary)}
          className={`px-3.5 py-2 glass-panel rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105 ${
            showBoundary ? 'text-sky-400 border-sky-500/40' : 'text-slate-400'
          }`}
          title="Toggle Official National Boundary of India"
        >
          <Shield className="w-4 h-4 text-sky-400" />
          <span>Official Border</span>
        </button>

        <button
          onClick={handleResetToIndia}
          className="px-3.5 py-2 glass-panel hover:bg-slate-900 text-white rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105"
          title="Zoom out to Full Map of India"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>India View</span>
        </button>

        <button
          onClick={handleFocusTelangana}
          className="px-3.5 py-2 glass-panel hover:bg-slate-900 text-white rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105"
          title="Zoom into Hyderabad & Telangana"
        >
          <LocateFixed className="w-4 h-4 text-emerald-400" />
          <span>Telangana View</span>
        </button>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Official Sovereign Boundary Overlay of India */}
        {showBoundary && (
          <GeoJSON
            data={indiaBoundary}
            style={{
              color: '#0284c7',
              weight: 3.5,
              opacity: 0.95,
              fillColor: '#38bdf8',
              fillOpacity: 0.08,
              dashArray: '6, 6'
            }}
          />
        )}

        <MapRecenter center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : viewState.center} zoom={viewState.zoom} />
        <LocationPicker isSelectingLocation={isSelectingLocation} onLocationSelected={onLocationSelected} />

        {/* Selected Geotag Marker preview when reporting */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createCustomIcon('Selected', 5, 'Pending')}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <p className="font-semibold text-sky-400">Selected Location</p>
                <p className="text-slate-300">{selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render Civic Issue Markers */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={createCustomIcon(issue.category, issue.severity, issue.status)}
          >
            <Popup>
              <div className="p-2 max-w-xs font-sans">
                {/* Image Thumbnail */}
                {issue.image_url && (
                  <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900">
                    <img
                      src={issue.image_url}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-mono text-sky-400 border border-sky-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{Math.round((issue.confidence || 0.9) * 100)}% AI</span>
                    </div>
                  </div>
                )}

                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-100 leading-tight">{issue.title}</h4>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold border ${
                    issue.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    issue.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {issue.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2">{issue.address || "Geo-tagged coordinate location"}</p>
                <p className="text-xs text-slate-300 mb-3 line-clamp-2">{issue.description}</p>

                {/* AI Tags */}
                {issue.ai_tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {issue.ai_tags.map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Action Status Updater */}
                {onUpdateStatus && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Severity: <strong className="text-sky-400">{issue.severity}/5</strong></span>
                    <button
                      onClick={() => onUpdateStatus(issue.id, issue.status === 'Resolved' ? 'Pending' : 'Resolved')}
                      className="px-2.5 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-semibold transition-all"
                    >
                      Mark {issue.status === 'Resolved' ? 'Pending' : 'Resolved'}
                    </button>
                  </div>
                )}

              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Map Legend Floating Widget */}
      <div className="absolute bottom-6 right-6 z-[999] glass-panel p-4 rounded-xl border border-slate-800 text-xs w-64 shadow-2xl">
        <h5 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-sky-400" /> Legend & Severity Scale
        </h5>
        <div className="space-y-1.5 text-slate-300 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Hazard (Sev 5 / Pothole)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (Sev 3-4)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Minor / Infrastructure</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved Issue</span>
          </div>
        </div>
      </div>

    </div>
  );
}
