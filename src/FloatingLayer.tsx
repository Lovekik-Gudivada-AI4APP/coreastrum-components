// FloatingLayer · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus FloatingLayer.css.
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx';

export interface FloatingLayerProps {
  anchor?: any;
  open?: any;
  onClose?: (...args: any[]) => any;
  align?: any;
  className?: string;
  children?: any;
  label?: any;
  role?: string;
}
export function FloatingLayer({ anchor, open, onClose, align = 'left', className, children, label, role = 'dialog' }: FloatingLayerProps) {
  const ref = useRef<any>(null);
  const [pos, setPos] = useState(null);
  const place = useCallback(() => {
    const a = anchor.current, el = ref.current; if (!a || !el) return;
    const r = a.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    let left = align === 'right' ? r.right - w : r.left;
    left = Math.max(8, Math.min(left, vw - w - 8));
    let top = r.bottom + 6;
    if (top + h > vh - 8 && r.top - h - 6 > 8) top = r.top - h - 6;
    top = Math.max(8, Math.min(top, vh - h - 8));
    setPos(p => (p && p.left === left && p.top === top ? p : { left, top }));
  }, [anchor, align]);
  useLayoutEffect(() => { if (open) place(); else setPos(null); });
  useEffect(() => {
    if (!open) return;
    const down = e => { if (ref.current?.contains(e.target) || anchor.current?.contains(e.target)) return; onClose(); };
    const key = e => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); anchor.current?.focus?.(); } };
    const re = () => place();
    document.addEventListener('mousedown', down); window.addEventListener('keydown', key, true);
    window.addEventListener('resize', re); window.addEventListener('scroll', re, true);
    return () => { document.removeEventListener('mousedown', down); window.removeEventListener('keydown', key, true); window.removeEventListener('resize', re); window.removeEventListener('scroll', re, true); };
  }, [open, onClose, place, anchor]);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div ref={ref} className={cx('popover layer', className)} role={role} aria-label={label}
      style={{ position: 'fixed', left: pos?.left ?? -9999, top: pos?.top ?? -9999, visibility: pos ? 'visible' : 'hidden' }}>{children}</div>,
    document.body);
}

/* Row "…" menu (tables §9 T2). items: [{ label, icon, onClick, danger, disabled, title, sep }]
   Delete lives here, never as a visible row button. Arrow keys move, Escape closes and restores focus. */
