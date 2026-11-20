-- Shared Relational Database Schema for Studio + Production
-- Compatible with MySQL 8.0+ and TiDB Serverless

CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(36) PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL DEFAULT 'SUPERWAY',
  `tagline` VARCHAR(255) NOT NULL,
  `studio_name` VARCHAR(150) NOT NULL DEFAULT 'SUPERWAY STUDIO',
  `studio_tagline` VARCHAR(255) NOT NULL,
  `production_name` VARCHAR(150) NOT NULL DEFAULT 'SUPERWAY PRODUCTION',
  `production_tagline` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50),
  `location` VARCHAR(100) NOT NULL,
  `about_company` TEXT NOT NULL,
  `social` JSON,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(50) DEFAULT 'Layers',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `division` VARCHAR(20) NOT NULL DEFAULT 'STUDIO', -- 'STUDIO' | 'PRODUCTION'
  `category` VARCHAR(100) NOT NULL,
  `categories` JSON,
  `short_description` TEXT NOT NULL,
  `full_description` TEXT NOT NULL,
  `thumbnail_image` VARCHAR(500) NOT NULL,
  `main_image_url` VARCHAR(500),
  `video_url` VARCHAR(500),
  `gallery_images` JSON,
  `project_date` VARCHAR(50),
  `release_year` INT,
  `role` VARCHAR(150),
  `credits` VARCHAR(255),
  `client_production` VARCHAR(150),
  `client_name` VARCHAR(150),
  `deliverables` VARCHAR(255),
  `live_url` VARCHAR(500),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `status` VARCHAR(20) DEFAULT 'published', -- 'published' | 'draft'
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `gallery` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `caption` TEXT,
  `category` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `photographer` VARCHAR(100),
  `display_order` INT DEFAULT 0,
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` VARCHAR(50),
  `mime_type` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50),
  `division` VARCHAR(20) NOT NULL DEFAULT 'GENERAL', -- 'STUDIO' | 'PRODUCTION' | 'GENERAL'
  `service_interest` VARCHAR(150),
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
