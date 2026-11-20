// useSignalCtx · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.
import { useApp } from './app-context';
import { useIngest, evalStore, traces, executionsStore, conversationsStore } from './platform';

/* Everything the series and lineage resolvers read, subscribed so the page re-renders on change. */
export function useSignalCtx() {
  const { db } = useApp();
  const S = useIngest();
  const ev = evalStore.use();
  const tr = traces.use();
  const executions = executionsStore.use();
  const conversations = conversationsStore.use();
  return { db, S, suites: ev.suites, evalRuns: ev.runs, traces: tr, executions, conversations };
}
