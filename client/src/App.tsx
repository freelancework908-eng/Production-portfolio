import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DivisionSwitcher } from './components/common/DivisionSwitcher';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { MainHomePage } from './pages/public/MainHomePage';
import { StudioHomePage } from './pages/public/StudioHomePage';
import { StudioServicesPage } from './pages/public/StudioServicesPage';
import { StudioWorkPage } from './pages/public/StudioWorkPage';
import { StudioProjectDetailPage } from './pages/public/StudioProjectDetailPage';

import { ProductionHomePage } from './pages/public/ProductionHomePage';
import { ProductionFilmsPage } from './pages/public/ProductionFilmsPage';
import { ProductionAdsPage } from './pages/public/ProductionAdsPage';
import { ProductionProjectDetailPage } from './pages/public/ProductionProjectDetailPage';

import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminClientsPage } from './pages/admin/AdminClientsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';

// Public Shell Layout
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#07090C] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DivisionSwitcher />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Shell Routes */}
        <Route element={<PublicLayout />}>
          {/* Main Division Selection Homepage */}
          <Route path="/" element={<MainHomePage />} />

          {/* STUDIO DIVISION ROUTES */}
          <Route path="/studio" element={<StudioHomePage />} />
          <Route path="/studio/services" element={<StudioServicesPage />} />
          <Route path="/studio/work" element={<StudioWorkPage />} />
          <Route path="/studio/work/:slug" element={<StudioProjectDetailPage />} />

          {/* PRODUCTION DIVISION ROUTES */}
          <Route path="/production" element={<ProductionHomePage />} />
          <Route path="/production/films" element={<ProductionFilmsPage />} />
          <Route path="/production/ads" element={<ProductionAdsPage />} />
          <Route path="/production/work/:slug" element={<ProductionProjectDetailPage />} />

          {/* SHARED COMPANY ROUTES */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legacy route redirects/fallbacks */}
          <Route path="/portfolio" element={<StudioWorkPage />} />
          <Route path="/projects/:slug" element={<ProductionProjectDetailPage />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* CENTRALIZED ADMIN DASHBOARD & MANAGEMENT */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />

          {/* Studio Management */}
          <Route path="studio/services" element={<AdminServicesPage />} />
          <Route
            path="studio/projects"
            element={
              <AdminProjectsPage
                initialDivision="STUDIO"
                titleOverride="Studio Projects Catalog"
              />
            }
          />
          <Route path="studio/categories" element={<AdminCategoriesPage />} />

          {/* Production Management */}
          <Route
            path="production/projects"
            element={
              <AdminProjectsPage
                initialDivision="PRODUCTION"
                titleOverride="Production Projects Catalog"
              />
            }
          />
          <Route
            path="production/films"
            element={
              <AdminProjectsPage
                initialDivision="PRODUCTION"
                initialCategory="Film Production"
                titleOverride="Feature & Short Films Catalog"
              />
            }
          />
          <Route
            path="production/ads"
            element={
              <AdminProjectsPage
                initialDivision="PRODUCTION"
                initialCategory="Commercial Production"
                titleOverride="Commercial Advertisements Catalog"
              />
            }
          />

          {/* Unified Project & Inquiries Management */}
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="media" element={<AdminMediaPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
