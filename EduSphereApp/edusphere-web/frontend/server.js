// Simple static file server + API proxy for deployment (ES Module)
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'https://edusphere-backend-4txo.onrender.com';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
};

const server = http.createServer((req, res) => {
  // If request starts with /api, proxy to backend service
  if (req.url.startsWith('/api')) {
    try {
      const backendUri = new URL(req.url, BACKEND_URL);
      const client = backendUri.protocol === 'https:' ? https : http;

      const proxyReq = client.request(backendUri, {
        method: req.method,
        headers: {
          ...req.headers,
          host: backendUri.host,
        }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      proxyReq.on('error', (err) => {
        console.error('API Proxy Error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend service unavailable' }));
      });

      req.pipe(proxyReq, { end: true });
      return;
    } catch (err) {
      console.error('Proxy exception:', err);
    }
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  filePath = filePath.split('?')[0];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(parseInt(PORT), '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`Proxying /api requests to: ${BACKEND_URL}`);
});
