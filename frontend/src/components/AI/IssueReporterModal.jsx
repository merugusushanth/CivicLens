import React, { useState } from 'react';
import { Upload, X, Shield, MapPin, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-sky-950 border border-sky-800 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submit Infrastructure Grievance Report</h3>
              <p className="text-xs text-slate-400">Upload defect photo & verify AI classification metadata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded bg-red-950 border border-red-800 text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Dropzone & Preview */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Defect Photo & Image Classifier</label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 hover:border-sky-600 rounded-lg bg-slate-950 cursor-pointer transition-colors">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Upload className="w-6 h-6 text-sky-400 mb-2" />
                  <p className="font-medium text-slate-200">Click or drag photo to upload</p>
                  <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP formats supported</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 h-44 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
                    <p className="text-xs font-medium text-sky-300">Processing Vision Classifier...</p>
                  </div>
                )}

                <label className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 rounded cursor-pointer font-medium">
                  Change Image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* AI Result Banner */}
          {aiPrediction && (
            <div className="p-3.5 rounded bg-slate-950 border border-sky-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sky-400" /> AI Classification Match Result
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                  {Math.round((aiPrediction.confidence || 0.95) * 100)}% Confidence
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Category:</span>
                  <p className="font-semibold text-slate-100">{aiPrediction.category}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assessed Hazard Level:</span>
                  <p className="font-semibold text-amber-400">{aiPrediction.severity}/5 Severity</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Issue Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hazardous Pothole on HITEC City Rd"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Defect Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-sky-500"
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
              <label className="block font-semibold text-slate-300 mb-1">Severity Rating (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full accent-sky-500 mt-1"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Minor)</span>
                <span className="font-bold text-sky-400">{severity}</span>
                <span>5 (Critical)</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Address / Location Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. HITEC City, Hyderabad, Telangana"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Interactive Coordinates & Map Picker Trigger */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" /> Geographic Coordinates
              </span>
              {onRequestMapPicker && (
                <button
                  type="button"
                  onClick={onRequestMapPicker}
                  className="px-2.5 py-1 text-[11px] font-semibold text-sky-400 bg-sky-950 border border-sky-800 rounded hover:bg-sky-900 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Select Pin on Map
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Latitude (°N)</span>
                <input
                  type="number"
                  step="any"
                  value={location.lat}
                  onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Longitude (°E)</span>
                <input
                  type="number"
                  step="any"
                  value={location.lng}
                  onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded font-mono text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description & Field Notes</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details regarding cause, traffic impact, or hazard risks..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAnalyzing}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
