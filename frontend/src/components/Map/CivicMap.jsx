import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Tag, Sparkles, Compass, LocateFixed, Shield } from 'lucide-react';
import indiaBoundary from '../../data/indiaBoundary.json';

// Custom SVG map marker generator (clean, high-contrast municipal pins)
const createCustomIcon = (category, severity, status) => {
  let color = '#0284c7'; // default municipal blue
  if (status === 'Resolved') color = '#16a34a'; // green
  else if (severity >= 5 || category === 'Pothole') color = '#dc2626'; // red hazard
  else if (severity === 4) color = '#ea580c'; // orange
  else if (severity === 3) color = '#d97706'; // yellow

  const svgHtml = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 26px; height: 26px; border-radius: 50%; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 11px;">
        ${severity}
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

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
  const HYDERABAD_CENTER = [17.3850, 78.4867];
  const INDIA_CENTER = [20.5937, 78.9629];
  
  const [viewState, setViewState] = useState({ center: HYDERABAD_CENTER, zoom: 11 });
  const [showBoundary, setShowBoundary] = useState(true);

  const handleFocusHyderabad = () => {
    setViewState({ center: HYDERABAD_CENTER, zoom: 11 });
  };

  const handleResetToIndia = () => {
    setViewState({ center: INDIA_CENTER, zoom: 5 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] rounded-xl overflow-hidden border border-slate-800 shadow-sm bg-slate-950">
      
      {/* Location Picker Banner Overlay */}
      {isSelectingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 border border-sky-600 px-5 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 text-sky-400 text-xs font-semibold">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>Click anywhere on the map to place issue location marker</span>
        </div>
      )}

      {/* Map View Control Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-2 text-xs">
        <button
          onClick={handleFocusHyderabad}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-sm flex items-center space-x-1.5 font-medium transition-colors"
          title="Zoom to Hyderabad, Telangana"
        >
          <LocateFixed className="w-3.5 h-3.5 text-sky-400" />
          <span>Hyderabad View</span>
        </button>

        <button
          onClick={handleResetToIndia}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 shadow-sm flex items-center space-x-1.5 font-medium transition-colors"
          title="Zoom to National View of India"
        >
          <Compass className="w-3.5 h-3.5 text-slate-300" />
          <span>India View</span>
        </button>

        <button
          onClick={() => setShowBoundary(!showBoundary)}
          className={`px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg border shadow-sm flex items-center space-x-1.5 font-medium transition-colors ${
            showBoundary ? 'text-sky-400 border-sky-700' : 'text-slate-400 border-slate-800'
          }`}
          title="Toggle National Boundary Overlay"
        >
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Border Overlay</span>
        </button>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={HYDERABAD_CENTER}
        zoom={11}
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
              weight: 3,
              opacity: 0.9,
              fillColor: '#38bdf8',
              fillOpacity: 0.05,
              dashArray: '5, 5'
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
                {issue.image_url && (
                  <div className="relative h-28 w-full mb-2 rounded border border-slate-700 bg-slate-950 overflow-hidden">
                    <img
                      src={issue.image_url}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-sky-400 border border-slate-700">
                      {Math.round((issue.confidence || 0.9) * 100)}% Match
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-100 leading-snug">{issue.title}</h4>
                  <span className={`px-2 py-0.5 text-[10px] rounded font-semibold border ${
                    issue.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                    issue.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                    'bg-rose-950 text-rose-400 border-rose-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-1.5">{issue.address}</p>
                <p className="text-xs text-slate-300 mb-2 leading-tight">{issue.description}</p>

                {onUpdateStatus && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Severity: <strong className="text-slate-200">{issue.severity}/5</strong></span>
                    <button
                      onClick={() => onUpdateStatus(issue.id, issue.status === 'Resolved' ? 'Pending' : 'Resolved')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-medium border border-slate-700 transition-colors"
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
      <div className="absolute bottom-6 right-6 z-[999] bg-slate-900/95 p-3.5 rounded-lg border border-slate-800 text-xs w-60 shadow-lg">
        <h5 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5 text-xs">
          <Tag className="w-3.5 h-3.5 text-sky-400" /> Defect Classification Scale
        </h5>
        <div className="space-y-1 text-slate-300 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Level 5 (Pothole / High Hazard)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Level 4 (Waterlogging)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Level 3 (Waste Accumulation)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Level 2 (Pavement Lift)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> Resolved Issue</span>
          </div>
        </div>
      </div>

    </div>
  );
}
