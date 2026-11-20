// useTabParam · CoreAstrum AI Studio, from the prototype's src/kit.jsx.
// Needs tokens.css and foundations.css once per app.
import { useApp } from './app-context';

export function useTabParam(defaultTab?: any) {
  const { path, nav } = useApp();
  const [pb, qs = ''] = path.split('?');
  const q = Object.fromEntries(qs.split('&').filter(Boolean).map(kv => kv.split('=')));
  return [q.tab || defaultTab, t => nav(`${pb}?tab=${t}`), q] as const;
}
