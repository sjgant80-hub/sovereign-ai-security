// sovereign-ai-security · tools/inline.mjs — copy the gated kernel into index.html, byte for byte, between the
// /*KERNEL:BEGIN*/ and /*KERNEL:END*/ markers. The body is kernel.mjs from its first export to its default export,
// with each `export ` removed so it runs as a plain script. page-parity.test.mjs holds the two equal in CI.
//   node tools/inline.mjs           write the kernel into the page
//   node tools/inline.mjs --check   fail unless the page already holds exactly this kernel
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function kernelBody(src) {
  const s = String(src).replace(/\r\n/g, '\n');
  const start = s.indexOf('export const STATUS');
  const end = s.indexOf('export default');
  if (start < 0 || end < start) throw new Error('kernel markers not found');
  return s.slice(start, end).replace(/\bexport /g, '').trimEnd();
}

const kernel = readFileSync(join(root, 'kernel.mjs'), 'utf8');
const page = readFileSync(join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const a = page.indexOf('/*KERNEL:BEGIN*/'), b = page.indexOf('/*KERNEL:END*/');
if (a < 0 || b < a) { console.error('page markers not found'); process.exit(1); }
const next = page.slice(0, a) + '/*KERNEL:BEGIN*/\n' + kernelBody(kernel) + '\n' + page.slice(b);
if (process.argv.includes('--check')) {
  if (next !== page) { console.error('index.html does not hold the current kernel: run node tools/inline.mjs'); process.exit(1); }
  console.log('page holds the gated kernel byte for byte');
} else {
  writeFileSync(join(root, 'index.html'), next);
  console.log('kernel inlined into index.html');
}
