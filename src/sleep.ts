// sleep · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


export const sleep = (ms?: any) => new Promise(r => setTimeout(r, ms));
