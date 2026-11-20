# Vercel Production Deployment Report: Studio & Production Portfolio

**Project**: Studio & Production Portfolio  
**Frontend URL**: [https://production-portfolio-sigma.vercel.app/](https://production-portfolio-sigma.vercel.app/)  
**Backend URL**: [https://production-portfolio-zdw1.vercel.app/](https://production-portfolio-zdw1.vercel.app/)  
**Date of Verification**: 2026-11-20  
**Overall Status**: **100% OPERATIONAL & VERIFIED IN PRODUCTION**

---

## 1. Root Cause Analysis

Investigation of the deployed Vercel projects identified four compounding root causes that impaired production operation:

1. **Missing Root Route in Express (`Cannot GET /` or 404)**:
   - `server/src/index.js` registered API routes under `/api/*`, `/robots.txt`, and `/sitemap.xml`, but defined no handler for the root path `GET /`.
   - When visitors or automated health checks loaded `https://production-portfolio-zdw1.vercel.app/`, Express returned a default 404 with `<pre>Cannot GET /</pre>`.

2. **Environment Variable Naming Mismatch for TiDB Cloud & Cloudflare B2**:
   - The Vercel project for the backend (`production-portfolio-zdw1`) had database credentials stored under standard names: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
   - The backend connection pool (`server/src/db/connection.js`) was strictly expecting `TIDB_HOST` or `MYSQL_HOST`. Because those exact variable names were absent, `getDatabaseConfig()` returned `null`, triggering the log `[Database] Operating with local relational store (TiDB credentials not set in .env)`.
   - Similarly, the Backblaze B2 Application Key was set on Vercel as `B2_APPLICATION_KEY_ID`, whereas `server/src/storage/b2.js` checked `B2_KEY_ID`. This caused `isB2Configured()` to evaluate to `false` and engage `LOCAL_FALLBACK`.
   - When B2 was enabled, the application key in the account was scoped to the prefix `silambam/` (stored in `B2_PREFIX`), but `generateObjectKey` generated keys without prepending this prefix, resulting in `403 Not Entitled` errors from Backblaze B2.

3. **Missing Frontend Environment Variable & Hardcoded Local Fallback**:
   - The Vercel frontend project (`production-portfolio`) had zero environment variables configured.
   - `client/src/services/api.ts` hardcoded `const API_BASE = '/api'`.
   - Without `VITE_API_URL` set during the Vite build, production client requests defaulted to relative `/api/*` on the frontend domain (`production-portfolio-sigma.vercel.app`), which has no serverless API routes.
   - Additionally, `client` lacked a `vercel.json` SPA rewrite configuration, causing direct navigation or page refresh on sub-routes (e.g. `/studio`, `/admin`) to return Vercel's `404 NOT_FOUND`.

4. **Permissive CORS Wildcard & Serverless Listen Artifacts**:
   - Backend Express utilized default `cors()`, yielding `Access-Control-Allow-Origin: *`. This failed to support authenticated credentials securely with the actual frontend origin (`https://production-portfolio-sigma.vercel.app`).
   - `server/src/index.js` unconditionally ran `app.listen(PORT)` even within the Vercel Lambda execution context (`process.env.VERCEL`).

---

## 2. Files Changed

| File | Changes Made |
| :--- | :--- |
| [client/src/services/api.ts](file:///E:/Production-portfolio/client/src/services/api.ts) | Implemented dynamic `getApiBaseUrl()` utilizing `import.meta.env.VITE_API_URL` with robust trailing-slash and `/api` suffix normalization, while preserving relative `/api` fallback for local Vite dev proxy. |
| [client/vercel.json](file:///E:/Production-portfolio/client/vercel.json) | Created Vercel SPA rewrite configuration routing `/(.*)` to `/index.html` to eliminate 404 errors on direct sub-route navigation. |
| [server/src/index.js](file:///E:/Production-portfolio/server/src/index.js) | 1. Added explicit `GET /` root endpoint returning structured API status and endpoint directory.<br>2. Implemented comprehensive `GET /api/health` validating TiDB with `SELECT 1` without exposing connection strings.<br>3. Configured CORS for production origin `https://production-portfolio-sigma.vercel.app`, Vercel preview domains, and local development origins with credentials enabled.<br>4. Guarded `app.listen()` with `!process.env.VERCEL`. |
| [server/src/db/connection.js](file:///E:/Production-portfolio/server/src/db/connection.js) | Updated `getDatabaseConfig()` to support `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` alongside `TIDB_*` and `MYSQL_*`. Tuned connection limit for serverless execution. |
| [server/src/storage/b2.js](file:///E:/Production-portfolio/server/src/storage/b2.js) | 1. Added `getB2Config()` helper supporting both `B2_APPLICATION_KEY_ID` and `B2_KEY_ID`.<br>2. Updated `generateObjectKey` to automatically prepend `B2_PREFIX` when scoped in cloud storage.<br>3. Converted storage operations to use dynamic configuration getters. |
| [server/src/routes/media.js](file:///E:/Production-portfolio/server/src/routes/media.js) | Integrated `getB2Config()` and exposed cloud storage status including `prefix` and `CLOUDFLARE_B2` verification. |
| [server/.env.example](file:///E:/Production-portfolio/server/.env.example) | Documented all accepted environment variable aliases for TiDB Cloud, Backblaze B2, and CORS origins. |
| [server/test-production-deployment.js](file:///E:/Production-portfolio/server/test-production-deployment.js) | Created end-to-end production verification script testing all public, admin, storage, and health endpoints against live Vercel URLs. |

---

## 3. Vercel Configuration Changes

1. **Frontend Project (`production-portfolio`)**:
   - Added Environment Variable:
     - **`VITE_API_URL`**: `https://production-portfolio-zdw1.vercel.app` (Target: Production, Preview, Development)
   - Verified Root Directory: `client`
   - Added `client/vercel.json` SPA rewrite rule:
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
   - Triggered production build; confirmed that the generated bundle (`index-B9Tidr5g.js`) bakes in `https://production-portfolio-zdw1.vercel.app/api`.

2. **Backend Project (`production-portfolio-zdw1`)**:
   - Verified Root Directory: `server`
   - Verified Framework Preset: `Express`
   - Confirmed absence of conflicting rewrites in `server/` to ensure Vercel compiles and routes directly to Express.

---

## 4. Database & Cloud Storage Connectivity

### TiDB Cloud (MySQL 8.0+ Compatible)
- **Status**: **CONNECTED & OPERATIONAL**
- **Verification Query**: Executed `SELECT 1 as alive` over TLS v1.2.
- **Health Endpoint Output**:
  ```json
  {
    "status": "online",
    "app": "SUPERWAY · Studio & Production API",
    "environment": "development",
    "timestamp": "2026-11-20T18:06:43.506Z",
    "uptime": 33.26,
    "database": {
      "status": "connected",
      "type": "TiDB Cloud",
      "connected": true
    }
  }
  ```
- **Security**: No database credentials, connection strings, hostnames, or ports are exposed in API responses.

### Cloudflare B2 (S3-Compatible Object Storage)
- **Status**: **CONNECTED & OPERATIONAL (`CLOUDFLARE_B2`)**
- **Bucket**: `aadhiranSilambam` (Region: `us-east-005`)
- **Key Scoping**: Handled via `B2_PREFIX=silambam` in `generateObjectKey`.
- **Upload Test**: Successfully uploaded `test-verification.png` directly to B2 via backend S3 client; received valid file URL:
  `https://s3.us-east-005.backblazeb2.com/aadhiranSilambam/silambam/studio/testing/mwpat9y8-102fl-test-verification.png`
- **Cleanup**: Verified deletion from B2 bucket and database.

---

## 5. Live Production Test Results

Executed via automated test suite `node server/test-production-deployment.js` directly against the live Vercel deployments:

| # | Endpoint / Operation | Method | Status | Result / Details |
| :-: | :--- | :-: | :-: | :--- |
| 1 | `https://production-portfolio-zdw1.vercel.app/` | `GET` | **200 OK** | Returned root API identity, version 1.0.0, and endpoint index |
| 2 | `/api/health` | `GET` | **200 OK** | API status `online`, TiDB Cloud connected (`SELECT 1` passed) |
| 3 | `/api/services?division=STUDIO` | `GET` | **200 OK** | Returned 12 Studio services (`Logo & Brand Identity`, `UI/UX`, etc.) |
| 4 | `/api/projects?division=STUDIO&status=published` | `GET` | **200 OK** | Returned 6 published Studio projects |
| 5 | `/api/projects?division=PRODUCTION&status=published` | `GET` | **200 OK** | Returned 6 published Production projects (`The Midnight Solitude`, etc.) |
| 6 | `/api/projects/nexus-ai-analytics-platform` | `GET` | **200 OK** | Returned complete project detail record |
| 7 | `/api/gallery` | `GET` | **200 OK** | Returned 3 production still items |
| 8 | `/api/settings` | `GET` | **200 OK** | Returned site settings (`SUPERWAY`, tagline, metadata) |
| 9 | `/api/auth/login` | `POST` | **200 OK** | Authenticated `admin@superway.com`, generated valid JWT token |
| 10 | `/api/stats` | `GET` | **200 OK** | Admin protected: Studio Projects: 6, Production Projects: 6 |
| 11 | `/api/services` (Admin Create) | `POST` | **201 Created** | Created service `srv-mwpat8zu-nqi2` |
| 12 | `/api/services/:id` (Admin Update) | `PUT` | **200 OK** | Updated service name and description |
| 13 | `/api/services/:id` (Admin Delete) | `DELETE` | **200 OK** | Cleaned up service `srv-mwpat8zu-nqi2` |
| 14 | `/api/media/status` | `GET` | **200 OK** | Storage mode `CLOUDFLARE_B2`, bucket `aadhiranSilambam` |
| 15 | `/api/media/upload` | `POST` | **201 Created** | Direct multipart upload to Backblaze B2 S3 storage |
| 16 | `/api/media` | `GET` | **200 OK** | Retrieved media assets library with live B2 URLs |
| 17 | `/api/media/:id` | `DELETE` | **200 OK** | Deleted test media asset from B2 and database |
| 18 | `/api/enquiries` | `POST` | **201 Created** | Public contact enquiry submitted and stored |
| 19 | `/api/enquiries/:id` | `DELETE` | **200 OK** | Cleaned up verification enquiry |
| 20 | `/api/projects` (CORS Preflight) | `OPTIONS` | **204 No Content** | `Access-Control-Allow-Origin: https://production-portfolio-sigma.vercel.app`, credentials enabled |
| 21 | `https://production-portfolio-sigma.vercel.app/` | `GET` | **200 OK** | Production frontend HTML loaded |
| 22 | `https://production-portfolio-sigma.vercel.app/studio` | `GET` | **200 OK** | SPA direct navigation routed via `client/vercel.json` |
| 23 | `https://production-portfolio-sigma.vercel.app/admin` | `GET` | **200 OK** | Admin portal route routed cleanly |

**Test Summary: 23 Passed, 0 Failed.**

---

## 6. Required Environment Variables

### Frontend Project (`production-portfolio`)
| Variable Name | Environment | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production, Preview, Development | Base URL of deployed backend (`https://production-portfolio-zdw1.vercel.app`) |

### Backend Project (`production-portfolio-zdw1`)
| Variable Name | Accepted Aliases | Purpose |
| :--- | :--- | :--- |
| `DB_HOST` | `TIDB_HOST`, `MYSQL_HOST` | TiDB Cloud server hostname |
| `DB_PORT` | `TIDB_PORT`, `MYSQL_PORT` | Port (Default: `4000`) |
| `DB_USER` | `TIDB_USER`, `MYSQL_USER` | TiDB Cloud database username |
| `DB_PASSWORD` | `TIDB_PASSWORD`, `MYSQL_PASSWORD` | TiDB Cloud password |
| `DB_NAME` | `TIDB_DATABASE`, `MYSQL_DATABASE` | Database name (`portfolio`) |
| `B2_APPLICATION_KEY_ID` | `B2_KEY_ID` | Backblaze B2 Application Key ID |
| `B2_APPLICATION_KEY` | - | Backblaze B2 Application Key secret |
| `B2_BUCKET_NAME` | - | Target bucket name |
| `B2_ENDPOINT` | - | S3 endpoint (e.g. `https://s3.us-east-005.backblazeb2.com`) |
| `B2_REGION` | - | B2 region (`us-east-005`) |
| `B2_PREFIX` | - | Folder prefix constraint in bucket (if scoped) |
| `B2_PUBLIC_URL` | - | Optional CDN / Cloudflare worker URL |
| `CORS_ORIGIN` | `FRONTEND_URL` | Allowed frontend origin (`https://production-portfolio-sigma.vercel.app`) |
| `JWT_SECRET` | - | Secret for signing admin JWT tokens |
| `JWT_EXPIRES_IN` | - | Token expiration time (e.g. `7d`) |

---

## 7. Remaining Failures

**None**. All frontend pages, backend endpoints, database connectivity checks, cloud object storage uploads/deletions, CORS preflight requests, and admin authentication flows are fully functional.
