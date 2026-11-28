const COMPANY_EMAIL = 'ampatiag@a2landseaire.com';
const SENDER_NAME = 'A2 LandSeaAir Logistics';

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function validEmail(value) {
  return typeof value === 'string' && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validMail(value) {
  return value && typeof value.subject === 'string' && value.subject.length > 0 && value.subject.length <= 180
    && typeof value.body === 'string' && value.body.length > 0 && value.body.length <= 12000
    && typeof value.htmlBody === 'string' && value.htmlBody.length > 0 && value.htmlBody.length <= 24000;
}

// Gmail's send-only API gives a message ID and avoids granting this script inbox access.
function sendConfirmation(mail) {
  const boundary = `a2_alt_${Utilities.getUuid().replace(/-/g, '')}`;
  const raw = [
    `From: ${SENDER_NAME} <${COMPANY_EMAIL}>`,
    `To: ${mail.to}`,
    `Reply-To: ${COMPANY_EMAIL}`,
    `Subject: ${mail.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Utilities.base64Encode(mail.body, Utilities.Charset.UTF_8),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Utilities.base64Encode(mail.htmlBody, Utilities.Charset.UTF_8),
    `--${boundary}--`,
    '',
  ].join('\r\n');
  const response = UrlFetchApp.fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${ScriptApp.getOAuthToken()}` },
    payload: JSON.stringify({ raw: Utilities.base64EncodeWebSafe(raw, Utilities.Charset.UTF_8) }),
    muteHttpExceptions: true,
  });
  const status = response.getResponseCode();
  const result = status === 200 ? JSON.parse(response.getContentText()) : null;
  if (!result?.id) throw new Error(`Gmail confirmation send failed: HTTP ${status}: ${response.getContentText().slice(0, 600)}`);
}

function doPost(event) {
  try {
    const data = JSON.parse(event?.postData?.contents || '{}');
    const secret = PropertiesService.getScriptProperties().getProperty('CONTACT_SHARED_SECRET');
    if (!secret || data.secret !== secret) return jsonResponse({ ok: false });
    if (Session.getEffectiveUser().getEmail().toLowerCase() !== COMPANY_EMAIL) {
      return jsonResponse({ ok: false });
    }
    if (!validMail(data.request) || !validMail(data.confirmation)
        || !validEmail(data.request.replyTo) || !validEmail(data.confirmation.to)
        || data.request.replyTo !== data.confirmation.to) {
      return jsonResponse({ ok: false });
    }

    MailApp.sendEmail({
      to: COMPANY_EMAIL,
      subject: data.request.subject,
      body: data.request.body,
      htmlBody: data.request.htmlBody,
      name: SENDER_NAME,
      replyTo: data.request.replyTo,
    });

    try {
      sendConfirmation(data.confirmation);
      return jsonResponse({ ok: true, confirmationSent: true });
    } catch (error) {
      console.error('Customer confirmation failed', error);
      return jsonResponse({ ok: true, confirmationSent: false });
    }
  } catch (error) {
    console.error('Request email failed', error);
    return jsonResponse({ ok: false });
  }
}

// Run once in the editor as the A2 mailbox owner to approve the mail permission.
function authorizeMail() {
  return `${Session.getEffectiveUser().getEmail()}: ${MailApp.getRemainingDailyQuota()} recipients remaining`;
}
