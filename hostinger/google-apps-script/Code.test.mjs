import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');
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
  const context = {
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) { return { text, setMimeType() { return this; } }; },
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => secret }) },
    Session: { getEffectiveUser: () => ({ getEmail: () => owner }) },
    MailApp: {
      sendEmail(message) {
        if (failConfirmation && sent.length === 1) throw new Error('Confirmation unavailable');
        sent.push(message);
      },
    },
    console: { error() {} },
  };
  vm.runInNewContext(source, context);
  const response = context.doPost({ postData: { contents: JSON.stringify(input) } });
  return { result: JSON.parse(response.text), sent };
}

test('sends the request and confirmation from the A2 owner', () => {
  const { result, sent } = run(payload);
  assert.deepEqual(result, { ok: true, confirmationSent: true });
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, 'ampatiag@a2landseaire.com');
  assert.equal(sent[0].replyTo, 'visitor@example.com');
  assert.equal(sent[1].to, 'visitor@example.com');
  assert.equal(sent[1].replyTo, 'ampatiag@a2landseaire.com');
});

test('rejects unauthorized calls and the wrong script owner', () => {
  for (const input of [{ ...payload, secret: 'wrong' }, payload]) {
    const { result, sent } = run(input, input === payload ? { owner: 'another@example.com' } : {});
    assert.deepEqual(result, { ok: false });
    assert.equal(sent.length, 0);
  }
});

test('reports a confirmation failure without losing the request', () => {
  const { result, sent } = run(payload, { failConfirmation: true });
  assert.deepEqual(result, { ok: true, confirmationSent: false });
  assert.equal(sent.length, 1);
});

test('rejects invalid recipient data before sending', () => {
  const { result, sent } = run({ ...payload, confirmation: { ...payload.confirmation, to: 'bad address' } });
  assert.deepEqual(result, { ok: false });
  assert.equal(sent.length, 0);
});
