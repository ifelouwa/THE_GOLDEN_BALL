# Deploying to Railway

This guide walks you through hosting your Next.js auction application on [Railway](https://railway.app/).

---

## Prerequisites

1. A **Railway Account** (sign up at [railway.app](https://railway.app/)).
2. The project pushed to a private or public **GitHub Repository**.
3. A **Resend API Key** (for sending emails, if active).

---

## Step 1: Create a Railway Project

1. Log into your [Railway Dashboard](https://railway.app/dashboard).
2. Click **+ New Project** in the upper right corner.
3. Select **Deploy from GitHub repo**.
4. Choose your `next-auction-app` repository.
5. Click **Deploy Now** (this initial build might fail or succeed temporarily, we will configure the database and environment variables next).

---

## Step 2: Add a PostgreSQL Database Service

Your app requires a PostgreSQL database. You can provision one directly inside your Railway project:

1. In your Railway project canvas, click **+ New** (or **+ Add Service**).
2. Select **Database**.
3. Choose **Add PostgreSQL**.
4. Railway will create and start a PostgreSQL service.

---

## Step 3: Link the Database to your Next.js App

Railway makes it easy to inject database credentials directly into your application service:

1. Click on your Next.js application service in the canvas.
2. Go to the **Variables** tab.
3. Click **+ New Variable**.
4. Use the autocomplete/dropdown to find `DATABASE_URL`.
5. For its value, select the reference to the PostgreSQL service's URL:
   - Click the **Reference Variable** link (or type `${{Postgres.DATABASE_URL}}` depending on the name of your DB service).
6. Click **Add**. Railway will automatically re-deploy your app with the database URL injected.

---

## Step 4: Configure Remaining Environment Variables

In the **Variables** tab of your Next.js application service, add the following required environment variables:

| Variable Name | Recommended Value / Description |
|---|---|
| `NEXTAUTH_SECRET` | A secure, random string (e.g., generated with `openssl rand -base64 32`). |
| `NEXTAUTH_URL` | Set to `https://${{RAILWAY_PUBLIC_DOMAIN}}` to dynamically resolve your app's live URL. |
| `RESEND_API_KEY` | Your API key from Resend (`re_...`). |
| `CRON_SECRET` | A secure string to authorize cron-triggered closing of auctions. |
| `PORT` | `3000` (optional, Railway assigns this automatically, but good to have if needed). |

> [!NOTE]
> `${{RAILWAY_PUBLIC_DOMAIN}}` is a special Railway template variable that automatically resolves to your app's public domain once generated.

---

## Step 5: Expose the App to the Internet

By default, Railway services are private. You need to generate a public domain:

1. Click on your Next.js service.
2. Go to the **Settings** tab.
3. Scroll down to the **Networking** section.
4. Click **Generate Domain** (or set up a custom domain if you own one).
5. Copy the generated domain and verify it matches the domain in `NEXTAUTH_URL`.

---

## Database Sync and Startup Mechanics

To make deployments seamless, we configured a `"prestart": "prisma db push"` script in your `package.json`. 

Here is what happens during a deployment:
1. **Build Phase**: Railway runs `npm run build`, which triggers `postinstall` -> `prisma generate` to compile the Prisma Client.
2. **Deploy Phase**: Before launching the server, Railway runs `npm run prestart` which runs `prisma db push`. This automatically connects to your Railway PostgreSQL database and updates the schema to match your models.
3. **Start Phase**: Railway starts the Next.js production server with `npm run start`.
