import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSeedData } from './seedData.js';
import { initTiDBPool, verifyTiDBConnection, isTiDBConnected } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

let dbState = null;

// Initialize Database (File-backed relational store + TiDB Cloud sync)
export async function initDatabase() {
  const seed = await getSeedData();

  // Test TiDB connectivity if credentials configured
  try {
    const tidbStatus = await verifyTiDBConnection();
    if (tidbStatus.connected) {
      console.log(`[TiDB Cloud] Verified live connection (SELECT 1 OK) to database "${tidbStatus.database}" on ${tidbStatus.host}:${tidbStatus.port}.`);
    } else if (tidbStatus.reason === 'NO_REMOTE_CONFIG') {
      console.log('[Database] Operating with local relational store (TiDB credentials not set in .env).');
    } else {
      console.warn(`[Database Diagnostic] TiDB connection failed (${tidbStatus.reason}: ${tidbStatus.message}). Operating with local store fallback.`);
    }
  } catch (err) {
    console.warn('[Database Diagnostic] TiDB check encountered an error:', err.message);
  }

  let dirty = false;

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      dbState = JSON.parse(raw);

      // Ensure all required collections exist for the dual-division system
      if (!Array.isArray(dbState.services) || dbState.services.length === 0) {
        dbState.services = seed.services;
        dirty = true;
      }
      if (!dbState.site_settings) {
        dbState.site_settings = seed.site_settings;
        dirty = true;
      }
      if (!dbState.categories) {
        dbState.categories = seed.categories;
        dirty = true;
      }
      if (!Array.isArray(dbState.enquiries)) {
        dbState.enquiries = seed.enquiries || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.clients) || dbState.clients.length === 0) {
        dbState.clients = seed.clients || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.testimonials) || dbState.testimonials.length === 0) {
        dbState.testimonials = seed.testimonials || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.banners) || dbState.banners.length === 0) {
        dbState.banners = seed.banners || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.navigation_items) || dbState.navigation_items.length === 0) {
        dbState.navigation_items = seed.navigation || seed.navigation_items || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.gallery) || dbState.gallery.length === 0) {
        dbState.gallery = seed.gallery || [];
        dirty = true;
      }
      if (!Array.isArray(dbState.admins) || dbState.admins.length === 0) {
        dbState.admins = seed.admins;
        dirty = true;
      } else {
        const hasSuperway = dbState.admins.some(a => a.email.toLowerCase() === 'admin@superway.com');
        if (!hasSuperway) {
          const superwayAdmin = seed.admins.find(a => a.email.toLowerCase() === 'admin@superway.com');
          if (superwayAdmin) {
            dbState.admins.unshift(superwayAdmin);
            dirty = true;
          }
        }
      }

      // Ensure projects have division field and at least Studio and Production projects exist
      dbState.projects = (dbState.projects || []).map(p => {
        if (!p.division) {
          p.division = 'PRODUCTION';
          dirty = true;
        }
        if (!p.short_description && p.logline) {
          p.short_description = p.logline;
          dirty = true;
        }
        if (!p.full_description && p.synopsis) {
          p.full_description = p.synopsis;
          dirty = true;
        }
        if (!p.thumbnail_image && p.cover_image) {
          p.thumbnail_image = p.cover_image;
          dirty = true;
        }
        if (!p.main_image_url && (p.banner_image || p.cover_image)) {
          p.main_image_url = p.banner_image || p.cover_image;
          dirty = true;
        }
        if (!p.project_date && p.release_year) {
          p.project_date = String(p.release_year);
          dirty = true;
        }
        return p;
      });

      // Check if there are any STUDIO projects; if not, merge the seed Studio projects
      const hasStudio = dbState.projects.some(p => p.division === 'STUDIO');
      if (!hasStudio) {
        const seedStudio = seed.projects.filter(p => p.division === 'STUDIO');
        dbState.projects = [...dbState.projects, ...seedStudio];
        dirty = true;
      }

      // Check if there are any commercial/ad production projects in PRODUCTION; if not, merge seed production
      const hasAd = dbState.projects.some(p => p.division === 'PRODUCTION' && p.category === 'Commercial Production');
      if (!hasAd) {
        const seedPrd = seed.projects.filter(p => p.division === 'PRODUCTION' && p.category === 'Commercial Production');
        dbState.projects = [...dbState.projects, ...seedPrd];
        dirty = true;
      }

      if (dirty) {
        saveState();
      }
    } catch (err) {
      console.warn('Error reading data.json, re-seeding...', err);
      dbState = seed;
      saveState();
    }
  } else {
    console.log('Seeding initial company portfolio database (Studio + Production)...');
    dbState = seed;
    saveState();
  }
  return dbState;
}

