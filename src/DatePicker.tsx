// DatePicker · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus DatePicker.css.
import React, { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { FloatingLayer } from './FloatingLayer';
import { isoDay } from './isoDay';
import { fmtDay } from './fmtDay';

const pad2 = (n?: any) => String(n).padStart(2, '0');

const parseDay = (s?: any) => { if (!s) return null; const [y, m, d] = s.slice(0, 10).split('-').map(Number); return y ? new Date(y, m - 1, d) : null; };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface MonthProps {
  year?: any;
  month?: any;
  start?: any;
  end?: any;
  hover?: any;
  onPick?: (...args: any[]) => any;
  onHover?: (...args: any[]) => any;
  min?: any;
  max?: any;
  today?: any;
}
function Month({ year, month, start, end, hover, onPick, onHover, min, max, today }: MonthProps) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // weeks start Monday
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => isoDay(new Date(year, month, i + 1)))];
  const lo = start, hi = end || (start && hover && hover > start ? hover : null);
  return (
    <div className="cal-m">
      <div className="cal-dow" aria-hidden="true">{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <span key={d}>{d}</span>)}</div>
      <div className="cal-grid" role="grid" aria-label={`${MONTHS[month]} ${year}`}>
        {cells.map((c, i) => c == null ? <span key={'e' + i} /> : (
          <button key={c} type="button" className="cal-d num" disabled={(min && c < min) || (max && c > max)}
            data-today={c === today || undefined} data-edge={c === lo || c === hi || undefined}
            data-in={lo && hi && c > lo && c < hi || undefined} aria-pressed={c === lo || c === hi}
            aria-label={fmtDay(c)} onClick={() => onPick(c)} onMouseEnter={() => onHover?.(c)}>{+c.slice(8)}</button>
        ))}
      </div>
    </div>
  );
}

interface CalHeadProps {
  view?: any;
  setView?: (...args: any[]) => any;
  months?: number;
  yearPick?: any;
}
function CalHead({ view, setView, months = 1, yearPick }: CalHeadProps) {
  const shift = n => setView(v => { const d = new Date(v.y, v.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const next = new Date(view.y, view.m + 1, 1);
  return (
    <div className="cal-h">
      <IconButton icon={ChevronLeft} size={14} label="Previous month" onClick={() => shift(-1)} />
      <div className="cal-titles" style={{ gridTemplateColumns: `repeat(${months}, 1fr)` }}>
        {yearPick ? (
          <div className="row" style={{ gap: 6, justifyContent: 'center' }}>
            <select className="select cal-sel" aria-label="Month" value={view.m} onChange={e => setView(v => ({ ...v, m: +e.target.value }))}>{MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}</select>
            <select className="select cal-sel" aria-label="Year" value={view.y} onChange={e => setView(v => ({ ...v, y: +e.target.value }))}>{Array.from({ length: 111 }, (_, i) => 1940 + i).map(y => <option key={y} value={y}>{y}</option>)}</select>
          </div>
        ) : <>
          <b>{MONTHS[view.m]} {view.y}</b>
          {months > 1 && <b>{MONTHS[next.getMonth()]} {next.getFullYear()}</b>}
        </>}
      </div>
      <IconButton icon={ChevronRight} size={14} label="Next month" onClick={() => shift(1)} />
    </div>
  );
}

export interface DatePickerProps {
  id?: string;
  value?: any;
  onChange?: (...args: any[]) => any;
  time?: any;
  min?: any;
  max?: any;
  placeholder?: string;
  disabled?: any;
  invalid?: any;
  label?: any;
  yearPick?: any;
  className?: string;
}
export function DatePicker({ id, value, onChange, time, min, max, placeholder, disabled, invalid, label, yearPick, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const btn = useRef<any>(null);
  const today = isoDay(new Date());
  const day = value ? value.slice(0, 10) : '';
  const hm = time ? (value && value.slice(11, 16)) || '09:00' : '';
  const [view, setView] = useState(() => { const d = parseDay(day) || new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const close = useCallback(() => setOpen(false), []);
  const emit = (d, t = hm) => onChange(d ? (time ? `${d}T${t}` : d) : '');
  const text = day ? fmtDay(day) + (time ? `, ${hm}` : '') : '';
  const [h, m] = (hm || '09:00').split(':');
  const mins = [...new Set([...Array.from({ length: 12 }, (_, i) => pad2(i * 5)), m])].sort();
  return (
    <>
      <button ref={btn} id={id} type="button" className={cx('input date-trigger', className)} disabled={disabled} aria-invalid={invalid || undefined}
        aria-haspopup="dialog" aria-expanded={open} aria-label={label ? `${label}: ${text || 'not set'}` : undefined}
        onClick={() => { if (!open) { const d = parseDay(day) || new Date(); setView({ y: d.getFullYear(), m: d.getMonth() }); } setOpen(o => !o); }}>
        <Icon icon={Calendar} size={14} /><span className={cx('dt-txt num', !text && 'dt-ph')}>{text || placeholder || (time ? 'Select date and time' : 'Select date')}</span>
      </button>
      <FloatingLayer anchor={btn} open={open} onClose={close} label={label || 'Choose date'} className="cal-pop">
        <div className="cal-main">
          <CalHead view={view} setView={setView} yearPick={yearPick} />
          <Month year={view.y} month={view.m} start={day} end={day} onPick={c => { emit(c); if (!time) close(); }} min={min && min.slice(0, 10)} max={max && max.slice(0, 10)} today={today} />
          {time && (
            <div className="cal-time">
              <span className="t-meta">Time</span>
              <select className="select cal-sel" aria-label="Hour" value={h} onChange={e => emit(day || today, `${e.target.value}:${m}`)}>{Array.from({ length: 24 }, (_, i) => pad2(i)).map(x => <option key={x}>{x}</option>)}</select>
              <span aria-hidden="true">:</span>
              <select className="select cal-sel" aria-label="Minute" value={m} onChange={e => emit(day || today, `${h}:${e.target.value}`)}>{mins.map(x => <option key={x}>{x}</option>)}</select>
            </div>
          )}
          <div className="cal-f">
            {value && <Button size="sm" kind="ghost" onClick={() => { emit(''); close(); }}>Clear</Button>}
            <span style={{ flex: 1 }} />
            <Button size="sm" kind="ghost" onClick={() => { emit(today); setView({ y: +today.slice(0, 4), m: +today.slice(5, 7) - 1 }); if (!time) close(); }}>Today</Button>
            {time && <Button size="sm" kind="primary" onClick={close}>Done</Button>}
          </div>
        </div>
      </FloatingLayer>
    </>
  );
}
