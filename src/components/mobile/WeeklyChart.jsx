import React, { useState } from 'react';

function WeeklyChart({ data, width = 320, height = 120 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const padding = 12;
  
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 5); // Default max 5 if data is small/zero
  const min = 0;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y, value: d.value, label: d.label };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path d={areaPath} fill="url(#chartFill)" />
        
        {/* Line */}
        <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Interaction points */}
        {points.map((p, i) => (
          <g 
            key={i} 
            onMouseEnter={() => setHoveredPoint(p)}
            onMouseLeave={() => setHoveredPoint(null)}
            onTouchStart={() => setHoveredPoint(p)}
            className="cursor-pointer"
          >
            {/* Larger invisible hit area for better mobile interaction */}
            <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={hoveredPoint === p ? "4" : "3"} 
              fill={hoveredPoint === p ? "#2563eb" : "#2563eb"} 
              stroke="white"
              strokeWidth={hoveredPoint === p ? "2" : "1"}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ 
            left: `${(hoveredPoint.x / width) * 100}%`, 
            top: `${(hoveredPoint.y / height) * 100}%` 
          }}
        >
          <div className="font-bold">{hoveredPoint.label}</div>
          <div>{hoveredPoint.value} Laporan</div>
        </div>
      )}

      <div className="flex justify-between mt-1 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[11px] text-slate-400 font-medium">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WeeklyChart;
