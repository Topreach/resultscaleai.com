function safeSmtpError(error) {
  const response = String(error?.response || '');
  const knownCommands = ['CONN', 'EHLO', 'HELO', 'STARTTLS', 'AUTH PLAIN', 'AUTH LOGIN', 'AUTH XOAUTH2', 'MAIL FROM', 'RCPT TO', 'DATA'];
  const knownCodes = ['EAUTH', 'ECONNECTION', 'ESOCKET', 'ETIMEDOUT', 'EDNS', 'ETLS', 'EENVELOPE', 'EMESSAGE'];
  const configCode = ['SMTP_NOT_CONFIGURED', 'SMTP_INVALID_PORT'].includes(error?.message) ? error.message : 'SMTP_CHECK_FAILED';
  return {
    result: 'FAIL',
    code: knownCodes.includes(error?.code) ? error.code : configCode,
    responseCode: Number.isInteger(error?.responseCode) ? error.responseCode : null,
    command: knownCommands.includes(error?.command) ? error.command : null,
    enhancedCode: response.match(/\b[245]\.\d{1,3}\.\d{1,3}\b/)?.[0] || null,
    appPasswordRequired: /application[ -]specific password|app password.*required/i.test(response),
    browserSignInRequired: /log in.*web browser|sign in.*browser/i.test(response),
  };
}
module.exports = { safeSmtpError };
