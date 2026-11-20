// Stand-ins for the prototype's data layer (stores, navigation model, lifecycle), so the components run anywhere.
// Replace a stand-in with your own data to light up the matching feature (for example lineage and global columns).
export const findByPath = (..._args: any[]): any => null;
export const isA = false;
export const ListLead = (..._args: any[]): any => null;
export const PROJECTS = [];
export const useIngest = (..._args: any[]): any => ({ PIPELINES: [], RUNS: [], ARTIFACTS: {}, RAG_EXTRA: {}, OWN_SOURCES: {} });
export const evalStore = { use: (..._args: any[]): any => ({ suites: [], runs: [] }) };
export const traces = { use: (..._args: any[]): any => [] };
export const executionsStore = { use: (..._args: any[]): any => [] };
export const conversationsStore = { use: (..._args: any[]): any => [] };
export const HEALTH_WORD = { ok: 'Healthy', warn: 'Degraded', bad: 'Failing', idle: 'No activity' };
export const STAGES = [
  { id: 'ingest', n: 1, label: 'Ingest', source: 'pipeline_run', desc: 'Sources parsed, chunked, embedded and indexed.', to: '/pipeline-runs' },
  { id: 'retrieve', n: 2, label: 'Retrieve', source: 'rag_version', desc: 'Passages found and ranked for a question.', to: '/rags' },
  { id: 'reason', n: 3, label: 'Reason', source: 'prompt_execution', desc: 'A model, prompt or agent produces the answer.', to: '/prompts?tab=prompt-executions' },
  { id: 'guard', n: 4, label: 'Guard', source: 'guard_check', desc: 'Input screening, citations and grounding checks.', to: '/rags' },
  { id: 'observe', n: 5, label: 'Observe', source: 'trace', desc: 'Every call traced, timed and costed.', to: '/ai-observability/tracing' },
  { id: 'improve', n: 6, label: 'Improve', source: 'eval_run', desc: 'Eval suites, runs and feedback that raise quality.', to: '/eval-runs' },
];
export const STAGE_BY_ID = Object.fromEntries(STAGES.map(s => [s.id, s]));
export function healthOf(ev?: any) {
  const done = ev.filter(e => e.status !== 'live' && e.status !== 'idle');
  if (!done.length) return ev.length ? 'ok' : 'idle';
  const bad = done.filter(e => e.status === 'bad').length;
  if (done[done.length - 1].status === 'bad' || bad / done.length > 0.25) return 'bad';
  if (bad || done.some(e => e.status === 'warn')) return 'warn';
  return 'ok';
}
export const Brief = (..._args: any[]): any => null;
export const FlowMap = (..._args: any[]): any => null;
export const lineageToFlow = (..._args: any[]): any => ({ steps: [], needs: [] });
export const briefFromCells = (..._args: any[]): any => ({ lead: [], body: null, facts: [] });
export const lineage: Record<string, any> = {};
