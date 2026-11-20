// kit: SignInScreen · The AI Studio sign-in: User ID or work email + 4-digit MPIN, then the project chooser, a signing-in
// state and the role picker. Markup and classes from the prototype's src/login-c2.jsx; the account lookup is a prop.
import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ChevronRight, Search, CircleAlert, Check } from './icons';
import { Icon } from './Icon';
import { Button } from './Button';
import { sleep } from './sleep';
import lockup from './assets/logo-full.png';

interface MpinInputProps {
  value?: any;
  onChange?: (...args: any[]) => any;
  invalid?: any;
}
function MpinInput({ value, onChange, invalid }: MpinInputProps) {
  const [show, setShow] = useState(false);
  const refs = useRef([]);
  const digits = [0, 1, 2, 3].map(i => value[i] || '');
  const put = (i, v) => {
    const d = v.replace(/\D/g, '');
    if (d.length > 1) { const n = (value.slice(0, i) + d).slice(0, 4); onChange(n); refs.current[Math.min(n.length, 3)]?.focus(); return; }
    const arr = [...digits]; arr[i] = d; onChange(arr.join('').slice(0, 4));
    if (d && i < 3) refs.current[i + 1]?.focus();
  };
  return (
    <div className="c2l-mpin">
      <div className="c2l-mpin-boxes" role="group" aria-labelledby="c2l-mpin-l">
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} id={i === 0 ? 'c2l-mpin' : undefined} inputMode="numeric" autoComplete="one-time-code" type={show ? 'text' : 'password'}
            aria-label={`MPIN digit ${i + 1}`} aria-invalid={invalid || undefined} value={d} maxLength={4}
            onChange={e => put(i, e.target.value)} onFocus={e => e.target.select()} onMouseUp={e => e.preventDefault()}
            onPaste={e => { e.preventDefault(); const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 4); if (t) { onChange(t); refs.current[Math.min(t.length, 3)]?.focus(); } }}
            onKeyDown={e => { if (e.key === 'Backspace' && !digits[i] && i) refs.current[i - 1]?.focus(); }} />
        ))}
      </div>
      <button type="button" className="c2l-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide MPIN' : 'Show MPIN'} aria-pressed={show}><Icon icon={show ? EyeOff : Eye} size={16} /></button>
    </div>
  );
}

const HERO_TILES = [['Enterprise Core', 'RBAC, SSO, audit and multi tenancy'], ['AI Runtime', 'Model gateway, prompts and guardrails'], ['Agentic AI', 'Agents, tools and human approval'],
  ['Knowledge & RAG', 'Hybrid search with source citations'], ['Evaluation', 'Eval suites and regression gates'], ['Docs to Data', 'OCR and structured extraction'],
  ['Engagement', 'Email, SMS, WhatsApp and in app'], ['Accelerators', 'Templates and GenAI copilots'], ['Project Setup', 'Standard project scaffolding'], ['Deployment', 'CI/CD, health checks, rollbacks']];
const tileOf = (p?: any) => <span className="c2l-tile" style={{ background: p.color }} aria-hidden="true">{(p.name || p.code || '?').charAt(0).toUpperCase()}</span>;

// Demo lookup. Replace with your API: resolve the ID + MPIN to { user, projects: [{ id, name, desc, color, roles: [{ id, name, unit }] }] } or { error }.
const DEMO_PROJECTS = [
  { id: 'core', name: 'Core Admin', desc: 'Platform administration', color: '#18181B', roles: [{ id: 'r1', name: 'Super Admin', unit: 'All units (global)' }] },
  { id: 'legal', name: 'Legal Assistant', desc: 'Criminal law Q&A over BNS, BNSS and POCSO', color: '#1769A1', roles: [{ id: 'r2', name: 'Prompt Engineer', unit: 'Head Office' }, { id: 'r3', name: 'Reviewer', unit: 'North District' }] },
  { id: 'tallman', name: 'Tallman Catalog', desc: 'Product answers over 15,402 catalog items', color: '#A8196F', roles: [] },
];
const demoLookup = async (id?: any, mpin?: any) => mpin === '0000' ? { error: 'Invalid User ID or MPIN.' } : { user: { id }, projects: DEMO_PROJECTS };

