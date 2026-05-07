# Cal — Multi-Calendar Event Tool

Create events, invite guests, and check everyone's availability across Google, Outlook, and Apple Calendar — all in one simple UI with voice input.

## Features

- **Connect** Google Calendar (OAuth), Outlook/Microsoft 365 (OAuth), and Apple iCloud Calendar (CalDAV + app-specific password)
- **Create events** with title, time, description, and multiple guest invites
- **Voice input** — click the mic and say "Team standup at 9am tomorrow" to fill fields automatically
- **Availability grid** — pull in your own busy times and guests' free/busy windows side by side

## Quick start

### 1. Copy env and fill credentials

```bash
cp server/.env.example server/.env
# Then edit server/.env with your API keys
```

### 2. Set up OAuth apps

| Provider | Where |
|---|---|
| Google | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID |
| Outlook | [portal.azure.com](https://portal.azure.com) → App registrations → New registration |
| Apple | No app needed — users supply Apple ID + [app-specific password](https://appleid.apple.com/account/manage) |

Both OAuth apps need these redirect URIs whitelisted:
- Google: `http://localhost:3001/auth/google/callback`
- Outlook: `http://localhost:3001/auth/outlook/callback`

### 3. Install & run

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001

## Architecture

```
calendar-tool/
├── server/          Express API
│   ├── routes/
│   │   ├── auth.js          OAuth flows (Google, Outlook, Apple)
│   │   ├── calendar.js      Create events
│   │   └── availability.js  Free/busy queries
│   └── index.js
└── client/          React + Vite + Tailwind
    └── src/
        ├── components/
        │   ├── CalendarConnect.tsx   Provider connection UI
        │   ├── EventCreator.tsx      Event form + voice
        │   └── AvailabilityView.tsx  Visual calendar grid
        ├── hooks/
        │   └── useVoice.ts           Web Speech API
        └── lib/api.ts                Backend API client
```
