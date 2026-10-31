// Run on the application server. No message is sent unless --send is explicitly supplied.
const { loadEnvConfig } = require('@next/env');
const { Resolver } = require('node:dns').promises;
const { createMailTransport } = require('../src/lib/smtp.cjs');
loadEnvConfig(process.cwd(), false, { info() {}, error() {} });

async function main() {
  const env = process.env;
  console.log('Configuration presence (secret values are never printed):');
  for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO']) console.log(`${key}: ${env[key] ? 'SET' : 'NOT SET'}`);
  const domain = 'resultscaleai.com';
  const resolver = new Resolver({ timeout: 3000, tries: 1 });
  for (const [type, name] of [['MX', domain], ['TXT', domain], ['TXT', `_dmarc.${domain}`]]) {
    try {
      const records = await resolver.resolve(name, type);
      const relevant = type === 'TXT' ? records.map((parts) => parts.join('')).filter((text) => /^v=(spf1|DMARC1)/i.test(text)) : records;
      console.log(`${name} ${type}: ${JSON.stringify(relevant)}`);
    } catch (error) { console.log(`${name} ${type}: ${error.code || 'LOOKUP_FAILED'}`); }
  }
  let transport;
  try {
    transport = createMailTransport();
    await transport.verify();
    console.log('SMTP verification: PASS (connection, TLS and authentication; inbox delivery not yet proven)');
    if (!process.argv.includes('--send')) { console.log('No email sent.'); return; }
    const index = process.argv.indexOf('--to');
    const to = index >= 0 ? process.argv[index + 1] : '';
    if (!to || !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to)) throw new Error('Supply exactly one recipient with --to address@example.com');
    const reference = `resultscale-delivery-${Date.now()}`;
    const result = await transport.sendMail({
      from: env.SMTP_FROM || `"ResultScale AI" <${env.SMTP_USER}>`,
      to,
      subject: `[DELIVERY TEST] ResultScale AI ${reference}`,
      text: `This is a requested website email delivery test.\nReference: ${reference}\nSent at: ${new Date().toISOString()}\n\nPlease check inbox and spam. SMTP acceptance alone does not prove inbox placement.`,
    });
    console.log(JSON.stringify({ reference, messageId: result.messageId, accepted: result.accepted.length, rejected: result.rejected.length }));
    if (!result.accepted.length || result.rejected.length) process.exitCode = 1;
    console.log('Check the recipient inbox/spam and message Authentication-Results for SPF, DKIM and DMARC.');
  } catch (error) {
    // Avoid printing provider response text, credentials, or environment values.
    console.error(JSON.stringify({ result: 'FAIL', code: error.code || (['SMTP_NOT_CONFIGURED', 'SMTP_INVALID_PORT'].includes(error.message) ? error.message : 'SMTP_CHECK_FAILED'), responseCode: error.responseCode || null, command: error.command || null }));
    process.exitCode = 1;
  } finally { if (transport) transport.close(); }
}
main().catch(() => { console.error('Diagnostic failed'); process.exitCode = 1; });
