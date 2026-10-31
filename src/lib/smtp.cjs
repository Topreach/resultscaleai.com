const nodemailer = require('nodemailer');

function smtpConfig(env = process.env) {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter((key) => !env[key]);
  const port = Number(env.SMTP_PORT || 587);
  if (missing.length) throw new Error('SMTP_NOT_CONFIGURED');
  if (![465, 587, 2525].includes(port)) throw new Error('SMTP_INVALID_PORT');
  return {
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    logger: false,
    debug: false,
  };
}

function createMailTransport(env = process.env) {
  return nodemailer.createTransport(smtpConfig(env));
}

module.exports = { smtpConfig, createMailTransport };
