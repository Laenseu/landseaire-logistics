<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

function respond(int $status, string $message, array $details = []): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    $acceptsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')
        || str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json');
    if ($acceptsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array_merge($status < 400 ? ['ok' => true] : ['error' => $message], $details));
    } else {
        header('Content-Type: text/html; charset=utf-8');
        $escaped = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact request</title><main style="max-width:40rem;margin:4rem auto;padding:1rem;font:1.1rem/1.6 system-ui"><h1>Contact request</h1><p>' . $escaped . '</p><a href="/#contact">Return to Landseaire Logistics</a></main></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Please submit the contact form.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '')) {
    respond(403, 'Please submit the form from this website.');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    respond(413, 'The request is too large.');
}
$data = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')
    ? json_decode($raw, true)
    : $_POST;
if (!is_array($data)) {
    respond(400, 'Please check the form and try again.');
}

$field = static function (string $name, int $max = 200) use ($data): string {
    $value = $data[$name] ?? '';
    return is_string($value) ? trim(mb_substr($value, 0, $max)) : '';
};
if ($field('website') !== '') {
    respond(200, 'Thank you. Your request has been received.');
}
$fullName = $field('fullName');
$email = $field('email');
$service = $field('service');
$message = $field('message', 5000);
if (mb_strlen($fullName) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $service === '' || mb_strlen($message) < 10 || ($data['consent'] ?? null) !== 'on') {
    respond(400, 'Please complete the required fields and try again.');
}

$configPath = dirname(__DIR__, 2) . '/contact-config.php';
$mailerPath = __DIR__ . '/vendor/autoload.php';
if (!is_file($configPath) || !is_file($mailerPath)) {
    error_log('Landseaire contact form: mail configuration is missing.');
    respond(503, 'Email delivery is being set up. Please contact us by phone or email.');
}
$config = require $configPath;
if (!is_array($config) || !filter_var($config['from_email'] ?? null, FILTER_VALIDATE_EMAIL)
    || !filter_var($config['recipient_email'] ?? null, FILTER_VALIDATE_EMAIL)
    || empty($config['smtp_host']) || empty($config['smtp_username']) || empty($config['smtp_password'])
    || str_starts_with((string) $config['smtp_host'], 'REPLACE_WITH_')
    || str_starts_with((string) $config['smtp_password'], 'REPLACE_WITH_')) {
    respond(503, 'Email delivery is being set up. Please contact us by phone or email.');
}
require $mailerPath;

$details = array_filter([
    'Service' => $service,
    'Name' => $fullName,
    'Company' => $field('organization'),
    'Email' => $email,
    'Phone / WhatsApp' => $field('phone'),
    'Vessel' => $field('vessel'),
    'Port / location' => $field('location'),
    'Preferred contact' => $field('preferredContact'),
], static fn (string $value): bool => $value !== '');
$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$emailLayout = static function (string $title, string $content) use ($escape): string {
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:24px 12px;background:#f1f5f9;color:#10213a;font-family:Arial,sans-serif">'
        . '<table role="presentation" style="width:100%;max-width:620px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #d9e3ed">'
        . '<tr><td style="padding:24px 30px;border-top:5px solid #e5a900">'
        . '<p style="margin:0 0 12px;color:#14569a;font-size:12px;font-weight:bold;letter-spacing:1px">A2 LANDSEAAIR LOGISTICS</p>'
        . '<h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:#10213a">' . $escape($title) . '</h1>'
        . $content
        . '</td></tr></table></body></html>';
};
$detailLines = [];
$detailRows = '';
foreach ($details as $label => $value) {
    $detailLines[] = $label . ': ' . (preg_replace('/\s+/u', ' ', $value) ?? $value);
    $detailRows .= '<tr><th scope="row" style="padding:10px 12px;text-align:left;vertical-align:top;width:35%;border-bottom:1px solid #e6edf3;color:#52647b;font-size:13px">' . $escape($label) . '</th>'
        . '<td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #e6edf3;font-size:14px">' . $escape($value) . '</td></tr>';
}
$messageHtml = nl2br($escape($message), false);
$requestText = "New assistance request\n\n" . implode("\n", $detailLines) . "\n\nMessage\n" . $message . "\n\nReply to this email to respond to the requester.";
$requestHtml = $emailLayout('New assistance request',
    '<table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 20px">' . $detailRows . '</table>'
    . '<p style="margin:0 0 8px;font-weight:bold;font-size:14px">Message</p>'
    . '<div style="padding:16px;background:#f1f5f9;border-left:3px solid #e5a900;line-height:1.6">' . $messageHtml . '</div>'
    . '<p style="margin:20px 0 0;color:#52647b;font-size:13px">Reply to this email to respond to the requester.</p>');
