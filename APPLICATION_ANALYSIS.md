# Application implementation inventory

Reviewed: 2026-10-31. Baseline: main at `8ab642e`.

## Scope and confidence

This inventory maps the main checkout's pages, route handlers, types, file storage, components, configuration, and integrations. It distinguishes connected code from placeholders so future changes extend existing features. Connected means the source contains a UI/API/storage path; it does not mean that path was verified in a browser or deployed environment.

Validation performed during this review: TypeScript passes; ESLint exits successfully with 58 warnings, including warnings from an alternate checkout; production build stops because Google font downloads fail. No production requests, email sends, upload operations, or destructive API tests were performed. No dependency vulnerability audit or visual/accessibility audit was performed. Environment secret values and private contact records were not inspected.

## 1. Existing implementation map

| Capability | Existing UI | API/storage | Status and reuse decision |
|---|---|---|---|
| Home | `src/app/page.tsx` | GET `/api/apps`; static services, testimonials, stats | Connected featured catalogue plus static marketing. Reuse existing page and data exports. |
| App catalogue | `src/app/apps/page.tsx` | GET `/api/apps` -> `getApps()` -> `data/apps.json` | Connected search/category filtering. Extend this catalogue; do not create a second app store. |
| App details | `src/app/apps/[id]/page.tsx` | GET `/api/apps/:id`, GET `/api/apps` for related entries | Connected descriptions, requirements, features, changelog, FAQ, safety fields, related apps. Images remain placeholders. |
| App management | `src/app/admin/apps/page.tsx` | POST `/api/apps`; PUT/DELETE `/api/apps/:id`; store CRUD | Connected CRUD for core fields, features, APK URL. Expand existing editor for unexposed fields. |
| APK upload | Same admin app editor | `/api/upload/apk`, action header `init`, `chunk`, `complete`; GET status | Connected chunking, retry, progress, assembly. Incomplete resume and unsafe authentication. Repair existing protocol. |
| Download tracking | App detail and downloads pages | POST `/api/apps/:id/download` -> `updateApp()` | Counter and URL response exist. Counts initiation, not confirmed completion; direct fallback bypasses count. Reuse endpoint. |
| Download centre | `src/app/downloads/page.tsx` | GET `/api/apps`, download POST | Connected current release links. Older releases only link to contact; no release archive. |
| Blog list | `src/app/blog/page.tsx` | GET `/api/blog` -> `getBlogPosts()` | Connected category filter and article links. |
| Article detail | `src/app/blog/[slug]/page.tsx` | Fetches all posts and searches by slug | Connected text/tags/related posts. HTML editing and public rendering disagree. |
| Blog management | `src/app/admin/blog/page.tsx` | POST `/api/blog`; PUT/DELETE `/api/blog/:id` | Connected CRUD, title-generated slug, tags, author, excerpt, content. No draft workflow. Extend existing CMS. |
| Contact submission | `src/app/contact/page.tsx` | POST `/api/contact` -> contacts JSON; optional SMTP notification | Connected persistence and conditional notification. Do not add a parallel contact pipeline. |
| Contact inbox | `src/app/admin/contacts/page.tsx` | GET `/api/contacts`; PATCH `/api/contacts/:id` | Connected inbox/detail/read/replied workflow. Reply opens mail client; does not send server-side replies. |
| Admin sign-in | `src/app/admin/login/page.tsx` | POST `/api/auth/login`; `data/admin.json` | Connected credential comparison, cookie, localStorage copy, redirect. Security model must be replaced in place. |
| Admin session check/logout | `src/app/admin/layout.tsx` | GET `/api/auth/me`; POST `/api/auth/logout` | Connected client gate and cookie clearing. No robust signed session/revocation. |
| Password change | `src/app/admin/settings/page.tsx` | PUT `/api/admin/settings` -> `updateAdminPassword()` | Connected old-password check and persistence; plaintext storage. Preserve workflow while replacing internals. |
| Google settings | Same settings page | GET/PUT `/api/admin/settings`; root layout reads store | Search verification, GA and GTM injection exist. CAPTCHA fields exist without enforcement. |
| Monetization administration | `src/app/admin/monetization/page.tsx` | GET/PUT `/api/admin/monetization` -> monetization JSON | Six existing tabs: ads, subscriptions, premium apps, affiliates, service packages, membership. Configuration is implemented; transactions are not. |
| Pricing | `src/app/pricing/page.tsx` | Reads monetization config | Config-backed tiers/packages/premium price. CTAs lead to contact/apps, not checkout. |
| Services | `src/app/services/page.tsx` | Static services plus configured service packages | Both service descriptions and sale packages already exist; clarify their relationship before adding another model. |
| Ads | `src/components/AdSlot.tsx` | Reads monetization config | Shared slot visibility/container exists. Ad network script and initialization are missing. |
| Public registration/login | `src/app/account/register/page.tsx`, `account/login/page.tsx` | Registration route exists but forms do not call it | UI placeholders; register API returns success without persistence/email. No public-user login implementation. |
| Account dashboard | `src/app/account/page.tsx` | `User` interface exists; no user storage | Hardcoded logged-out state, sample profile, inert quick actions. Extend this route if accounts are required. |
| Admin dashboard | `src/app/admin/page.tsx` | No metrics API | Navigation works; totals and system status are hardcoded. |
| User management | `src/app/admin/users/page.tsx` | None | Sample rows and inactive Manage button. |
| Analytics | `src/app/admin/analytics/page.tsx` | No analytics query path | Sample counts/activity; chart placeholder. Existing app download totals can support an initial aggregate. Historical analytics need events. |
| Security reports | `src/app/admin/security-reports/page.tsx` | None | Sample reports and inactive actions. No report persistence or scanning implementation. |
| About/portfolio/security | Corresponding page routes | Static local arrays and `src/lib/data.ts` | Implemented marketing content, not operational AI/security tooling. |
| Privacy policy | `src/app/privacy-policy/page.tsx` | Static content | Existing long policy page. Its claims need reconciliation with actual features before launch. |

