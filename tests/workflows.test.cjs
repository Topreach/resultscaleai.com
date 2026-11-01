const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'resultscale-tests-'));
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
process.chdir(temporary);
after(() => { process.chdir(root); fs.rmSync(temporary, { recursive: true, force: true }); });
const { NextRequest } = require('next/server');
const auth = require('../src/lib/auth.ts');
const db = require('../src/lib/store/db.ts');
const request = (url, body, token, method = 'POST') => new NextRequest(`http://localhost${url}`, {
  method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Cookie: `admin_token=${token}` } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

test('password hashes verify; fabricated and revoked sessions are rejected', () => {
  const hash = auth.hashPassword('example-password');
  assert.notEqual(hash, 'example-password');
  assert.equal(auth.verifyPassword('example-password', hash), true);
  assert.equal(auth.verifyPassword('incorrect', hash), false);
  const forged = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + 100000 })).toString('base64');
  assert.equal(auth.getSession(request('/api/auth/me', null, forged, 'GET')), null);
  const token = auth.createSession('admin@example.com');
  const req = request('/api/auth/me', null, token, 'GET');
  assert.equal(auth.getSession(req).email, 'admin@example.com');
  auth.revokeSession(req);
  assert.equal(auth.getSession(req), null);
});

test('all existing private handlers reject anonymous callers', async () => {
  const targets = {
    'apps/route.ts': ['POST'], 'apps/[id]/route.ts': ['PUT', 'DELETE'],
    'blog/route.ts': ['POST'], 'blog/[id]/route.ts': ['PUT', 'DELETE'],
    'contacts/route.ts': ['GET'], 'contacts/[id]/route.ts': ['PATCH'],
    'admin/settings/route.ts': ['GET', 'PUT'], 'admin/monetization/route.ts': ['PUT'],
    'upload/apk/route.ts': ['GET', 'POST'],
    'admin/users/route.ts': ['GET', 'PATCH'], 'admin/reports/route.ts': ['GET', 'POST', 'DELETE'],
    'admin/analytics/route.ts': ['GET'],
  };
  for (const [file, methods] of Object.entries(targets)) {
    const handlers = require(path.join(root, 'src/app/api', file));
    for (const method of methods) {
      const response = await handlers[method](request('/api/test', null, null, method), { params: Promise.resolve({ id: 'test' }) });
      assert.equal(response.status, 401, `${method} ${file}`);
    }
  }
});

test('authenticated CRUD persists and public lists remain accessible', async () => {
  const handlers = require('../src/app/api/blog/route.ts');
  const token = auth.createSession('admin@example.com');
  const post = { id: 'article-1', slug: 'article-one', title: 'Article', excerpt: 'Example', content: 'Example', category: 'AI', author: 'Admin', date: '2026-10-31', readTime: '1 min', image: '', tags: [] };
  assert.equal((await handlers.POST(request('/api/blog', post, token))).status, 201);
  assert.equal((await (await handlers.GET()).json())[0].slug, post.slug);
  assert.equal(db.getBlogPosts().length, 1);
});

test('APK cleanup rejects traversal and remote URLs', () => {
  const { localApkPath } = require('../src/lib/apk-storage.ts');
  for (const value of ['/apks/../../data/admin.json', '/apks/../other.apk', 'https://uploads.example/apks/a.apk', '/apks/a.apk/../b.apk']) assert.equal(localApkPath(value), null);
  assert.equal(localApkPath('/apks/123-example.apk'), path.join(temporary, 'public/apks/123-example.apk'));
});

test('payment verification rejects mismatches and records successful payment once', async () => {
  process.env.FLW_SECRET_KEY = 'test-only-placeholder';
  const { verifyPayment } = require('../src/lib/payments.ts');
  db.createOrder({ reference: 'order-1', productId: 'scan', kind: 'service', name: 'Scan', email: 'buyer@example.com', amount: 99, currency: 'USD', status: 'pending', createdAt: new Date().toISOString() });
  const originalFetch = global.fetch;
  let amount = 1;
  global.fetch = async () => Response.json({ status: 'success', data: { id: 123, tx_ref: 'order-1', status: 'successful', amount, currency: 'USD', customer: { email: 'buyer@example.com' } } });
  try {
    await assert.rejects(() => verifyPayment('123', 'order-1'));
    assert.equal(db.getOrders()[0].status, 'pending');
    amount = 99;
    await assert.rejects(() => verifyPayment('123', 'wrong-order'));
    assert.equal((await verifyPayment('123', 'order-1')).status, 'paid');
    await verifyPayment('123', 'order-1');
    assert.equal(db.getOrders().length, 1);
  } finally { global.fetch = originalFetch; delete process.env.FLW_SECRET_KEY; }
});

