const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// ─── Google ───────────────────────────────────────────────────────────────────

function googleClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
  );
}

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.readonly',
];

router.get('/google', (_req, res) => {
  const url = googleClient().generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES,
    prompt: 'consent',
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const client = googleClient();
    const { tokens } = await client.getToken(code);
    req.session.google = tokens;
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?connected=google`);
  } catch (err) {
    console.error('Google auth error:', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=google`);
  }
});

// ─── Outlook (Microsoft) ──────────────────────────────────────────────────────

const MS_TENANT = 'common';
const MS_AUTH_BASE = `https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0`;
const MS_SCOPES = 'openid offline_access Calendars.ReadWrite';

router.get('/outlook', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.OUTLOOK_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI || 'http://localhost:3001/auth/outlook/callback',
    scope: MS_SCOPES,
    response_mode: 'query',
  });
  res.redirect(`${MS_AUTH_BASE}/authorize?${params}`);
});

router.get('/outlook/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const body = new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI || 'http://localhost:3001/auth/outlook/callback',
      grant_type: 'authorization_code',
    });
    const fetch = require('node-fetch');
    const resp = await fetch(`${MS_AUTH_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const tokens = await resp.json();
    req.session.outlook = tokens;
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?connected=outlook`);
  } catch (err) {
    console.error('Outlook auth error:', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=outlook`);
  }
});

// ─── Apple (iCloud CalDAV via app-specific password) ─────────────────────────

router.post('/apple', async (req, res) => {
  const { appleId, appPassword } = req.body;
  if (!appleId || !appPassword) {
    return res.status(400).json({ error: 'appleId and appPassword are required' });
  }
  // Validate credentials by attempting a PROPFIND on the CalDAV endpoint
  const fetch = require('node-fetch');
  const credentials = Buffer.from(`${appleId}:${appPassword}`).toString('base64');
  try {
    const resp = await fetch('https://caldav.icloud.com/', {
      method: 'PROPFIND',
      headers: {
        Authorization: `Basic ${credentials}`,
        Depth: '0',
        'Content-Type': 'application/xml',
      },
      body: `<?xml version="1.0" encoding="UTF-8"?><D:propfind xmlns:D="DAV:"><D:prop><D:resourcetype/></D:prop></D:propfind>`,
    });
    if (resp.status === 401) {
      return res.status(401).json({ error: 'Invalid Apple credentials' });
    }
    req.session.apple = { appleId, appPassword };
    res.json({ ok: true });
  } catch (err) {
    console.error('Apple auth error:', err);
    res.status(500).json({ error: 'Failed to connect to iCloud' });
  }
});

// ─── Session status ───────────────────────────────────────────────────────────

router.get('/status', (req, res) => {
  res.json({
    google: !!req.session.google,
    outlook: !!req.session.outlook,
    apple: !!req.session.apple,
  });
});

router.post('/disconnect/:provider', (req, res) => {
  const { provider } = req.params;
  delete req.session[provider];
  res.json({ ok: true });
});

module.exports = router;
