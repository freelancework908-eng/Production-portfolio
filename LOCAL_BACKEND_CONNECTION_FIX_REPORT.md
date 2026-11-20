# Local Backend API Connection Fix Report

**Project**: `E:\Production-portfolio`  
**Execution Timestamp**: 2026-11-20T22:45:00+05:30  
**Verification Result**: **SUCCESS (All Tests Passing, Zero Connection Failures)**

---

## 1. Root Cause Analysis

Investigation revealed two compounding root causes responsible for the recurring `ECONNREFUSED` and `ECONNRESET` errors between the frontend Vite proxy and the backend Node.js server:

1. **Nodemon Infinite Rapid-Restart Crash Loop (`EADDRINUSE` Race Condition)**:
   - `server/package.json` executes `"dev": "nodemon src/index.js"`.
   - Without an explicit ignore configuration (`nodemon.json`), nodemon watches all files matching `js,mjs,cjs,json` across the entire project tree.
   - Upon backend boot, `initDatabase()` unconditionally called `saveState()`, writing to `server/src/db/data.json`.
   - Nodemon detected `data.json` had changed and immediately triggered a process restart.
   - During restart, the previous Node.js process had not yet released TCP port 5000, triggering an unhandled `Error: listen EADDRINUSE: address already in use :::5000` which crashed the server (`[nodemon] app crashed - waiting for file changes...`).
   - Any request proxied by Vite during this restart/crash cycle received **`ECONNRESET`** (connection aborted mid-handshake) or **`ECONNREFUSED`** (server port offline).

2. **IPv6 / IPv4 Loopback Resolution Mismatch in Vite Proxy**:
   - `client/vite.config.ts` proxied `/api` requests to `http://localhost:5000`.
   - In Node.js 18+ on modern Windows, `localhost` resolves to IPv6 `::1` first.
   - Express in `server/src/index.js` invoked `app.listen(PORT)` without explicit IPv4 loopback binding (`0.0.0.0` or `127.0.0.1`).
   - When Vite's proxy forwarded requests to `[::1]:5000`, the connection was dropped or refused by the OS socket stack.

3. **Incomplete Collection Seeding Safeguard**:
   - When TiDB was not configured in `.env`, the standalone database initialization did not guarantee defaults for `clients`, `testimonials`, `banners`, and `navigation_items` in `seedData.js`, which could return empty arrays.

---

## 2. Files Changed

