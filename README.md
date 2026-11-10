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

Set these environment variables before using card checkout:

- `STRIPE_SECRET_KEY` (required for `/api/checkout`)
- `STRIPE_WEBHOOK_SECRET` (required for `/api/stripe/webhook` to persist paid/failed checkout status)
- `STRIPE_SHIPPING_COUNTRIES` (optional, comma-separated ISO country codes, for example `US,CA`)
- `STRIPE_TAX_CODE` (optional, Stripe product tax code applied to checkout line items)

Then configure a Stripe webhook endpoint to:

- `POST https://<your-domain>/api/stripe/webhook`

Enable these events in Stripe:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
