import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, Layers, MapPin, Activity, Shield } from 'lucide-react';

export default function AnalyticsOverview({ analytics, issues }) {
  const stats = analytics || {
    total_issues: issues.length,
    pending_count: issues.filter(i => i.status === 'Pending').length,
    in_progress_count: issues.filter(i => i.status === 'In Progress').length,
    resolved_count: issues.filter(i => i.status === 'Resolved').length,
    avg_ai_confidence: 0.93,
    resolution_rate_percent: 20,
  };

  const categories = [
    { name: "Potholes & Surface Hazards", count: issues.filter(i => i.category === 'Pothole').length, color: "bg-red-500", text: "text-red-400" },
    { name: "Garbage & Waste Overflow", count: issues.filter(i => i.category === 'Garbage Accumulation').length, color: "bg-amber-500", text: "text-amber-400" },
    { name: "Damaged Streetlights", count: issues.filter(i => i.category === 'Damaged Streetlight').length, color: "bg-yellow-500", text: "text-yellow-400" },
    { name: "Waterlogging & Drainage", count: issues.filter(i => i.category === 'Waterlogging / Flooding').length, color: "bg-sky-500", text: "text-sky-400" },
    { name: "Broken Sidewalks", count: issues.filter(i => i.category.includes('Sidewalk')).length, color: "bg-indigo-500", text: "text-indigo-400" }
  ];

  return (
    <div className="space-y-6 p-2">
      
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Tracked Defects */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tracked Issues</span>
            <div className="p-1.5 rounded bg-slate-800 text-slate-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white font-mono">{issues.length}</h3>
            <span className="text-xs text-slate-400">Greater Hyderabad</span>
          </div>
        </div>

        {/* Metric 2: AI Classifier Match */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Classifier Match</span>
            <div className="p-1.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white font-mono">
              {Math.round((stats.avg_ai_confidence || 0.93) * 100)}%
            </h3>
            <span className="text-[11px] text-sky-400 font-mono">
              PyTorch MobileNetV3
            </span>
          </div>
        </div>

        {/* Metric 3: Resolution Rate */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white font-mono">
              {Math.round((issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100)}%
            </h3>
            <span className="text-xs text-slate-400">
              {issues.filter(i => i.status === 'Resolved').length} resolved
            </span>
          </div>
        </div>

        {/* Metric 4: Priority Action Hazards */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level 5 Hazards</span>
            <div className="p-1.5 rounded bg-red-950 text-red-400 border border-red-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white font-mono">
              {issues.filter(i => i.severity >= 5).length}
            </h3>
            <span className="text-xs text-red-400 font-medium">Priority Queue</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Status Pipeline & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Pipeline Card */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm lg:col-span-1 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" /> Resolution Pipeline
          </h4>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Pending ({issues.filter(i => i.status === 'Pending').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'Pending').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(issues.filter(i => i.status === 'Pending').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> In Progress ({issues.filter(i => i.status === 'In Progress').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'In Progress').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(issues.filter(i => i.status === 'In Progress').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resolved ({issues.filter(i => i.status === 'Resolved').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm lg:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Infrastructure Category Distribution</span>
            <span className="text-xs font-normal text-slate-400">PostGIS Spatial Query Engine</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <span className="text-xs font-medium text-slate-300">{cat.name}</span>
                </div>
                <span className={`text-xs font-bold font-mono ${cat.text}`}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Spatial Issue Feed Table */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Geo-Tagged Grievance Log</span>
          <span className="text-xs font-mono text-slate-400">RFC 7946 GeoJSON</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Title & Category</th>
                <th className="p-3">Location Address</th>
                <th className="p-3">Severity</th>
                <th className="p-3">AI Match</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-slate-100">{issue.title}</div>
                    <div className="text-[11px] text-slate-400">{issue.category}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate max-w-xs">{issue.address}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {issue.latitude.toFixed(4)}° N, {issue.longitude.toFixed(4)}° E
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      issue.severity >= 5 ? 'bg-red-950 text-red-400 border border-red-800' :
                      issue.severity === 4 ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      Sev {issue.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sky-400">
                    {Math.round((issue.confidence || 0.9) * 100)}%
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                      issue.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      issue.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
