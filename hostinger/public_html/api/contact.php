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

$labels = [
    'Full name' => $fullName,
    'Company or organization' => $field('organization'),
    'Email' => $email,
    'Phone or WhatsApp number' => $field('phone'),
    'Service required' => $service,
    'Vessel name' => $field('vessel'),
    'Port or location' => $field('location'),
    'Preferred contact method' => $field('preferredContact'),
    'Message' => $message,
];
$body = implode("\n\n", array_map(
    static fn (string $label, string $value): string => $label . ":\n" . $value,
    array_keys($labels),
    array_values($labels)
));

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
    $mail->setFrom($config['from_email'], 'Landseaire Logistics Website');
    $mail->addAddress($config['recipient_email']);
    $mail->addReplyTo($email, $fullName);
    $mail->Subject = 'Landseaire Logistics Assistance Request';
    $mail->Body = $body;
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
    $receipt->Body = "Hello {$fullName},\n\nThank you for contacting A2 LandSeaAir Logistics. We received your assistance request for {$service}. Our team will review it and respond through your preferred contact method.\n\nYour message:\n{$message}\n\nIf you need to add information, reply to this email.\n\nA2 LandSeaAir Logistics";
    $receipt->send();
    respond(200, 'Thank you. Your request has been received.', ['confirmationSent' => true]);
} catch (Throwable $error) {
    error_log('Landseaire contact form: customer confirmation failed: ' . $error->getMessage());
    respond(200, 'Your request was received, but the confirmation email could not be delivered.', ['confirmationSent' => false]);
}
