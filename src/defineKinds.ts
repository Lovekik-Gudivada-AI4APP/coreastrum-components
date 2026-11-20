// defineKinds · CoreAstrum AI Studio, from the prototype's src/signal.jsx.
// Needs tokens.css and foundations.css once per app.


/* ------------------------------------------------------------------ Lineage */
const KIND = {
  kb: ['Knowledge base', 'knowledge bases'], pipeline: ['Pipeline', 'pipelines'], pipelineRun: ['Run', 'runs'], artifact: ['Artifact', 'artifacts'], rag: ['RAG', 'RAGs'],
  agent: ['Agent', 'agents'], prompt: ['Prompt', 'prompts'], model: ['Model', 'models'], connection: ['Connection', 'connections'], evalSuite: ['Eval suite', 'eval suites'],
  evalRun: ['Eval run', 'eval runs'], conversation: ['Conversation', 'conversations'], source: ['Sources', 'sources'],
};

/* Modules outside AI register their record kinds once: defineKinds({ unit: ['Unit', 'units'] }). */
export function defineKinds(map?: any) { Object.assign(KIND, map); }
