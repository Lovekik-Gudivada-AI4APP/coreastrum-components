// StatusBadge · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus StatusBadge.css.
import React from 'react';
import { cx } from './cx';

const STATUS = {
  ACTIVE: ['ok', 'Active'], READY: ['ok', 'Ready'], healthy: ['ok', 'Healthy'], Active: ['ok', 'Active'], PASSED: ['ok', 'Passed'], COMPLETED: ['ok', 'Completed'], DELIVERED: ['ok', 'Delivered'], published: ['ok', 'Published'],
  DRAFT: ['info', 'Draft'], draft: ['info', 'Draft'], Invited: ['info', 'Invited'], QUEUED: ['info', 'Queued'],
  INGESTING: ['ai live', 'Ingesting'], RUNNING: ['ai live', 'Running'], running: ['ai live', 'Running'],
  degraded: ['warn', 'Degraded'], WARN: ['warn', 'Warning'], PARTIAL: ['warn', 'Partial'], 'half-open': ['warn', 'Half-open'], REVIEW: ['warn', 'Needs review'],
  FAILED: ['bad', 'Failed'], down: ['bad', 'Down'], Locked: ['bad', 'Locked'], open: ['bad', 'Open'], ERROR: ['bad', 'Error'],
  INACTIVE: ['', 'Inactive'], closed: ['ok', 'Closed'], CANCELLED: ['', 'Cancelled'],
};

export interface StatusBadgeProps {
  s?: any;
  label?: any;
}
export function StatusBadge({ s, label }: StatusBadgeProps) {
  const [k, l] = STATUS[s] || ['', s];
  return <span className={cx('chip', k)}><span className="d" />{label || l}</span>;
}