$receiptText = "Hello {$fullName},\n\nThank you for contacting A2 LandSeaAir Logistics. We received your request for {$service}. Our team will review it and respond through your preferred contact method.\n\nYour message\n{$message}\n\nIf you need to add information, reply to this email.\n\nA2 LandSeaAir Logistics";
$receiptHtml = $emailLayout('We received your request',
    '<p style="margin:0 0 14px;line-height:1.6">Hello ' . $escape($fullName) . ',</p>'
    . '<p style="margin:0 0 18px;line-height:1.6">Thank you for contacting A2 LandSeaAir Logistics. We received your request for <strong>' . $escape($service) . '</strong>. Our team will review it and respond through your preferred contact method.</p>'
    . '<p style="margin:0 0 8px;font-weight:bold;font-size:14px">Your message</p>'
    . '<div style="padding:16px;background:#f1f5f9;border-left:3px solid #e5a900;line-height:1.6">' . $messageHtml . '</div>'
    . '<p style="margin:20px 0 0;line-height:1.6">If you need to add information, reply to this email.</p>'
    . '<p style="margin:20px 0 0;color:#52647b;font-size:13px">A2 LandSeaAir Logistics</p>');
$subjectService = mb_substr(preg_replace('/\s+/u', ' ', $service) ?? $service, 0, 70);

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->Port = (int) $config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], 'A2 LandSeaAir Logistics');
    $mail->addAddress($config['recipient_email']);
    $mail->addReplyTo($email, $fullName);
    $mail->Subject = 'New assistance request: ' . $subjectService;
    $mail->isHTML(true);
    $mail->Body = $requestHtml;
    $mail->AltBody = $requestText;
    $mail->send();
} catch (Throwable $error) {
    error_log('Landseaire contact form: SMTP delivery failed: ' . $error->getMessage());
    respond(503, 'Your request could not be sent. Please contact us by phone or email.');
}

try {
    $receipt = new PHPMailer(true);
    $receipt->isSMTP();
    $receipt->Host = $config['smtp_host'];
    $receipt->Port = (int) $config['smtp_port'];
    $receipt->SMTPAuth = true;
    $receipt->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $receipt->Username = $config['smtp_username'];
    $receipt->Password = $config['smtp_password'];
    $receipt->CharSet = 'UTF-8';
    $receipt->setFrom($config['from_email'], 'A2 LandSeaAir Logistics');
    $receipt->addAddress($email, $fullName);
    $receipt->addReplyTo($config['recipient_email'], 'A2 LandSeaAir Logistics');
    $receipt->Subject = 'We received your assistance request';
    $receipt->isHTML(true);
    $receipt->Body = $receiptHtml;
    $receipt->AltBody = $receiptText;
    $receipt->send();
    respond(200, 'Thank you. Your request has been received.', ['confirmationSent' => true]);
} catch (Throwable $error) {
    error_log('Landseaire contact form: customer confirmation failed: ' . $error->getMessage());
    respond(200, 'Your request was received, but the confirmation email could not be delivered.', ['confirmationSent' => false]);
}
