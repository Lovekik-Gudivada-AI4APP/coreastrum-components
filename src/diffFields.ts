// diffFields · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.


const fmtV = (v?: any) => v == null || v === '' ? '—' : Array.isArray(v) ? (v.length ? v.join(', ') : '—') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : typeof v === 'object' ? JSON.stringify(v) : String(v);

export function diffFields(orig?: any, cur?: any, labels?: any) {
  if (!orig) return null;
  return Object.entries(labels).map(([k, label]: any) => {
    const a = typeof k === 'string' && k.includes('.') ? k.split('.').reduce((o, x) => o?.[x], orig) : orig[k];
    const b = typeof k === 'string' && k.includes('.') ? k.split('.').reduce((o, x) => o?.[x], cur) : cur[k];
    return fmtV(a) === fmtV(b) ? null : { label, from: fmtV(a), to: fmtV(b) };
  }).filter(Boolean);
}
