# GTA Online Community

A community web app for GTA Online players on **PS4 and PS5**. It has live platform chat, GTA Online news, a guide library, two AI assistants, a vehicle browser, a music player, and a fun hub. It ships as a **Progressive Web App** and as an **Android APK** (a WebView shell around the same site).

Developer: **professor_ji96**

> Not affiliated with Rockstar Games. "Grand Theft Auto" and "GTA Online" are trademarks of Take-Two Interactive and Rockstar Games.

## Features

- **Guest sessions.** Pick PS4 or PS5, enter a gamertag, and set a password. The password locks the gamertag, so nobody else can take it.
- **Live chat per platform.** Messages stream over Server-Sent Events. If the stream fails, the client falls back to polling.
- **Two AI assistants.** Each has its own personality. The server calls a provider you configure. Without a key, the assistants show a clear "not configured" message.
- **GTA Online news.** Curated bulletins by default, or live items from an RSS/Atom feed (`NEWS_FEED_URL`).
- **Guides.** Money, outfits, glitches, and GCTF guides, plus an index of working glitches with links to their sources. Every method stays marked **unverified** until you test it on your build.
- **Vehicles, music, and fun hub.** A vehicle browser, a radio player, and weather, cat and dog widgets.
- **Installable.** Install from the browser as a PWA, or install the Android APK (see [docs/ANDROID_APK.md](docs/ANDROID_APK.md)).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL with Drizzle ORM · Tailwind CSS v4 · a WebView-based Android shell (Java, no AndroidX).

## Quick start

Requirements: Node.js 20.9 or newer, and a PostgreSQL 14+ database.

```bash
git clone https://github.com/<your-account>/<your-repo>.git
cd <your-repo>
cp .env.example .env        # set DATABASE_URL, and optionally AI / news keys
npm install
npx drizzle-kit migrate     # creates the tables
npm run dev                 # http://localhost:3000
```

For production:

```bash
npm run build
npm start
```

Serve the app over **HTTPS**. Install prompts and the service worker require it.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEWS_REFRESH_SECRET` | for news refresh | 16+ characters. Needed for `POST /api/news/refresh` (`Authorization: Bearer <secret>`). Without it the endpoint is disabled. |
| `NEWS_FEED_URL` | no | RSS/Atom feed for live news |
| `APP_URL` | no | Public site URL (used by tooling and the APK build) |
| `GROQ_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, … | one for full AI | Enables the AI assistants. Keys stay on the server. |
| `AI_PROVIDER`, `AI_MODEL` | no | Force a provider or model |

See `.env.example` for the full list, including the free Pollinations provider that needs no key.

## Project layout

```
android/                       Android APK project (WebView shell) — see docs/ANDROID_APK.md
docs/                          Extra guides (APK build and release)
drizzle/                       SQL migrations
public/
  icons/                       PWA and app icons
  images/                      Banners and vehicle images (placeholders — replace with real art)
  sw.js                        Service worker: offline page + cached images; /api is never cached
scripts/
  auth-live-check.sh           Live check of the login rules against a running server
src/
  app/                         Routes: pages in (app)/, API handlers in api/
  components/                  Shared UI (shell, design-system primitives)
  db/                          Drizzle schema and client
  lib/                         Constants, API client, error handling, hooks
  middleware.ts                Forwards session tokens for page loads
  modules/                     Feature modules: session, chat, ai, news, guides,
                               vehicles, music, feed, fun, install
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (needs `DATABASE_URL` set) |
| `npm start` | Run the production build |
| `npm run lint` | ESLint (React hooks rules included) |
| `npm run typecheck` | TypeScript check without emitting files |
| `bash scripts/auth-live-check.sh` | Checks the login rules on `127.0.0.1:3100` |
| `python scripts/browser-smoke-test.py` | Browser test: login, chat, guides, images (needs Playwright; set `BASE_URL`) |

## Database changes

1. Edit `src/db/schema.ts`.
2. Run `npx drizzle-kit generate --name <change>`. This creates `drizzle/XXXX_<change>.sql`.
3. Run `npx drizzle-kit migrate` (or `push` in development).

Curated news and guides are seeded the first time their tables are read. Seeded rows are upserted by slug. Glitch rows from older imports that are no longer in the index are removed.

## Security model

- **Passwords.** Stored as scrypt hashes (`scrypt$<salt>$<hash>`). Passwords are 6–72 characters.
- **Session tokens.** API calls send the token only in the `Authorization` header. They are never placed in API URLs.
- **One documented exception.** Page loads still accept a one-time `?t=<token>` link as a fallback when browser storage is blocked (for example, inside a cross-origin iframe). The link is only used in that case. Removing it would break login in those browsers.
- **Gamertag ownership.** A gamertag can be used by only one account. Renaming to a gamertag that another account uses returns `409`.
- **News refresh.** Protected by `NEWS_REFRESH_SECRET`.
- **Chat.** The stream endpoint does not carry tokens in URLs.

Old accounts created before passwords existed have no password. Their first sign-in sets one.

## Content and images

- **Glitch list.** The working-glitches index links to its sources: gtaglitches.com and the r/gtaglitches community on Reddit. Only titles, platforms, solo/non-solo mode, and links are stored. Step-by-step text is not copied from those sites. Each entry stays **unverified**, because Rockstar patches change what works.
- **Images.** The banners and vehicle pictures in `public/images/` are generated placeholders. Replace them with your own artwork, keeping the same file names, to update the look without code changes. Make sure you have the right to use any image you add.

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `npm run typecheck`, `npm run lint`, and `npm run build`. Keep secrets, keystores, and APK binaries out of commits (see `.gitignore`).

## License

No license file yet. Add a `LICENSE` file before you accept outside contributions.
