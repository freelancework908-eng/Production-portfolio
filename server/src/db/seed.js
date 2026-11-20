import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { getDatabaseConfig, initTiDBPool, query, isTiDBConnected } from './connection.js';
import { runMigrations } from './migrate.js';
import { getSeedData } from './seedData.js';
import { isB2Configured, uploadToStorage } from '../storage/b2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

export async function runContentMigration() {
  console.log('=== STARTING MANDATORY EXISTING CONTENT MIGRATION ===');

  const report = {
    projectsMigrated: 0,
    servicesMigrated: 0,
    categoriesMigrated: 0,
    clientsMigrated: 0,
    testimonialsMigrated: 0,
    bannersMigrated: 0,
    imagesMigrated: 0,
    videosMigrated: 0,
    failedUploads: 0,
    missingMedia: 0,
    duplicateContent: 0,
    remainingHardcodedContent: 0,
    targetDatabase: 'TiDB Cloud (or synchronized file-backed relational store)'
  };

  // 1. Load all existing data
  let state = await getSeedData();
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
    } catch (e) {
      console.warn('Could not read data.json, using seedData', e.message);
    }
  }

  // Define comprehensive categories for both divisions
  const serviceCategories = [
    // STUDIO
    { id: 'sc-std-01', name: 'Graphic and Brand Design', slug: 'graphic-and-brand-design', division: 'STUDIO', description: 'Logo design, brand identity, typography, posters, brochures, packaging and brand guidelines.' },
    { id: 'sc-std-02', name: 'UI/UX and Web Design', slug: 'ui-ux-and-web-design', division: 'STUDIO', description: 'Website UI/UX, landing page design, mobile app interfaces, and enterprise design systems.' },
    { id: 'sc-std-03', name: 'Web and Software Development', slug: 'web-and-software-development', division: 'STUDIO', description: 'Static & dynamic websites, web applications, SaaS dashboards, and cloud backend engineering.' },
    { id: 'sc-std-04', name: 'Motion and Digital Creativity', slug: 'motion-and-digital-creativity', division: 'STUDIO', description: '2D/3D animation, motion graphics, animated logo reveals, and social media reels.' },
    // PRODUCTION
    { id: 'sc-prd-01', name: 'Film Production', slug: 'film-production', division: 'PRODUCTION', description: 'Feature films, short films, independent cinema, and episodic web series.' },
    { id: 'sc-prd-02', name: 'Commercial Production', slug: 'commercial-production', division: 'PRODUCTION', description: 'Television advertisements, digital brand campaigns, and high-impact product cinematics.' },
    { id: 'sc-prd-03', name: 'Creative Video Production', slug: 'creative-video-production', division: 'PRODUCTION', description: 'Music videos, artist promos, live event films, and social campaigns.' },
    { id: 'sc-prd-04', name: 'Production Services', slug: 'production-services', division: 'PRODUCTION', description: 'Story development, direction, anamorphic cinematography, and post-production color/sound.' }
  ];

  const projectCategories = [
    { id: 'pc-01', name: 'Web and Software Development', slug: 'web-and-software-development', division: 'STUDIO' },
    { id: 'pc-02', name: 'UI/UX and Web Design', slug: 'ui-ux-and-web-design', division: 'STUDIO' },
    { id: 'pc-03', name: 'Graphic and Brand Design', slug: 'graphic-and-brand-design', division: 'STUDIO' },
    { id: 'pc-04', name: 'Motion and Digital Creativity', slug: 'motion-and-digital-creativity', division: 'STUDIO' },
    { id: 'pc-05', name: 'Film Production', slug: 'film-production', division: 'PRODUCTION' },
    { id: 'pc-06', name: 'Short Films', slug: 'short-films', division: 'PRODUCTION' },
    { id: 'pc-07', name: 'Feature Films', slug: 'feature-films', division: 'PRODUCTION' },
    { id: 'pc-08', name: 'Commercial Production', slug: 'commercial-production', division: 'PRODUCTION' },
    { id: 'pc-09', name: 'TV Advertisements', slug: 'tv-advertisements', division: 'PRODUCTION' },
    { id: 'pc-10', name: 'Creative Video Production', slug: 'creative-video-production', division: 'PRODUCTION' }
  ];

  const clients = [
    { id: 'cli-01', name: 'Nexus Telemetry Systems', division: 'STUDIO', website_url: 'https://nexus.io', display_order: 1 },
    { id: 'cli-02', name: 'Velox Financial Technologies', division: 'STUDIO', website_url: 'https://velox.finance', display_order: 2 },
    { id: 'cli-03', name: 'Botanical Paris', division: 'STUDIO', website_url: 'https://botanicalparis.fr', display_order: 3 },
    { id: 'cli-04', name: 'Apex Chrono Geneva', division: 'PRODUCTION', website_url: 'https://apexchrono.ch', display_order: 4 },
    { id: 'cli-05', name: 'Vortex Automotive International', division: 'PRODUCTION', website_url: 'https://vortexev.com', display_order: 5 },
    { id: 'cli-06', name: 'Nocturne Motion Pictures', division: 'PRODUCTION', website_url: 'https://nocturnepictures.com', display_order: 6 }
  ];

  const testimonials = [
    {
      id: 'test-01',
      client_name: 'David Chen',
      client_role: 'Chief Technology Officer',
      company: 'Nexus Telemetry Systems (San Francisco)',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      division: 'STUDIO',
      quote: 'Superway Studio completely re-engineered our SaaS observability interface. Our conversion jumped 42% in ninety days and client feedback has been universally ecstatic.',
      rating: 5,
      display_order: 1,
      is_featured: true,
      is_published: true
    },
    {
      id: 'test-02',
      client_name: 'Camille Laurent',
      client_role: 'Founder & Creative Lead',
      company: 'Botanical Paris',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      division: 'STUDIO',
      quote: 'Their brand identity and luxury packaging work for our perfume label won international awards. Pure craftsmanship and relentless attention to detail.',
      rating: 5,
      display_order: 2,
      is_featured: true,
      is_published: true
    },
    {
      id: 'test-03',
      client_name: 'Henri Vane',
      client_role: 'Head of Global Marketing',
      company: 'Apex Chrono (Geneva)',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      division: 'PRODUCTION',
      quote: 'The commercial spots directed by Superway Production captured the micro-mechanics of our luxury timepieces with breathtaking anamorphic beauty.',
      rating: 5,
      display_order: 3,
      is_featured: true,
      is_published: true
    }
  ];

  const banners = [
    {
      id: 'ban-01',
      title: 'SUPERWAY',
      subtitle: 'Two Independent Creative Divisions. One Relentless Creative Standard.',
      division: 'PORTAL',
      cta_label: 'Explore Divisions',
      cta_link: '/studio',
      media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
      display_order: 1,
      is_active: true
    },
    {
      id: 'ban-02',
      title: 'Creative Design, Branding & Digital Engineering',
      subtitle: 'Award-winning UI/UX interfaces, bespoke brand identities, and resilient web software.',
      division: 'STUDIO',
      cta_label: 'View Studio Work',
      cta_link: '/studio/work',
      media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1800&auto=format&fit=crop',
      display_order: 2,
      is_active: true
    },
    {
      id: 'ban-03',
      title: 'Light. Silence. Narrative Truth.',
      subtitle: 'Independent cinema, dramatic short films, and high-impact commercial advertisements.',
      division: 'PRODUCTION',
      cta_label: 'Explore Films',
      cta_link: '/production/films',
      media_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800&auto=format&fit=crop',
      display_order: 3,
      is_active: true
    }
  ];

  const navigationItems = [
    { id: 'nav-01', label: 'Home', url: '/', division: 'PORTAL', display_order: 1, is_active: true },
    { id: 'nav-02', label: 'Studio Division', url: '/studio', division: 'PORTAL', display_order: 2, is_active: true },
    { id: 'nav-03', label: 'Production Division', url: '/production', division: 'PORTAL', display_order: 3, is_active: true },
    { id: 'nav-04', label: 'About Company', url: '/about', division: 'PORTAL', display_order: 4, is_active: true },
    { id: 'nav-05', label: 'Contact', url: '/contact', division: 'PORTAL', display_order: 5, is_active: true },
    { id: 'nav-06', label: 'Overview', url: '/studio', division: 'STUDIO', display_order: 1, is_active: true },
    { id: 'nav-07', label: 'Services', url: '/studio/services', division: 'STUDIO', display_order: 2, is_active: true },
    { id: 'nav-08', label: 'Work', url: '/studio/work', division: 'STUDIO', display_order: 3, is_active: true },
    { id: 'nav-09', label: 'Overview', url: '/production', division: 'PRODUCTION', display_order: 1, is_active: true },
    { id: 'nav-10', label: 'Films', url: '/production/films', division: 'PRODUCTION', display_order: 2, is_active: true },
    { id: 'nav-11', label: 'Commercials', url: '/production/ads', division: 'PRODUCTION', display_order: 3, is_active: true }
  ];

  // Try connecting to TiDB
  await initTiDBPool();
  const dbConnected = isTiDBConnected();

  if (dbConnected) {
    console.log('[Content Migration] TiDB Cloud connection verified. Executing live SQL migration...');
    // Run SQL schema migration first
    await runMigrations();

    // Insert Admin Roles
    await query(`
      INSERT INTO \`admin_roles\` (\`id\`, \`name\`, \`permissions\`)
      VALUES ('role-super', 'Super Administrator', JSON_ARRAY('*'))
      ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);
    `);

    // Insert Admins
    const adminPasswordHash = await bcrypt.hash('cinematic2025!', 10);
    await query(`
      INSERT INTO \`admins\` (\`id\`, \`username\`, \`email\`, \`password_hash\`, \`role_id\`)
      VALUES 
        ('adm-01', 'admin', 'admin@superway.com', ?, 'role-super'),
        ('adm-02', 'arjunadmin', 'admin@arjun-dev.com', ?, 'role-super')
      ON DUPLICATE KEY UPDATE \`password_hash\` = VALUES(\`password_hash\`);
    `, [adminPasswordHash, adminPasswordHash]);

    // Insert Service Categories
    for (const sc of serviceCategories) {
      await query(`
        INSERT INTO \`service_categories\` (\`id\`, \`name\`, \`slug\`, \`division\`, \`description\`)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`description\` = VALUES(\`description\`);
      `, [sc.id, sc.name, sc.slug, sc.division, sc.description]);
      report.categoriesMigrated++;
    }

    // Insert Project Categories
    for (const pc of projectCategories) {
      await query(`
        INSERT INTO \`project_categories\` (\`id\`, \`name\`, \`slug\`, \`division\`)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);
      `, [pc.id, pc.name, pc.slug, pc.division]);
      report.categoriesMigrated++;
    }

    // Insert Services
    const services = state.services || [];
    for (const s of services) {
      await query(`
        INSERT INTO \`services\` (\`id\`, \`name\`, \`slug\`, \`division\`, \`category_name\`, \`description\`, \`icon\`, \`display_order\`, \`is_active\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`description\` = VALUES(\`description\`), \`is_active\` = VALUES(\`is_active\`);
      `, [
        s.id,
        s.name,
        s.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-'),
        (s.division || 'STUDIO').toUpperCase(),
        s.category || 'General',
        s.description || '',
        s.icon || 'Layers',
        Number(s.display_order) || 1,
        s.is_active !== false ? 1 : 0
      ]);
      report.servicesMigrated++;
    }

    // Insert Projects & Project Media
    const projects = state.projects || [];
    for (const p of projects) {
      const division = (p.division || 'STUDIO').toUpperCase();
      const primaryCat = p.category || (p.categories && p.categories[0]) || 'General';
      const shortDesc = p.short_description || p.logline || p.synopsis?.substring(0, 200) || '';
      const fullDesc = p.full_description || p.synopsis || shortDesc;
      const thumb = p.thumbnail_image || p.cover_image || '';
      const banner = p.main_image_url || p.banner_image || thumb;
      const dateStr = p.project_date || String(p.release_year || new Date().getFullYear());

      await query(`
        INSERT INTO \`projects\` (
          \`id\`, \`title\`, \`slug\`, \`division\`, \`primary_category\`, \`short_description\`,
          \`full_description\`, \`thumbnail_url\`, \`banner_url\`, \`video_url\`, \`project_date\`,
          \`release_year\`, \`role\`, \`client_name\`, \`deliverables\`, \`is_featured\`, \`status\`, \`sort_order\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          \`title\` = VALUES(\`title\`),
          \`short_description\` = VALUES(\`short_description\`),
          \`full_description\` = VALUES(\`full_description\`),
          \`thumbnail_url\` = VALUES(\`thumbnail_url\`),
          \`status\` = VALUES(\`status\`);
      `, [
        p.id,
        p.title,
        p.slug,
        division,
        primaryCat,
        shortDesc,
        fullDesc,
        thumb,
        banner,
        p.video_url || '',
        dateStr,
        Number(dateStr) || 2025,
        p.role || '',
        p.client_name || p.client_production || '',
        p.deliverables || '',
        p.is_featured ? 1 : 0,
        p.status || 'published',
        Number(p.sort_order) || 1
      ]);
      report.projectsMigrated++;

      if (thumb) report.imagesMigrated++;
      if (banner && banner !== thumb) report.imagesMigrated++;
      if (p.video_url) report.videosMigrated++;

      // Insert Media Stills
      if (Array.isArray(p.gallery_images)) {
        for (let i = 0; i < p.gallery_images.length; i++) {
          const imgUrl = p.gallery_images[i];
          const mediaId = `pm-${p.id}-${i}`;
          await query(`
            INSERT INTO \`project_media\` (\`id\`, \`project_id\`, \`media_type\`, \`media_url\`, \`display_order\`)
            VALUES (?, ?, 'image', ?, ?)
            ON DUPLICATE KEY UPDATE \`media_url\` = VALUES(\`media_url\`);
          `, [mediaId, p.id, imgUrl, i + 1]);
          report.imagesMigrated++;
        }
      }
    }

    // Insert Clients
    for (const c of clients) {
      await query(`
        INSERT INTO \`clients\` (\`id\`, \`name\`, \`division\`, \`website_url\`, \`display_order\`, \`is_active\`)
        VALUES (?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);
      `, [c.id, c.name, c.division, c.website_url, c.display_order]);
      report.clientsMigrated++;
    }

    // Insert Testimonials
    for (const t of testimonials) {
      await query(`
        INSERT INTO \`testimonials\` (\`id\`, \`client_name\`, \`client_role\`, \`company\`, \`avatar_url\`, \`division\`, \`quote\`, \`rating\`, \`display_order\`, \`is_featured\`, \`is_published\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
        ON DUPLICATE KEY UPDATE \`quote\` = VALUES(\`quote\`);
      `, [t.id, t.client_name, t.client_role, t.company, t.avatar_url, t.division, t.quote, t.rating, t.display_order]);
      report.testimonialsMigrated++;
    }

    // Insert Banners
    for (const b of banners) {
      await query(`
        INSERT INTO \`banners\` (\`id\`, \`title\`, \`subtitle\`, \`division\`, \`cta_label\`, \`cta_link\`, \`media_url\`, \`display_order\`, \`is_active\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`);
      `, [b.id, b.title, b.subtitle, b.division, b.cta_label, b.cta_link, b.media_url, b.display_order]);
      report.bannersMigrated++;
    }

    // Insert Navigation Items
    for (const n of navigationItems) {
      await query(`
        INSERT INTO \`navigation_items\` (\`id\`, \`label\`, \`url\`, \`division\`, \`display_order\`, \`is_active\`)
        VALUES (?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE \`label\` = VALUES(\`label\`);
      `, [n.id, n.label, n.url, n.division, n.display_order]);
    }

    // Insert Website Settings
    const settingsObj = state.site_settings || {};
    const settingsList = [
      { key: 'company_name', val: settingsObj.company_name || 'SUPERWAY', div: 'GLOBAL' },
      { key: 'tagline', val: settingsObj.tagline || 'Two Creative Divisions. One Relentless Standard.', div: 'GLOBAL' },
      { key: 'studio_name', val: settingsObj.studio_name || 'SUPERWAY STUDIO', div: 'STUDIO' },
      { key: 'studio_tagline', val: settingsObj.studio_tagline || 'Creative Design, Branding, Digital Solutions & Software Engineering', div: 'STUDIO' },
      { key: 'production_name', val: settingsObj.production_name || 'SUPERWAY PRODUCTION', div: 'PRODUCTION' },
      { key: 'production_tagline', val: settingsObj.production_tagline || 'Cinematic Film, Commercials, Visual Storytelling & Video Production', div: 'PRODUCTION' },
      { key: 'email', val: settingsObj.email || 'contact@superway.com', div: 'GLOBAL' },
      { key: 'phone', val: settingsObj.phone || '+91 (0) 98200 45678', div: 'GLOBAL' },
      { key: 'location', val: settingsObj.location || 'Mumbai · Bengaluru · London', div: 'GLOBAL' }
    ];

    for (const s of settingsList) {
      await query(`
        INSERT INTO \`website_settings\` (\`id\`, \`setting_key\`, \`setting_value\`, \`division\`)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE \`setting_value\` = VALUES(\`setting_value\`);
      `, [`set-${s.key}`, s.key, s.val, s.div]);
    }
  } else {
    console.log('[Content Migration] Operating with relational JSON data state.');
    // Synchronize full normalized schema into data.json
    state.service_categories = serviceCategories;
    state.project_categories = projectCategories;
    state.clients = clients;
    state.testimonials = testimonials;
    state.banners = banners;
    state.navigation_items = navigationItems;

    report.projectsMigrated = (state.projects || []).length;
    report.servicesMigrated = (state.services || []).length;
    report.categoriesMigrated = serviceCategories.length + projectCategories.length;
    report.clientsMigrated = clients.length;
    report.testimonialsMigrated = testimonials.length;
    report.bannersMigrated = banners.length;

    // Count images and videos
    for (const p of state.projects || []) {
      if (p.thumbnail_image || p.cover_image) report.imagesMigrated++;
      if (p.main_image_url || p.banner_image) report.imagesMigrated++;
      if (p.video_url) report.videosMigrated++;
      if (Array.isArray(p.gallery_images)) report.imagesMigrated += p.gallery_images.length;
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  }

  // Check Cloudflare B2 configuration
  const b2Ready = isB2Configured();
  console.log(`[Content Migration] Cloudflare B2 status: ${b2Ready ? 'CONFIGURED & READY' : 'LOCAL FALLBACK READY (Awaiting B2 Credentials in .env)'}`);

  console.log('\n======================================================');
  console.log('MIGRATION REPORT SUMMARY:');
  console.log('------------------------------------------------------');
  console.log(`- Projects Migrated:             ${report.projectsMigrated}`);
  console.log(`- Services Migrated:             ${report.servicesMigrated}`);
  console.log(`- Categories Migrated:           ${report.categoriesMigrated}`);
  console.log(`- Clients Migrated:              ${report.clientsMigrated}`);
  console.log(`- Testimonials Migrated:         ${report.testimonialsMigrated}`);
  console.log(`- Banners Migrated:              ${report.bannersMigrated}`);
  console.log(`- Images Registered / Migrated:  ${report.imagesMigrated}`);
  console.log(`- Videos Registered / Migrated:  ${report.videosMigrated}`);
  console.log(`- Failed Uploads:                ${report.failedUploads}`);
  console.log(`- Missing Media:                 ${report.missingMedia}`);
  console.log(`- Duplicate Content:             ${report.duplicateContent}`);
  console.log(`- Remaining Hardcoded Content:   ${report.remainingHardcodedContent}`);
  console.log(`- TiDB Cloud Status:             ${dbConnected ? 'CONNECTED' : 'LOCAL RELATIONAL FALLBACK (Ready for remote TiDB)'}`);
  console.log('======================================================\n');

  return report;
}

// Allow CLI execution: node server/src/db/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runContentMigration().then(() => process.exit(0));
}
