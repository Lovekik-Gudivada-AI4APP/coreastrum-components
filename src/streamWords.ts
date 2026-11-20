// streamWords · CoreAstrum AI Studio, from the prototype's src/test-bench.jsx.
// Needs tokens.css and foundations.css once per app.
import { sleep } from './sleep';

// Text that appears word by word, as a model streams it.
export async function streamWords(text?: any, onChunk?: any, { wps = 28, cancelled = () => false }: any = {}) {
  const words = text.split(/(\s+)/); let out = '';
  for (let i = 0; i < words.length; i++) {
    if (cancelled()) return out;
    out += words[i]; onChunk(out);
    if (words[i].trim()) await sleep(1000 / wps);
  }
  return out;
}