function saveState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data.json', err.message);
  }
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

// Database Operations
export const db = {
  // Admin & Auth
  async getAdminByEmail(email) {
    if (!dbState) await initDatabase();
    return dbState.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  },
  async getAdminById(id) {
    if (!dbState) await initDatabase();
    return dbState.admins.find(a => a.id === id);
  },
  async updateAdminPassword(id, passwordHash) {
    if (!dbState) await initDatabase();
    const admin = dbState.admins.find(a => a.id === id);
    if (!admin) return false;
    admin.password_hash = passwordHash;
    saveState();
    return true;
  },

  // Site Settings
  async getSettings() {
    if (!dbState) await initDatabase();
    return dbState.site_settings || {
      company_name: 'SUPERWAY',
      studio_name: 'SUPERWAY STUDIO',
      production_name: 'SUPERWAY PRODUCTION'
    };
  },
  async updateSettings(updates) {
    if (!dbState) await initDatabase();
    dbState.site_settings = {
      ...dbState.site_settings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveState();
    return dbState.site_settings;
  },

  // Services Management
  async getServices({ division, category, onlyActive = false } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.services || [])];
    if (division) {
      list = list.filter(s => (s.division || 'STUDIO').toUpperCase() === division.toUpperCase());
    }
    if (category && category !== 'All') {
      list = list.filter(s => (s.category || '').toLowerCase() === category.toLowerCase());
    }
    if (onlyActive) {
      list = list.filter(s => s.is_active !== false);
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async getServiceById(id) {
    if (!dbState) await initDatabase();
    return (dbState.services || []).find(s => s.id === id);
  },
  async createService(data) {
    if (!dbState) await initDatabase();
    const newService = {
      id: generateId('srv'),
      name: data.name || 'Creative Service',
      division: (data.division || 'STUDIO').toUpperCase(),
      category: data.category || 'Graphic and Brand Design',
      description: data.description || '',
      icon: data.icon || 'Layers',
      display_order: Number(data.display_order) || ((dbState.services || []).length + 1),
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      created_at: new Date().toISOString()
    };
    if (!dbState.services) dbState.services = [];
    dbState.services.push(newService);
    saveState();
    return newService;
  },
  async updateService(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.services) dbState.services = [];
    const index = dbState.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    dbState.services[index] = {
      ...dbState.services[index],
      ...updates,
      division: (updates.division || dbState.services[index].division || 'STUDIO').toUpperCase()
    };
    saveState();
    return dbState.services[index];
  },
  async deleteService(id) {
    if (!dbState) await initDatabase();
    if (!dbState.services) return false;
    const lenBefore = dbState.services.length;
    dbState.services = dbState.services.filter(s => s.id !== id);
    saveState();
    return dbState.services.length < lenBefore;
  },

  // Categories helper
  async getCategories(division) {
    if (!dbState) await initDatabase();
    if (division) {
      const key = division.toLowerCase();
      return dbState.categories?.[key] || [];
    }
    return dbState.categories || { studio: [], production: [] };
  },

  // Projects (Dual Division: STUDIO & PRODUCTION)
  async getProjects({ division, category, featured, status } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.projects || [])];

    // Filter by division (STUDIO or PRODUCTION)
    if (division) {
      list = list.filter(p => (p.division || 'PRODUCTION').toUpperCase() === division.toUpperCase());
    }

    // Filter by publication status (e.g. 'published' for public viewers)
    if (status) {
      list = list.filter(p => (p.status || 'published') === status);
    }

    // Filter by featured flag
    if (featured !== undefined) {
      const isFeat = featured === true || featured === 'true';
      list = list.filter(p => Boolean(p.is_featured) === isFeat);
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'All Projects' && category !== 'All Films' && category !== 'All Ads') {
      const catLower = category.toLowerCase();
      list = list.filter(p => {
        const primaryMatch = (p.category || '').toLowerCase() === catLower;
        const arrayMatch = Array.isArray(p.categories) && p.categories.some(c => c.toLowerCase() === catLower);
        return primaryMatch || arrayMatch;
      });
    }

    return list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  },
  async getProjectById(idOrSlug) {
    if (!dbState) await initDatabase();
    return (dbState.projects || []).find(p => p.id === idOrSlug || p.slug === idOrSlug);
  },
  async createProject(data) {
    if (!dbState) await initDatabase();
    const slug = data.slug
      ? data.slug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
      : (data.title || 'project').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');

    const division = (data.division || 'STUDIO').toUpperCase();
    const category = data.category || (division === 'STUDIO' ? 'Web and Software Development' : 'Film Production');
    const categoriesList = Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories
      : [category];

    const thumbnail = data.thumbnail_image || data.cover_image || '';
    const mainImg = data.main_image_url || data.banner_image || thumbnail;
    const shortDesc = data.short_description || data.logline || '';
    const fullDesc = data.full_description || data.synopsis || shortDesc;
    const projDate = data.project_date || String(data.release_year || new Date().getFullYear());

    const newProj = {
      id: generateId('proj'),
      title: data.title,
      slug,
      division,
      category,
      categories: categoriesList,
      short_description: shortDesc,
      full_description: fullDesc,
      thumbnail_image: thumbnail,
      main_image_url: mainImg,
      video_url: data.video_url || '',
      project_date: projDate,
      release_year: Number(projDate) || new Date().getFullYear(),
      role: data.role || '',
      credits: data.credits || '',
      client_production: data.client_production || data.client_name || '',
      client_name: data.client_name || data.client_production || '',
      deliverables: data.deliverables || '',
      live_url: data.live_url || '',
      gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
      is_featured: Boolean(data.is_featured),
      status: data.status || 'published',
      sort_order: Number(data.sort_order) || ((dbState.projects || []).length + 1),
      // Backwards compatibility aliases
      logline: shortDesc,
      synopsis: fullDesc,
      cover_image: thumbnail,
      banner_image: mainImg,
      created_at: new Date().toISOString()
    };

    if (!dbState.projects) dbState.projects = [];
    dbState.projects.push(newProj);
    saveState();
    return newProj;
  },
  async updateProject(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.projects) return null;
    const index = dbState.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = dbState.projects[index];
    const division = updates.division ? updates.division.toUpperCase() : existing.division || 'STUDIO';
    const category = updates.category || existing.category;
    const categoriesList = updates.categories || (category ? [category] : existing.categories);
    const shortDesc = updates.short_description !== undefined ? updates.short_description : (updates.logline !== undefined ? updates.logline : existing.short_description);
    const fullDesc = updates.full_description !== undefined ? updates.full_description : (updates.synopsis !== undefined ? updates.synopsis : existing.full_description);
    const thumbnail = updates.thumbnail_image !== undefined ? updates.thumbnail_image : (updates.cover_image !== undefined ? updates.cover_image : existing.thumbnail_image);
    const mainImg = updates.main_image_url !== undefined ? updates.main_image_url : (updates.banner_image !== undefined ? updates.banner_image : existing.main_image_url);
    const projDate = updates.project_date !== undefined ? updates.project_date : (updates.release_year !== undefined ? String(updates.release_year) : existing.project_date);

    dbState.projects[index] = {
      ...existing,
      ...updates,
      division,
      category,
      categories: categoriesList,
      short_description: shortDesc,
      full_description: fullDesc,
      thumbnail_image: thumbnail,
      main_image_url: mainImg,
      project_date: projDate,
      release_year: Number(projDate) || existing.release_year,
      logline: shortDesc,
      synopsis: fullDesc,
      cover_image: thumbnail,
      banner_image: mainImg,
      is_featured: updates.is_featured !== undefined ? Boolean(updates.is_featured) : existing.is_featured,
      status: updates.status || existing.status || 'published'
    };
    saveState();
    return dbState.projects[index];
  },
  async deleteProject(id) {
    if (!dbState) await initDatabase();
    if (!dbState.projects) return false;
    const lenBefore = dbState.projects.length;
    dbState.projects = dbState.projects.filter(p => p.id !== id);
    saveState();
    return dbState.projects.length < lenBefore;
  },

  // Contact Inquiries (Dual-Division)
  async getEnquiries({ division } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.enquiries || [])];
    if (division && division !== 'ALL') {
      list = list.filter(e => (e.division || 'GENERAL').toUpperCase() === division.toUpperCase());
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  async createEnquiry(data) {
    if (!dbState) await initDatabase();
    const newEnq = {
      id: generateId('enq'),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      division: (data.division || 'GENERAL').toUpperCase(),
      service_interest: data.service_interest || data.project_type || 'General Collaboration',
      project_type: data.service_interest || data.project_type || 'General Collaboration',
      message: data.message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    if (!dbState.enquiries) dbState.enquiries = [];
    dbState.enquiries.push(newEnq);
    saveState();
    return newEnq;
  },
  async markEnquiryRead(id, isRead = true) {
    if (!dbState) await initDatabase();
    if (!dbState.enquiries) return null;
    const enquiry = dbState.enquiries.find(e => e.id === id);
    if (!enquiry) return null;
    enquiry.is_read = isRead;
    saveState();
    return enquiry;
  },
  async deleteEnquiry(id) {
    if (!dbState) await initDatabase();
    if (!dbState.enquiries) return false;
    const lenBefore = dbState.enquiries.length;
    dbState.enquiries = dbState.enquiries.filter(e => e.id !== id);
    saveState();
    return dbState.enquiries.length < lenBefore;
  },

  // Gallery (Behind the scenes / Stills)
  async getGallery({ category, onlyPublished = false } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.gallery || [])];
    if (onlyPublished) {
      list = list.filter(g => g.is_published);
    }
    if (category && category !== 'All') {
      list = list.filter(g => (g.category || '').toLowerCase() === category.toLowerCase());
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async createGalleryItem(data) {
    if (!dbState) await initDatabase();
    const newItem = {
      id: generateId('gal'),
      title: data.title || 'Untitled Still',
      caption: data.caption || '',
      category: data.category || 'Behind the Scenes',
      image_url: data.image_url || '',
      photographer: data.photographer || '',
      display_order: Number(data.display_order) || ((dbState.gallery || []).length + 1),
      is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
      created_at: new Date().toISOString()
    };
    if (!dbState.gallery) dbState.gallery = [];
    dbState.gallery.push(newItem);
    saveState();
    return newItem;
  },
  async updateGalleryItem(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.gallery) return null;
    const index = dbState.gallery.findIndex(g => g.id === id);
    if (index === -1) return null;
    dbState.gallery[index] = { ...dbState.gallery[index], ...updates };
    saveState();
    return dbState.gallery[index];
  },
  async deleteGalleryItem(id) {
    if (!dbState) await initDatabase();
    if (!dbState.gallery) return false;
    const lenBefore = dbState.gallery.length;
    dbState.gallery = dbState.gallery.filter(g => g.id !== id);
    saveState();
    return dbState.gallery.length < lenBefore;
  },

  // Media Library
  async getMedia({ type } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.media || [])];
    if (type && type !== 'all') {
      list = list.filter(m => m.file_type === type);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  async getMediaById(id) {
    if (!dbState) await initDatabase();
    return (dbState.media || []).find(m => m.id === id);
  },
  async createMedia(data) {
    if (!dbState) await initDatabase();
    const newMedia = {
      id: generateId('med'),
      title: data.title || data.file_name,
      file_name: data.file_name,
      object_key: data.object_key || `media/${Date.now()}-${data.file_name}`,
      file_url: data.file_url,
      file_type: data.file_type || 'image',
      file_size: data.file_size || 'Unknown',
      mime_type: data.mime_type || 'application/octet-stream',
      division: data.division || 'GENERAL',
      storage_provider: data.storage_provider || 'CLOUDFLARE_B2',
      created_at: new Date().toISOString()
    };
    if (!dbState.media) dbState.media = [];
    dbState.media.push(newMedia);
    saveState();
    return newMedia;
  },
  async deleteMedia(id) {
    if (!dbState) await initDatabase();
    if (!dbState.media) return false;
    const lenBefore = dbState.media.length;
    dbState.media = dbState.media.filter(m => m.id !== id);
    saveState();
    return dbState.media.length < lenBefore;
  },

  // Clients
  async getClients(division) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.clients || [])];
    if (division && division !== 'ALL') {
      list = list.filter(c => c.division === division || c.division === 'BOTH');
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async createClient(data) {
    if (!dbState) await initDatabase();
    const newClient = {
      id: generateId('cli'),
      name: data.name,
      division: data.division || 'BOTH',
      logo_url: data.logo_url || '',
      b2_key: data.b2_key || '',
      website_url: data.website_url || '',
      display_order: Number(data.display_order) || ((dbState.clients || []).length + 1),
      is_active: data.is_active !== false,
      created_at: new Date().toISOString()
    };
    if (!dbState.clients) dbState.clients = [];
    dbState.clients.push(newClient);
    saveState();
    return newClient;
  },
  async updateClient(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.clients) return null;
    const index = dbState.clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    dbState.clients[index] = { ...dbState.clients[index], ...updates };
    saveState();
    return dbState.clients[index];
  },
  async deleteClient(id) {
    if (!dbState) await initDatabase();
    if (!dbState.clients) return false;
    const lenBefore = dbState.clients.length;
    dbState.clients = dbState.clients.filter(c => c.id !== id);
    saveState();
    return dbState.clients.length < lenBefore;
  },

  // Testimonials
  async getTestimonials({ division, onlyPublished = false } = {}) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.testimonials || [])];
    if (division && division !== 'ALL') {
      list = list.filter(t => t.division === division || t.division === 'BOTH');
    }
    if (onlyPublished) {
      list = list.filter(t => t.is_published !== false);
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async createTestimonial(data) {
    if (!dbState) await initDatabase();
    const newTest = {
      id: generateId('test'),
      client_name: data.client_name,
      client_role: data.client_role || '',
      company: data.company || '',
      avatar_url: data.avatar_url || '',
      b2_key: data.b2_key || '',
      division: data.division || 'BOTH',
      quote: data.quote,
      rating: Number(data.rating) || 5,
      display_order: Number(data.display_order) || ((dbState.testimonials || []).length + 1),
      is_featured: data.is_featured !== undefined ? Boolean(data.is_featured) : true,
      is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
      created_at: new Date().toISOString()
    };
    if (!dbState.testimonials) dbState.testimonials = [];
    dbState.testimonials.push(newTest);
    saveState();
    return newTest;
  },
  async updateTestimonial(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.testimonials) return null;
    const index = dbState.testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    dbState.testimonials[index] = { ...dbState.testimonials[index], ...updates };
    saveState();
    return dbState.testimonials[index];
  },
  async deleteTestimonial(id) {
    if (!dbState) await initDatabase();
    if (!dbState.testimonials) return false;
    const lenBefore = dbState.testimonials.length;
    dbState.testimonials = dbState.testimonials.filter(t => t.id !== id);
    saveState();
    return dbState.testimonials.length < lenBefore;
  },

  // Banners
  async getBanners(division) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.banners || [])];
    if (division && division !== 'ALL') {
      list = list.filter(b => b.division === division || b.division === 'PORTAL');
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async createBanner(data) {
    if (!dbState) await initDatabase();
    const newBanner = {
      id: generateId('ban'),
      title: data.title,
      subtitle: data.subtitle || '',
      division: data.division || 'PORTAL',
      cta_label: data.cta_label || 'Explore',
      cta_link: data.cta_link || '/',
      media_url: data.media_url || '',
      b2_key: data.b2_key || '',
      display_order: Number(data.display_order) || ((dbState.banners || []).length + 1),
      is_active: data.is_active !== false,
      created_at: new Date().toISOString()
    };
    if (!dbState.banners) dbState.banners = [];
    dbState.banners.push(newBanner);
    saveState();
    return newBanner;
  },
  async updateBanner(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.banners) return null;
    const index = dbState.banners.findIndex(b => b.id === id);
    if (index === -1) return null;
    dbState.banners[index] = { ...dbState.banners[index], ...updates };
    saveState();
    return dbState.banners[index];
  },
  async deleteBanner(id) {
    if (!dbState) await initDatabase();
    if (!dbState.banners) return false;
    const lenBefore = dbState.banners.length;
    dbState.banners = dbState.banners.filter(b => b.id !== id);
    saveState();
    return dbState.banners.length < lenBefore;
  },

  // Navigation Items
  async getNavigationItems(division) {
    if (!dbState) await initDatabase();
    let list = [...(dbState.navigation_items || dbState.navigation || [])];
    if (division && division !== 'ALL') {
      list = list.filter(n => n.division === division || n.division === 'PORTAL');
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },
  async createNavigationItem(data) {
    if (!dbState) await initDatabase();
    const newItem = {
      id: generateId('nav'),
      label: data.label,
      url: data.url,
      division: data.division || 'PORTAL',
      display_order: Number(data.display_order) || ((dbState.navigation_items || []).length + 1),
      is_active: data.is_active !== false,
      created_at: new Date().toISOString()
    };
    if (!dbState.navigation_items) dbState.navigation_items = [];
    dbState.navigation_items.push(newItem);
    saveState();
    return newItem;
  },
  async updateNavigationItem(id, updates) {
    if (!dbState) await initDatabase();
    if (!dbState.navigation_items) return null;
    const index = dbState.navigation_items.findIndex(n => n.id === id);
    if (index === -1) return null;
    dbState.navigation_items[index] = { ...dbState.navigation_items[index], ...updates };
    saveState();
    return dbState.navigation_items[index];
  },
  async deleteNavigationItem(id) {
    if (!dbState) await initDatabase();
    if (!dbState.navigation_items) return false;
    const lenBefore = dbState.navigation_items.length;
    dbState.navigation_items = dbState.navigation_items.filter(n => n.id !== id);
    saveState();
    return dbState.navigation_items.length < lenBefore;
  },

  // Dashboard Stats
  async getStats() {
    if (!dbState) await initDatabase();
    const projects = dbState.projects || [];
    const studioProjs = projects.filter(p => (p.division || '').toUpperCase() === 'STUDIO');
    const productionProjs = projects.filter(p => (p.division || 'PRODUCTION').toUpperCase() === 'PRODUCTION');
    const services = dbState.services || [];
    const enquiries = dbState.enquiries || [];

    return {
      totalStudioProjects: studioProjs.length,
      totalProductionProjects: productionProjs.length,
      totalServices: services.length,
      totalInquiries: enquiries.length,
      totalEnquiries: enquiries.length,
      unreadInquiries: enquiries.filter(e => !e.is_read).length,
      unreadEnquiries: enquiries.filter(e => !e.is_read).length,
      totalProjects: projects.length,
      publishedProjects: projects.filter(p => p.status === 'published').length,
      totalClients: (dbState.clients || []).length,
      totalTestimonials: (dbState.testimonials || []).length,
      totalBanners: (dbState.banners || []).length,
      totalGallery: (dbState.gallery || []).length,
      totalMedia: (dbState.media || []).length
    };
  }
};
