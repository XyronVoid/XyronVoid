// Local preview server: node serve.mjs  ->  http://localhost:5200
// Serves public/, runs /api/* through the shared api-core and stores
// everything in data/ (content.json + uploads/).

import http from 'node:http';
import { readFile, writeFile, mkdir, unlink, rename, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApi } from './server/api-core.mjs';
import { renderIndex } from './server/render-page.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const UPLOADS = path.join(DATA, 'uploads');
const CONTENT_FILE = path.join(DATA, 'content.json');
const CONFIG_FILE = path.join(ROOT, 'site.config.json');
const PORT = Number(process.env.PORT) || 5200;

// Minimal .env loader (no extra dependency)
function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i.exec(line);
    if (!m || line.trim().startsWith('#')) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}
loadEnv();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

const TYPE_EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const imageFile = (id, type) => path.join(UPLOADS, id + (TYPE_EXT[type] || '.bin'));

// Write to a temp file then rename, so a crash never leaves half a file.
async function atomicWrite(file, data) {
  const tmp = file + '.tmp';
  await writeFile(tmp, data);
  await rename(tmp, file);
}

const fileStorage = {
  async getContent() {
    try {
      return JSON.parse(await readFile(CONTENT_FILE, 'utf8'));
    } catch {
      return null;
    }
  },
  async setContent(content) {
    await mkdir(DATA, { recursive: true });
    await atomicWrite(CONTENT_FILE, JSON.stringify(content, null, 2));
  },
  async getImage(id) {
    for (const [type, ext] of Object.entries(TYPE_EXT)) {
      try {
        return { data: await readFile(path.join(UPLOADS, id + ext)), type };
      } catch {}
    }
    return null;
  },
  async setImage(id, data, type) {
    await mkdir(UPLOADS, { recursive: true });
    await atomicWrite(imageFile(id, type), data);
  },
  async deleteImage(id) {
    for (const ext of Object.values(TYPE_EXT)) {
      await unlink(path.join(UPLOADS, id + ext)).catch(() => {});
    }
  },
};

function readConfig() {
  return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
}

const api = createApi({
  storage: fileStorage,
  getPassword: () => process.env.ADMIN_PASSWORD || '',
  timeZone: (() => {
    try {
      return readConfig().timezone || 'Asia/Kolkata';
    } catch {
      return 'Asia/Kolkata';
    }
  })(),
});

async function toWebRequest(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  return new Request(`http://${req.headers.host || 'localhost'}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
  });
}

async function sendWebResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function send(res, status, body, type = 'text/plain; charset=utf-8', headers = {}) {
  res.writeHead(status, { 'content-type': type, ...headers });
  res.end(body);
}

async function serveStatic(req, res, pathname) {
  // Live config for the admin panel and the site
  if (pathname === '/site.config.json') {
    return send(res, 200, await readFile(CONFIG_FILE), MIME['.json'], { 'cache-control': 'no-store' });
  }

  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  if (rel === '/admin' || rel === '/admin/') rel = '/admin.html';
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, 'Forbidden');

  let info;
  try {
    info = await stat(file);
  } catch {
    return send(res, 404, 'Not found');
  }
  if (info.isDirectory()) return send(res, 404, 'Not found');

  const ext = path.extname(file).toLowerCase();
  const headers = { 'cache-control': 'no-cache' };
  if (rel === '/admin.html') headers['x-robots-tag'] = 'noindex';

  if (rel === '/index.html') {
    // Bake the current site.config.json into the page (same as the Netlify build)
    const html = renderIndex(await readFile(file, 'utf8'), readConfig());
    return send(res, 200, html, MIME['.html'], headers);
  }
  return send(res, 200, await readFile(file), MIME[ext] || 'application/octet-stream', headers);
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  try {
    if (pathname.startsWith('/api/')) {
      return await sendWebResponse(res, await api.handle(await toWebRequest(req)));
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    await serveStatic(req, res, pathname);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) send(res, 500, 'Server error');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Site:   http://localhost:${PORT}`);
  console.log(`  Admin:  http://localhost:${PORT}/admin`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('\n  ! ADMIN_PASSWORD is not set. Copy .env.example to .env and set a password to use the admin panel.');
  }
  console.log('');
});
