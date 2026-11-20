// ToastContainer · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ToastContainer.css.
import React from 'react';
import { Check, CircleCheck, CircleAlert, TriangleAlert, Info, Sparkles } from './icons';
import { useApp } from './app-context';
import { cx } from './cx';
import { Icon } from './Icon';

/* ---------- Toasts ---------- */
export function ToastContainer() {
  const { toasts } = useApp();
  const ico = { ok: CircleCheck, bad: CircleAlert, warn: TriangleAlert, info: Info, ai: Sparkles };
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={cx('toast', t.kind)}>
          <Icon icon={ico[t.kind] || Check} size={17} className="ti" />
          <div><div className="tt">{t.title}</div>{t.sub && <div className="ts">{t.sub}</div>}</div>
        </div>
      ))}
    </div>
  );
}
