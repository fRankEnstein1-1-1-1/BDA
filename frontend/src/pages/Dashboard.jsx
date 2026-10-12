import React, { useState, useEffect } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import SubjectChart from "../components/SubjectChart";
import ResultsChart from "../components/ResultsChart";
import PerformanceChart from "../components/PerformanceChart";
import TopStudentsTable from "../components/TopStudentsTable";
import {
  Users,
  Award,
  CheckCircle2,
  CalendarCheck,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  Database
} from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [results, setResults] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [toppers, setToppers] = useState([]);
  const [attendance, setAttendance] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [sumRes, subjRes, resRes, perfRes, topRes, attRes] = await Promise.all([
        api.getSummary(),
        api.getSubjects(),
        api.getResults(),
        api.getPerformance(),
        api.getToppers(),
        api.getAttendance()
      ]);

      setSummary(sumRes);
      setSubjects(subjRes);
      setResults(resRes);
      setPerformance(perfRes);
      setToppers(topRes);
      setAttendance(attRes);
    } catch (err) {
      setError(err.message || "Failed to load analytics data from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-container">
          <div className="spinner"></div>
          <p style={{ fontWeight: 600, color: "#475569" }}>
            Executing MongoDB aggregation pipelines...
          </p>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            Querying academic records and performance metrics
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} />
            <strong>Unable to connect to Analytics API</strong>
          </div>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>{error}</p>
          <button className="btn btn-primary" onClick={() => fetchAnalytics(false)} style={{ marginTop: "0.5rem" }}>
            <RefreshCw size={14} /> Retry Analytics Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Action / Refresh header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
            Cohort Performance Overview
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Calculated dynamically via MongoDB NoSQL Aggregation Framework
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          title="Reload latest statistics from MongoDB"
        >
          <RefreshCw size={15} className={refreshing ? "spinner" : ""} style={{ animationDuration: "1s" }} />
          <span>{refreshing ? "Refreshing..." : "Refresh Analytics"}</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Students"
          value={summary?.totalStudents ?? 0}
          subtitle="Enrolled cohort count"
          icon={Users}
          color="blue"
        />
        <SummaryCard
          title="Overall Average"
          value={`${summary?.overallAverageMarks ?? 0}%`}
          subtitle="Mean across all 4 subjects"
          icon={Award}
          color="indigo"
        />
        <SummaryCard
          title="Pass Percentage"
          value={`${summary?.passPercentage ?? 0}%`}
          subtitle={`${summary?.passingStudents ?? 0} passing • ${summary?.failingStudents ?? 0} failing`}
          icon={CheckCircle2}
          color="green"
        />
        <SummaryCard
          title="Average Attendance"
          value={`${attendance?.averageAttendance ?? 0}%`}
          subtitle={`${attendance?.lowAttendanceCount ?? 0} students below 75%`}
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Dynamic Academic Insights Banner */}
      {subjects?.lowestSubject && (
        <div className="insights-banner">
          <Lightbulb size={24} className="insights-icon" />
          <div className="insights-content">
            <h4>Real-Time Academic Insights (Pipeline Engine)</h4>
            <p style={{ fontSize: "0.85rem", color: "#334155" }}>
              Lowest performing course is <strong>{subjects.lowestSubject.subject}</strong> with a class average of{" "}
              <strong>{subjects.lowestSubject.average}%</strong>. Highest performing subject is{" "}
              <strong>{subjects.highestSubject?.subject}</strong> ({subjects.highestSubject?.average}%).
            </p>
            <div className="insights-pills">
              <span className="insight-pill">
                Pass Criterion: ≥40 in each subject
              </span>
              <span className="insight-pill">
                Passing Students: {summary?.passingStudents} / {summary?.totalStudents} ({summary?.passPercentage}%)
              </span>
              <span className="insight-pill">
                Attendance Alert: {attendance?.lowAttendanceCount} students &lt;75%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid-2">
        {/* Subject Averages Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-title">Subject Average Scores</span>
              <span className="card-description">
                $group + $avg across all four engineering disciplines
              </span>
            </div>
          </div>
          <div className="card-body">
            <SubjectChart data={subjects?.subjects || []} />
          </div>
        </div>

        {/* Results Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-title">Pass vs. Fail Distribution</span>
              <span className="card-description">
                $cond evaluation (pass = score ≥ 40 in all 4 subjects)
              </span>
            </div>
          </div>
          <div className="card-body">
            <ResultsChart data={results || {}} />
          </div>
        </div>
      </div>

      {/* Performance Distribution & Low Attendance Section */}
      <div className="charts-grid-2">
        {/* Performance Category Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-title">Performance Tiers</span>
              <span className="card-description">
                $switch categorization into Excellent, Good, Average, and Needs Improvement
              </span>
            </div>
          </div>
          <div className="card-body">
            <PerformanceChart data={performance || []} />
          </div>
        </div>

        {/* Attendance Risk Action Center */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-title">Attendance Deficit Monitor (&lt; 75%)</span>
              <span className="card-description">
                Identifies students at risk of attendance shortage
              </span>
            </div>
            <span className="pill pill-warning" style={{ fontSize: "0.75rem" }}>
              {attendance?.lowAttendanceCount || 0} At Risk
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {attendance?.lowAttendanceStudents && attendance.lowAttendanceStudents.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th style={{ textAlign: "center" }}>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.lowAttendanceStudents.map((st) => (
                      <tr key={st._id}>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                            {st.rollNo}
                          </span>
                        </td>
                        <td>{st.name}</td>
                        <td style={{ color: "#64748b", fontSize: "0.8rem" }}>{st.department}</td>
                        <td style={{ textAlign: "center" }}>
                          <span className="pill pill-fail" style={{ fontWeight: 700 }}>
                            {st.attendance}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="state-container" style={{ padding: "2rem" }}>
                <p style={{ color: "#10b981", fontWeight: 600 }}>All students satisfy the 75% attendance threshold!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 5 Performers Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-title">Top 5 Academic Performers</span>
            <span className="card-description">
              $sort by calculated average marks descending + $limit 5
            </span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <TopStudentsTable toppers={toppers} />
        </div>
      </div>
    </div>
  );
}
