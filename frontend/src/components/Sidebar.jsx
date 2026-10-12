import React from "react";
import { LayoutDashboard, Users, Database, GraduationCap, Sparkles } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, dbStatus }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="sidebar-title">BDA Analytics</div>
          <div className="sidebar-subtitle">Student Performance System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Analytics Dashboard</span>
        </button>

        <button
          className={`nav-link ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <Users size={18} />
          <span>Student Records</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Database size={14} color="#94a3b8" />
          <span style={{ fontWeight: 600, color: "#cbd5e1" }}>Database Status</span>
        </div>
        <div className={`status-badge ${dbStatus === "connected" ? "connected" : "disconnected"}`}>
          <span className="status-dot"></span>
          <span>MongoDB {dbStatus === "connected" ? "Connected" : "Offline"}</span>
        </div>
        <div style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Sparkles size={12} />
          <span>NoSQL Aggregation Engine</span>
        </div>
      </div>
    </aside>
  );
}
