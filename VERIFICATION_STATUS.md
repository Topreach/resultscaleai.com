# Verification status

Updated 2026-10-31. `APPLICATION_ANALYSIS.md` records the pre-change inventory; this file records implementation work after that review.

## Implemented locally

- Admin management handlers now enforce server-side sessions. Tokens are random, stored as hashes, expire, and can be revoked. Login upgrades existing plaintext passwords to scrypt hashes. Password changes revoke other sessions. Logout removes the browser's upload-token copy. New installations use ADMIN_PASSWORD rather than a shared default password.
- Public registration, login, logout, profile, favorite toggling and download history persist real accounts. Admins can enable/disable accounts; disabling revokes sessions. Public sessions cannot authorize admin operations.
- App/blog mutations validate their records and preserve record identity. Duplicate IDs/slugs are rejected. Contact updates allow status changes only. Invalid monetization/Google configuration is rejected. Public settings expose only the CAPTCHA site key.
- JSON writes use temporary files and rename. Corrupt data raises an error rather than silently resetting content. Existing admin files without Google fields receive read-time defaults.
- APK paths are constrained to the APK directory. Uploads enforce chunk indices/sizes and final size; streaming assembly handles backpressure and computes SHA256. Download files are streamed by a route handler, including files uploaded after the build. New uploads use the current application host; old remote URLs remain usable but their remote cleanup is not implemented.
- Existing app editor supports screenshot URLs, requirements and JSON arrays for changelog/FAQ. Screenshots render, full computed checksums display, and new entries no longer claim a malware scan occurred. The blog editor explicitly uses plain text, rendered with line breaks; no unsanitized HTML execution was added.
- Dashboard totals, user management, analytics, payment-order listings, and security-report creation/viewing/deletion use stored records. Report entry is manual; it does not run a security scanner. Download totals count requested downloads, not installed apps or verified file completion.
- Paid subscription/service links lead to Flutterwave checkout using server-side USD prices. Callback and webhook verification check reference, transaction ID, status, amount, currency and customer. Duplicate callbacks do not duplicate an order. Subscription checkout requires an active matching Flutterwave plan and verifies its amount/currency/interval before charging.
- reCAPTCHA v2 renders on the contact form when configured and is verified on the server. AdSense uses publisher ID plus per-location numeric ad-unit IDs. No ad placeholder appears if the account/slot is not configured. Google settings render at request time, and script values are safely serialized.
- Public catalogue/list errors and loading states are shown. App/article routes provide metadata and missing-content responses. Admin navigation no longer competes with the public header.

## Automated verification

Latest local result: **12/12 workflow tests pass, lint passes with no warnings, TypeScript passes, production build passes, and 28/28 production HTTP smoke checks pass.** The initial HTTP smoke run found the legacy-settings bug above; the final run verifies its correction.

`npm test` runs isolated temporary data fixtures; it does not alter the application's saved data. It covers authentication/authorization, session revocation, CRUD persistence, path containment, mocked payment verification, checkout pricing, registration/profile/favorites/downloads/disable, upload/assembly/file serving, reports/analytics, cross-site mutation rejection and invalid input. It does not simulate a bank/card transaction.

TypeScript, lint and production build checks are run separately. Production font downloads require network access. HTTP smoke checks cover public page responses, public JSON reads, anonymous denial of private APIs and missing app/article responses. HTTP response checks do not establish visual or interactive browser correctness.

## Required before claiming every section is production verified

1. **Flutterwave:** configure test credentials, SITE_URL, webhook secret and plan IDs from `.env.example`. Confirm merchant country and USD eligibility in the actual account. Run successful, declined, cancelled, delayed, duplicate-webhook and recurring-renewal test cases. Other charge currencies are not implemented; changing a currency label without an exchange-rate/product-price policy is insufficient. Secrets must stay in the deployment's secret store, not browser code or chat.
2. **Fulfilment and subscriptions:** verified orders are recorded and visible to administrators. Return page directs customers to support for fulfilment. Automatic premium app entitlement, subscription access provisioning, renewals/cancellation management, refunds and customer billing history are not finished. Do not enable paid access promises until those flows are agreed and tested. Existing membership/affiliate configuration still needs a defined public product workflow.
3. **Email/CAPTCHA/ads:** exercise real SMTP delivery, a real allowed-domain CAPTCHA key pair, and approved AdSense inventory in a controlled environment. Script blocking, consent requirements and unavailable inventory must be checked in a browser.
4. **Hosting/data:** this remains a single-instance filesystem application. Atomic writes do not provide cross-process transactions or shared storage. Database migration, backups, durable upload volumes, proxy/request limits, HTTPS, and a distributed rate limiter are needed for multi-instance production hosting. Upload sessions are still process-local; full restart/reload resume remains incomplete. Do not deploy the old separate upload-host topology with an unshared session store.
5. **Content:** replace sample marketing metrics, team/portfolio/testimonial content, placeholder WhatsApp number and social/terms/cookie links with actual business information. Privacy policy content requires business/legal review; no legal correctness is claimed.
6. **Browser QA:** inspect desktop/mobile layout, keyboard navigation, form feedback, image failures, download behavior and provider scripts. No browser automation provider was available in this session; HTTP checks do not replace those tests.
7. **Account lifecycle:** email verification, password recovery, account/profile editing and account deletion are not implemented. Report editing and historical analytics/event collection are also incomplete. These are explicit remaining work, not working capabilities inferred from their previous mock interfaces.

## Flutterwave setup

- Put `FLW_SECRET_KEY` (test key first), `FLW_WEBHOOK_SECRET`, and the public HTTPS `SITE_URL` in server-only environment configuration.
- Set the dashboard webhook URL to `${SITE_URL}/api/payments/webhook`, with the same webhook secret. The handler accepts the documented v3 secret header and HMAC signature form; payment status is independently reverified through the v3 transaction API.
- Set `FLW_PAYMENT_PLANS` as JSON mapping `tierId:month` and `tierId:year` to the corresponding dashboard plan IDs. Plans must be active, USD, and have the same current price and monthly/yearly interval. Annual price is 12 monthly prices minus 20%.
- Run a full sandbox checkout and verify that exactly one correct order becomes paid in Admin -> Analytics. Reconcile provider and local records before live activation.
- Current integration is Flutterwave v3 Standard. It does not require storing card details locally or exposing a secret key to the browser.

References: [Standard checkout](https://developer.flutterwave.com/docs/flutterwave-standard-1), [transaction verification](https://developer.flutterwave.com/docs/transaction-verification), [webhooks](https://developer.flutterwave.com/docs/webhooks), [payment plans](https://developer.flutterwave.com/docs/payment-plans-1).
