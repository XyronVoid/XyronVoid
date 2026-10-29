// npm run use -- salon   ->  copies examples/salon.json to site.config.json

import { readdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const examples = readdirSync(path.join(ROOT, 'examples'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));
const name = (process.argv[2] || '').trim().toLowerCase();

if (!name || !examples.includes(name)) {
  console.log(`Usage: npm run use -- <name>\nAvailable: ${examples.join(', ')}`);
  process.exit(name ? 1 : 0);
}

const target = path.join(ROOT, 'site.config.json');
if (existsSync(target)) copyFileSync(target, path.join(ROOT, 'site.config.backup.json'));
copyFileSync(path.join(ROOT, 'examples', `${name}.json`), target);
console.log(`site.config.json is now the "${name}" example (old file saved as site.config.backup.json).`);
