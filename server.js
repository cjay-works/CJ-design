const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const root = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const maxBodyBytes = 16 * 1024;
const rateWindowMs = 15 * 60 * 1000;
const rateLimit = 5;
const attempts = new Map();
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

let pool = null;
let databaseReady = false;
let databaseInitPromise = null;

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), 'application/json; charset=utf-8');
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > maxBodyBytes) {
        reject(Object.assign(new Error('Request too large'), { code: 'BODY_TOO_LARGE' }));
        req.destroy();
        return;
      }
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        reject(Object.assign(new Error('Invalid JSON'), { code: 'INVALID_JSON' }));
      }
    });
    req.on('error', reject);
  });
}

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
    .slice(0, 80);
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < rateWindowMs);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > rateLimit;
}

function clean(value, max) {
  return String(value || '').trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 254;
}

async function initDatabase() {
  if (databaseReady) return true;
  if (!process.env.DATABASE_URL) return false;
  if (!databaseInitPromise) {
    databaseInitPromise = (async () => {
      pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 5,
        ssl: { rejectUnauthorized: false },
      });
      await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          name VARCHAR(120) NOT NULL,
          email VARCHAR(254) NOT NULL,
          business VARCHAR(120) NOT NULL,
          message TEXT NULL,
          source VARCHAR(32) NOT NULL DEFAULT 'website',
          status VARCHAR(24) NOT NULL DEFAULT 'new',
          PRIMARY KEY (id),
          INDEX leads_created_at_idx (created_at),
          INDEX leads_status_idx (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      databaseReady = true;
      console.log('CJ Design lead database ready');
      return true;
    })().catch((error) => {
      databaseInitPromise = null;
      databaseReady = false;
      console.error('Lead database initialization failed:', error.message);
      return false;
    });
  }
  return databaseInitPromise;
}

async function notifyOwner(lead) {
  const apiUrl = process.env.MANUS_API_URL;
  const apiKey = process.env.MANUS_API_KEY;
  if (!apiUrl || !apiKey) return;

  const content = [
    `New CJ Design website enquiry #${lead.id}`,
    `Name: ${lead.name}`,
    `Reply email: ${lead.email}`,
    `Website type: ${lead.business}`,
    `Message: ${lead.message || 'No additional message.'}`,
  ].join('\n');

  const response = await fetch(`${apiUrl}/webdevtoken.v1.WebDevService/SendNotification`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'connect-protocol-version': '1',
    },
    body: JSON.stringify({
      title: 'New CJ Design website enquiry',
      content,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Owner notification failed (${response.status}): ${detail.slice(0, 240)}`);
  }
}

async function handleLead(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    sendJson(res, 429, { ok: false, error: 'Please wait a few minutes before trying again.' });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    sendJson(res, error.code === 'BODY_TOO_LARGE' ? 413 : 400, { ok: false, error: error.message });
    return;
  }

  // Quietly discard obvious bot submissions without confirming the honeypot field.
  if (clean(body.website, 200)) {
    sendJson(res, 201, { ok: true, message: 'Thanks — your enquiry has been received.' });
    return;
  }

  const lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 254),
    business: clean(body.business, 120),
    message: clean(body.message, 3000),
  };

  const errors = [];
  if (lead.name.length < 2) errors.push('Please enter your name.');
  if (!isEmail(lead.email)) errors.push('Please enter a valid email address.');
  if (lead.business.length < 2) errors.push('Please select a website type.');
  if (errors.length) {
    sendJson(res, 422, { ok: false, error: errors[0], fields: errors });
    return;
  }

  if (!(await initDatabase())) {
    sendJson(res, 503, { ok: false, error: 'Lead capture is temporarily unavailable. Please email cjaydesign063@gmail.com directly.' });
    return;
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO leads (name, email, business, message) VALUES (?, ?, ?, ?)',
      [lead.name, lead.email, lead.business, lead.message || null],
    );
    const savedLead = { ...lead, id: result.insertId };

    notifyOwner(savedLead).catch((error) => {
      // The lead is already durable; an alert failure must not lose the enquiry.
      console.error(error.message);
    });

    sendJson(res, 201, { ok: true, message: 'Thanks — your enquiry has been received.', leadId: String(result.insertId) });
  } catch (error) {
    console.error('Lead insert failed:', error.message);
    sendJson(res, 500, { ok: false, error: 'We could not save your enquiry. Please email cjaydesign063@gmail.com directly.' });
  }
}

function serveStatic(req, res) {
  let cleanPath;
  try {
    cleanPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    send(res, 400, 'Bad request');
    return;
  }
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    const type = mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  });
}

const requestHandler = (req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  if (pathname === '/api/leads') {
    handleLead(req, res).catch((error) => {
      console.error('Lead API error:', error);
      sendJson(res, 500, { ok: false, error: 'Unexpected server error.' });
    });
    return;
  }
  if (pathname === '/health') {
    sendJson(res, 200, { ok: true, database: databaseReady ? 'ready' : 'initializing' });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed');
    return;
  }
  serveStatic(req, res);
};

if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await initDatabase();
    requestHandler(req, res);
  };
} else {
  const server = http.createServer(requestHandler);
  initDatabase().finally(() => {
    server.listen(port, '0.0.0.0', () => {
      console.log(`CJ Design server listening on http://0.0.0.0:${port}`);
    });
  });
}
