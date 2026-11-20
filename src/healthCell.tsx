// healthCell · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.
import React from 'react';
import { healthOf } from './platform';
import { HealthIndicator } from './HealthIndicator';

export function healthCell(series?: any, override?: any) {
  const h = override || healthOf(series);
  const live = series.some(e => e.status === 'live');
  return { k: 'Health', v: <HealthIndicator h={h} live={live} word /> };
}
