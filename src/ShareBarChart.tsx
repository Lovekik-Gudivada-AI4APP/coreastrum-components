// ShareBarChart · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ShareBarChart.css.
import React from 'react';

export interface ShareBarChartProps {
  items?: any;
}
// Horizontal proportion bars (share of total).
export function ShareBarChart({ items }: ShareBarChartProps) {
  return (
    <div className="col" style={{ gap: 10 }}>
      {items.map(([label, v, color, right]: any) => (
        <div key={label} className="col" style={{ gap: 4 }}>
          <div className="spread" style={{ fontSize: 12.5 }}><span>{label}</span><span className="num muted">{right ?? v + '%'}</span></div>
          <div className="bar"><i style={{ width: v + '%', background: color || 'var(--viz-1)' }} /></div>
        </div>
      ))}
    </div>
  );
}
