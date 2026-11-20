// globalInfo · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.
import { rec } from './rec';

/* ------------------------------------------------------------------ Global view (redesign, All projects) */
// What a record touches across every project: its project, what it depends on, what uses it, the dependency
// layers it sits in, and every session (conversation) that ran through it. Built from the same lineage the
// record and the Edit page use, so the three never disagree.
const GLOBAL_COLL = { agent: 'agents', prompt: 'prompts', model: 'models', rag: 'rags', kb: 'kbs' };

function recordOf(kind?: any, id?: any, c?: any) {
  if (GLOBAL_COLL[kind]) return c.db[GLOBAL_COLL[kind]]?.find(x => x.id === id);
  if (kind === 'pipeline') return c.S.PIPELINES.find(x => x.id === id);
  if (kind === 'evalSuite') return c.suites.find(x => x.id === id);
  return null;
}

export function globalInfo(steps?: any, c?: any) {
  const flat = (steps || []).filter(s => s && (!Array.isArray(s) || s.length));
  const at = flat.findIndex(s => !Array.isArray(s) && s.current);
  if (at < 0) return null;
  const cur = flat[at];
  const nodes = xs => xs.flatMap(s => Array.isArray(s) ? s : [s]).filter(n => n && !n.empty);
  const up = nodes(flat.slice(0, at)), down = nodes(flat.slice(at + 1));
  const rec = recordOf(cur.kind, cur.id, c);
  const agentIds = new Set(nodes(flat).filter(n => n.kind === 'agent').map(n => n.id));
  const convIds = new Set(nodes(flat).filter(n => n.kind === 'conversation').map(n => n.id));
  const key = cur.kind === 'prompt' ? 'promptId' : cur.kind === 'model' ? 'modelId' : cur.kind === 'agent' ? 'agentId' : null;
  if (key) c.executions.forEach(e => { if (e[key] === cur.id && e.conversationId) convIds.add(e.conversationId); });
  const sessions = c.conversations.filter(v => !v.isDeleted && (convIds.has(v.id) || agentIds.has(v.agentId))).sort((a, b) => b.updatedAt - a.updatedAt);
  return { cur, rec, project: rec?.project || 'Core', up, down, layers: flat, sessions };
}
