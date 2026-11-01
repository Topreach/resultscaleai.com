const { test } = require('node:test');
const assert = require('node:assert/strict');
const { safeSmtpError } = require('../scripts/email-diagnostic-details.cjs');

test('diagnostic classifies Google app-password requirements without leaking response text', () => {
  const details = safeSmtpError({ code: 'EAUTH', responseCode: 534, command: 'AUTH PLAIN', response: '534-5.7.9 Application-specific password required. secret-value@example.com private-token' });
  assert.equal(details.enhancedCode, '5.7.9');
  assert.equal(details.appPasswordRequired, true);
  assert.equal(JSON.stringify(details).includes('secret-value'), false);
  assert.equal(JSON.stringify(details).includes('private-token'), false);
});

test('diagnostic distinguishes browser sign-in restrictions and handles unexpected errors safely', () => {
  assert.equal(safeSmtpError({ response: '534 5.7.14 Please log in via your web browser' }).browserSignInRequired, true);
  const details = safeSmtpError({ code: 'private-token', command: 'AUTH PLAIN private-token', response: 'private-token' });
  assert.equal(JSON.stringify(details).includes('private-token'), false);
  assert.equal(details.code, 'SMTP_CHECK_FAILED');
  assert.equal(details.enhancedCode, null);
});
