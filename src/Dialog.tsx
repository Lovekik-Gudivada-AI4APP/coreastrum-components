// Dialog · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Dialog.css.
import React, { useEffect, useRef } from 'react';
import { X } from './icons';
import { cx } from './cx';
import { IconButton } from './IconButton';

function useEscape(onClose?: any, active = true) {
  useEffect(() => {
    if (!active) return;
    const on = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onClose, active]);
}

function useFocusFirst(ref?: any) {
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current?.querySelector('input:not([disabled]), textarea, select, button:not([disabled])');
    el?.focus();
    return () => prev?.focus?.();
  }, []);
}

export interface DialogProps {
  title?: any;
  sub?: any;
  children?: any;
  footer?: any;
  onClose?: (...args: any[]) => any;
  wide?: any;
}
export function Dialog({ title, sub, children, footer, onClose, wide }: DialogProps) {
  const ref = useRef<any>(null);
  useEscape(onClose); useFocusFirst(ref);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className={cx('dialog', wide && 'wide')} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="dialog-h">
          <div><h2 className="t-h1 sm">{title}</h2>{sub && <p className="t-meta page-sub">{sub}</p>}</div>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="dialog-b">{children}</div>
        {footer && <div className="dialog-f">{footer}</div>}
      </div>
    </>
  );
}
