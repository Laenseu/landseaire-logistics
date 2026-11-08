# Hostinger deployment

This package targets the Single Web Hosting **Upload your PHP or HTML** option for `a2landseaire.com`. React is compiled to static HTML, CSS, and JavaScript. Hostinger runs only the contact endpoint with PHP; Node.js is not required on the server.

## Build and upload

1. Run `npm ci` at the repository root.
2. Run `composer install --no-dev --prefer-dist` in `hostinger/`.
3. Set `NEXT_PUBLIC_SITE_URL=https://a2landseaire.com` and run `npm run build:hostinger`.
4. Run `npm run package:hostinger`.
5. ZIP the **contents** of `hostinger-ready/public_html/`, including hidden `.htaccess` files, and upload/extract them into the site's `public_html` directory. `index.html` must be directly in `public_html`.

The package script writes domain-specific `robots.txt` and `sitemap.xml`. The `.htaccess` file serves `/website-budget` from `website-budget.html`.

## Automatic contact email

The browser posts to `/api/contact.php`. PHPMailer sends through an authenticated SMTP mailbox and delivers to the recipient specified in `contact-config.php`. Until SMTP is configured, JavaScript falls back to opening an email draft; no automatic email is claimed or shown as successfully sent.

Copy `hostinger/contact-config.php.example` to `contact-config.php` **beside** `public_html` on the hosting account. The example uses the existing `ampatiag71@gmail.com` address as sender and recipient with Gmail SMTP. Create a dedicated Google app password for this website and replace the placeholder in the server-side config. Google requires 2-Step Verification for app passwords. The real config belongs outside the public web directory and must not be committed. Keep the app password out of chat and source control.
