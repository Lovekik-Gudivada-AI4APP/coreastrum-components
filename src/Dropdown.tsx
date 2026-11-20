// Dropdown · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus Dropdown.css.
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Check } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { FloatingLayer } from './FloatingLayer';

// The panel under a trigger: as wide as the trigger (at least minWidth), opened by FloatingLayer.
function usePanelWidth(anchor?: any, open?: any, minWidth = 240) {
  const [w, setW] = useState(minWidth);
  useEffect(() => { if (open && anchor.current) setW(Math.max(minWidth, anchor.current.getBoundingClientRect().width)); }, [open]);
  return w;
}

// Arrow keys move between the panel's options; Home/End jump.
function moveFocus(e?: any, root?: any) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !root) return;
  const items = [...root.querySelectorAll('[data-opt]:not([disabled])')];
  if (!items.length) return;
  e.preventDefault();
  const i = items.indexOf(document.activeElement);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
  items[next < 0 ? 0 : next].focus();
}

export interface DropdownProps {
  value?: any;
  onChange?: (...args: any[]) => any;
  options?: any[];
  placeholder?: string;
  label?: any;
  id?: string;
  disabled?: any;
  invalid?: any;
  className?: string;
}
// One choice from a short list. The field shows the choice; the panel lists the options with a tick on the current one.
// Arrow keys move, Enter or a click picks, Escape closes, typing a letter jumps to the next option starting with it.
export function Dropdown({ value, onChange, options = [], placeholder = 'Select…', label = 'Select', id, disabled, invalid, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<any>(null);
  const listRef = useRef<any>(null);
  const width = usePanelWidth(anchor, open, 200);
  const current = options.find(o => o.value === value);
  useEffect(() => { if (!open) return; const t = setTimeout(() => { const el = listRef.current?.querySelector('[aria-selected="true"]') || listRef.current?.querySelector('[data-opt]:not([disabled])'); el?.focus(); }, 0); return () => clearTimeout(t); }, [open]);
  const pick = o => { if (o.disabled) return; onChange && onChange(o.value); setOpen(false); anchor.current?.querySelector('button')?.focus(); };
  const onListKey = e => {
    moveFocus(e, listRef.current);
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const items = [...listRef.current.querySelectorAll('[data-opt]:not([disabled])')];
      const at = items.indexOf(document.activeElement);
      const next = [...items.slice(at + 1), ...items.slice(0, at + 1)].find(b => b.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));
      next?.focus();
    }
  };
  return (
    <>
      <div ref={anchor} className={cx('lib-trigger', 'lib-select', open && 'open', disabled && 'disabled', invalid && 'invalid', className)}>
        <button id={id} type="button" className="lib-trigger-hit" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-invalid={invalid || undefined}
          aria-label={`${label}: ${current ? current.label : 'none selected'}`} onClick={() => setOpen(o => !o)}
          onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } }} />
        <span className={cx('lib-value', !current && 'lib-placeholder')}>{current ? current.label : placeholder}</span>
        <Icon icon={ChevronDown} size={16} className="lib-chev" />
      </div>
      <FloatingLayerPanel anchor={anchor} open={open} onClose={() => setOpen(false)} label={label} width={width}>
        <div className="lib-panel">
          <div className="lib-opts" role="listbox" aria-label={label} ref={listRef} onKeyDown={onListKey}>
            {options.map(o => (
              <button key={o.value} type="button" role="option" data-opt aria-selected={o.value === value} disabled={o.disabled}
                className={cx('lib-opt', o.value === value && 'on')} onClick={() => pick(o)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(o); } }}>
                <span className="lib-opt-t">{o.label}{o.hint && <small>{o.hint}</small>}</span>{o.value === value && <Icon icon={Check} size={14} className="lib-tick" />}
              </button>))}
          </div>
        </div>
      </FloatingLayerPanel>
    </>
  );
}

interface FloatingLayerPanelProps {
  anchor?: any;
  open?: any;
  onClose?: (...args: any[]) => any;
  label?: any;
  width?: any;
  align?: any;
  role?: string;
  children?: any;
}
// FloatingLayer with a fixed width for its panel.
function FloatingLayerPanel({ anchor, open, onClose, label, width, align = 'left', role = 'presentation', children }: FloatingLayerPanelProps) {
  return <FloatingLayer anchor={anchor} open={open} onClose={onClose} label={label} role={role} align={align} className="lib-pop"><div style={{ width }}>{children}</div></FloatingLayer>;
}
