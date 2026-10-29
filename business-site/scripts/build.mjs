// Netlify build step (also safe to run locally): bakes site.config.json into
// public/index.html and copies it to public/site.config.json for the admin panel.

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderIndex } from '../server/render-page.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const configFile = path.join(ROOT, 'site.config.json');
const indexFile = path.join(ROOT, 'public', 'index.html');

const config = JSON.parse(readFileSync(configFile, 'utf8'));
writeFileSync(indexFile, renderIndex(readFileSync(indexFile, 'utf8'), config));
copyFileSync(configFile, path.join(ROOT, 'public', 'site.config.json'));
console.log(`Built site for "${config.business?.name}" (${config.theme?.preset || 'dark-gold'})`);
