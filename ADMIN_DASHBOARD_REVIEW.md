# Admin dashboard review

Reviewed 2026-11-01 against the local repository. This is a source and API-workflow review, not a claim that the deployed admin screens have passed browser or accessibility testing.

## Verdict

The admin has connected management features and protected server handlers. It is suitable as a foundation for a single-administrator, single-instance application. It is not yet a complete production operations console or a full website CMS. This review repaired specific reliability problems in the existing pages rather than adding duplicate modules.

## Implementation by section

| Section | Implemented | Remaining limitations |
|---|---|---|
| Admin shell/login | Session-cookie login, private API checks, periodic/focus/navigation revalidation, sign-out with failure feedback, mobile menu labeling and active-link state | No MFA, password recovery, independent administrators, granular roles or security audit trail; browser focus/menu behavior still requires QA |
| Dashboard | Persisted app/download/user/contact totals; links to all management modules; loading/error feedback | Totals are snapshots, not a live monitoring system; no trend/event history |
| Apps | CRUD, validated API records, upload progress/retries, screenshots, requirements, FAQ/changelog input and SHA256 | JSON editing is technical; full restart/resume, orphan cleanup, automated malware scanning and version-file history are incomplete |
| Blog | CRUD, validated records, slug uniqueness, plain-text content and tags | No draft/review/publication workflow, media library, rich-text editor or safe redirect handling for changed slugs |
| Contacts | Persisted enquiries, read/replied status, details, notification status and mail-client reply link | No in-app reply sending, thread history, notification retry queue or delivery/bounce confirmation; modal keyboard/focus behavior remains to be tested |
| Monetization | Existing configuration tabs and protected validated save route; saves disabled if initial load fails | Saving configuration does not implement checkout fulfilment, refunds, paid entitlements or all membership/affiliate workflows |
| Users | Real account listing and enable/disable; disabling revokes user sessions | No admin role assignment, profile editing, recovery/invitations or pagination |
| Analytics/payments | Stored download totals and payment-order list | Download requests are not completed installations; no historical charts, comprehensive payment reconciliation or failed/cancelled payment lifecycle |
| Security reports | Validated manual report creation, viewing and deletion | No report editing, attachments, version history or automated scanning |
| Settings | Password hashing/change, revocation of other admin sessions, Google settings validation and protected routes | No SMTP configuration UI; real SMTP authentication remains an independent deployment issue |
| Public website CMS | App/blog content and configured service packages are editable | Homepage marketing copy, About/team, portfolio projects, testimonials, business details and legal pages still require source changes |

## Problems corrected in this review

1. **Protect configuration from failed reads.** Monetization and Google settings could finish a failed load with default values visible and save enabled. Pages now show failure and disable saving until real configuration loads successfully.
2. **Handle authentication lifecycle.** The shell previously checked once on entry to the admin area and trusted that result across management pages. It now checks each admin pathname, periodically, and on focus; navigation waits for verification. Network/service failures show a retry state, and 401 responses return to login. Server authorization remains the actual security boundary.
3. **Make sign-out failures visible.** Previously any HTTP response caused a local redirect even when server-side logout failed. The shell now verifies the response, keeps failures visible and prevents repeated sign-out clicks.
4. **Use cookie authentication for uploads.** Same-origin uploads no longer need an administrator bearer token in localStorage. Login stops returning a JavaScript-readable token; legacy local copies are removed. HttpOnly cookie sessions continue to authorize all existing handlers.
5. **Do not hide failed enquiries.** Contact load/status failures now show an error. Successful updates synchronize both the list and the selected detail record. Failed mark-replied requests do not close the detail view as if the update succeeded. Reply subjects are URL-encoded.
6. **Preserve save confirmation.** App/blog success messages were immediately cleared by form reset. They now remain visible after a successful save. Failed deletes also show feedback instead of only logging to the console.
7. **Prevent saving an unfinished upload.** The app submit handler and button now block saves during upload, and uploaded-file state merges with current editor state instead of a stale form snapshot.
8. **Validate the submitted JSON input.** FAQ/changelog editors are controlled inputs parsed when saving. Invalid JSON blocks save with a clear error; it no longer leaves an older value silently eligible for saving after a failed blur parse. Server record validation still checks the resulting structure.
9. **Clarify dashboard capabilities.** User/analytics descriptions now match actual functionality, and Settings/Monetization have dashboard shortcuts. Unknown metrics show loading/unavailable states instead of unexplained question marks or a fabricated zero-unread count.

## Verification

Local result after these fixes: **17 tests pass; lint, TypeScript and the production build pass.**

- Existing tests exercise private-handler rejection, CRUD/storage, account disabling, report/analytics persistence, contact notifications, upload/serving and payment checks using isolated temporary records.
- Added regressions exercise HttpOnly-only admin sign-in, password-change revocation of other sessions, invalid Google configuration preserving stored values and contact update allowlists preserving identity/email.
- Lint and TypeScript checks validate the changed components. A production build is required before deployment.
- Component click flows, visual layout and keyboard/screen-reader behavior have not been verified by automated browser tests. API tests do not establish those properties.
- No live admin credentials were requested, and no production records were edited during this review.

## Release gates still needed

1. Run a browser checklist at desktop/mobile widths: login/logout, expired session, offline failures, each navigation route, load/save/delete errors, keyboard navigation and modal focus.
2. Test every editor using disposable records on a staging instance, including invalid JSON, failed uploads and interrupted requests.
3. Add pagination/search and loading/retry consistency before managing substantial record volumes. The shared analytics endpoint currently returns all apps/orders even when the dashboard needs only totals.
4. Add a durable database/shared storage before multi-process or multi-server deployment. Atomic file replacement does not provide cross-process transactions; two administrators can overwrite concurrent changes.
5. Add audit history and MFA before delegating administrator access. Current admin settings represent one administrator, not a granular permission model.
6. Confirm SMTP from the server and inbox receipt independently; the last supplied VPS result was EAUTH/534. Complete Flutterwave sandbox/fulfilment validation before relying on paid access.
7. Decide whether full marketing-content administration is a requirement. Do not describe the current admin as a complete site CMS until those existing public content sources are intentionally connected.
