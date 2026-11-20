// DateRangePicker · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus DateRangePicker.css.
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from './icons';
import { cx } from './cx';
import { Icon } from './Icon';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { FloatingLayer } from './FloatingLayer';
import { isoDay } from './isoDay';
import { fmtDay } from './fmtDay';
import { RANGE_PRESETS } from './RANGE_PRESETS';

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

const useNarrow = () => { const [n, setN] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640); useEffect(() => { const f = () => setN(window.innerWidth < 640); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []); return n; };

export interface DateRangePickerProps {
  value?: Record<string, any>;
  onChange?: (...args: any[]) => any;
  presets?: any;
  max?: any;
  min?: any;
  label?: any;
  className?: string;
}
export function DateRangePicker({ value = {}, onChange, presets = RANGE_PRESETS, max, min, label = 'Date range', className }: DateRangePickerProps) {
  const today = isoDay(new Date());
  const lim = max === undefined ? today : max;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ start: '', end: '' });
  const [hover, setHover] = useState(null);
  const btn = useRef<any>(null);
  const narrow = useNarrow();
  const init = () => { const e = parseDay(value.end || value.start || lim || today) || new Date(); const d = new Date(e.getFullYear(), e.getMonth() - (narrow ? 0 : 1), 1); return { y: d.getFullYear(), m: d.getMonth() }; };
  const [view, setView] = useState(init);
  const custom = value.preset === 'custom' || (!value.preset && (value.start || value.end));
  const text = custom ? (value.start && value.end && value.start !== value.end ? `${fmtDay(value.start)} – ${fmtDay(value.end)}` : fmtDay(value.start || value.end) || 'Custom')
    : (presets.find(p => p[0] === value.preset) || [])[1] || 'Select range';
  const toggle = () => { if (!open) { setDraft({ start: value.start || '', end: value.end || '' }); setView(init()); } setOpen(o => !o); };
  const close = useCallback(() => setOpen(false), []);
  const pick = c => setDraft(d => (!d.start || d.end ? { start: c, end: '' } : c < d.start ? { start: c, end: d.start } : { start: d.start, end: c }));
  const apply = () => { onChange({ preset: 'custom', start: draft.start, end: draft.end || draft.start }); close(); };
  const next = new Date(view.y, view.m + 1, 1);
  return (
    <>
      <button ref={btn} type="button" className={cx('input date-trigger', className)} aria-haspopup="dialog" aria-expanded={open} aria-label={`${label}: ${text}`} onClick={toggle}>
        <Icon icon={Calendar} size={14} /><span className="dt-txt num">{text}</span>
      </button>
      <FloatingLayer anchor={btn} open={open} onClose={close} label={label} className="cal-pop">
        <div className="cal-wrap">
          <div className="cal-presets" role="group" aria-label="Presets">
            {presets.map(([k, l]: any) => <button key={k} type="button" aria-pressed={!custom && value.preset === k} onClick={() => { onChange({ preset: k, start: '', end: '' }); close(); }}>{l}</button>)}
            <button type="button" aria-pressed={!!custom} onClick={() => setDraft(d => d.start ? d : { start: '', end: '' })}>Custom</button>
          </div>
          <div className="cal-main">
            <CalHead view={view} setView={setView} months={narrow ? 1 : 2} />
            <div className="cal-months" onMouseLeave={() => setHover(null)}>
              <Month year={view.y} month={view.m} {...draft} hover={hover} onHover={setHover} onPick={pick} min={min} max={lim} today={today} />
              {!narrow && <Month year={next.getFullYear()} month={next.getMonth()} {...draft} hover={hover} onHover={setHover} onPick={pick} min={min} max={lim} today={today} />}
            </div>
            <div className="cal-f">
              <span className="t-meta num">{draft.start ? `${fmtDay(draft.start)} – ${draft.end ? fmtDay(draft.end) : 'pick an end date'}` : 'Pick a start date'}</span>
              <Button size="sm" kind="ghost" onClick={close}>Cancel</Button>
              <Button size="sm" kind="primary" disabled={!draft.start} onClick={apply}>Apply</Button>
            </div>
          </div>
        </div>
      </FloatingLayer>
    </>
  );
}

/* DatePicker: single date (optionally with time). Drop-in for <input type="date|datetime-local">:
   value/onChange use the same string format; onChange receives the string (not an event). */
