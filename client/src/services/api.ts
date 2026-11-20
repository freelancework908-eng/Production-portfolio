import {
  AdminUser,
  SiteSettings,
  Service,
  Project,
  Enquiry,
  DashboardStats,
  GalleryItem,
  MediaAsset,
  Client,
  Testimonial,
  Banner,
  NavigationItem,
  Award,
  Profession,
  Profile,
  HomepageConfig,
  SEOSettings
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('arjun_dev_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication failed');
    }
    return res.json();
  },

  async verifySession(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update password');
    }
    return res.json();
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Services (STUDIO / PRODUCTION)
  async getServices(params?: { division?: string; category?: string; all?: boolean }): Promise<Service[]> {
    const query = new URLSearchParams();
    if (params?.division) query.set('division', params.division);
    if (params?.category) query.set('category', params.category);
    if (params?.all) query.set('all', 'true');
    const res = await fetch(`${API_BASE}/services?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  },

  async getServiceCategories(division?: string): Promise<string[] | { studio: string[]; production: string[] }> {
    const query = division ? `?division=${division}` : '';
    const res = await fetch(`${API_BASE}/services/categories${query}`);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  async getServiceById(id: string): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${id}`);
    if (!res.ok) throw new Error('Service not found');
    return res.json();
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create service');
    }
    return res.json();
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update service');
    }
    return res.json();
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // Projects (STUDIO / PRODUCTION)
  async getProjects(params?: { division?: string; category?: string; featured?: boolean; status?: string }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.division) query.set('division', params.division);
    if (params?.category) query.set('category', params.category);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.status) query.set('status', params.status);
    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  },

  async getAllProjectsAdmin(params?: { division?: string; category?: string }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.division) query.set('division', params.division);
    if (params?.category) query.set('category', params.category);
    const res = await fetch(`${API_BASE}/projects/all?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin projects');
    return res.json();
  },

  async getProject(idOrSlug: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  // Alias for backwards compatibility
  async getProjectById(idOrSlug: string): Promise<Project> {
    return this.getProject(idOrSlug);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create project');
    }
    return res.json();
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update project');
    }
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // Contact Inquiries
  async submitEnquiry(data: {
    name: string;
    email: string;
    phone?: string;
    division?: 'STUDIO' | 'PRODUCTION' | 'GENERAL';
    service_interest?: string;
    message: string;
  }): Promise<{ message: string; enquiry: any }> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit enquiry');
    }
    return res.json();
  },

  async getEnquiries(params?: { division?: string }): Promise<Enquiry[]> {
    const query = params?.division ? `?division=${params.division}` : '';
    const res = await fetch(`${API_BASE}/enquiries${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load enquiries');
    return res.json();
  },

  async markEnquiryRead(id: string, isRead: boolean): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_read: isRead })
    });
    if (!res.ok) throw new Error('Failed to update enquiry status');
    return res.json();
  },

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
  },

  // Media Library
  async uploadMedia(file: File, title?: string): Promise<MediaAsset> {
    return this.uploadMediaFile(file, title);
  },

  async uploadMediaFile(formDataOrFile: FormData | File, title?: string): Promise<MediaAsset> {
    const token = localStorage.getItem('arjun_dev_token');
    let body: FormData;
    if (formDataOrFile instanceof FormData) {
      body = formDataOrFile;
    } else {
      body = new FormData();
      body.append('file', formDataOrFile);
      if (title) body.append('title', title);
    }

    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers,
      body
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload media file');
    }
    return res.json();
  },

  async createMedia(data: Partial<MediaAsset>): Promise<MediaAsset> {
    const res = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create media entry');
    return res.json();
  },

  async getMedia(type?: string): Promise<MediaAsset[]> {
    const res = await fetch(`${API_BASE}/media${type ? `?type=${type}` : ''}`);
    if (!res.ok) throw new Error('Failed to load media');
    return res.json();
  },

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete media');
  },

  // Gallery
  async getGallery(params?: string | { category?: string; all?: boolean }): Promise<GalleryItem[]> {
    let query = '';
    if (typeof params === 'string') {
      query = `?category=${encodeURIComponent(params)}`;
    } else if (params) {
      const q = new URLSearchParams();
      if (params.category) q.set('category', params.category);
      if (params.all) q.set('all', 'true');
      query = `?${q.toString()}`;
    }
    const res = await fetch(`${API_BASE}/gallery${query}`);
    if (!res.ok) throw new Error('Failed to load gallery');
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create gallery item');
    return res.json();
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update gallery item');
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  // Dashboard Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  // Clients
  async getClients(division?: string): Promise<Client[]> {
    const query = division ? `?division=${division}` : '';
    const res = await fetch(`${API_BASE}/clients${query}`);
    if (!res.ok) throw new Error('Failed to load clients');
    return res.json();
  },

  async createClient(data: Partial<Client>): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update client');
    return res.json();
  },

  async deleteClient(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete client');
  },

  // Testimonials
  async getTestimonials(params?: { division?: string; all?: boolean }): Promise<Testimonial[]> {
    const query = new URLSearchParams();
    if (params?.division) query.set('division', params.division);
    if (params?.all) query.set('all', 'true');
    const res = await fetch(`${API_BASE}/testimonials?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load testimonials');
    return res.json();
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return res.json();
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
    return res.json();
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },

  // Banners
  async getBanners(division?: string): Promise<Banner[]> {
    const query = division ? `?division=${division}` : '';
    const res = await fetch(`${API_BASE}/banners${query}`);
    if (!res.ok) throw new Error('Failed to load banners');
    return res.json();
  },

  async createBanner(data: Partial<Banner>): Promise<Banner> {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create banner');
    return res.json();
  },

  async updateBanner(id: string, data: Partial<Banner>): Promise<Banner> {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update banner');
    return res.json();
  },

  async deleteBanner(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete banner');
  },

  // Navigation Items
  async getNavigationItems(division?: string): Promise<NavigationItem[]> {
    const query = division ? `?division=${division}` : '';
    const res = await fetch(`${API_BASE}/navigation${query}`);
    if (!res.ok) throw new Error('Failed to load navigation items');
    return res.json();
  },

  async createNavigationItem(data: Partial<NavigationItem>): Promise<NavigationItem> {
    const res = await fetch(`${API_BASE}/navigation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create navigation item');
    return res.json();
  },

  async updateNavigationItem(id: string, data: Partial<NavigationItem>): Promise<NavigationItem> {
    const res = await fetch(`${API_BASE}/navigation/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update navigation item');
    return res.json();
  },

  async deleteNavigationItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/navigation/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete navigation item');
  },

  // ==========================================
  // LEGACY BACKWARDS COMPATIBILITY HELPERS
  // ==========================================
  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) return {} as Profile;
    return res.json();
  },
  async updateProfile(data: Partial<Profile>): Promise<{ profile: Profile }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getProfessions(all = false): Promise<Profession[]> {
    const res = await fetch(`${API_BASE}/professions${all ? '?all=true' : ''}`);
    if (!res.ok) return [];
    return res.json();
  },
  async getProfessionById(id: string): Promise<Profession> {
    const res = await fetch(`${API_BASE}/professions/${id}`);
    if (!res.ok) throw new Error('Profession not found');
    return res.json();
  },
  async createProfession(data: Partial<Profession>): Promise<Profession> {
    const res = await fetch(`${API_BASE}/professions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create profession');
    return res.json();
  },
  async updateProfession(id: string, data: Partial<Profession>): Promise<Profession> {
    const res = await fetch(`${API_BASE}/professions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profession');
    return res.json();
  },
  async deleteProfession(id: string): Promise<void> {
    await fetch(`${API_BASE}/professions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getAwards(): Promise<Award[]> {
    const res = await fetch(`${API_BASE}/awards`);
    if (!res.ok) return [];
    return res.json();
  },
  async createAward(data: Partial<Award>): Promise<Award> {
    const res = await fetch(`${API_BASE}/awards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create award');
    return res.json();
  },
  async updateAward(id: string, data: Partial<Award>): Promise<Award> {
    const res = await fetch(`${API_BASE}/awards/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update award');
    return res.json();
  },
  async deleteAward(id: string): Promise<void> {
    await fetch(`${API_BASE}/awards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getHomepage(): Promise<HomepageConfig> {
    const res = await fetch(`${API_BASE}/homepage`);
    if (!res.ok) return {} as HomepageConfig;
    return res.json();
  },
  async updateHomepage(data: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const res = await fetch(`${API_BASE}/homepage`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update homepage');
    return res.json();
  },

  async getSEO(): Promise<SEOSettings> {
    const res = await fetch(`${API_BASE}/seo`);
    if (!res.ok) return {} as SEOSettings;
    return res.json();
  },
  async updateSEO(data: Partial<SEOSettings>): Promise<SEOSettings> {
    const res = await fetch(`${API_BASE}/seo`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update SEO');
    return res.json();
  }
};
