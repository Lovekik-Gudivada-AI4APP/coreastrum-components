// The app context the components read (permissions, navigation, toasts, project scope).
// In the prototype this is src/app.jsx; here it is a small provider you can wire to your own app.
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const Ctx = createContext<any>(null);
const DEFAULTS = {
  path: '', nav: to => { window.location.hash = to; }, can: () => true, scope: null, c2: null,
  project: { id: 'core', name: 'Core Admin', code: 'CORE_ADMIN' }, role: { name: 'Admin', unit: 'All units', perms: [] }, db: {},
};
export interface AppProviderProps {
  value?: any;
  children?: any;
}
export function AppProvider({ value, children }: AppProviderProps) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback(t => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts.slice(-3), { id, kind: 'ok', ...t }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), t.ms || 4200);
  }, []);
  const v = useMemo(() => ({ ...DEFAULTS, ...value, toast, toasts }), [value, toast, toasts]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export const useApp = () => useContext(Ctx) || { ...DEFAULTS, toast: () => {}, toasts: [] };
