// rec · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.


/* A lineage node for any record: rec(kind, { id, label, ident, to, health, meta, current }). */
export const rec = (kind?: any, o?: any) => ({ kind, health: 'idle', ...o });
