// pulseSummary · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.


/* ------------------------------------------------------------------ Pulse */
const UNIT = {
  ms: v => v == null ? '—' : v >= 1000 ? (v / 1000).toFixed(1) + ' s' : Math.round(v) + ' ms',
  pct: v => v == null ? '—' : Math.round(v) + '%',
};

const median = (xs?: any) => { const s = xs.filter(v => v != null).sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };

export function pulseSummary(series?: any, { noun = 'calls', unit = 'ms', stat = 'p50' }: any = {}) {
  const n = series.length;
  if (!n) return `No ${noun} yet`;
  const bad = series.filter(e => e.status === 'bad').length, warn = series.filter(e => e.status === 'warn').length, live = series.filter(e => e.status === 'live').length;
  const mid = median(series.filter(e => e.status !== 'live').map(e => e.value));
  return [`${n} ${noun}`, bad && `${bad} failed`, warn && `${warn} went off`, live && `${live} running`, mid != null && `${stat} ${UNIT[unit](mid)}`].filter(Boolean).join(' · ');
}

/* series: [{ at, status: 'ok'|'warn'|'bad'|'live'|'idle', value, tip, to }] oldest → newest.
   Fixed slot count so pulses line up down a list column. onPick(event) makes ticks clickable. */
