// dayLabels · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


export function dayLabels(n?: any) {
  const out = []; const d = new Date(2026, 10, 2);
  for (let i = n - 1; i >= 0; i--) { const x = new Date(d); x.setDate(d.getDate() - i); out.push(x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })); }
  return out;
}