test('unconfigured checkout and unsigned webhooks fail closed', async () => {
  delete process.env.FLW_SECRET_KEY;
  const checkout = require('../src/app/api/payments/checkout/route.ts');
  assert.equal((await checkout.POST(request('/api/payments/checkout', {}))).status, 503);
  process.env.FLW_WEBHOOK_SECRET = 'test-webhook-secret';
  const webhook = require('../src/app/api/payments/webhook/route.ts');
  assert.equal((await webhook.POST(request('/api/payments/webhook', {}))).status, 401);
  delete process.env.FLW_WEBHOOK_SECRET;
});

test('registration, sign in, profile, favorites, downloads and disabling accounts', async () => {
  const register = require('../src/app/api/auth/register/route.ts');
  const profile = { name: 'Test Buyer', email: 'buyer@example.com', password: 'long-test-password' };
  assert.equal((await register.POST(request('/api/auth/register', profile))).status, 201);
  assert.equal((await register.POST(request('/api/auth/register', profile))).status, 409);
  const login = require('../src/app/api/account/login/route.ts');
  assert.equal((await login.POST(request('/api/account/login', { ...profile, password: 'wrong' }))).status, 401);
  const response = await login.POST(request('/api/account/login', profile));
  assert.equal(response.status, 200);
  const user = (await response.json()).user;
  assert.equal(user.passwordHash, undefined);
  const cookie = response.headers.get('set-cookie').split(';')[0];
  const userRequest = (url, body, method = 'POST') => new NextRequest(`http://localhost${url}`, { method, headers: { Cookie: cookie, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const me = require('../src/app/api/account/me/route.ts');
  assert.equal((await me.GET(userRequest('/api/account/me', null, 'GET'))).status, 200);
  const app = { id: 'account-app', name: 'Account App', apkUrl: '/apks/test.apk', downloads: 0 };
  db.createApp(app);
  const favorites = require('../src/app/api/account/favorites/route.ts');
  assert.equal((await (await favorites.POST(userRequest('/api/account/favorites', { appId: app.id }))).json()).saved, true);
  const downloads = require('../src/app/api/apps/[id]/download/route.ts');
  assert.equal((await downloads.POST(userRequest('/api/apps/account-app/download'), { params: Promise.resolve({ id: app.id }) })).status, 200);
  assert.deepEqual(db.getUsers()[0].downloads, [app.id]);
  const users = require('../src/app/api/admin/users/route.ts');
  const token = auth.createSession('admin@example.com');
  assert.equal((await users.PATCH(request('/api/admin/users', { id: user.id, active: false }, token, 'PATCH'))).status, 200);
  assert.equal((await me.GET(userRequest('/api/account/me', null, 'GET'))).status, 401);
});

test('chunked upload checks actual size and serves assembled bytes', async () => {
  const handlers = require('../src/app/api/upload/apk/route.ts');
  const token = auth.createSession('uploader@example.com');
  const init = request('/api/upload/apk', { filename: 'test.apk', totalSize: 8, totalChunks: 1 }, token);
  init.headers.set('x-upload-action', 'init');
  const started = await handlers.POST(init);
  assert.equal(started.status, 200);
  const { uploadId } = await started.json();
  const bytes = Buffer.from([0x50, 0x4b, 3, 4, 1, 2, 3, 4]);
  const form = new FormData();
  form.set('uploadId', uploadId); form.set('chunkIndex', '0'); form.set('chunk', new File([bytes], 'test.part'));
  const chunk = new NextRequest('http://localhost/api/upload/apk', { method: 'POST', headers: { Cookie: `admin_token=${token}`, 'x-upload-action': 'chunk' }, body: form });
  assert.equal((await handlers.POST(chunk)).status, 200);
  const complete = request('/api/upload/apk', { uploadId }, token);
  complete.headers.set('x-upload-action', 'complete');
  const completed = await handlers.POST(complete);
  assert.equal(completed.status, 200);
  const result = await completed.json();
  assert.match(result.sha256, /^[a-f0-9]{64}$/);
  const file = require('../src/app/apks/[filename]/route.ts');
  const download = await file.GET(new Request('http://localhost' + result.url), { params: Promise.resolve({ filename: result.url.split('/').pop() }) });
  assert.equal(download.status, 200);
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), bytes);
});

test('report persistence and analytics use stored records', async () => {
  const token = auth.createSession('admin@example.com');
  const reports = require('../src/app/api/admin/reports/route.ts');
  const created = await reports.POST(request('/api/admin/reports', { client: 'Example', type: 'Audit', findings: 3, critical: 1, status: 'Completed', summary: 'Reviewed' }, token));
  assert.equal(created.status, 201);
  assert.equal((await (await reports.GET(request('/api/admin/reports', null, token, 'GET'))).json()).length, 1);
  const analytics = require('../src/app/api/admin/analytics/route.ts');
  const metrics = await (await analytics.GET(request('/api/admin/analytics', null, token, 'GET'))).json();
  assert.equal(metrics.reports, 1);
  assert.equal(metrics.totalDownloads, 1);
  assert.equal(metrics.orders[0].status, 'paid');
});

test('checkout uses stored USD prices rather than caller supplied amount', async () => {
  process.env.FLW_SECRET_KEY = 'test-only-placeholder';
  process.env.SITE_URL = 'http://localhost';
  const originalFetch = global.fetch;
  let payload;
  global.fetch = async (_url, options) => { payload = JSON.parse(options.body); return Response.json({ status: 'success', data: { link: 'https://checkout.flutterwave.com/v3/hosted/pay/test' } }); };
  try {
    const checkout = require('../src/app/api/payments/checkout/route.ts');
    const response = await checkout.POST(request('/api/payments/checkout', { kind: 'service', productId: 'web-scan', amount: 1, currency: 'NGN', name: 'Buyer', email: 'buyer@example.com' }));
    assert.equal(response.status, 200);
    assert.equal(payload.amount, 99);
    assert.equal(payload.currency, 'USD');
    assert.match(payload.payload_hash, /^[a-f0-9]{64}$/);
    const order = db.getOrders().find((order) => order.reference === payload.tx_ref);
    assert.equal(order.amount, 99);
    const unavailable = await checkout.POST(request('/api/payments/checkout', { kind: 'subscription', productId: 'starter', name: 'Buyer', email: 'buyer@example.com' }));
    assert.equal(unavailable.status, 503);
  } finally { global.fetch = originalFetch; delete process.env.FLW_SECRET_KEY; delete process.env.SITE_URL; }
});

test('cross-site mutations and malformed app content are rejected', async () => {
  const token = auth.createSession('admin@example.com');
  const handlers = require('../src/app/api/apps/route.ts');
  const crossSite = request('/api/apps', {}, token);
  crossSite.headers.set('Origin', 'https://untrusted.example');
  assert.equal((await handlers.POST(crossSite)).status, 401);
  assert.equal((await handlers.POST(request('/api/apps', { name: 'Missing fields' }, token))).status, 400);
  const contact = require('../src/app/api/contact/route.ts');
  assert.equal((await contact.POST(request('/api/contact', { name: 'Test', email: 'invalid', message: 'Hello' }))).status, 400);
});

test('legacy admin settings without Google fields retain safe defaults', async () => {
  const target = path.join(temporary, 'data/admin.json');
  const original = fs.existsSync(target) ? fs.readFileSync(target) : null;
  fs.writeFileSync(target, JSON.stringify({ email: 'admin@example.com', passwordHash: auth.hashPassword('legacy-pass') }));
  try {
    const settings = require('../src/app/api/public/settings/route.ts');
    assert.equal((await (await settings.GET()).json()).recaptchaSiteKey, '');
    assert.equal(db.getAdminSettings().google.analyticsMeasurementId, '');
  } finally { if (original) fs.writeFileSync(target, original); else fs.unlinkSync(target); }
});

test('contact notification records missing configuration, SMTP acceptance and failures', async () => {
  const mailer = require('nodemailer');
  const originalTransport = mailer.createTransport;
  const keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO'];
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const handler = require('../src/app/api/contact/route.ts');
  try {
    for (const key of keys) delete process.env[key];
    let response = await handler.POST(request('/api/contact', { name: 'Test', email: 'missing@example.com', message: 'Missing configuration' }));
    assert.equal(response.status, 201);
    assert.equal(db.getContactRequests().at(-1).notification.status, 'not_configured');
    Object.assign(process.env, { SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'sender@example.com', SMTP_PASS: 'test-placeholder' });
    let sent;
    mailer.createTransport = () => ({ sendMail: async (mail) => { sent = mail; return { accepted: ['intelligence@resultscaleai.com'], rejected: [], messageId: 'test-message-id' }; }, close() {} });
    response = await handler.POST(request('/api/contact', { name: '<Test>', email: 'accepted@example.com', message: '<script>test</script>' }));
    assert.equal(response.status, 201);
    assert.equal(db.getContactRequests().at(-1).notification.status, 'accepted');
    assert.equal(sent.replyTo, 'accepted@example.com');
    assert.ok(sent.text.includes('<script>test</script>'));
    assert.ok(!sent.html.includes('<script>test</script>'));
    mailer.createTransport = () => ({ sendMail: async () => { const error = new Error('Private provider response'); error.code = 'EAUTH'; throw error; }, close() {} });
    response = await handler.POST(request('/api/contact', { name: 'Test', email: 'failed@example.com', message: 'Authentication failure' }));
    assert.equal(response.status, 201);
    assert.equal(db.getContactRequests().at(-1).notification.status, 'failed');
    assert.equal(db.getContactRequests().at(-1).notification.errorCode, 'EAUTH');
    assert.ok(!JSON.stringify(await response.json()).includes('Private provider response'));
  } finally {
    mailer.createTransport = originalTransport;
    for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; }
  }
});

