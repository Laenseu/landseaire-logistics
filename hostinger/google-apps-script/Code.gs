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
      MailApp.sendEmail({
        to: data.confirmation.to,
        subject: data.confirmation.subject,
        body: data.confirmation.body,
        htmlBody: data.confirmation.htmlBody,
        name: SENDER_NAME,
        replyTo: COMPANY_EMAIL,
      });
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
