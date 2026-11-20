// ColumnChart · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ColumnChart.css.
import React from 'react';

export interface ColumnChartProps {
  data?: any;
  labels?: any;
  h?: number;
  color?: any;
  fmtY?: (...args: any[]) => any;
  highlight?: any;
  ticks?: number;
  budgetLine?: any;
}
// Column chart with a single y scale; labels drawn from the same scale.
export function ColumnChart({ data, labels, h = 160, color = 'var(--viz-1)', fmtY = v => v, highlight, ticks = 4, budgetLine }: ColumnChartProps) {
  const W = 600, pad = { l: 40, r: 8, t: 10, b: 22 };
  const max = Math.max(...data, budgetLine || 0) * 1.1 || 1;
  const step = niceStep(max / ticks);
  const top = Math.ceil(max / step) * step;
  const bw = (W - pad.l - pad.r) / data.length;
  const y = v => pad.t + (h - pad.t - pad.b) * (1 - v / top);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${h}`} width="100%" height={h} role="img" aria-label="Column chart">
      {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map(v => (
        <g key={v}><line className="grid-line" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} /><text x={pad.l - 6} y={y(v) + 3.5} textAnchor="end">{fmtY(v)}</text></g>
      ))}
      {data.map((v, i) => (
        <rect key={i} x={pad.l + i * bw + bw * 0.18} y={y(v)} width={bw * 0.64} height={Math.max(0, y(0) - y(v))} rx="2.5"
          fill={highlight != null && highlight !== i ? 'var(--brand-200)' : color}>
          <title>{(labels?.[i] ?? i) + ': ' + fmtY(v)}</title>
        </rect>
      ))}
      {budgetLine && <g><line x1={pad.l} x2={W - pad.r} y1={y(budgetLine)} y2={y(budgetLine)} stroke="var(--ai)" strokeDasharray="4 4" /><text x={W - pad.r} y={y(budgetLine) - 4} textAnchor="end" style={{ fill: 'var(--ai-ink)' }}>daily budget</text></g>}
      {labels && labels.map((l, i) => (i % Math.ceil(labels.length / 7) === 0 || i === labels.length - 1) && <text key={i} x={pad.l + i * bw + bw / 2} y={h - 6} textAnchor="middle">{l}</text>)}
    </svg>
  );
}

function niceStep(raw?: any) {
  const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}
