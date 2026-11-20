-- 001_initial_schema.sql
-- TiDB Cloud & MySQL 8.0+ Compatible Complete Relational Schema
-- Supports Studio & Production Divisions with Full Persistence

-- 1. Admin Roles
CREATE TABLE IF NOT EXISTS `admin_roles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `permissions` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Administrators
CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(36) PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`)
);

-- 3. Service Categories
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `description` TEXT,
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sc_division` (`division`)
);

-- 4. Services
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `category_id` VARCHAR(36),
  `category_name` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(50) DEFAULT 'Layers',
  `image_url` VARCHAR(500),
  `b2_key` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_division` (`division`),
  INDEX `idx_services_active` (`is_active`)
);

-- 5. Project Categories
CREATE TABLE IF NOT EXISTS `project_categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `description` TEXT,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pc_division` (`division`)
);

-- 6. Projects (Dual-Division: Studio & Production)
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `primary_category` VARCHAR(100) NOT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` TEXT NOT NULL,
  `thumbnail_url` VARCHAR(500) NOT NULL,
  `thumbnail_b2_key` VARCHAR(255),
  `banner_url` VARCHAR(500),
  `banner_b2_key` VARCHAR(255),
  `video_url` VARCHAR(500),
  `external_link` VARCHAR(500),
  `project_date` VARCHAR(50),
  `release_year` INT,
  `role` VARCHAR(150),
  `client_name` VARCHAR(150),
  `deliverables` VARCHAR(255),
  `credits` TEXT,
  `tags` JSON,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `status` VARCHAR(20) DEFAULT 'published', -- 'published' | 'draft'
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_proj_division` (`division`),
  INDEX `idx_proj_status` (`status`),
  INDEX `idx_proj_featured` (`is_featured`)
);

-- 7. Project Media (Multiple images & videos per project)
CREATE TABLE IF NOT EXISTS `project_media` (
  `id` VARCHAR(36) PRIMARY KEY,
  `project_id` VARCHAR(36) NOT NULL,
  `media_type` VARCHAR(20) NOT NULL DEFAULT 'image', -- 'image' | 'video'
  `media_url` VARCHAR(500) NOT NULL,
  `b2_key` VARCHAR(255),
  `thumbnail_url` VARCHAR(500),
  `caption` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  `is_cover` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pm_project` (`project_id`)
);

-- 8. Clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `division` VARCHAR(20) DEFAULT 'BOTH', -- 'STUDIO' | 'PRODUCTION' | 'BOTH'
  `logo_url` VARCHAR(500),
  `b2_key` VARCHAR(255),
  `website_url` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_clients_division` (`division`)
);

-- 9. Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(36) PRIMARY KEY,
  `client_name` VARCHAR(150) NOT NULL,
  `client_role` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150) NOT NULL,
  `avatar_url` VARCHAR(500),
  `b2_key` VARCHAR(255),
  `division` VARCHAR(20) DEFAULT 'BOTH', -- 'STUDIO' | 'PRODUCTION' | 'BOTH'
  `quote` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `display_order` INT DEFAULT 0,
  `is_featured` BOOLEAN DEFAULT TRUE,
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_test_division` (`division`),
  INDEX `idx_test_published` (`is_published`)
);

-- 10. Banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` TEXT,
  `division` VARCHAR(20) DEFAULT 'PORTAL', -- 'STUDIO' | 'PRODUCTION' | 'PORTAL'
  `cta_label` VARCHAR(100),
  `cta_link` VARCHAR(500),
  `media_url` VARCHAR(500),
  `b2_key` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_banners_division` (`division`)
);

-- 11. Media Library (Centralized B2 asset registry)
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `object_key` VARCHAR(255) NOT NULL UNIQUE,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT 'image', -- 'image' | 'video' | 'document' | 'audio'
  `file_size` VARCHAR(50),
  `mime_type` VARCHAR(100),
  `division` VARCHAR(20) DEFAULT 'GENERAL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ml_object_key` (`object_key`),
  INDEX `idx_ml_file_type` (`file_type`)
);

-- 12. Website Settings
CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `division` VARCHAR(20) DEFAULT 'GLOBAL', -- 'GLOBAL' | 'STUDIO' | 'PRODUCTION'
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ws_key` (`setting_key`)
);

-- 13. Social Links
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` VARCHAR(36) PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `icon` VARCHAR(50),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Contact Messages / Enquiries
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50),
  `division` VARCHAR(20) DEFAULT 'GENERAL', -- 'STUDIO' | 'PRODUCTION' | 'GENERAL'
  `service_interest` VARCHAR(150),
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cm_division` (`division`),
  INDEX `idx_cm_read` (`is_read`)
);

-- 15. Navigation Items
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `division` VARCHAR(20) NOT NULL, -- 'PORTAL' | 'STUDIO' | 'PRODUCTION'
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_nav_division` (`division`)
);

-- Migrations tracking table
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `migration_name` VARCHAR(255) NOT NULL UNIQUE,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
