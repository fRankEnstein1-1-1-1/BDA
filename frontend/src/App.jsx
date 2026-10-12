import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import api from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dbStatus, setDbStatus] = useState("checking");
  const [analyticsKey, setAnalyticsKey] = useState(0);

  // Check backend and MongoDB connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await api.getHealth();
        if (health.database === "connected") {
          setDbStatus("connected");
        } else {
          setDbStatus("disconnected");
        }
      } catch (err) {
        setDbStatus("disconnected");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDataChanged = () => {
    // Invalidate and trigger analytics reload on subsequent dashboard view
    setAnalyticsKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
      />

      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <h1>
              {activeTab === "dashboard"
                ? "Academic Performance Analytics"
                : "Student Directory & Records"}
            </h1>
            <p>
              {activeTab === "dashboard"
                ? "Aggregated cohort metrics powered by MongoDB pipeline stages"
                : "Manage individual student records and marks"}
            </p>
          </div>

          <div className="header-actions">
            <div
              className={`status-badge ${
                dbStatus === "connected" ? "connected" : "disconnected"
              }`}
            >
              <span className="status-dot"></span>
              <span>
                {dbStatus === "connected"
                  ? "MongoDB Atlas Online"
                  : "Database Disconnected"}
              </span>
            </div>
          </div>
        </header>

        <main>
          {activeTab === "dashboard" ? (
            <Dashboard key={analyticsKey} />
          ) : (
            <Students onDataChanged={handleDataChanged} />
          )}
        </main>
      </div>
    </div>
  );
}
