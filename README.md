# ResultScale AI

Next.js application for the public website, app catalogue, blog, contact inbox, accounts and administration.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set an initial `ADMIN_PASSWORD` before the first run. Initial administrator email is `admin@resultscaleai.com`. Existing `data/admin.json` credentials are preserved; change them through Admin -> Settings.
3. Run `npm run dev`, then open http://localhost:3000.
4. Check changes with `npm test`, `npm run lint`, and `npm run build`. Run a production build with `npm start`.

## Data and deployment

Saved JSON records live in `data/`; uploads live in `public/apks/` and are served through `/apks/[filename]`. Both need persistent writable storage and backups. Never commit credentials, customer data, session files or uploaded APKs. Current storage is intended for a single application instance; use a database/shared object storage before scaling to multiple instances.

The application uses Google fonts downloaded during build. SMTP, reCAPTCHA, AdSense and Flutterwave require account-specific configuration. New uploads use the same application origin; older external APK URLs can still be downloaded.

See [implementation inventory](APPLICATION_ANALYSIS.md) for the original audit and [verification status and setup](VERIFICATION_STATUS.md) for the current work, payment configuration and remaining release checks. Passing the automated checks does not establish provider integration or production readiness.
