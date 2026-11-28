import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('./appsscript.json', import.meta.url), 'utf8'));
const secret = 'a-private-test-secret-with-more-than-32-characters';
const payload = {
  secret,
  request: {
    subject: 'New assistance request: Customs Clearance',
    body: 'Request details',
    htmlBody: '<p>Request details</p>',
    replyTo: 'visitor@example.com',
  },
  confirmation: {
    to: 'visitor@example.com',
    subject: 'We received your assistance request',
    body: 'Thank you',
    htmlBody: '<p>Thank you</p>',
  },
};

function run(input, { owner = 'ampatiag@a2landseaire.com', failConfirmation = false } = {}) {
  const sent = [];
  const apiCalls = [];
  const context = {
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) { return { text, setMimeType() { return this; } }; },
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => secret }) },
    Session: { getEffectiveUser: () => ({ getEmail: () => owner }) },
    MailApp: {
      sendEmail(message) {
        sent.push(message);
      },
    },
    Utilities: {
      Charset: { UTF_8: 'UTF-8' },
      getUuid: () => '1234-5678',
      base64Encode: value => Buffer.from(value, 'utf8').toString('base64'),
      base64EncodeWebSafe: value => Buffer.from(value, 'utf8').toString('base64url'),
    },
    ScriptApp: { getOAuthToken: () => 'test-token' },
    UrlFetchApp: {
      fetch(url, options) {
        apiCalls.push({ url, options });
        return {
          getResponseCode: () => failConfirmation ? 403 : 200,
          getContentText: () => failConfirmation ? '{}' : '{"id":"gmail-message-id"}',
        };
      },
    },
    console: { error() {} },
  };
  vm.runInNewContext(source, context);
  const response = context.doPost({ postData: { contents: JSON.stringify(input) } });
  return { result: JSON.parse(response.text), sent, apiCalls };
}

test('sends the request and confirmation from the A2 owner', () => {
  const { result, sent, apiCalls } = run(payload);
  assert.deepEqual(result, { ok: true, confirmationSent: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'ampatiag@a2landseaire.com');
  assert.equal(sent[0].replyTo, 'visitor@example.com');
  assert.equal(apiCalls.length, 1);
  assert.equal(apiCalls[0].url, 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
  const raw = Buffer.from(JSON.parse(apiCalls[0].options.payload).raw, 'base64url').toString('utf8');
  assert.match(raw, /To: visitor@example\.com\r\n/);
  assert.match(raw, /Reply-To: ampatiag@a2landseaire\.com\r\n/);
  assert.match(raw, /Subject: We received your assistance request\r\n/);
  assert.match(raw, /Content-Type: multipart\/alternative/);
  assert.ok(raw.includes(Buffer.from('<p>Thank you</p>').toString('base64')));
});

test('rejects unauthorized calls and the wrong script owner', () => {
  for (const input of [{ ...payload, secret: 'wrong' }, payload]) {
    const { result, sent, apiCalls } = run(input, input === payload ? { owner: 'another@example.com' } : {});
    assert.deepEqual(result, { ok: false });
    assert.equal(sent.length, 0);
    assert.equal(apiCalls.length, 0);
  }
});

test('reports a confirmation failure without losing the request', () => {
  const { result, sent, apiCalls } = run(payload, { failConfirmation: true });
  assert.deepEqual(result, { ok: true, confirmationSent: false });
  assert.equal(sent.length, 1);
  assert.equal(apiCalls.length, 1);
});

test('rejects invalid recipient data before sending', () => {
  const { result, sent, apiCalls } = run({ ...payload, confirmation: { ...payload.confirmation, to: 'bad address' } });
  assert.deepEqual(result, { ok: false });
  assert.equal(sent.length, 0);
  assert.equal(apiCalls.length, 0);
});

test('requests only send access to Gmail', () => {
  assert.ok(manifest.oauthScopes.includes('https://www.googleapis.com/auth/gmail.send'));
  assert.ok(!manifest.oauthScopes.includes('https://mail.google.com/'));
  assert.ok(manifest.dependencies.enabledAdvancedServices.some(service =>
    service.serviceId === 'gmail' && service.version === 'v1'));
});