test('admin sign-in uses HttpOnly cookies and password changes revoke other sessions', async () => {
  const password = 'admin-test-password';
  db.updateAdminPassword(auth.hashPassword(password));
  const email = db.getAdminSettings().email;
  const login = require('../src/app/api/auth/login/route.ts');
  const signedIn = await login.POST(request('/api/auth/login', { email, password }));
  assert.equal(signedIn.status, 200);
  assert.equal((await signedIn.json()).token, undefined);
  const cookie = signedIn.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/i);
  const token = cookie.match(/admin_token=([^;]+)/)[1];
  const otherToken = auth.createSession(email);
  const settings = require('../src/app/api/admin/settings/route.ts');
  assert.equal((await settings.PUT(request('/api/admin/settings', { currentPassword: password, newPassword: 'replacement-password' }, token, 'PUT'))).status, 200);
  assert.ok(auth.getSession(request('/api/auth/me', null, token, 'GET')));
  assert.equal(auth.getSession(request('/api/auth/me', null, otherToken, 'GET')), null);
  assert.equal(auth.verifyPassword('replacement-password', db.getAdminSettings().passwordHash), true);
});

test('invalid Google settings and contact updates do not overwrite unrelated data', async () => {
  const token = auth.createSession(db.getAdminSettings().email);
  const settings = require('../src/app/api/admin/settings/route.ts');
  const original = db.getAdminSettings().google;
  assert.equal((await settings.PUT(request('/api/admin/settings', { google: { ...original, analyticsMeasurementId: "G-';alert(1)//" } }, token, 'PUT'))).status, 400);
  assert.deepEqual(db.getAdminSettings().google, original);
  const contact = db.getContactRequests()[0];
  const handler = require('../src/app/api/contacts/[id]/route.ts');
  const response = await handler.PATCH(request(`/api/contacts/${contact.id}`, { status: 'replied', email: 'replacement@example.com', id: 'changed-id' }, token, 'PATCH'), { params: Promise.resolve({ id: contact.id }) });
  assert.equal(response.status, 200);
  const updated = await response.json();
  assert.equal(updated.email, contact.email);
  assert.equal(updated.id, contact.id);
  assert.equal(updated.status, 'replied');
});
