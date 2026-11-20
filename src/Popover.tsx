// Popover · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus Popover.css.
import React, { useEffect, useRef, useState } from 'react';

export interface PopoverProps {
  trigger?: any;
  children?: any;
  align?: any;
  width?: any;
  open?: any;
  setOpen?: (...args: any[]) => any;
}
// Popover anchored to a trigger. Closes on outside click / Escape.
export function Popover({ trigger, children, align = 'left', width, open: ctrlOpen, setOpen: ctrlSet }: PopoverProps) {
  const [own, setOwn] = useState(false);
  const open = ctrlOpen ?? own; const setOpen = ctrlSet ?? setOwn;
  const ref = useRef<any>(null);
  useEffect(() => {
    if (!open) return;
    const on = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', on); window.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', on); window.removeEventListener('keydown', key); };
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {trigger({ open, toggle: () => setOpen(!open) })}
      {open && <div className="popover" style={{ [align]: 0, top: 'calc(100% + 6px)', width }}>{typeof children === 'function' ? children(() => setOpen(false)) : children}</div>}
    </div>
  );
}
