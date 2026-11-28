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

The browser posts to `/api/contact.php`. PHPMailer sends a formatted request to the address in `recipient_email`, then sends a confirmation containing the submitted message to the customer's email. Both messages include plain-text alternatives. Empty optional fields are omitted from the request. If the recipient email fails, the form reports an error. If only the customer confirmation fails, the form says the request reached the team but the confirmation could not be delivered. Until SMTP is configured, JavaScript falls back to opening an email draft; it does not claim the request was sent automatically.

Copy `hostinger/contact-config.php.example` to `contact-config.php` **beside** `public_html` on the hosting account. Set the SMTP host, port, username, password, sender, and recipient for the chosen mail service. The sender must be authorized by that service. The real config belongs outside the public web directory and must not be committed. Enter the password directly in the hosting control panel; keep it out of chat and source control.

## Google Workspace without an app password

The contact handler also supports a Google Apps Script web app owned by `ampatiag@a2landseaire.com`. This sends both messages from that Workspace mailbox without storing a Google password on Hostinger. The current SMTP configuration remains active until the Apps Script route is authorized and tested.

1. Sign in to [Google Apps Script](https://script.google.com/) as `ampatiag@a2landseaire.com`, create a project, and paste `hostinger/google-apps-script/Code.gs` into it.
2. In **Project Settings → Script properties**, add `CONTACT_SHARED_SECRET` with a unique random value of at least 32 characters. Keep it private and do not put it in the repository or chat.
3. Run `authorizeMail` in the editor and approve the requested permissions. Its result must begin with `ampatiag@a2landseaire.com`.
4. Deploy the project as a web app with **Execute as: Me** and **Who has access: Anyone**. Google Workspace policy may prevent anonymous web apps; if so, an administrator must allow this method. The shared secret is required because the web app URL is publicly callable.
5. Copy `hostinger/contact-config.apps-script.php.example` to the private `contact-config.php` beside `public_html`. Enter the `/exec` deployment URL and the same secret in the hosting file editor. Keep both `from_email` and `recipient_email` set to `ampatiag@a2landseaire.com`.
6. Submit a test request using an address you control. Verify that the request arrives at the A2 mailbox and the confirmation arrives at the test address before treating the switch as complete. If the test fails, restore the previous private SMTP configuration.

The Apps Script uses `MailApp`, which is subject to Google Workspace sending quotas. The public website never sees the shared secret; only the Hostinger PHP handler sends it to the Apps Script over HTTPS.
