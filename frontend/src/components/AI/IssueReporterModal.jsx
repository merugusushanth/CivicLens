import React, { useState } from 'react';
import { Upload, X, Sparkles, MapPin, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { classifyImage, createIssue, isValidCoordinates } from '../../services/api';

export default function IssueReporterModal({ isOpen, onClose, onIssueCreated, onRequestMapPicker }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [severity, setSeverity] = useState(3);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Hyderabad, Telangana');
  const [location, setLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Run AI Classification
    setIsAnalyzing(true);
    try {
      const result = await classifyImage(selectedFile);
      setAiPrediction(result);
      setCategory(result.category);
      setSeverity(result.severity || 4);
      setTitle(`${result.category} Reported`);
      setDescription(`Automated AI vision classified ${result.category.toLowerCase()} hazard with ${Math.round((result.confidence || 0.9) * 100)}% confidence.`);
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidCoordinates(location.lat, location.lng)) {
      setErrorMsg('Invalid map coordinates. Please click on the map or enter valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }

    setIsSubmitting(true);

    const issueData = {
      title: title || `${category} Issue`,
      category,
      severity: parseInt(severity, 10),
      status: 'Pending',
      confidence: aiPrediction ? aiPrediction.confidence : 0.92,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lng),
      address: address || 'Telangana, India',
      description,
      image_url: previewUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      ai_tags: aiPrediction?.tags || ["ai_classified", category.toLowerCase().replace(/\s+/g, '_')]
    };

    try {
      const newIssue = await createIssue(issueData);
      if (onIssueCreated) onIssueCreated(newIssue);
      onClose();
    } catch (error) {
      setErrorMsg(error.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Report Civic Issue with AI</h3>
              <p className="text-xs text-slate-400">Upload a photo & pick defect location on map</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Dropzone & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Issue Photo & AI Scanner</label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl bg-slate-900/50 cursor-pointer transition-all hover:bg-slate-900">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <Upload className="w-8 h-8 text-sky-400 mb-2 animate-bounce" />
                  <p className="text-sm font-medium text-slate-200">Click or drag photo to scan with AI Vision</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 h-48 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                
                {/* AI Analyzing Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                    <p className="text-xs font-semibold text-sky-300 animate-pulse">Running PyTorch Vision Classifier...</p>
                  </div>
                )}

                {/* Change photo button */}
                <label className="absolute bottom-3 right-3 px-3 py-1 bg-slate-950/80 hover:bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded-lg cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* AI Result Card */}
          {aiPrediction && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-indigo-950/40 border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" /> AI Classification Match
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {Math.round((aiPrediction.confidence || 0.95) * 100)}% Match
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Detected Category:</span>
                  <p className="font-semibold text-slate-100">{aiPrediction.category}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assessed Severity:</span>
                  <p className="font-semibold text-amber-400">{aiPrediction.severity}/5 Hazard Level</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Report Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hazardous Pothole on HITEC City Rd"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="Pothole">Pothole</option>
                <option value="Garbage Accumulation">Garbage Accumulation</option>
                <option value="Damaged Streetlight">Damaged Streetlight</option>
                <option value="Waterlogging / Flooding">Waterlogging / Flooding</option>
                <option value="Broken Sidewalk / Pavement">Broken Sidewalk / Pavement</option>
                <option value="Graffiti / Vandalism">Graffiti / Vandalism</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Rating (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Minor)</span>
                <span className="font-bold text-sky-400">{severity}</span>
                <span>5 (Critical)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. HITEC City, Hyderabad, Telangana"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Interactive Coordinates & Map Picker Trigger */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" /> Issue Location Coordinates
              </span>
              {onRequestMapPicker && (
                <button
                  type="button"
                  onClick={onRequestMapPicker}
                  className="px-2.5 py-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-lg hover:bg-sky-500/20 transition-all flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Pick Location on Map
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Latitude (N)</span>
                <input
                  type="number"
                  step="any"
                  value={location.lat}
                  onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Longitude (E)</span>
                <input
                  type="number"
                  step="any"
                  value={location.lng}
                  onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg font-mono text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Field Notes</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details regarding cause, traffic impact, or hazard risks..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAnalyzing}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Civic Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
