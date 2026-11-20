// fmt · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


export const fmt = {
  n: v => v == null ? '—' : Number(v).toLocaleString('en-US'),
  usd: v => v == null ? '—' : '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: v < 10 ? 2 : 0, maximumFractionDigits: v < 10 ? 2 : 0 }),
  pct: v => v == null ? '—' : v.toFixed(v % 1 ? 1 : 0) + '%',
  ms: v => v == null ? '—' : v >= 1000 ? (v / 1000).toFixed(1) + ' s' : Math.round(v) + ' ms',
};
