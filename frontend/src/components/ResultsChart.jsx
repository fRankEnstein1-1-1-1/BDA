import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = {
  Passed: "#10b981",
  Failed: "#ef4444"
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "0.5rem 0.85rem",
        borderRadius: "8px",
        fontSize: "0.8rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontWeight: 600, color: COLORS[data.name] || "#ffffff" }}>
          {data.name}
        </div>
        <div style={{ color: "#e2e8f0", marginTop: "2px" }}>
          Count: <strong>{data.value}</strong> students
        </div>
        <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Share: {data.payload.percentage}%
        </div>
      </div>
    );
  }
  return null;
};

export default function ResultsChart({ data = {} }) {
  const chartData = [
    {
      name: "Passed",
      value: data.passedCount || 0,
      percentage: data.passRate || 0
    },
    {
      name: "Failed",
      value: data.failedCount || 0,
      percentage: data.failRate || 0
    }
  ];

  const total = (data.passedCount || 0) + (data.failedCount || 0);

  if (total === 0) {
    return (
      <div className="state-container" style={{ padding: "2rem" }}>
        <p style={{ color: "#94a3b8" }}>No results data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: "#475569", fontSize: "0.85rem", fontWeight: 500 }}>
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Central label inside donut */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none"
        }}
      >
        <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
          {data.passRate}%
        </div>
        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>
          PASS RATE
        </div>
      </div>
    </div>
  );
}
