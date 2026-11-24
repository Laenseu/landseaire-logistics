# Hostinger deployment

This package targets the Single Web Hosting **Upload your PHP or HTML** option for `a2landseaire.com`. React is compiled to static HTML, CSS, and JavaScript. Hostinger runs only the contact endpoint with PHP; Node.js is not required on the server.

## Build and upload

1. Run `npm ci` at the repository root.
2. Run `composer install --no-dev --prefer-dist` in `hostinger/`.
3. Set `NEXT_PUBLIC_SITE_URL=https://a2landseaire.com` and run `npm run build:hostinger`.
4. Run `npm run package:hostinger`.
5. ZIP the **contents** of `hostinger-ready/public_html/`, including hidden `.htaccess` files, and upload/extract them into the site's `public_html` directory. `index.html` must be directly in `public_html`.

The build writes domain-specific `robots.txt` and `sitemap.xml`, listing the homepage and the three service pages. The internal website budget page is excluded from the sitemap and marked `noindex`. The `.htaccess` file serves `/website-budget` from `website-budget.html`.

## Automatic contact email

The browser posts to `/api/contact.php`. PHPMailer sends the full request to `ampatiag@a2landseaire.com`, then sends a receipt containing the submitted message to the customer's email. If the company email fails, the form reports an error. If only the customer receipt fails, the form says the request reached the team but the confirmation could not be delivered. Until SMTP is configured, JavaScript falls back to opening an email draft; it does not claim the request was sent automatically.

Copy `hostinger/contact-config.php.example` to `contact-config.php` **beside** `public_html` on the hosting account. Set the SMTP host, port, username, and password provided by the service hosting the `ampatiag@a2landseaire.com` mailbox. The sender must be authorized by that service. The real config belongs outside the public web directory and must not be committed. Enter the password directly in the hosting control panel; keep it out of chat and source control.
