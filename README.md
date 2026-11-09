# North Room

A one-person print studio site. Browse the work, request a hold, and leave an email for the next edition. Hold requests and mailing-list addresses are stored for the studio.

Nothing on the site charges a card. A hold saves a name, an email, a note, and the pieces. Payment is arranged in the reply.

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
