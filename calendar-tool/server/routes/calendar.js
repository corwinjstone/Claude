const express = require('express');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const router = express.Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function googleAuth(session) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials(session.google);
  return client;
}

async function outlookHeaders(session) {
  const tokens = session.outlook;
  // Refresh if expired
  if (tokens.expires_at && Date.now() > tokens.expires_at - 60000) {
    const body = new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    });
    const resp = await fetch(
      `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }
    );
    const refreshed = await resp.json();
    session.outlook = { ...tokens, ...refreshed, expires_at: Date.now() + refreshed.expires_in * 1000 };
  }
  return { Authorization: `Bearer ${session.outlook.access_token}`, 'Content-Type': 'application/json' };
}

// ─── List calendars ───────────────────────────────────────────────────────────

router.get('/list', async (req, res) => {
  const calendars = [];
  const errors = [];

  if (req.session.google) {
    try {
      const auth = googleAuth(req.session);
      const cal = google.calendar({ version: 'v3', auth });
      const { data } = await cal.calendarList.list();
      calendars.push(...(data.items || []).map(c => ({
        provider: 'google', id: c.id, name: c.summary, color: c.backgroundColor,
      })));
    } catch (e) { errors.push({ provider: 'google', error: e.message }); }
  }

  if (req.session.outlook) {
    try {
      const headers = await outlookHeaders(req.session);
      const resp = await fetch('https://graph.microsoft.com/v1.0/me/calendars', { headers });
      const data = await resp.json();
      calendars.push(...(data.value || []).map(c => ({
        provider: 'outlook', id: c.id, name: c.name, color: c.hexColor,
      })));
    } catch (e) { errors.push({ provider: 'outlook', error: e.message }); }
  }

  res.json({ calendars, errors });
});

// ─── Create event ─────────────────────────────────────────────────────────────

router.post('/event', async (req, res) => {
  const { provider, title, description, start, end, attendees, calendarId } = req.body;

  if (!provider || !title || !start || !end) {
    return res.status(400).json({ error: 'provider, title, start, end are required' });
  }

  try {
    if (provider === 'google') {
      if (!req.session.google) return res.status(401).json({ error: 'Not connected to Google' });
      const auth = googleAuth(req.session);
      const cal = google.calendar({ version: 'v3', auth });
      const event = {
        summary: title,
        description,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: (attendees || []).map(email => ({ email })),
        conferenceData: undefined,
      };
      const { data } = await cal.events.insert({
        calendarId: calendarId || 'primary',
        resource: event,
        sendUpdates: 'all',
      });
      return res.json({ ok: true, eventId: data.id, link: data.htmlLink });
    }

    if (provider === 'outlook') {
      if (!req.session.outlook) return res.status(401).json({ error: 'Not connected to Outlook' });
      const headers = await outlookHeaders(req.session);
      const event = {
        subject: title,
        body: { contentType: 'text', content: description || '' },
        start: { dateTime: start, timeZone: 'UTC' },
        end: { dateTime: end, timeZone: 'UTC' },
        attendees: (attendees || []).map(email => ({
          emailAddress: { address: email },
          type: 'required',
        })),
      };
      const calPath = calendarId ? `calendars/${calendarId}/events` : 'me/events';
      const resp = await fetch(`https://graph.microsoft.com/v1.0/${calPath}`, {
        method: 'POST', headers, body: JSON.stringify(event),
      });
      const data = await resp.json();
      return res.json({ ok: true, eventId: data.id, link: data.webLink });
    }

    if (provider === 'apple') {
      if (!req.session.apple) return res.status(401).json({ error: 'Not connected to Apple Calendar' });
      // Apple/iCloud CalDAV event creation
      const { appleId, appPassword } = req.session.apple;
      const uid = require('uuid').v4();
      const credentials = Buffer.from(`${appleId}:${appPassword}`).toString('base64');

      // Format dates for iCalendar
      const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace('.000', '');
      const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CalendarTool//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${title}`,
        description ? `DESCRIPTION:${description}` : '',
        ...(attendees || []).map(e => `ATTENDEE:mailto:${e}`),
        'END:VEVENT',
        'END:VCALENDAR',
      ].filter(Boolean).join('\r\n');

      // Discover the user's principal CalDAV URL first
      const calUrl = calendarId || `https://caldav.icloud.com/`;
      const putResp = await fetch(`${calUrl}${uid}.ics`, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'text/calendar; charset=utf-8',
        },
        body: ical,
      });

      if (putResp.status >= 400) {
        return res.status(500).json({ error: 'Failed to create Apple Calendar event' });
      }
      return res.json({ ok: true, eventId: uid });
    }

    res.status(400).json({ error: 'Unknown provider' });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