## 2. API contracts and existing storage

Route paths below are relative to `/api`. Management operations currently lack server authorization except for upload's inadequate token check.

| Route | Methods | Existing responsibility |
|---|---|---|
| `apps` | GET, POST | Read collection; append caller-supplied app |
| `apps/[id]` | GET, PUT, DELETE | Lookup/update/delete app and attempt APK cleanup |
| `apps/[id]/download` | POST | Increment aggregate download counter and return URL |
| `blog` | GET, POST | Read collection; append caller-supplied post |
| `blog/[id]` | GET, PUT, DELETE | GET searches slug, while mutations search record ID: contract inconsistency |
| `contact` | POST | Validate presence, save enquiry, optionally notify via SMTP |
| `contacts` | GET | Return all enquiries |
| `contacts/[id]` | PATCH | Merge arbitrary updates into enquiry; UI uses status only |
| `auth/login` | POST | Admin credential comparison and token issuance |
| `auth/logout` | POST | Clear admin cookie |
| `auth/me` | GET | Decode token and inspect expiry |
| `auth/register` | POST | Basic presence/length check; no account creation |
| `admin/settings` | GET, PUT | Return email/Google config; update password or Google config |
| `admin/monetization` | GET, PUT | Read/replace full config |
| `upload/apk` | GET, POST, OPTIONS | Session status; upload actions selected by header; CORS |

`src/lib/store/db.ts` is the current persistence boundary. Keep its callers in mind during migration. It owns app/blog/contact CRUD, admin settings/password/Google config, monetization config, and optional seed initialization. The corresponding files are `apps.json`, `blog.json`, `contacts.json`, `admin.json`, and `monetization.json` under `data/`.

`src/types/index.ts` already defines App, BlogPost, ContactRequest, User, Service, PortfolioProject, TeamMember, Testimonial, Stat, GoogleConfig, MonetizationConfig and its nested pricing/affiliate/membership types. Reuse and evolve these contracts instead of introducing competing representations. TypeScript interfaces do not validate incoming JSON.

Important existing model boundaries:

- App has one `apkUrl` and a textual changelog; it has no per-version file records.
- App safety flags and checksum are metadata, not results generated by an implemented scanner.
- User has downloads/favorites fields but no account repository or credential model.
- Subscription tiers and membership tiers are different existing configuration concepts; decide whether to unify or distinguish them before implementing billing.
- Contact status is `new | read | replied`; no stored reply thread exists.
- Blog has no draft/published field despite the editor table labeling every record Published.

## 3. Features needing connection rather than replacement

### App publishing and files

