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

const CATEGORY_COLORS = {
  "Excellent": "#10b981",
  "Good": "#3b82f6",
  "Average": "#f59e0b",
  "Needs Improvement": "#ef4444"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "0.5rem 0.85rem",
        borderRadius: "8px",
        fontSize: "0.8rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontWeight: 600, color: CATEGORY_COLORS[data.category] || "#ffffff" }}>
          {data.category} ({data.range})
        </div>
        <div style={{ color: "#e2e8f0", marginTop: "2px" }}>
          Count: <strong>{data.count}</strong> students
        </div>
        <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Share: {data.percentage}% of cohort
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="state-container" style={{ padding: "2rem" }}>
        <p style={{ color: "#94a3b8" }}>No performance data available</p>
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
            dataKey="category"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            interval={0}
            angle={-10}
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={CATEGORY_COLORS[entry.category] || "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