export interface SignInScreenProps {
  logo?: any;
  lookup?: any;
  onSignIn?: (...args: any[]) => any;
  defaultId?: any;
  defaultMpin?: any;
}
export function SignInScreen({ logo = lockup, lookup = demoLookup, onSignIn = () => {}, defaultId = 'kavya.iyer@4sightai.example', defaultMpin = '1234' }: SignInScreenProps) {
  const [loginId, setLoginId] = useState(defaultId);
  const [mpin, setMpin] = useState(defaultMpin);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [step, setStep] = useState('cred');      // cred · project · signing · role · norole · done
  const [acct, setAcct] = useState(null);
  const [proj, setProj] = useState(null);
  const [filter, setFilter] = useState('');
  const idRef = useRef<any>(null);
  useEffect(() => { idRef.current?.focus(); }, []);

  const finish = (project, role) => { setStep('done'); onSignIn({ user: acct?.user, project, role }); };
  const enter = async (project, showScreen) => {
    setProj(project);
    if (showScreen) setStep('signing'); else setBusy(true);
    await sleep(showScreen ? 900 : 650); setBusy(false);
    if (project.roles.length === 1) return finish(project, project.roles[0]);
    setStep(project.roles.length ? 'role' : 'norole');
  };
  const submit = async e => {
    e.preventDefault();
    if (!loginId.trim()) { setErr('Enter your User ID or work email.'); idRef.current?.focus(); return; }
    if (mpin.length < 4) { setErr('Enter your 4-digit MPIN.'); document.getElementById('c2l-mpin')?.focus(); return; }
    setErr(''); setBusy(true); await sleep(500);
    const r = await lookup(loginId.trim(), mpin);
    if (r.error) { setBusy(false); setErr(r.error); return; }
    setAcct(r);
    if (r.projects.length > 1) { setBusy(false); setFilter(''); setStep('project'); return; }
    await enter(r.projects[0], false);
  };
  const back = () => { setStep('cred'); setAcct(null); setProj(null); setBusy(false); };
  const shown = acct ? acct.projects.filter(p => !filter.trim() || (p.name + ' ' + (p.desc || '')).toLowerCase().includes(filter.trim().toLowerCase())) : [];
  const year = new Date().getFullYear();

  return (
    <div className="c2l" data-signin="c2">
      <aside className="c2l-art">
        <div className="c2l-logo"><img src={logo} alt="4S CoreAstrum, GenAI Foundation" /></div>
        <div className="c2l-art-body">
          <p className="c2l-eyebrow">4S CoreAstrum</p>
          <h2 className="c2l-art-h">The GenAI foundation<br />for enterprise teams.</h2>
          <p className="c2l-art-p">Build faster. Operate with confidence. Power enterprise AI.</p>
          <ul className="c2l-tiles">{HERO_TILES.map(([t, d]: any) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
          <ul className="c2l-checks">{['Role based access', 'Single sign on', 'Audit logging', 'Multi tenant'].map(c => <li key={c}><Icon icon={Check} size={14} />{c}</li>)}</ul>
        </div>
        <p className="c2l-art-foot">© {year} 4sCoreASTRUM · v1.0.0</p>
      </aside>
      <main className="c2l-main">
        <header className="c2l-brand"><img className="c2l-lockup" src={logo} alt="4S CoreAstrum" /></header>
        <div className="c2l-body">
          {step === 'cred' && (
            <form className="c2l-card c2l-in" onSubmit={submit} noValidate>
              <div><h1 className="c2l-h">Sign in</h1><p className="c2l-sub">Use your User ID or work email to continue.</p></div>
              {err && <div className="c2l-err" role="alert"><Icon icon={CircleAlert} size={16} /><span>{err}</span></div>}
              <div className="field">
                <label htmlFor="li-id">User ID or email</label>
                <input id="li-id" ref={idRef} className="input c2l-input" placeholder="name@company.com" required value={loginId} autoComplete="username" onChange={e => { setLoginId(e.target.value); if (err) setErr(''); }} />
              </div>
              <div className="field">
                <div className="c2l-row"><label id="c2l-mpin-l" htmlFor="c2l-mpin">MPIN</label><button type="button" className="c2l-link" aria-expanded={forgot} onClick={() => setForgot(f => !f)}>Forgot MPIN?</button></div>
                <MpinInput value={mpin} onChange={v => { setMpin(v); if (err) setErr(''); }} invalid={/MPIN/.test(err)} />
                {forgot && <span className="hint" role="status">Ask your administrator to reset your MPIN.</span>}
              </div>
              <Button kind="primary" size="lg" type="submit" loading={busy} className="c2l-submit">{busy ? 'Signing in…' : 'Sign in'}</Button>
              <p className="c2l-note"><Icon icon={ShieldCheck} size={14} />Protected by role-based access and audit logging.</p>
            </form>
          )}
          {step === 'project' && acct && (
            <div className="c2l-card c2l-in">
              <button type="button" className="c2l-back" onClick={back}><Icon icon={ArrowLeft} size={14} />Back</button>
              <div><h1 className="c2l-h">Choose a project</h1><p className="c2l-sub"><b>{loginId.trim()}</b> has access to more than one project.</p></div>
              {acct.projects.length > 6 && <div className="input-icon"><Icon icon={Search} size={14} /><input className="input" placeholder="Search projects" aria-label="Search projects" value={filter} onChange={e => setFilter(e.target.value)} /></div>}
              <ul className="c2l-list" aria-label="Projects">
                {shown.map(p => <li key={p.id}><button type="button" className="c2l-choice" onClick={() => enter(p, true)}>{tileOf(p)}<span className="c2l-choice-t"><b>{p.name}</b>{p.desc && <span>{p.desc}</span>}</span><Icon icon={ChevronRight} size={16} className="c2l-chev" /></button></li>)}
                {!shown.length && <li className="c2l-empty">No projects match “{filter.trim()}”.</li>}
              </ul>
            </div>
          )}
          {step === 'signing' && proj && (
            <div className="c2l-card c2l-in c2l-signing" role="status" aria-live="polite">
              {tileOf(proj)}<h1 className="c2l-h">Signing in to {proj.name}</h1><p className="c2l-sub">Loading your roles and permissions…</p>
              <div className="c2l-bar"><div className="bar indeterminate"><i /></div></div>
            </div>
          )}
          {step === 'role' && proj && (
            <div className="c2l-card c2l-in">
              <button type="button" className="c2l-back" onClick={back}><Icon icon={ArrowLeft} size={14} />Back to login</button>
              <div><h1 className="c2l-h">Select your role</h1><p className="c2l-sub">You have more than one role. Pick the one to continue with.</p></div>
              <ul className="c2l-list" aria-label="Roles">{proj.roles.map(r => (
                <li key={r.id}><button type="button" className="c2l-choice" onClick={() => finish(proj, r)}><span className="c2l-tile role" aria-hidden="true"><Icon icon={ShieldCheck} size={16} /></span><span className="c2l-choice-t"><b>{r.name}</b><span>{r.unit}</span></span><Icon icon={ChevronRight} size={16} className="c2l-chev" /></button></li>))}</ul>
            </div>
          )}
          {step === 'norole' && (
            <div className="c2l-card c2l-in">
              <div className="c2l-err" role="alert"><Icon icon={CircleAlert} size={16} /><span>No active role is assigned to your account. Please contact your administrator.</span></div>
              <Button kind="primary" size="lg" className="c2l-submit" onClick={back}>Back to login</Button>
            </div>
          )}
          {step === 'done' && (
            <div className="c2l-card c2l-in c2l-signing" role="status"><Icon icon={Check} size={20} /><h1 className="c2l-h">Signed in to {proj?.name}</h1><button type="button" className="c2l-link" onClick={back}>Sign in again</button></div>
          )}
        </div>
        <footer className="c2l-foot"><span>© {year} 4SightAI</span><span>Trouble signing in? Contact your administrator.</span></footer>
      </main>
    </div>
  );
}