The admin form edits name, category, version, size, descriptions, icon, APK attachment, and features. Types and public rendering already support screenshots, requirements, changelog, FAQ, developer, rating, and safety data, but the editor does not expose the corresponding full workflows. Public icon areas use initials even though icon is editable; screenshot URLs are iterated but not rendered as images. Add missing inputs and rendering to existing components.

The upload client sends 5 MB chunks sequentially with up to three attempts. It stores upload ID/name in sessionStorage but never reads them back or calls the status endpoint. Init always creates a fresh UUID/temp directory, so scanning that directory cannot restore a previous upload. The server's in-memory Map also disappears on restart and differs between instances. Resume support is partial, not absent.

Uploads and URLs assume `uploads.resultscaleai.com`; the server writes to its own `public/apks`. The deployment/storage topology is not defined in the repository. App deletion runs on the management server's filesystem, so it cannot be assumed to delete files on a separate upload host. Full URLs are also mishandled by the local cleanup path conversion. Clearing an APK URL skips the replacement cleanup condition. Uploading without saving an app can leave orphan files.

The upload handler checks ZIP magic bytes, not APK structure, signature, malware status, or SHA256. New app defaults claim scanned/secure without a scan. Repair these claims and connect an actual verification process if required.

### Blog publishing

Keep the existing editor and CRUD routes. Resolve whether content is plain text, sanitized HTML, or another format. The editor says HTML; the article interpolates content as escaped text and appends sample-article copy. Enabling raw HTML without sanitization would add another vulnerability. Image fields exist but are not exposed/rendered as a finished image workflow. Slugs are not enforced unique, title edits regenerate slugs, and GET-by-slug versus mutation-by-ID must be documented or normalized.

### Enquiries and email

