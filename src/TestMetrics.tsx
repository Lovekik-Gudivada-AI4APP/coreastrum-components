// TestMetrics · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app, plus TestMetrics.css.
import React from 'react';
import { cx } from './cx';

export interface TestMetricsProps {
  items?: any;
}
// Where the time, money or volume went, step by step; the last cell is the total.
export function TestMetrics({ items }: TestMetricsProps) {
  return <div className="tb-metrics">{items.map(([k, v, tone]: any) => <div key={k} className={cx(tone && 'tb-m-' + tone)}><span>{k}</span><b className="num">{v}</b></div>)}</div>;
}
