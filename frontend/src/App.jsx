import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CivicMap from './components/Map/CivicMap';
import AnalyticsOverview from './components/Dashboard/AnalyticsOverview';
import IssueReporterModal from './components/AI/IssueReporterModal';
import { getIssues, getAnalytics } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isReporterOpen, setIsReporterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const issueData = await getIssues();
    setIssues(issueData);
    const analyticsData = await getAnalytics();
    setAnalytics(analyticsData);
  };

  const handleIssueCreated = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    fetchData();
  };

  const handleUpdateStatus = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, status: newStatus } : issue))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500">
      
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReporter={() => setIsReporterOpen(true)}
        issueCount={issues.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'map' ? (
          <CivicMap
            issues={issues}
            selectedLocation={selectedLocation}
            isSelectingLocation={isSelectingLocation}
            onLocationSelected={(latlng) => {
              setSelectedLocation(latlng);
              setIsSelectingLocation(false);
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <AnalyticsOverview analytics={analytics} issues={issues} />
        )}
      </main>

      {/* AI Issue Reporter Modal */}
      <IssueReporterModal
        isOpen={isReporterOpen}
        onClose={() => setIsReporterOpen(false)}
        onIssueCreated={handleIssueCreated}
        onRequestMapPicker={() => {
          setIsReporterOpen(false);
          setIsSelectingLocation(true);
        }}
      />

    </div>
  );
}
