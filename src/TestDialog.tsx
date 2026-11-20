// TestDialog · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app, plus TestDialog.css.
import React from 'react';
import { FlaskConical, ShieldCheck } from './icons';
import { Icon } from './Icon';
import { Dialog } from './Dialog';

export interface TestDialogProps {
  title?: any;
  sub?: any;
  subject?: any;
  promise?: any;
  onClose?: (...args: any[]) => any;
  setup?: any;
  children?: any;
  footer?: any;
}
export function TestDialog({ title, sub, subject, promise, onClose, setup, children, footer }: TestDialogProps) {
  return (
    <Dialog wide title={title} sub={sub} onClose={onClose} footer={footer}>
      <div className="tb">
        <div className="tb-top">
          <span className="tb-badge"><Icon icon={FlaskConical} size={13} />Test</span>
          {subject && <span className="tb-subj mono">{subject}</span>}
          <span className="tb-promise"><Icon icon={ShieldCheck} size={14} />{promise}</span>
        </div>
        <div className="tb-body">
          <div className="tb-setup">{setup}</div>
          <div className="tb-run">{children}</div>
        </div>
      </div>
    </Dialog>
  );
}
