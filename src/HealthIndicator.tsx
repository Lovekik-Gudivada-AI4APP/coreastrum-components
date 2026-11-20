// HealthIndicator · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app, plus HealthIndicator.css.
import React from 'react';
import { HEALTH_WORD } from './platform';

export interface HealthIndicatorProps {
  h?: any;
  live?: any;
  word?: any;
}
/* ------------------------------------------------------------------ Health */
export function HealthIndicator({ h = 'idle', live, word }: HealthIndicatorProps) {
  return <span className="hdot" data-h={live ? 'live' : h} title={live ? 'Running now' : HEALTH_WORD[h]}><span className="sr">{live ? 'Running now' : HEALTH_WORD[h]}</span>{word && <b>{live ? 'Running' : HEALTH_WORD[h]}</b>}</span>;
}
