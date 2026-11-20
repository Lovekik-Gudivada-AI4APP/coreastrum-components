// isoDay · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


const pad2 = (n?: any) => String(n).padStart(2, '0');

export const isoDay = (d?: any) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
