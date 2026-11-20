export type Division = 'STUDIO' | 'PRODUCTION';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
}

export interface SiteSettings {
  id?: string;
  company_name: string;
  tagline: string;
  studio_name: string;
  studio_tagline: string;
  production_name: string;
  production_tagline: string;
  email: string;
  phone?: string;
  location?: string;
  about_company?: string;
  social?: {
    instagram?: string;
    youtube?: string;
    vimeo?: string;
    linkedin?: string;
    twitter?: string;
  };
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  division: 'STUDIO' | 'PRODUCTION';
  category: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  division: 'STUDIO' | 'PRODUCTION';
  category: string;
  categories: string[];
  short_description: string;
  full_description: string;
  thumbnail_image: string;
  main_image_url?: string;
  video_url?: string;
  project_date?: string;
  release_year?: number;
  role: string;
  credits?: string;
  client_production?: string;
  client_name?: string;
  deliverables?: string;
  live_url?: string;
  gallery_images?: string[];
  is_featured: boolean;
  status: 'published' | 'draft';
  sort_order: number;
  created_at?: string;

  // Legacy aliases
  logline?: string;
  synopsis?: string;
  cover_image?: string;
  banner_image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  image_url: string;
  photographer?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'video' | 'audio' | 'pdf';
  file_size: string;
  mime_type: string;
  created_at?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  division: 'STUDIO' | 'PRODUCTION' | 'GENERAL';
  service_interest: string;
  project_type?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  division: 'STUDIO' | 'PRODUCTION' | 'BOTH';
  logo_url?: string;
  b2_key?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role?: string;
  company?: string;
  avatar_url?: string;
  b2_key?: string;
  division: 'STUDIO' | 'PRODUCTION' | 'BOTH';
  quote: string;
  rating?: number;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  division: 'STUDIO' | 'PRODUCTION' | 'PORTAL';
  cta_label?: string;
  cta_link?: string;
  media_url?: string;
  b2_key?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  division: 'STUDIO' | 'PRODUCTION' | 'PORTAL';
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface DashboardStats {
  totalStudioProjects: number;
  totalProductionProjects: number;
  totalServices: number;
  totalInquiries: number;
  unreadInquiries: number;
  totalProjects: number;
  publishedProjects: number;
  totalGallery?: number;
  totalMedia?: number;
  totalAwards?: number;
  totalEnquiries?: number;
  unreadEnquiries?: number;
  professionsCount?: number;
}

// ==========================================
// LEGACY COMPATIBILITY INTERFACES
// ==========================================
export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  project_name?: string;
  category?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  created_at?: string;
}

export interface Profession {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  short_bio: string;
  bio: string;
  philosophy: string;
  photo_url: string;
  portrait_url: string;
  email: string;
  phone: string;
  location: string;
  agency?: string;
  instagram?: string;
  imdb?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  vimeo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageConfig {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  showreel_url: string;
  about_snippet: string;
  featured_project_ids: string[];
  updated_at?: string;
}

export interface SEOSettings {
  id: string;
  site_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_handle: string;
  updated_at?: string;
}
