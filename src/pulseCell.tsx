// pulseCell · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.
import React from 'react';
import { pulseSummary } from './pulseSummary';
import { ActivityTicks } from './ActivityTicks';

// The usual first cell: pulse of recent activity + summary sentence, ticks open the event.
export function pulseCell(series?: any, { k = 'Recent activity', noun, unit, onPick }: any = {}) {
  return { k, wide: true, v: <ActivityTicks series={series} height={26} noun={noun} unit={unit} onPick={onPick} />, sub: pulseSummary(series, { noun, unit }) };
}
