import React from "react";

export default function Sparkline({
  points = [10, 25, 50, 70, 15, 35, 50], // sample data
  height = 192,
  padding = 30,
  maxY = 100, // fixed max for y axis (0–100 as in your screenshot)
  stepY = 25,
}) {
  // Use a larger responsive width for better desktop display
  const width = 1100; // Increased width for better desktop scaling
  
  const normalizeY = (value) => {
    return (
      height -
      padding -
      ((value - 0) / (maxY - 0)) * (height - padding * 2)
    );
  };

  const xStep = (width - padding * 2) / (points.length - 1);

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${padding + i * xStep} ${normalizeY(p)}`
    )
    .join(" ");

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
      {/* Grid lines & y-axis labels */}
      {Array.from({ length: maxY / stepY + 1 }, (_, i) => {
        const yVal = i * stepY;
        const y = normalizeY(yVal);
        return (
          <g key={yVal}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb" /* Tailwind gray-200 */
              strokeWidth="1"
            />
            <text
              x={padding - 6}
              y={y + 4}
              fontSize="10"
              textAnchor="end"
              fill="#6b7280" /* Tailwind gray-500 */
            >
              {yVal}
            </text>
          </g>
        );
      })}

      {/* Area under the line */}
      <path
        d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill="rgba(16,185,129,0.15)" // green-500 with opacity
      />

      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke="#10B981" // Tailwind green-500
        strokeWidth="2"
      />

      {/* Data point circles */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={padding + i * xStep}
          cy={normalizeY(p)}
          r="4"
          fill="white"
          stroke="#3b82f6" // Tailwind blue-500
          strokeWidth="2"
        />
      ))}
      </svg>
    </div>
  );
}
