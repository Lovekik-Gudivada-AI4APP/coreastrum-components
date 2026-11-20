// Sample records the screen kits show. Replace with your API data; the shapes are what the screens read.
export const AGENTS = [
  { id: 'a1', name: 'Policy Assistant', code: 'policy_assistant', status: 'ACTIVE', model: 'gpt-4o-mini', runs: 4812, project: 'Core', updated: '12 min ago' },
  { id: 'a2', name: 'Grievance Triage', code: 'grievance_triage', status: 'RUNNING', model: 'claude-sonnet', runs: 1206, project: 'Legal Assistant', updated: '1 h ago' },
  { id: 'a3', name: 'Tender Summariser', code: 'tender_summariser', status: 'DRAFT', model: 'gpt-4o', runs: 318, project: 'Core', updated: 'Yesterday' },
  { id: 'a4', name: 'FIR Desk Triage', code: 'fir_desk_triage', status: 'ACTIVE', model: 'claude-haiku', runs: 2940, project: 'Legal Assistant', updated: '3 h ago' },
  { id: 'a5', name: 'catalog answers', code: 'catalog_answers', status: 'FAILED', model: 'gemini-flash', runs: 77, project: 'Tallman Catalog', updated: '2 days ago' },
  { id: 'a6', name: 'Bail Order Reader', code: 'bail_reader', status: 'ACTIVE', model: 'gpt-4o-mini', runs: 512, project: 'Legal Assistant', updated: '4 days ago' },
  { id: 'a7', name: 'Asset Tagger', code: 'asset_tagger', status: 'INACTIVE', model: 'llama-3.1-70b', runs: 0, project: 'Tallman Catalog', updated: '1 week ago' },
];
export const SERIES = Array.from({ length: 22 }, (_, i) => ({ status: i === 13 ? 'bad' : i % 7 === 3 ? 'warn' : i === 21 ? 'live' : 'ok', value: 600 + ((i * 137) % 900), tip: `Call ${i + 1}` }));
const node = (kind?: any, label?: any, extra = {}) => ({ kind, id: label, label, ident: label.toLowerCase().replace(/\W+/g, '_'), health: 'ok', ...extra });
export const LINEAGE = [[node('prompt', 'Criminal Law Answer', { stage: 'reason' }), node('model', 'Claude Sonnet 5', { stage: 'reason', health: 'warn' })], node('agent', 'FIR desk triage', { stage: 'reason', current: true }), [node('evalSuite', 'FIR desk tool selection', { stage: 'improve', health: 'bad' })]];
