// SkeletonRows · CoreAstrum AI Studio, from the prototype's src/ui.jsx.
// Needs tokens.css and foundations.css once per app, plus SkeletonRows.css.
import React from 'react';
import { Skeleton } from './Skeleton';

export interface SkeletonRowsProps {
  n?: number;
}
export function SkeletonRows({ n = 5 }: SkeletonRowsProps) {
  return <div className="col" style={{ gap: 14, padding: 16 }}>{Array.from({ length: n }, (_, i) => <div key={i} className="row" style={{ gap: 12 }}><Skeleton w={28} h={28} r={7} /><div className="col" style={{ flex: 1, gap: 6 }}><Skeleton w={`${50 + (i * 13) % 35}%`} /><Skeleton w="30%" h={10} /></div></div>)}</div>;
}
