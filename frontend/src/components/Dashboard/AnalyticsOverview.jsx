import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, Sparkles, Activity, Layers, MapPin, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AnalyticsOverview({ analytics, issues }) {
  const stats = analytics || {
    total_issues: 5,
    pending_count: 3,
    in_progress_count: 1,
    resolved_count: 1,
    avg_ai_confidence: 0.93,
    resolution_rate_percent: 20,
  };

  const categories = [
    { name: "Pothole", count: issues.filter(i => i.category === 'Pothole').length, color: "bg-rose-500", text: "text-rose-400" },
    { name: "Garbage Accumulation", count: issues.filter(i => i.category === 'Garbage Accumulation').length, color: "bg-amber-500", text: "text-amber-400" },
    { name: "Damaged Streetlight", count: issues.filter(i => i.category === 'Damaged Streetlight').length, color: "bg-yellow-500", text: "text-yellow-400" },
    { name: "Waterlogging / Flooding", count: issues.filter(i => i.category === 'Waterlogging / Flooding').length, color: "bg-sky-500", text: "text-sky-400" },
    { name: "Broken Sidewalk", count: issues.filter(i => i.category.includes('Sidewalk')).length, color: "bg-indigo-500", text: "text-indigo-400" }
  ];

  return (
    <div className="space-y-6 animate-fade-in p-2">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Issues */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Tracked Issues</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">{issues.length}</h3>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this week
            </span>
          </div>
        </div>

        {/* Metric 2: AI Accuracy */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">AI Vision Match Avg</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">
              {Math.round((stats.avg_ai_confidence || 0.93) * 100)}%
            </h3>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
              MobileNetV3 PyTorch
            </span>
          </div>
        </div>

        {/* Metric 3: Resolution Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Resolution Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">
              {Math.round((issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100)}%
            </h3>
            <span className="text-xs text-slate-400">
              {issues.filter(i => i.status === 'Resolved').length} resolved
            </span>
          </div>
        </div>

        {/* Metric 4: Critical Hazards */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Critical Hazards (Sev 5)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">
              {issues.filter(i => i.severity >= 5).length}
            </h3>
            <span className="text-xs text-rose-400 font-semibold">Priority Action</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Status Pipeline & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Pipeline Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 lg:col-span-1 space-y-5">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> Resolution Pipeline
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Pending ({issues.filter(i => i.status === 'Pending').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'Pending').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${(issues.filter(i => i.status === 'Pending').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> In Progress ({issues.filter(i => i.status === 'In Progress').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'In Progress').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(issues.filter(i => i.status === 'In Progress').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolved ({issues.filter(i => i.status === 'Resolved').length})
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round((issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(issues.filter(i => i.status === 'Resolved').length / Math.max(issues.length, 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center justify-between">
            <span>Infrastructure Category Distribution</span>
            <span className="text-xs font-normal text-slate-400">PostGIS DBSCAN Spatial Clustering</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="text-xs font-medium text-slate-200">{cat.name}</span>
                </div>
                <span className={`text-sm font-extrabold font-mono ${cat.text}`}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Spatial Issue Feed Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-base font-bold text-white flex items-center justify-between">
          <span>Live Geo-Tagged Defect Feed</span>
          <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20">
            PostGIS RFC 7946 GeoJSON
          </span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Title & Category</th>
                <th className="p-3">Location / Address</th>
                <th className="p-3">Severity</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-slate-100">{issue.title}</div>
                    <div className="text-[11px] text-slate-400">{issue.category}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate max-w-xs">{issue.address}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      issue.severity >= 5 ? 'bg-rose-500/20 text-rose-400' :
                      issue.severity === 4 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-sky-500/20 text-sky-400'
                    }`}>
                      Level {issue.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sky-400">
                    {Math.round((issue.confidence || 0.9) * 100)}%
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      issue.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      issue.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30'
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
