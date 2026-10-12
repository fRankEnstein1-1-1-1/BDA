import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

const SUBJECT_COLORS = ["#3b82f6", "#6366f1", "#0ea5e9", "#10b981"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "0.5rem 0.85rem",
        borderRadius: "8px",
        fontSize: "0.8rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ color: "#93c5fd", marginTop: "2px" }}>
          Average Score: <strong style={{ color: "#ffffff" }}>{payload[0].value}%</strong>
        </div>
      </div>
    );
  }
  return null;
};

export default function SubjectChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="state-container" style={{ padding: "2rem" }}>
        <p style={{ color: "#94a3b8" }}>No subject analytics available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            interval={0}
            angle={-10}
            textAnchor="end"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="average" radius={[6, 6, 0, 0]} maxBarSize={55}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
