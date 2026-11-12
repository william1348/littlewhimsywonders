# Little Whimsy Wonders

A one-person print studio site. Browse the work, request a hold, leave an email for the next edition, or pay by card with Stripe Checkout.

Card checkout sessions and studio messages are stored for the studio.

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port 3847.

## Where addresses are saved

- With `DATABASE_URL` set, addresses go to Postgres. The schema is in `migrations/001_init.sql`, and the app creates the same tables on first use.
- Without `DATABASE_URL`, this copy writes `data/local-store.json` and says so on the form and the desk. That file is local to the machine running the app.

Publishing the app can attach its own Postgres database. Do not commit `DATABASE_URL` or the local store.

The desk lists what was saved. On a team copy, only an admin can open it. On a private copy, the signed-in viewer can open it.

Preview traffic is stored separately from production traffic, so a preview does not mix into the live list.

## Stripe checkout setup

### 1) App environment variables

Set these variables before using card checkout:

- `STRIPE_SECRET_KEY` (required for `/api/checkout` and checkout status verification)
- `STRIPE_WEBHOOK_SECRET` (required for `/api/stripe/webhook` to persist paid/failed checkout status)
- `STRIPE_SHIPPING_COUNTRIES` (optional, comma-separated ISO country codes, for example `US,CA`)
- `STRIPE_TAX_CODE` (optional, Stripe product tax code applied to checkout line items)

### 2) Stripe dashboard webhook

Configure a Stripe webhook endpoint:

- `POST https://<your-domain>/api/stripe/webhook`

Enable these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

Copy the webhook signing secret from Stripe and set it as `STRIPE_WEBHOOK_SECRET`.

### 3) Local POC test flow

1. Run the app:

   ```bash
   npm run dev
   ```

2. In another terminal, forward Stripe webhooks locally:

   ```bash
   stripe listen --forward-to http://127.0.0.1:3847/api/stripe/webhook
   ```

3. Copy the `whsec_...` value printed by Stripe CLI into `STRIPE_WEBHOOK_SECRET`.
4. Open a piece or collection page and click **Buy now with Stripe**.
5. Use Stripe test card `4242 4242 4242 4242` with any future date/CVC.
6. Confirm the result:
   - Success banner appears on the return page.
   - Order appears in `/desk` under **Card checkouts**.

## Contact form email setup (Zoho-compatible)

The `/contact` form sends messages via SMTP. Set:

- `SMTP_HOST` (Zoho: `smtp.zoho.com`)
- `SMTP_PORT` (Zoho SSL: `465`)
- `SMTP_SECURE` (`true` for port 465)
- `SMTP_USER` (the website mailbox address, for example `hello@littlewhimsywonders.com`)
- `SMTP_PASS` (mailbox password or app password)
- `CONTACT_TO_EMAIL` (where contact form messages should arrive)
- `CONTACT_FROM_EMAIL` (optional; defaults to `SMTP_USER`)
