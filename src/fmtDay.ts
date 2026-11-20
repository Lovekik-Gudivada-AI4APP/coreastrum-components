// fmtDay · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


const parseDay = (s?: any) => { if (!s) return null; const [y, m, d] = s.slice(0, 10).split('-').map(Number); return y ? new Date(y, m - 1, d) : null; };

export const fmtDay = (s?: any) => { const d = parseDay(s); return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; };
