import React from "react";
import { Award } from "lucide-react";

export default function TopStudentsTable({ toppers = [] }) {
  if (!toppers || toppers.length === 0) {
    return (
      <div className="state-container" style={{ padding: "2rem" }}>
        <p style={{ color: "#94a3b8" }}>No topper records found</p>
      </div>
    );
  }

  const getRankClass = (index) => {
    if (index === 0) return "rank-1";
    if (index === 1) return "rank-2";
    if (index === 2) return "rank-3";
    return "rank-other";
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: "60px", textAlign: "center" }}>Rank</th>
            <th>Roll No</th>
            <th>Student Name</th>
            <th style={{ textAlign: "center" }}>Average</th>
            <th>Big Data</th>
            <th>Data Mining</th>
            <th>Cloud Comp.</th>
            <th>Machine Learning</th>
            <th style={{ textAlign: "center" }}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {toppers.map((student, idx) => (
            <tr key={student._id || student.rollNo}>
              <td style={{ textAlign: "center" }}>
                <span className={`badge-rank ${getRankClass(idx)}`}>
                  {idx + 1}
                </span>
              </td>
              <td>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "#1e293b" }}>
                  {student.rollNo}
                </span>
              </td>
              <td>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>
                  {student.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {student.department} • Sem {student.semester}
                </div>
              </td>
              <td style={{ textAlign: "center" }}>
                <span className="pill pill-pass" style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                  {student.averageMarks}%
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{student.marks?.bigDataAnalytics}</span>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{student.marks?.dataMining}</span>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{student.marks?.cloudComputing}</span>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{student.marks?.machineLearning}</span>
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  className={`pill ${student.attendance >= 75 ? "pill-neutral" : "pill-warning"}`}
                  style={{ fontSize: "0.78rem" }}
                >
                  {student.attendance}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
