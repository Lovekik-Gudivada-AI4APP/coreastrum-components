// cx · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


export const cx = (...a) => a.filter(Boolean).join(' ');
/* Codes and identifiers (RAG.Legal.CriminalLaw, ERR.CORE.AI_RUNTIME…, gen_ai.request.model) may only
   wrap at their separators — never mid-token. Inserts <wbr> after . _ / : and the full value as a tooltip. */
