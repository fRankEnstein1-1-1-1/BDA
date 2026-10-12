import React from "react";

export default function SummaryCard({ title, value, subtitle, icon: Icon, color = "blue", badge }) {
  const colorStyles = {
    blue: {
      bg: "#eff6ff",
      iconColor: "#2563eb",
      border: "#bfdbfe"
    },
    green: {
      bg: "#ecfdf5",
      iconColor: "#059669",
      border: "#a7f3d0"
    },
    indigo: {
      bg: "#eef2ff",
      iconColor: "#4f46e5",
      border: "#c7d2fe"
    },
    amber: {
      bg: "#fffbeb",
      iconColor: "#d97706",
      border: "#fde68a"
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="summary-card">
      <div className="summary-info">
        <h3>{title}</h3>
        <div className="summary-value">{value}</div>
        {subtitle && <div className="summary-subtitle">{subtitle}</div>}
      </div>
      <div
        className="summary-icon-wrapper"
        style={{
          backgroundColor: style.bg,
          color: style.iconColor,
          border: `1px solid ${style.border}`
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
