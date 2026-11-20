// Sparkline · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Sparkline.css.
import React from 'react';

export interface SparklineProps {
  data?: any;
  w?: number;
  h?: number;
  color?: any;
  fill?: boolean;
  max?: any;
}
/* ---------- Charts (hand-drawn SVG, one scale per chart) ---------- */
export function Sparkline({ data, w = 120, h = 32, color = 'var(--viz-1)', fill = true, max }: SparklineProps) {
  const m = max ?? Math.max(...data, 1);
  const pts = data.map((v, i) => [i * (w - 4) / (data.length - 1) + 2, h - 3 - (v / m) * (h - 6)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {fill && <path d={`${d} L${last[0]} ${h} L${pts[0][0]} ${h} Z`} fill={color} opacity=".1" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}
