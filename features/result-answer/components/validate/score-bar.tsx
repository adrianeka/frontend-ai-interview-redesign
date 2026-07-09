"use client";

interface ScoreBarProps {
  label: string;
  weight: number;
  value: number;
}

export function ScoreBar({ label, weight, value }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 14,
          color: "#475569",
          width: 175,
          flexShrink: 0,
        }}
      >
        {label} <span style={{ color: "#94A3B8" }}>({weight}%)</span>
      </span>
      <div
        style={{
          flex: "1 1 0%",
          minWidth: 0,
          height: 8,
          borderRadius: 9999,
          backgroundColor: "#E2E4E6",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clamped}%`,
            borderRadius: 9999,
            backgroundColor: "#5BC8D9",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "#64748B",
          width: 36,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
