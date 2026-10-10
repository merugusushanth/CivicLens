import React from 'react';
import { Camera, MapPin, BarChart3, Shield, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenReporter, issueCount }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Professional Municipal Header */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('map')}>
          <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white tracking-tight">
                CivicLens
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium text-sky-300 bg-sky-950 border border-sky-800 rounded">
                Telangana GIS Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Urban Infrastructure Tracking & Grievance System</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-3">
          <nav className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Spatial Map</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-900 text-slate-300 rounded font-mono font-semibold">
                {issueCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics Dashboard</span>
            </button>
          </nav>

          {/* Report Button */}
          <button
            onClick={onOpenReporter}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>

      </div>
    </header>
  );
}
