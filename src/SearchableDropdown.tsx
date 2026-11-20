// SearchableDropdown · CoreAstrum AI Studio, new in the CoreAstrum component library (built on the prototype's parts).
// Needs tokens.css and foundations.css once per app, plus SearchableDropdown.css.
import React, { useEffect, useState, useId, useMemo, useRef } from 'react';
import { Search, X, ChevronDown, Check } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { FloatingLayer } from './FloatingLayer';

// The panel under a trigger: as wide as the trigger (at least minWidth), opened by FloatingLayer.
function usePanelWidth(anchor?: any, open?: any, minWidth = 240) {
  const [w, setW] = useState(minWidth);
  useEffect(() => { if (open && anchor.current) setW(Math.max(minWidth, anchor.current.getBoundingClientRect().width)); }, [open]);
  return w;
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

export interface SearchableDropdownProps {
  value?: any;
  onChange?: (...args: any[]) => any;
  options?: any[];
  placeholder?: string;
  label?: any;
  disabled?: any;
  id?: string;
  emptyText?: any;
  clearable?: boolean;
  className?: string;
}
// One choice from a long list, found by typing (a combobox). Arrow keys move, Enter picks, Escape closes; × clears.
export function SearchableDropdown({ value, onChange, options = [], placeholder = 'Search and select…', label = 'Select', disabled, id, emptyText = 'No match', clearable = true, className }: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const anchor = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const listId = useId();
  const width = usePanelWidth(anchor, open);
  const current = options.find(o => o.value === value);
  const ql = q.trim().toLowerCase();
  const shown = useMemo(() => options.filter(o => !ql || (o.label + ' ' + (o.hint || '')).toLowerCase().includes(ql)), [options, ql]);
  useEffect(() => { if (open) setHi(Math.max(0, shown.findIndex(o => o.value === value))); }, [open]);
  useEffect(() => { if (q) setHi(0); }, [q]);
  useEffect(() => { document.getElementById(`${listId}-${hi}`)?.scrollIntoView({ block: 'nearest' }); }, [hi, open]);
  const pick = o => { if (!o || o.disabled) return; onChange && onChange(o.value); setQ(''); setOpen(false); };
  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setHi(h => Math.min(h + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && open) { e.preventDefault(); pick(shown[hi]); }
    else if (e.key === 'Tab') { setOpen(false); setQ(''); }
  };
  return (
    <>
      <div ref={anchor} className={cx('lib-trigger', 'lib-combo', open && 'open', disabled && 'disabled', className)}>
        <Icon icon={Search} size={14} className="lib-lead" />
        <input ref={inputRef} id={id} className="lib-combo-input" role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-label={label}
          aria-activedescendant={open && shown[hi] ? `${listId}-${hi}` : undefined} disabled={disabled} autoComplete="off"
          placeholder={current ? current.label : placeholder} value={open ? q : current ? current.label : ''}
          onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={e => { setQ(e.target.value); setOpen(true); }} onKeyDown={onKey} />
        {clearable && current && !disabled && <button type="button" className="lib-clear" aria-label={`Clear ${label}`} onMouseDown={e => e.preventDefault()} onClick={() => { onChange && onChange(null); setQ(''); inputRef.current?.focus(); }}><Icon icon={X} size={13} /></button>}
        <Icon icon={ChevronDown} size={16} className="lib-chev" />
      </div>
      <FloatingLayerPanel anchor={anchor} open={open} onClose={() => { setOpen(false); setQ(''); }} label={label} width={width}>
        <div className="lib-panel">
          <div className="lib-opts" role="listbox" id={listId} aria-label={label}>
            {shown.map((o, i) => (
              <div key={o.value} id={`${listId}-${i}`} role="option" aria-selected={o.value === value} aria-disabled={o.disabled || undefined}
                className={cx('lib-opt', i === hi && 'hi', o.value === value && 'on')} onMouseEnter={() => setHi(i)} onMouseDown={e => e.preventDefault()} onClick={() => pick(o)}>
                <span className="lib-opt-t">{o.label}{o.hint && <small>{o.hint}</small>}</span>{o.value === value && <Icon icon={Check} size={14} className="lib-tick" />}
              </div>))}
            {!shown.length && <p className="lib-none">{emptyText} for “{q.trim()}”.</p>}
          </div>
        </div>
      </FloatingLayerPanel>
    </>
  );
}
