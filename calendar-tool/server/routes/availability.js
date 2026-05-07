const express = require('express');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const router = express.Router();

function googleAuth(session) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials(session.google);
  return client;
}

async function outlookAccessToken(session) {
  const tokens = session.outlook;
  if (tokens.expires_at && Date.now() > tokens.expires_at - 60000) {
    const body = new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      client_secret: process.env.OUTLOOK_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    });
    const resp = await fetch(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }
    );
    const refreshed = await resp.json();
    session.outlook = { ...tokens, ...refreshed, expires_at: Date.now() + refreshed.expires_in * 1000 };
  }
  return session.outlook.access_token;
}

// GET /availability?start=ISO&end=ISO&emails=a@b.com,c@d.com
// Returns busy slots for the authenticated user + requested email addresses (via free/busy APIs)
router.get('/', async (req, res) => {
  const { start, end, emails } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end are required' });

  const guestEmails = emails ? emails.split(',').map(e => e.trim()).filter(Boolean) : [];
  const result = { self: [], guests: {} };

  // ── Google free/busy ──────────────────────────────────────────────────────
  if (req.session.google) {
    try {
      const auth = googleAuth(req.session);
      const cal = google.calendar({ version: 'v3', auth });

      // Get own profile first
      const me = await cal.calendarList.list({ maxResults: 1 });
      const primaryId = 'primary';

      const items = [{ id: primaryId }, ...guestEmails.map(e => ({ id: e }))];
      const { data } = await cal.freebusy.query({
        resource: {
          timeMin: start,
          timeMax: end,
          items,
        },
      });

      const calendars = data.calendars || {};

      // Own busy times
      result.self.push(...(calendars[primaryId]?.busy || []));

      // Guest busy times
      for (const email of guestEmails) {
        if (!result.guests[email]) result.guests[email] = [];
        result.guests[email].push(...(calendars[email]?.busy || []));
      }
    } catch (e) {
      console.error('Google availability error:', e.message);
    }
  }

  // ── Outlook free/busy ─────────────────────────────────────────────────────
  if (req.session.outlook) {
    try {
      const token = await outlookAccessToken(req.session);
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      const scheduleItems = [
        { scheduleId: 'me@placeholder', availabilityViewInterval: 30 },
        ...guestEmails.map(e => ({ scheduleId: e, availabilityViewInterval: 30 })),
      ];

      const resp = await fetch('https://graph.microsoft.com/v1.0/me/calendar/getSchedule', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          schedules: guestEmails,
          startTime: { dateTime: start, timeZone: 'UTC' },
          endTime: { dateTime: end, timeZone: 'UTC' },
          availabilityViewInterval: 30,
        }),
      });
      const data = await resp.json();

      for (const item of data.value || []) {
        const busySlots = (item.scheduleItems || [])
          .filter(s => s.status === 'busy' || s.status === 'tentative')
          .map(s => ({ start: s.start.dateTime, end: s.end.dateTime }));

        if (item.scheduleId === 'me') {
          result.self.push(...busySlots);
        } else {
          if (!result.guests[item.scheduleId]) result.guests[item.scheduleId] = [];
          result.guests[item.scheduleId].push(...busySlots);
        }
      }
    } catch (e) {
      console.error('Outlook availability error:', e.message);
    }
  }

  res.json(result);
});

module.exports = router;