| File | Changes Made |
| :--- | :--- |
| [server/nodemon.json](file:///E:/Production-portfolio/server/nodemon.json) | Created nodemon configuration watching only `src/` (extensions: `js,mjs,cjs`) and strictly ignoring `src/db/data.json`, `uploads/*`, `*.log`, and `*.tmp` with a 500ms debounce. |
| [client/vite.config.ts](file:///E:/Production-portfolio/client/vite.config.ts) | Updated proxy targets from `http://localhost:5000` to explicit IPv4 `http://127.0.0.1:5000` with `secure: false` and `changeOrigin: true` for both `/api` and `/uploads`. |
| [server/src/index.js](file:///E:/Production-portfolio/server/src/index.js) | Updated `app.listen` to explicitly bind to `0.0.0.0` on port 5000. Added `server.on('error', ...)` handler for clear diagnostics on `EADDRINUSE` and global uncaught/unhandled handlers. |
| [server/src/db/index.js](file:///E:/Production-portfolio/server/src/db/index.js) | 1. Integrated `initTiDBPool` and `verifyTiDBConnection` with `SELECT 1` validation.<br>2. Removed unconditional `saveState()` on boot; only saves if migrations or missing collections set `dirty = true`.<br>3. Enforced fallback defaults for all CMS collections (`services`, `projects`, `clients`, `testimonials`, `banners`, `navigation_items`, `gallery`, `admins`). |
| [server/src/db/connection.js](file:///E:/Production-portfolio/server/src/db/connection.js) | Added `verifyTiDBConnection()` to test database connectivity with `SELECT 1 as alive` and return structured diagnostic status without process crashes. |
| [server/src/db/seedData.js](file:///E:/Production-portfolio/server/src/db/seedData.js) | Added complete default datasets for `clients` (6), `testimonials` (3), `banners` (3), and `navigation` (11) so fallback data is complete. |
| [server/test-all-endpoints.js](file:///E:/Production-portfolio/server/test-all-endpoints.js) | Updated `BASE_URL` to `http://127.0.0.1:5000` for deterministic loopback socket binding. |

---

## 3. Configuration & Ports

- **Actual Backend Port**: `5000` (Listening on `0.0.0.0:5000`, accessible via `http://127.0.0.1:5000`)
- **Vite Proxy Destination**: `http://127.0.0.1:5000` (Forwarding `/api/*` and `/uploads/*`)
- **Frontend Vite Port**: `5173` (`http://localhost:5173`)

---

## 4. TiDB Connectivity Result

- **Connection Verification**: Tested using `verifyTiDBConnection()`.
- **Environment Status**: `DATABASE_URL` and `TIDB_*` environment variables are currently unpopulated in `server/.env` (available in `.env.example`).
- **Diagnostic Behavior**:
  - Without remote credentials: Logs clear diagnostic notice `[Database] Operating with local relational store (TiDB credentials not set in .env).` and initializes the local relational store.
  - When remote credentials are provided: Establishes TLS v1.2 connection pool and executes `SELECT 1 as alive` health check.
  - Failures produce structured error diagnostics without crashing the backend process or throwing unhandled promise rejections.
- **Dataset Integrity**: **Confirmed no empty fallback dataset is returned**. Standalone relational store contains:
  - 16 Services (Studio & Production)
  - 12 Projects (6 Studio, 6 Production)
  - 6 Clients
  - 3 Testimonials
  - 3 Banners
  - 11 Navigation Items
  - 3 Gallery Items
  - 2 Admins (`admin@superway.com`, `admin@arjun-dev.com`)

---

## 5. API Endpoint Test Results

### Tests Through Vite Proxy (`http://localhost:5173`)

| Method & Endpoint | Status | Result / Content Verified |
| :--- | :---: | :--- |
| `GET /api/services?division=STUDIO` | **200 OK** | Returned 12 Studio services (`Brand Design`, `UI/UX`, `Web Dev`, etc.) |
| `GET /api/projects?division=STUDIO&status=published` | **200 OK** | Returned 6 published Studio projects |
| `GET /api/projects/the-midnight-solitude` | **200 OK** | Returned project detail: *"The Midnight Solitude"* |
| `GET /api/gallery` | **200 OK** | Returned 3 production still items |
| `GET /api/projects?division=PRODUCTION&status=published` | **200 OK** | Returned 6 published Production film/ad projects |
| `GET /api/clients` | **200 OK** | Returned 6 verified clients across both divisions |
| `GET /api/testimonials` | **200 OK** | Returned 3 verified client testimonials |
| `GET /api/banners` | **200 OK** | Returned 3 division hero banners |
| `GET /api/navigation` | **200 OK** | Returned 11 navigation routes across portal/studio/production |
| `POST /api/auth/login` | **200 OK** | Authenticated `admin@superway.com`, issued JWT token |
| `GET /api/stats` | **200 OK** | CMS dashboard stats with valid JWT bearer token |

### Backend Test Suite (`node server/test-all-endpoints.js`)
- **12 of 12 tests passed** (0 failed).

---

## 6. Stability & Verification

- **Backend Process**: Started via `npm --prefix server run dev` (nodemon). Confirmed stable; zero unexpected restarts or `EADDRINUSE` errors.
- **Frontend Process**: Running on `localhost:5173`. Proxies directly to `127.0.0.1:5000` with zero `ECONNREFUSED` or `ECONNRESET`.
- **Public & Admin UI**: All public views (`/studio`, `/production`, `/about`, `/contact`) and Admin CMS (`/admin`, `/admin/login`) receive database content reliably.

## 7. Remaining Issues

- None. All target endpoints are responding with HTTP 200 and complete database records through the Vite proxy.