Keep the existing form, POST handler, JSON repository boundary, and inbox. SMTP is already integrated through `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optional `SMTP_FROM`; recipient is hardcoded. The Resend dependency is installed but unused. Choose the existing SMTP path unless a deliberate provider migration is requested. Email failures do not undo saved contacts, which is useful; delivery status/retry tracking is absent. Escape user input in notification HTML and validate field types, formats, and lengths. CAPTCHA and abuse controls should attach to this submission handler.

### Authentication

Admin login/password-change/session-check/logout are implemented paths. Public accounts are a separate incomplete flow. Do not connect the public login form to the admin-only login handler as if they were interchangeable. Introduce a shared authentication/session boundary with explicit roles, then adapt existing callers.

The current token is unsigned JSON encoded in Base64. `/auth/me` can accept a decoded object without a valid expiry because it only rejects `exp < now`; upload requires a future expiry but still verifies neither signature nor identity/role. Logout clears the cookie but leaves the localStorage token used by uploads. Password changes do not revoke existing tokens. Default credentials are shown on the login page. Fix these together, including cross-host upload authorization.

### Monetization and Google integrations

Configuration editing and persistence already exist. Public pricing, services, and AdSlot consume `/api/admin/monetization`; adding blanket protection to its GET would break these consumers. Preserve a deliberate public read contract, ideally a public projection, while protecting writes.

Affiliate and membership settings have no public consumer in the reviewed source. Ad slots are mounted on home, catalogue, app details, blog list and downloads. `blogInline` has no mounted consumer; catalogue reuses the `appDetail` toggle. There are no numeric network slot IDs, ad loader, or ad initialization. Complete the shared component/config rather than adding a parallel ad system.

GA, GTM and Search Console rendering exist in the root layout. Google settings GET currently also returns `recaptchaSecretKey` publicly. Protect secret access and return only safe public fields. Validate IDs and serialize script values safely. Layout settings are read synchronously without an explicit freshness strategy; verify post-save behavior against the chosen rendering/cache mode.

Pricing annual total uses ten monthly payments while claiming 20% savings; the effective monthly label is also inconsistent. Configured currency and tier interval are not fully respected by the display. No billing provider, checkout, webhook, order/subscription persistence, entitlement enforcement, or premium file access exists.

## 4. Existing duplication and competing sources

1. `.kilo/worktrees/plum-chemistry` is a Git worktree at the same commit as main, with no reported working changes when checked. It is an alternate checkout, not an additional application module. Do not copy it into src. ESLint and broad TypeScript include patterns encompass this tree; exclude it from application checks.
2. `public/index.html` is a separate static document with independent title, canonical, social metadata and organization JSON-LD. It is not the App Router home page. Determine its deployment purpose before maintaining two landing-page documents. Its referenced OG image is absent from the inspected public files.
3. `src/lib/data.ts` exports sample apps/blog posts while runtime catalogue/blog use JSON storage. `seedInitialData()` imports those exports but has no call site. Never invoke seeding casually: if apps are empty, it overwrites both apps and blog, including potentially existing blog content.
4. Services exist as static marketing descriptions and configurable service packages; homepage/admin totals also exist separately from persisted app counters. Identify the source of truth before adding dashboards or content administration.
5. Monetization defaults appear in storage and admin UI; category lists are repeated in types, sample data and page-local arrays. Centralize shared definitions when modifying these areas.
6. The same download POST/open/fallback logic appears in app details and downloads. A shared download action can serve both.
7. Authentication decoding is repeated in auth/me and upload; consolidate into one server verifier.
8. List fetching, loading/error behavior, admin create/edit patterns and configuration reads repeat across components. Extract only where a real shared change warrants it; a new CMS/framework is unnecessary.
9. Navbar is globally mounted even on admin pages, while admin layout supplies another fixed header. FooterWrapper already hides the footer for admin routes. Review header overlap using the existing shell pattern.

## 5. Risk priorities

### Critical: repair before public exposure

- Enforce server authentication and role checks on content mutations, private enquiries, and settings. Client redirects provide no API protection.
- Replace forgeable tokens with verified sessions, remove exposed defaults, hash passwords, and handle logout/password-change revocation.
- Close stored script injection: unauthenticated Google-config updates reach inline root-layout scripts.

### High: protect files, data, and service availability

- Validate and constrain APK cleanup paths to the intended storage root. Arbitrary caller-supplied `apkUrl` plus unprotected mutations permits traversal to other server-writable files.
- Enforce upload chunk ranges, expected sizes, total assembled size, integer bounds, quotas and lifecycle ownership. `checkRateLimit` and server CHUNK_SIZE are currently unused.
- Handle stream errors/backpressure and atomic publication. Current code buffers chunk data into an unchecked write stream. Directory cleanup uses unlink, which does not remove directories.
- Replace non-atomic synchronous JSON persistence before multi-instance deployment; add migration/backup handling. Parse failure silently returns defaults and later mutations can overwrite damaged data.
- Add runtime schemas and update allowlists. Current generic merges allow identity changes and malformed records.
- Remove public exposure of enquiry records and CAPTCHA secret configuration.

### Medium: finish product contracts and operability

- Distinguish errors, empty lists and missing resources. Most public content arrives after hydration and no route-specific metadata/real server 404 is implemented for app/article details.
- Complete existing media/editor fields, resume behavior, configured ad placement, and pricing arithmetic.
- Replace hardcoded dashboard/analytics numbers with real aggregates before presenting them as operational data.
- Add focused integration coverage for authorization, CRUD, contact delivery failure, uploads and downloads. No test script/framework is configured.
- Document local setup, environment variable names, data migration, upload-host topology, backups and deployment. README is still the Next.js starter.

## 6. Safe implementation sequence without duplicate features

1. Use this inventory as the baseline and refresh it when the working tree changes. Trace any requested behavior through its existing route, type, store function and consumer before introducing a new module.
2. Establish one server session/authorization implementation and apply it to existing sensitive handlers. Preserve public catalogue/blog/config reads that public components require.
3. Add shared runtime schemas and file-storage containment; strengthen existing upload protocol and cleanup.
4. Migrate behind the existing store boundary, preserving record IDs, slugs, URLs and current content. Introduce a release-file model only if version history is required.
5. Finish app media/editor and blog format gaps in their existing routes. Connect current dashboard to available aggregates; introduce events only for historical metrics.
6. Implement public user persistence/auth by extending existing account routes and User model. Add only the missing public-user API responsibilities.
7. Implement checkout/entitlements only if requested, building on existing monetization configuration. Likewise connect actual ads/CAPTCHA/affiliate rendering to the components/settings already present.
8. Verify each end-to-end flow in a controlled environment and update this document's confidence/status. Passing TypeScript alone is not functional verification.

## 7. Remaining verification boundaries

Browser interactions, responsive layout, accessibility, deployed headers/proxy limits, writable storage persistence, cross-domain CORS/token behavior, actual SMTP delivery, APK static serving after upload, and settings freshness still require runtime verification. The current repository does not establish how the two hostnames share deployment, secrets, sessions or file storage. These are unresolved infrastructure facts, not evidence that another implementation should be added.
