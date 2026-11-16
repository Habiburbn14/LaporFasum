import React, { useRef, useEffect, useState } from 'react';

function WeeklyChart({ data, width = '100%', height = 200 }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(width === '100%' ? 600 : width);

  useEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth || 600;
      setContainerWidth(w);
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center bg-slate-50 rounded-xl">
        <span className="text-xs text-slate-400">Tidak ada data</span>
      </div>
    );
  }

  const padding = 12;
  const chartWidth = containerWidth;
  const chartHeight = height;
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = data.length === 1 
      ? chartWidth / 2 
      : padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((d.value - min) / range) * (chartHeight - padding * 2);
    return { x, y };
  });

  const isSinglePoint = data.length === 1;
  const linePath = isSinglePoint 
    ? `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
    : points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');

  const areaPath = isSinglePoint 
    ? '' 
    : `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div ref={containerRef} className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#chartFill)" />}
        {data.length > 1 && (
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2563eb" />
        ))}
      </svg>
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