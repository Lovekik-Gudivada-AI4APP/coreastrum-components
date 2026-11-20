// ApiStatusBadge · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus ApiStatusBadge.css.
import React from 'react';

export interface ApiStatusBadgeProps {
  kind?: any;
  api?: any;
  note?: any;
}
// Provenance marker shown in Blueprint mode. kind: live | partial | proposed
export function ApiStatusBadge({ kind = 'live', api, note }: ApiStatusBadgeProps) {
  const label = { live: 'Live API', partial: 'Partial', proposed: 'Proposed' }[kind];
  const tip = [label, api, note].filter(Boolean).join(' · ');
  return <span className={'prov ' + kind + ' tip'} data-tip={tip.length > 70 ? tip.slice(0, 68) + '…' : tip} title={tip} tabIndex={0}>{label}</span>;
}
