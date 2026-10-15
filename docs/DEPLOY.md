# Deploying the Website (Netlify + PostgreSQL)

The Android APK only opens a website. The website must be deployed first, on HTTPS, and then the APK is built with that address.

The app is a **Next.js 16** project with server routes and a **PostgreSQL** database. It needs both a hosted Next.js runtime and a hosted database.

---

## 1. Create a PostgreSQL database

Any PostgreSQL 14+ host works. The steps below use **Neon** (free tier):

1. Sign up at https://neon.tech and create a project.
2. Copy the **pooled** connection string. It looks like:
   `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`
3. Keep it private. Do not commit it to Git.

## 2. Create the tables

Run the migrations once, in order. From your computer (needs `psql`):

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
psql "$DATABASE_URL" -f drizzle/0000_init.sql
psql "$DATABASE_URL" -f drizzle/0001_add_user_password.sql
```

Or paste the contents of each file into the Neon SQL editor and run them in that order.

Do not run them twice on the same database. The second run fails because the tables already exist.

## 3. Deploy on Netlify

1. Sign in at https://app.netlify.com and click **Add new site → Import an existing project**.
2. Choose **GitHub** and select the repository `pakyji/gta`.
3. Netlify detects Next.js. Keep these defaults:
   - Build command: `npm run build`
   - Publish directory: leave empty (Netlify's Next.js runtime handles it)
4. Open **Site configuration → Environment variables** and add:

| Name | Value |
|---|---|
| `DATABASE_URL` | Your Neon pooled connection string |
| `NODE_VERSION` | `22` |
| `APP_URL` | Your Netlify address, e.g. `https://your-site.netlify.app` |
| `FORCE_SECURE_COOKIES` | `1` |
| `NEWS_REFRESH_SECRET` | A random string, 16 characters or more |

Optional: `NEWS_FEED_URL`, `GROQ_API_KEY`, `OPENAI_API_KEY`, and other keys listed in `.env.example`. The AI assistants work without a key (they use the free Pollinations provider).

5. Click **Deploy site** and wait for the build to finish.
6. Open the site address. Check that `https://your-site.netlify.app/api/health` returns an OK response.

If the build fails, open the deploy log and look for the first error. The most common causes are a missing `DATABASE_URL` or a Node version that is too old.

## 4. Build the APK with your address

When the site works on HTTPS, build the APK with that address:

```bash
cd android
./gradlew assembleRelease -PappUrl=https://your-site.netlify.app
```

See `docs/ANDROID_APK.md` for the full APK guide.

## Checklist

- [ ] Database created and both migrations run
- [ ] Netlify site deployed, with all environment variables set
- [ ] `/api/health` returns OK over HTTPS
- [ ] `APP_URL` matches the address used for the APK
- [ ] APK built with `-PappUrl=https://...`
