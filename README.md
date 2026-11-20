# SUPERWAY — Integrated Creative Studio & Film Production House

Transforming personal cinematic brand portfolio into a unified creative company portfolio operating with two independent creative divisions under **ONE DOMAIN**, **ONE BACKEND**, **ONE DATABASE**, and **ONE CENTRALIZED ADMIN PANEL**.

![Superway Preview](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop)

---

## 1. Executive Summary & Architecture

| Element | Description |
| :--- | :--- |
| **Parent Entity** | **Superway** (Mumbai · Bengaluru · London) |
| **Division 01: STUDIO** | Creative Design, Branding, Digital Solutions, UI/UX, and Custom Software Development |
| **Division 02: PRODUCTION** | Film Production, Narrative Short Films, Commercial Advertisements, and Video Production |
| **Architecture** | React 19 (TypeScript, Vite, Tailwind CSS v4) + Node.js / Express API |
| **Database** | Shared relational data store with dual-division support (`data.json` & MySQL 8.0+ schema) |
| **Admin Panel** | Centralized CMS dashboard with granular Studio & Production management |
| **Development Constraint** | Engineered within strict ₹6,500 scope: zero unnecessary paid dependencies |

---

## 2. Visual Identities & Themes

### Division 01 — STUDIO
- **Visual Feel**: Modern digital technology and design agency.
- **Theme**: Blue and Purple gradient (top-left to bottom-right).
- **Colors**:
  - Deep Navy: `#10152D`
  - Dark Blue: `#172B55`
  - Blue: `#4263EB`
  - Purple: `#7952D9`
  - Violet: `#A78BFA`
  - Background: `#0B1020`
  - Text: `#F8FAFC`
- **Atmosphere**: Subtle gradient lighting, modern typography, glassmorphism card surfaces, and crisp interactive states.

### Division 02 — PRODUCTION
- **Visual Feel**: Premium cinematic auteur production house.
- **Theme**: Premium Cinematic Dark.
- **Colors**:
  - Background: `#101010`
  - Secondary Background: `#1B1B1B`
  - Gold Accent: `#C6A04A`
  - Warm Accent: `#D9B96E`
  - Main Text: `#FFFFFF`
  - Secondary Text: `#A1A1AA`
- **Atmosphere**: Deep matte blacks, anamorphic stills, full-width video backdrops, gold typography, and zero blue-purple gradient spillover.

---

## 3. URL Route Structure

### Main Portal
- `/` — Division selection homepage (two-column desktop / stacked mobile)
- `/about` — Unified company introduction & dual-division philosophy
- `/contact` — Dynamic inquiry page with division routing

### STUDIO Division
- `/studio` — Studio division homepage (Hero, Services, Selected Work, Capabilities, Process, Testimonials, CTA)
- `/studio/services` — Full categorized services catalog
- `/studio/work` — Studio portfolio gallery with category filters
- `/studio/work/:slug` — Dynamic project case study details

### PRODUCTION Division
- `/production` — Production division homepage (Hero showreel, Featured Films, Short Films, Commercial Ads, BTS Stills, Services, CTA)
- `/production/films` — Narrative feature films & short films portfolio
- `/production/ads` — Commercial advertisements & brand films portfolio
- `/production/work/:slug` — Dynamic cinematic project details & video player

### Centralized Admin Panel
- `/admin/login` — Secure administrator authentication
- `/admin` — Centralized command center dashboard (metrics & recent activity)
- `/admin/studio/services` — Studio services catalog CRUD
- `/admin/studio/projects` — Studio portfolio projects CRUD
- `/admin/studio/categories` — Service categories taxonomy
- `/admin/production/projects` — All production projects CRUD
- `/admin/production/films` — Feature & short films catalog
- `/admin/production/ads` — Commercial advertisements catalog
- `/admin/projects` — Unified projects management with division filters
- `/admin/enquiries` — Inbound client communications & message manager
- `/admin/settings` — Corporate identity, division branding & security

---

## 4. Centralized Admin Panel Features

### Dashboard Metrics
- **Total Studio Projects**
- **Total Production Projects**
- **Total Services**
- **Total Inquiries** (with unread badge counters)
- Quick creation triggers for Studio Projects, Production Films/Ads, and Services

### Project Management CRUD
- **Title & Slug**: Automatic slug generator from title with manual override
- **Division Selection**: `STUDIO` or `PRODUCTION`
- **Dynamic Category Mapping**: Automatically shows Studio categories for Studio and Film/Commercial categories for Production
- **Short & Full Descriptions**: Markdown-compatible text fields
- **Media Upload & Direct URL**: Supports local file uploads to `/uploads` as well as Cloudinary / Unsplash / CDN image URLs
- **Video Embeds**: Direct support for YouTube (`watch?v=` or `youtu.be/`) and Vimeo URLs
- **Status & Featured Toggles**: Immediate publication switch (`published` / `draft`) and featured badge
- **Public Isolation**: Studio projects appear exclusively in Studio views; Production projects appear exclusively in Production views

### Inquiries Management
- Saves inquiries directly into the database with `division` tag (`STUDIO`, `PRODUCTION`, `GENERAL`)
- Filters inquiries by Division and Unread status
- 1-click Mark Read / Mark Unread toggle
- Modal view for full message body and sender details
- Secure deletion

---

## 5. Security & Backend Architecture

- **Authentication**: JWT (JSON Web Tokens) with 7-day expiration and bcrypt-hashed administrator passwords.
- **Protection**: All administrative APIs (`/api/projects`, `/api/services`, `/api/enquiries`, `/api/stats`, `/api/settings`) require `Bearer` token validation.
- **Public Visibility Enforcement**: Unauthenticated public endpoints filter by `status = 'published'` and `is_active = true`.
- **Relational Integrity**: Shared database schema with `division` column ensures clean separation without database duplication.

---

## 6. Media Management Architecture

1. **Direct Upload Endpoint**: The server implements Multer storage saving to `/uploads` and serving statically through Express.
2. **Cloud Storage Integration**: Accepts external CDN URLs (Unsplash, Cloudinary, AWS S3).
3. **Video Delivery**: Leverages YouTube and Vimeo embeds through a lightweight responsive `VideoModal` without expensive video streaming infrastructure.
4. *Dependency Note*: For multi-server serverless deployments, configure an external S3/Cloudinary bucket via environment variables.

---

## 7. Environment Variables

Create `.env` in the `server` directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=cinematic-super-secret-key-2025

# Optional TiDB / MySQL 8.0+ connection config:
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=password
# MYSQL_DATABASE=superway_db
```

---

## 8. Default Credentials

- **Admin Email**: `admin@superway.com` *(or `admin@arjun-dev.com`)*
- **Admin Password**: `cinematic2025!`
- **Login URL**: `/admin/login`

---

## 9. Local Development & Deployment

### Quick Run
```bash
# Install dependencies
npm --prefix server install
npm --prefix client install

# Start backend server (port 5000)
npm run server

# Start client development server (port 5173 with API proxy)
npm run client

# Production Build
npm run build
```

The application is fully configured, tested, and ready for deployment.
