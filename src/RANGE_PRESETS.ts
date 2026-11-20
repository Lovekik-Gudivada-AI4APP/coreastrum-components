// RANGE_PRESETS · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app.


export const RANGE_PRESETS = [['1d', 'Today'], ['7d', '7 days'], ['30d', '30 days']];
/* DateRange: presets (Today · 7 days · 30 days · Custom, plus any extra presets) and a two-month calendar.
   value: { preset, start, end } — preset is a preset id or 'custom' (then start/end are 'YYYY-MM-DD').
   onChange receives the same shape. */
