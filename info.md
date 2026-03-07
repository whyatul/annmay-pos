# Annamay Restaurant POS — Deployment, Database, API Management & Scaling Guide

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites & Accounts](#2-prerequisites--accounts)
3. [Step 1 — Set Up Neon PostgreSQL Database](#3-step-1--set-up-neon-postgresql-database)
4. [Step 2 — Deploy Backend API on Render](#4-step-2--deploy-backend-api-on-render)
5. [Step 3 — Deploy pos-frontend on Vercel (Staff POS)](#5-step-3--deploy-pos-frontend-on-vercel-staff-pos)
6. [Step 4 — Deploy pos-customer on Vercel (Customer Menu)](#6-step-4--deploy-pos-customer-on-vercel-customer-menu)
7. [Step 5 — Deploy pos-kitchen on Vercel (Kitchen Display)](#7-step-5--deploy-pos-kitchen-on-vercel-kitchen-display)
8. [Step 6 — Set Up Supabase Realtime (Optional Enhancement)](#8-step-6--set-up-supabase-realtime-optional-enhancement)
9. [Step 7 — Set Up Cloudinary for Image Uploads](#9-step-7--set-up-cloudinary-for-image-uploads)
10. [Step 8 — Custom Domains & DNS](#10-step-8--custom-domains--dns)
11. [Step 9 — Seed the Production Database](#11-step-9--seed-the-production-database)
12. [Database Access & Management](#12-database-access--management)
13. [API Management & Monitoring](#13-api-management--monitoring)
14. [Load Monitoring, Crash Recovery & Alerts](#14-load-monitoring-crash-recovery--alerts)
15. [Dynamic Scaling Strategy](#15-dynamic-scaling-strategy)
16. [Security Hardening](#16-security-hardening)
17. [Cost Breakdown (Free Tier Limits)](#17-cost-breakdown-free-tier-limits)
18. [Environment Variable Reference](#18-environment-variable-reference)
19. [Code Changes Required Before Deploy](#19-code-changes-required-before-deploy)
20. [Troubleshooting](#20-troubleshooting)

---

## 1. Architecture Overview

```
Customer Phone                    Staff Devices
     │                                 │
     │ Scans QR                        │ Login
     ▼                                 ▼
menu.annamay.com            pos.annamay.com
(Vercel - Free)             (Vercel - Free)
pos-customer app            pos-frontend app
     │                                 │
     │         HTTPS Requests          │
     └──────────────┬──────────────────┘
                    ▼
         api.annamay.com
         (Render - Free)
         Express + Node.js + Socket.IO
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
     Neon DB    Cloudinary  Supabase
     (Free)     (Free)      Realtime
     PostgreSQL  Images     (Free)
                               │
                               ▼
                    kitchen.annamay.com
                    (Vercel - Free)
                    pos-kitchen app
                    Socket.IO client
```

**Tech Stack Summary:**

| Layer | Tech | Hosting |
|-------|------|---------|
| Staff POS Frontend | React 18 + Vite + TailwindCSS + Redux | Vercel |
| Customer Menu | React 19 + Vite + TailwindCSS + Redux | Vercel |
| Kitchen Display | React 19 + Vite + TailwindCSS + Socket.IO Client | Vercel |
| Backend API | Express.js + Sequelize ORM + Socket.IO Server | Render |
| Database | PostgreSQL (Sequelize ORM) | Neon |
| Image Uploads | Multer → Cloudinary | Cloudinary |
| Realtime Orders | Socket.IO (primary) / Supabase Realtime (optional) | Render / Supabase |
| Payments | PhonePe / Razorpay | Third-party |

---

## 2. Prerequisites & Accounts

Create free accounts on these platforms:

| Platform | URL | Purpose |
|----------|-----|---------|
| **GitHub** | https://github.com | Source code hosting |
| **Vercel** | https://vercel.com | Frontend deployments (3 apps) |
| **Render** | https://render.com | Backend API deployment |
| **Neon** | https://neon.tech | Serverless PostgreSQL |
| **Cloudinary** | https://cloudinary.com | Image CDN & storage |
| **Supabase** | https://supabase.com | Realtime subscriptions (optional) |
| **Namecheap / Cloudflare** | https://namecheap.com | Domain `annamay.com` (~₹800/yr) |

### Tooling Required Locally

```bash
# Ensure you have these installed
node -v    # v18+ required
npm -v     # v9+ required
git -v     # Git installed
```

---

## 3. Step 1 — Set Up Neon PostgreSQL Database

### 3.1 Create the Project

1. Go to https://console.neon.tech
2. Click **"New Project"**
3. Fill in:
   - **Project name:** `annamay-pos`
   - **Region:** `Asia Southeast 1 (Singapore)` ← closest to India
   - **Postgres version:** `16` (latest)
4. Click **"Create Project"**

### 3.2 Get Connection String

After creation, Neon shows your connection string:

```
postgresql://pos_user:AbCdEfGh123@ep-cool-rain-123456.ap-southeast-1.aws.neon.tech/restaurant_pos?sslmode=require
```

**Parse this into individual variables:**

| Variable | Value |
|----------|-------|
| `PG_HOST` | `ep-cool-rain-123456.ap-southeast-1.aws.neon.tech` |
| `PG_PORT` | `5432` |
| `PG_DATABASE` | `restaurant_pos` (it defaults to `neondb`, rename it) |
| `PG_USER` | `pos_user` (from the connection string) |
| `PG_PASSWORD` | `AbCdEfGh123` (from the connection string) |

### 3.3 Rename Default Database

In the Neon console:
1. Go to **Databases** tab
2. Delete the default `neondb` (if empty)
3. Click **"New Database"** → name it `restaurant_pos`

### 3.4 Enable Connection Pooling

1. Go to **Connection Details** in Neon dashboard
2. Toggle **"Pooled connection"** → ON
3. Use the **pooled** connection string for your backend (uses port `5432` through PgBouncer)
4. This is critical for Render's free tier which may open many short-lived connections

### 3.5 Configure SSL for Sequelize

Your `config/database.js` needs SSL for Neon. Update the Sequelize config:

```javascript
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,  // Neon uses self-signed certs
      },
    },
  }
);
```

> **Important:** Only enable SSL in production. Use an env variable:
> ```javascript
> dialectOptions: process.env.NODE_ENV === 'production'
>   ? { ssl: { require: true, rejectUnauthorized: false } }
>   : {},
> ```

---

## 4. Step 2 — Deploy Backend API on Render

### 4.1 Prepare Repository

Ensure your code is pushed to GitHub. If the whole project is a single repo (monorepo), Render can target a subdirectory.

```bash
cd /path/to/Restaurant_POS_System-master
git init
git add .
git commit -m "Initial commit for deployment"
git remote add origin https://github.com/YOUR_USERNAME/annamay-pos.git
git push -u origin main
```

### 4.2 Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `annamay-api` |
| **Region** | `Singapore` (closest to Neon region) |
| **Branch** | `main` |
| **Root Directory** | `pos-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 4.3 Set Environment Variables on Render

Go to **Environment** tab and add:

```env
NODE_ENV=production
PORT=8000
PG_HOST=ep-cool-rain-123456.ap-southeast-1.aws.neon.tech
PG_PORT=5432
PG_DATABASE=restaurant_pos
PG_USER=pos_user
PG_PASSWORD=your_neon_password
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_REDIRECT_URL=https://menu.annamay.com
SERVER_BASE_URL=https://annamay-api.onrender.com
```

> Generate a strong JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 4.4 Update CORS Origins in `app.js`

Before deploying, update `app.js` to accept your production domains:

```javascript
app.use(cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://pos.annamay.com',
      'https://menu.annamay.com',
      'https://kitchen.annamay.com',
    ]
}));
```

Similarly, update the Socket.IO CORS:

```javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://pos.annamay.com',
      'https://menu.annamay.com',
      'https://kitchen.annamay.com',
    ],
    methods: ["GET", "POST", "PUT", "PATCH"]
  }
});
```

### 4.5 Verify Deployment

After Render finishes building:

```bash
curl https://annamay-api.onrender.com/
# Should return: {"message":"Hello from POS Server!"}
```

> **Note:** Render free tier sleeps after 15 min of inactivity. First request after sleep takes ~30–50 seconds (cold start).

---

## 5. Step 3 — Deploy pos-frontend on Vercel (Staff POS)

### 5.1 Import Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Import your GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `annamay-pos` |
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | `pos-frontend` ← Click "Edit" to set this |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 5.2 Set Environment Variables

In the Vercel project settings → **Environment Variables**:

```env
VITE_BACKEND_URL=https://annamay-api.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> **Critical:** Vite inlines env vars at build time. Any change to env vars requires a redeployment.

### 5.3 Add SPA Redirect Rule

Create `pos-frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router works on page refresh.

### 5.4 Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies (`npm install`)
2. Build (`npm run build`)
3. Serve the static `dist/` folder globally via CDN

The app will be live at: `https://annamay-pos.vercel.app`

---

## 6. Step 4 — Deploy pos-customer on Vercel (Customer Menu)

### 6.1 Import as Separate Project

1. In Vercel → **"Add New" → "Project"**
2. Import the **same repo** again
3. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `annamay-menu` |
| **Root Directory** | `pos-customer` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 6.2 Code Change Required — Use Environment Variable for API

Currently, `pos-customer` has hardcoded `http://localhost:8000/api` in `Menu.jsx` and `Cart.jsx`. **You must change this before deploying.**

**In `pos-customer/src/pages/Menu.jsx`:**
```javascript
// BEFORE:
const API_BASE = 'http://localhost:8000/api';

// AFTER:
const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : 'http://localhost:8000/api';
```

**In `pos-customer/src/pages/Cart.jsx`:**
```javascript
// Same change as above
const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : 'http://localhost:8000/api';
```

### 6.3 Set Environment Variables on Vercel

```env
VITE_BACKEND_URL=https://annamay-api.onrender.com
```

### 6.4 Add SPA Redirect

Create `pos-customer/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 6.5 Deploy

Click **Deploy**. Live at: `https://annamay-menu.vercel.app`

---

## 7. Step 5 — Deploy pos-kitchen on Vercel (Kitchen Display)

### 7.1 Import as Separate Project

| Setting | Value |
|---------|-------|
| **Project Name** | `annamay-kitchen` |
| **Root Directory** | `pos-kitchen` |
| **Framework Preset** | `Vite` |

### 7.2 Code Change Required — Socket URL from Environment

In `pos-kitchen/src/App.jsx`:

```javascript
// BEFORE:
const SOCKET_URL = 'http://localhost:8000';

// AFTER:
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
```

### 7.3 Set Environment Variables on Vercel

```env
VITE_BACKEND_URL=https://annamay-api.onrender.com
```

### 7.4 Add SPA Redirect

Create `pos-kitchen/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 7.5 Socket.IO on Vercel Note

Socket.IO works from Vercel frontends connecting **to** the Render backend. The Vercel app is just a static site — the WebSocket connection is client → Render, not client → Vercel.

### 7.6 Deploy

Live at: `https://annamay-kitchen.vercel.app`

---

## 8. Step 6 — Set Up Supabase Realtime (Optional Enhancement)

> Your current system uses Socket.IO for realtime. Supabase Realtime is an **optional addition** for scenarios where Socket.IO can't maintain a persistent connection (e.g., Render free tier sleeps).

### 8.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. **New Project** → name: `annamay-realtime`
3. Region: **South Asia (Mumbai)** `ap-south-1`
4. Generate a strong database password

### 8.2 Use Supabase for Realtime Broadcast

Instead of using Supabase as a database (you already have Neon), use **Supabase Realtime Broadcast** as a pub/sub channel:

```javascript
// In pos-kitchen, as a fallback/supplement to Socket.IO:
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Subscribe to order updates
const channel = supabase.channel('orders')
channel.on('broadcast', { event: 'new-order' }, (payload) => {
  console.log('New order:', payload)
}).subscribe()
```

```javascript
// In pos-backend, after creating an order, broadcast:
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Inside orderController after order creation:
await supabase.channel('orders').send({
  type: 'broadcast',
  event: 'new-order',
  payload: orderData,
})
```

### 8.3 Environment Variables for Supabase

**Backend (Render):**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...  # service_role key
```

**Kitchen Frontend (Vercel):**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...  # anon key (safe for client)
```

---

## 9. Step 7 — Set Up Cloudinary for Image Uploads

### 9.1 Why Cloudinary?

Currently, the backend stores images on disk (`/uploads` folder via Multer). On Render's free tier, the filesystem is **ephemeral** — files are lost on every deploy/restart. You **must** use Cloudinary for persistent image storage.

### 9.2 Create Cloudinary Account

1. Go to https://cloudinary.com
2. Sign up → Dashboard shows your credentials:
   - **Cloud Name:** `your-cloud-name`
   - **API Key:** `123456789012345`
   - **API Secret:** `abcdefghijklmnopqrstuvwx`

### 9.3 Install Cloudinary SDK

```bash
cd pos-backend
npm install cloudinary multer-storage-cloudinary
```

### 9.4 Update Upload Middleware

Replace `pos-backend/middlewares/upload.js`:

```javascript
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "annamay-menu",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
```

### 9.5 Update Menu Item Controller

After this change, `req.file.path` will contain the Cloudinary URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v123/annamay-menu/dish-123.jpg`). Store this full URL in the database `image` column instead of a relative path.

### 9.6 Add Environment Variables on Render

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwx
```

---

## 10. Step 8 — Custom Domains & DNS

### 10.1 Buy Domain

Buy `annamay.com` from Namecheap (~₹800/yr) or use Cloudflare Registrar.

### 10.2 DNS Configuration

Set up DNS records (in Namecheap/Cloudflare):

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| `CNAME` | `pos` | `cname.vercel-dns.com` | Staff POS frontend |
| `CNAME` | `menu` | `cname.vercel-dns.com` | Customer menu |
| `CNAME` | `kitchen` | `cname.vercel-dns.com` | Kitchen display |
| `CNAME` | `api` | `annamay-api.onrender.com` | Backend API |

### 10.3 Add Custom Domains in Vercel

For **each** Vercel project:
1. Go to Project Settings → **Domains**
2. Add the domain:
   - `annamay-pos` → `pos.annamay.com`
   - `annamay-menu` → `menu.annamay.com`
   - `annamay-kitchen` → `kitchen.annamay.com`
3. Vercel auto-provisions SSL certificates

### 10.4 Add Custom Domain in Render

1. Go to your Render web service → **Settings** → **Custom Domains**
2. Add `api.annamay.com`
3. Render auto-provisions SSL via Let's Encrypt

### 10.5 Update Environment Variables

After setting up custom domains, update backend env vars:

```env
SERVER_BASE_URL=https://api.annamay.com
PHONEPE_REDIRECT_URL=https://menu.annamay.com
```

Update all Vercel frontend env vars:

```env
VITE_BACKEND_URL=https://api.annamay.com
```

> **Redeploy all four services** after changing env vars.

---

## 11. Step 9 — Seed the Production Database

### 11.1 Run Seed Script Locally Against Neon

You can run the seed script from your local machine pointing to the production Neon database:

```bash
cd pos-backend

# Create a temporary .env with production values
export PG_HOST=ep-cool-rain-123456.ap-southeast-1.aws.neon.tech
export PG_PORT=5432
export PG_DATABASE=restaurant_pos
export PG_USER=pos_user
export PG_PASSWORD=your_neon_password
export NODE_ENV=production

node scripts/seedDatabase.js
```

This will create:
- **5 users** (admin, manager, waiter, chef, cashier)
- **7 tables**
- **29 categories**
- **200+ menu items**
- **25 ingredients**

### 11.2 Verify Seeded Data

```bash
# Quick check via the API
curl https://api.annamay.com/api/category | head -c 200
curl https://api.annamay.com/api/menu-item | head -c 200
```

---

## 12. Database Access & Management

### 12.1 Neon SQL Editor (Browser)

The easiest way to run queries:

1. Go to https://console.neon.tech
2. Select your project → **SQL Editor** tab
3. Run queries directly:

```sql
-- Check users
SELECT id, name, email, role FROM "Users";

-- Check order stats
SELECT COUNT(*), status FROM "Orders" GROUP BY status;

-- Check today's revenue
SELECT SUM("totalAmount") as revenue
FROM "Orders"
WHERE "createdAt" >= CURRENT_DATE AND status = 'completed';

-- See table statuses
SELECT "tableNo", seats, status FROM "Tables" ORDER BY "tableNo";
```

### 12.2 Connect via Local psql CLI

```bash
# Install psql if not available
sudo apt install postgresql-client

# Connect to Neon
psql "postgresql://pos_user:PASSWORD@ep-xxxx.ap-southeast-1.aws.neon.tech/restaurant_pos?sslmode=require"
```

Useful commands:
```sql
\dt                    -- List all tables
\d "Users"             -- Describe Users table schema
\d "Orders"            -- Describe Orders table schema
SELECT COUNT(*) FROM "MenuItems";  -- Count menu items
```

### 12.3 Connect via GUI Tools

**pgAdmin 4** (free):
1. Download from https://www.pgadmin.org
2. Add Server → Connection:
   - Host: `ep-xxxx.ap-southeast-1.aws.neon.tech`
   - Port: `5432`
   - Database: `restaurant_pos`
   - Username: `pos_user`
   - Password: your password
   - SSL Mode: `Require`

**DBeaver** (free):
1. New Connection → PostgreSQL
2. Use same credentials as above
3. Enable SSL in Driver Properties

**TablePlus** (free tier):
1. New Connection → PostgreSQL
2. Toggle SSL → ON

### 12.4 Neon Branching (Database Previews)

Neon's killer feature — **branch your database** like Git:

```
Production DB (main branch)
    │
    ├── feature/new-menu  ← copy-on-write, instant, free
    ├── staging           ← test migrations safely
    └── debug/issue-42    ← investigate production data
```

1. In Neon console → **Branches** → **Create Branch**
2. Select parent: `main`
3. Get a separate connection string for the branch
4. Test migrations on the branch, then merge changes to main

### 12.5 Automated Backups

Neon automatically:
- Takes **point-in-time recovery** snapshots
- Free tier: **7 days** of history
- Restore to any second in the past from the Neon console → **Restore** tab

### 12.6 Useful Database Management Queries

```sql
-- ═══ Health Checks ═══

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'restaurant_pos';

-- Table sizes
SELECT relname AS table, pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;

-- Slow queries (if pg_stat_statements is available)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- ═══ Business Queries ═══

-- Today's orders breakdown
SELECT status, COUNT(*), SUM("totalAmount")
FROM "Orders"
WHERE "createdAt" >= CURRENT_DATE
GROUP BY status;

-- Top 10 selling items this week
-- (depends on your OrderItems table structure)

-- Revenue by hour
SELECT date_trunc('hour', "createdAt") AS hour, SUM("totalAmount")
FROM "Orders"
WHERE "createdAt" >= CURRENT_DATE AND status = 'completed'
GROUP BY hour ORDER BY hour;
```

---

## 13. API Management & Monitoring

### 13.1 Render Dashboard

Your primary API monitoring tool:

1. Go to https://dashboard.render.com → your `annamay-api` service
2. **Logs** tab — real-time stdout/stderr from your server
3. **Metrics** tab — CPU, memory, bandwidth (available on paid tiers)
4. **Events** tab — deploy history, restarts, failures

### 13.2 Add Health Check Endpoint

Add to `pos-backend/app.js`:

```javascript
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();  // Check DB connection
    res.json({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      dbConnected: true,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      dbConnected: false,
    });
  }
});
```

Configure Render's health check:
1. Service Settings → **Health Check Path**: `/health`
2. Render will auto-restart the service if health checks fail

### 13.3 Request Logging with Morgan

```bash
cd pos-backend && npm install morgan
```

Add to `app.js`:

```javascript
const morgan = require("morgan");
app.use(morgan("combined"));  // Logs every request with details
```

### 13.4 Free External Monitoring — UptimeRobot

1. Go to https://uptimerobot.com (free for 50 monitors)
2. **Add Monitor:**
   - Type: HTTP(s)
   - URL: `https://api.annamay.com/health`
   - Interval: 5 min
3. **Alert Contacts:** Add your email/Telegram
4. Bonus: This also **keeps Render awake** by pinging every 5 min (prevents free tier sleep!)

### 13.5 Free APM — Better Stack (formerly Logtail)

1. Go to https://betterstack.com (free tier: 1GB/month logs)
2. Create a source → get an ingestion token
3. Install in backend:

```bash
npm install @logtail/node @logtail/winston
```

4. Or simply pipe logs from Render → Better Stack using their Render integration

### 13.6 API Rate Limiting

Protect against abuse:

```bash
cd pos-backend && npm install express-rate-limit
```

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // max 100 requests per window per IP
  message: { error: "Too many requests, please try again later." },
});

app.use("/api/", limiter);
```

---

## 14. Load Monitoring, Crash Recovery & Alerts

### 14.1 Render Auto-Restart

Render automatically restarts your service if it crashes. The health check endpoint (configured in §13.2) ensures:
- If `/health` returns 5xx → Render restarts the container
- If the process exits → Render restarts immediately

### 14.2 Graceful Shutdown in `app.js`

Add at the bottom of `app.js`:

```javascript
// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    sequelize.close().then(() => {
      console.log("Database connections closed.");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);  // Let Render restart the process
});
```

### 14.3 Monitor Memory & CPU

In your `/health` endpoint, the `process.memoryUsage()` output shows:

```json
{
  "rss": 52428800,        // ~50MB total
  "heapTotal": 20971520,  // ~20MB allocated
  "heapUsed": 15728640,   // ~15MB used
  "external": 1048576     // ~1MB external C++ objects
}
```

Render free tier gives **512MB RAM**. If `rss` > 450MB, you're at risk.

### 14.4 Detect Overload — Connection Pool Monitoring

Add to `config/database.js`:

```javascript
const sequelize = new Sequelize(/* ... */, {
  pool: {
    max: 5,       // Free tier: keep low
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

Log pool status:

```javascript
// In health endpoint
const pool = sequelize.connectionManager.pool;
res.json({
  // ... other health info
  dbPool: {
    size: pool.size,
    available: pool.available,
    pending: pool.pending,
  },
});
```

### 14.5 Alert System

**Free Stack:**

| Alert | Tool | Setup |
|-------|------|-------|
| API down | UptimeRobot | Email/Telegram when /health fails |
| Error spike | Better Stack | Alert rule on error log count |
| DB connection fail | Health endpoint + UptimeRobot | `dbConnected: false` triggers 503 |
| Slow response | UptimeRobot | Alert if response > 5s |
| Deploy failure | Render | Email notification (built-in) |

### 14.6 Crash Investigation Checklist

When the API crashes:

1. **Check Render Logs:**
   - Dashboard → Logs → look for error stack traces
   - Filter by time range of the crash

2. **Check Database:**
   - Can you connect to Neon from your local machine?
   - Run `SELECT count(*) FROM pg_stat_activity;` — too many connections?

3. **Check Memory:**
   - Hit `/health` → check `memory.rss`
   - Render free tier: 512MB limit → OOM kill

4. **Check Neon Status:**
   - https://neonstatus.com — is Neon having an outage?

5. **Check Render Status:**
   - https://render-status.com — is Render having an outage?

---

## 15. Dynamic Scaling Strategy

### 15.1 Understanding Free Tier Limits

| Service | Limit | What Happens When Exceeded |
|---------|-------|----|
| **Render Free** | 750 hrs/month, 512MB RAM, sleeps after 15min idle | Cold starts (~30s), kills process if OOM |
| **Neon Free** | 0.5 GB storage, 1 compute endpoint, 190 compute hours/month | Suspends after idle, auto-wakes |
| **Vercel Free** | 100GB bandwidth/month, 100 deployments/day | Blocks deploys, charges overages |
| **Cloudinary Free** | 25GB storage, 25GB bandwidth/month | Blocks uploads |

### 15.2 Scaling Phase 1 — Keep Free, Optimize (0–50 concurrent users)

**Backend:**
- Use UptimeRobot to ping `/health` every 5 min → prevents Render sleep
- Enable gzip: `npm install compression` + `app.use(require('compression')())`
- Cache frequently hit endpoints (categories, menu items):

```javascript
const menuCache = new Map();

app.get("/api/menu-item", async (req, res) => {
  if (menuCache.has("all") && Date.now() - menuCache.get("all").time < 300000) {
    return res.json(menuCache.get("all").data);
  }
  const items = await MenuItem.findAll(/* ... */);
  menuCache.set("all", { data: items, time: Date.now() });
  res.json(items);
});
```

**Database:**
- Use Neon connection pooling (PgBouncer) to handle more concurrent queries
- Keep pool max at 5 connections

**Frontend:**
- Vercel CDN handles static assets automatically — no scaling needed
- Enable browser caching with proper headers

### 15.3 Scaling Phase 2 — Paid Tiers (50–500 concurrent users)

When free tiers aren't enough:

| Upgrade | Cost | Benefit |
|---------|------|---------|
| **Render Starter** | $7/month | No sleep, 512MB RAM, always-on |
| **Render Standard** | $25/month | 2GB RAM, auto-restart, higher CPU |
| **Neon Scale** | $19/month | 10GB storage, more compute hours |
| **Vercel Pro** | $20/month | More bandwidth, preview deploys |

**Recommended first upgrade:** Render Starter ($7/mo) — eliminates cold starts.

### 15.4 Scaling Phase 3 — Production Grade (500+ concurrent users)

```
        Cloudflare (Free CDN + DDoS Protection)
                    │
                    ▼
    ┌───────── Load Balancer ──────────┐
    │                                  │
    ▼                                  ▼
 Render Instance 1              Render Instance 2
 (Express + Socket.IO)          (Express + Socket.IO)
    │                                  │
    └──────────┬───────────────────────┘
               ▼
      Neon PostgreSQL (Scaled)
      + Redis (for sessions & Socket.IO adapter)
```

**Actions:**
1. **Add Redis** (Upstash free tier: 10K commands/day):
   - Session store: `connect-redis` + express-session
   - Socket.IO adapter: `@socket.io/redis-adapter` — allows multiple server instances to share socket connections

2. **Horizontal scaling on Render:**
   - Render Pro plan supports multiple instances
   - Or migrate to **Railway** ($5/mo) or **Fly.io** (free tier with multiple regions)

3. **CDN for API responses:**
   - Put Cloudflare in front of `api.annamay.com`
   - Cache GET requests for `/api/category` and `/api/menu-item` at the edge

4. **Database read replicas:**
   - Neon supports read replicas on paid plans
   - Route all GET queries to read replica, writes to primary

### 15.5 Scaling Phase 4 — High Availability (1000+ users, multi-restaurant)

| Component | Solution |
|-----------|----------|
| **API** | Kubernetes (EKS/GKE) with auto-scaling pods |
| **Database** | Neon Pro with branch-per-tenant, or self-hosted PostgreSQL cluster |
| **Cache** | Redis Cluster (Upstash or ElastiCache) |
| **CDN** | Cloudflare Pro |
| **Monitoring** | Grafana + Prometheus stack, or Datadog |
| **CI/CD** | GitHub Actions → Docker → Kubernetes |

### 15.6 Quick Scaling Decision Matrix

```
                     ┌─ Free tiers handle it fine
Is business making   │
money from the POS?  │
    │                │  No → Stay on free tier, optimize code
    │ Yes            │
    ▼                │
Render $7/mo         │  ← First upgrade, eliminates cold starts
    │                │
    ▼                │
Users > 200/day?     │
    │                │  No → Render Starter is enough
    │ Yes            │
    ▼                │
Render $25/mo +      │
Neon $19/mo          │  ← Handles 500+ concurrent easily
    │                │
    ▼                │
Users > 1000/day?    │
    │                │
    ▼                │
Kubernetes + Redis + │
Read replicas        └─ Full production infra
```

---

## 16. Security Hardening

### 16.1 Backend Security Checklist

```bash
cd pos-backend && npm install helmet
```

Add to `app.js`:

```javascript
const helmet = require("helmet");
app.use(helmet());  // Sets security headers
```

### 16.2 Environment Variable Security

- **Never** commit `.env` files to Git
- Add to `.gitignore`:
  ```
  .env
  .env.local
  .env.production
  ```
- Rotate JWT_SECRET and DB passwords every 90 days
- Use Render's "secret files" for sensitive configs

### 16.3 Database Security

- Neon connections are **always encrypted** (SSL required)
- Use Neon IP Allow List (paid feature) to restrict access to Render's IP range
- Never expose database credentials in frontend code

### 16.4 CORS Lockdown

Only allow your exact domains (already covered in §4.4):

```javascript
origin: [
  'https://pos.annamay.com',
  'https://menu.annamay.com',
  'https://kitchen.annamay.com',
]
```

Remove `localhost` origins in production by checking `NODE_ENV`.

---

## 17. Cost Breakdown (Free Tier Limits)

### Monthly Cost: ₹0 (within free limits)

| Service | Free Tier | Your Usage | OK? |
|---------|-----------|-----------|-----|
| **Vercel** (x3 projects) | 100GB bandwidth each | ~1-5GB each | ✅ |
| **Render** (1 web service) | 750 hrs/month | 720 hrs (always on with ping) | ✅ |
| **Neon** (PostgreSQL) | 0.5GB storage, 190 compute hrs | ~50MB data, ~100 hrs | ✅ |
| **Cloudinary** | 25GB storage, 25GB bandwidth | ~500MB images | ✅ |
| **Supabase** (optional) | 500MB DB, 2GB bandwidth | Realtime only, minimal | ✅ |
| **UptimeRobot** | 50 monitors, 5-min interval | 1 monitor | ✅ |
| **Domain** | N/A | annamay.com | ₹800/yr |

**Total: ~₹67/month** (domain only)

### When You'll Hit Limits

| Scenario | Likely Limit Hit | Action |
|----------|-----------------|--------|
| >50 orders/day | Render cold starts annoy users | Upgrade Render to $7/mo |
| >1000 menu images | Cloudinary 25GB storage | Compress images, or $89/mo plan |
| >10K page views/day | Neon compute hours | Upgrade to Neon Scale $19/mo |

---

## 18. Environment Variable Reference

### Backend (Render) — All Required Variables

```env
# Server
NODE_ENV=production
PORT=8000

# Database (Neon)
PG_HOST=ep-xxxxx.ap-southeast-1.aws.neon.tech
PG_PORT=5432
PG_DATABASE=restaurant_pos
PG_USER=pos_user
PG_PASSWORD=xxxxxxxx

# Auth
JWT_SECRET=your_64_char_hex_secret

# Payments
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_REDIRECT_URL=https://menu.annamay.com
SERVER_BASE_URL=https://api.annamay.com
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Supabase (optional)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### pos-frontend (Vercel)

```env
VITE_BACKEND_URL=https://api.annamay.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### pos-customer (Vercel)

```env
VITE_BACKEND_URL=https://api.annamay.com
```

### pos-kitchen (Vercel)

```env
VITE_BACKEND_URL=https://api.annamay.com
VITE_SUPABASE_URL=https://xxxxx.supabase.co          # optional
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...       # optional
```

---

## 19. Code Changes Required Before Deploy

### Summary of changes needed before going to production:

| # | File | Change | Reason |
|---|------|--------|--------|
| 1 | `pos-backend/config/database.js` | Add SSL `dialectOptions` for production | Neon requires SSL |
| 2 | `pos-backend/app.js` | Update CORS origins to include production domains | Frontend domains changed |
| 3 | `pos-backend/app.js` | Update Socket.IO CORS origins | Kitchen display needs access |
| 4 | `pos-backend/app.js` | Add `/health` endpoint | Render health checks + UptimeRobot |
| 5 | `pos-backend/app.js` | Add graceful shutdown handlers | Clean restarts on Render |
| 6 | `pos-backend/middlewares/upload.js` | Switch to Cloudinary storage | Render filesystem is ephemeral |
| 7 | `pos-customer/src/pages/Menu.jsx` | Use `import.meta.env.VITE_BACKEND_URL` | Remove hardcoded localhost |
| 8 | `pos-customer/src/pages/Cart.jsx` | Use `import.meta.env.VITE_BACKEND_URL` | Remove hardcoded localhost |
| 9 | `pos-kitchen/src/App.jsx` | Use `import.meta.env.VITE_BACKEND_URL` for socket URL | Remove hardcoded localhost |
| 10 | Create `pos-frontend/vercel.json` | SPA rewrites | React Router works on refresh |
| 11 | Create `pos-customer/vercel.json` | SPA rewrites | React Router works on refresh |
| 12 | Create `pos-kitchen/vercel.json` | SPA rewrites | React Router works on refresh |

---

## 20. Troubleshooting

### Problem: Render free tier sleeps → first request takes 30s

**Solution:** UptimeRobot pings `/health` every 5 min. Or upgrade to Render Starter ($7/mo).

### Problem: "Connection refused" from frontend

**Checklist:**
1. Is `VITE_BACKEND_URL` set correctly in Vercel?
2. Did you redeploy after changing env vars? (Vite inlines at build time)
3. Is CORS configured for your Vercel domain?
4. Check Render logs for errors

### Problem: Database connection fails on Render

**Checklist:**
1. Are `PG_*` env vars set on Render?
2. Is SSL configured in `database.js`? (Neon requires SSL)
3. Check Neon dashboard → is the compute endpoint active?
4. Pool max connections set too high? (Keep at 5 for free tier)

### Problem: Socket.IO not connecting from kitchen display

**Checklist:**
1. Socket.IO server CORS includes `kitchen.annamay.com`
2. Kitchen app's `SOCKET_URL` points to `https://api.annamay.com` (not `http://`)
3. WebSocket transport works through Vercel → not needed, connection is client → Render directly
4. Check browser console for connection errors

### Problem: Images lost after Render redeploy

**Cause:** Render's filesystem is ephemeral.
**Solution:** Migrate to Cloudinary (§9). All existing images uploaded to `/uploads` need to be re-uploaded to Cloudinary.

### Problem: Neon compute suspended

**Cause:** Neon free tier suspends compute after 5 min of inactivity.
**Solution:** Neon auto-wakes on next connection (adds ~1-2s latency). If this is a problem, the health check ping from UptimeRobot will keep both Render AND Neon awake.

### Problem: PhonePe payments failing in production

**Checklist:**
1. `SERVER_BASE_URL` must be your public API URL (HTTPS)
2. `PHONEPE_REDIRECT_URL` must be your customer-facing URL
3. PhonePe webhook must be able to reach your Render URL
4. Ensure PhonePe is configured for production mode (not sandbox)

---

## Deployment Checklist

Use this final checklist before going live:

- [ ] Neon database created and connection string obtained
- [ ] Database SSL enabled in `config/database.js`
- [ ] CORS updated in `app.js` for production domains
- [ ] Socket.IO CORS updated for production domains
- [ ] `/health` endpoint added
- [ ] Graceful shutdown handlers added
- [ ] Cloudinary configured in upload middleware
- [ ] `pos-customer` API URL changed to env variable
- [ ] `pos-kitchen` socket URL changed to env variable
- [ ] All three `vercel.json` files created
- [ ] Backend deployed on Render with all env vars
- [ ] pos-frontend deployed on Vercel with env vars
- [ ] pos-customer deployed on Vercel with env vars
- [ ] pos-kitchen deployed on Vercel with env vars
- [ ] Custom domains configured (DNS + Vercel + Render)
- [ ] Production database seeded
- [ ] UptimeRobot monitor configured
- [ ] All login credentials tested (admin, manager, waiter, chef, cashier)
- [ ] QR code generated pointing to `menu.annamay.com`
- [ ] Kitchen display tested with live order placement
- [ ] Payment flow tested end-to-end
