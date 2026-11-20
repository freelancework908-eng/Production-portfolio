import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { initDatabase, db } from './db/index.js';
import { verifyTiDBConnection } from './db/connection.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import projectsRoutes from './routes/projects.js';
import settingsRoutes from './routes/settings.js';
import galleryRoutes from './routes/gallery.js';
import mediaRoutes from './routes/media.js';
import enquiriesRoutes from './routes/enquiries.js';
import statsRoutes from './routes/stats.js';
import clientsRoutes from './routes/clients.js';
import testimonialsRoutes from './routes/testimonials.js';
import bannersRoutes from './routes/banners.js';
import navigationRoutes from './routes/navigation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDatabase().catch(err => {
  console.error('Database initialization error:', err);
});

// CORS Configuration
const allowedOrigins = [
  'https://production-portfolio-sigma.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow Vercel preview deployment origins for this project
    if (/^https:\/\/production-portfolio(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Range', 'Accept'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/navigation', navigationRoutes);

// Root Route (Prevents "Cannot GET /" or 404 on backend root)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'SUPERWAY · Studio & Production API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    message: 'Welcome to the Superway Studio & Production API service.',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      projects: '/api/projects',
      gallery: '/api/gallery',
      settings: '/api/settings',
      media: '/api/media',
      clients: '/api/clients',
      testimonials: '/api/testimonials',
      banners: '/api/banners',
      navigation: '/api/navigation',
      auth: '/api/auth'
    }
  });
});

// Comprehensive Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = {
    status: 'disconnected',
    type: 'none',
    connected: false
  };

  try {
    const tidbCheck = await verifyTiDBConnection();
    if (tidbCheck.connected && tidbCheck.alive) {
      dbStatus = {
        status: 'connected',
        type: 'TiDB Cloud',
        connected: true
      };
    } else if (tidbCheck.reason === 'NO_REMOTE_CONFIG') {
      dbStatus = {
        status: 'local_fallback',
        type: 'file_backed_store',
        connected: true,
        note: 'Operating on standalone relational store'
      };
    } else {
      dbStatus = {
        status: 'error',
        type: 'TiDB Cloud',
        connected: false,
        error: tidbCheck.reason || 'Database verification failed'
      };
    }
  } catch (err) {
    dbStatus = {
      status: 'error',
      type: 'unknown',
      connected: false,
      error: 'Database check failed'
    };
  }

  res.status(200).json({
    status: 'online',
    app: 'SUPERWAY · Studio & Production API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
});

// Dynamic Robots.txt
app.get('/robots.txt', async (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: http://${req.headers.host || 'localhost:5173'}/sitemap.xml\n`);
});

// Dynamic Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const projects = await db.getProjects({ status: 'published' });
    const host = req.headers.host || 'localhost:5173';
    const baseUrl = `http://${host}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages across both divisions
    const staticPages = [
      '',
      '/about',
      '/contact',
      '/studio',
      '/studio/services',
      '/studio/work',
      '/production',
      '/production/films',
      '/production/ads'
    ];
    staticPages.forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Dynamic projects
    projects.forEach(p => {
      const prefix = p.division === 'STUDIO' ? '/studio/work' : '/production/work';
      xml += `  <url>\n    <loc>${baseUrl}${prefix}/${p.slug || p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Process level error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('[SUPERWAY API] Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[SUPERWAY API] Uncaught Exception:', err);
});

// Start listening if executed directly (and not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SUPERWAY API] Running on port ${PORT} (http://127.0.0.1:${PORT})`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[SUPERWAY API ERROR] Port ${PORT} is already in use by another process.`);
    } else {
      console.error('[SUPERWAY API ERROR] Server failed to start:', err);
    }
  });
}

export default app;
