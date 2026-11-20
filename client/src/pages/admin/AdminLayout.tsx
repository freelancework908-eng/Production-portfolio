import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Film,
  Layers,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Tv,
  CheckCircle2,
  FolderOpen,
  Users,
  MessageCircle,
  Image as ImageIcon,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090C] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#0F1218] border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-xs font-bold text-white shadow-md">
            SW
          </span>
          <div>
            <span className="font-cinzel text-sm font-bold text-white block leading-none">
              Superway Central Admin
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#A78BFA]">
              Studio & Production CMS
            </span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B0D12] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Branding */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                SW
              </span>
              <div>
                <h2 className="font-cinzel text-sm uppercase tracking-wider font-bold text-white">
                  Superway
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-[#A78BFA] block">
                  Studio + Production CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Groups */}
          <nav className="p-4 space-y-6">
            {/* 1. Main Dashboard */}
            <div>
              <NavLink
                to="/admin"
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <LayoutDashboard size={16} />
                <span>Dashboard Overview</span>
              </NavLink>
            </div>

            {/* 2. Studio Management */}
            <div className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#A78BFA]">
                <Sparkles size={11} />
                <span>Studio Management</span>
              </div>
              <NavLink
                to="/admin/studio/services"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#172B55] text-white font-semibold border-l-2 border-[#7952D9]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Layers size={15} />
                <span>Services Catalog</span>
              </NavLink>
              <NavLink
                to="/admin/studio/projects"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#172B55] text-white font-semibold border-l-2 border-[#7952D9]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Sparkles size={15} />
                <span>Studio Projects</span>
              </NavLink>
              <NavLink
                to="/admin/studio/categories"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#172B55] text-white font-semibold border-l-2 border-[#7952D9]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <CheckCircle2 size={15} />
                <span>Service Categories</span>
              </NavLink>
            </div>

            {/* 3. Production Management */}
            <div className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#D9B96E]">
                <Film size={11} />
                <span>Production Management</span>
              </div>
              <NavLink
                to="/admin/production/projects"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E1A11] text-white font-semibold border-l-2 border-[#C6A04A]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Film size={15} />
                <span>All Production Projects</span>
              </NavLink>
              <NavLink
                to="/admin/production/films"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E1A11] text-white font-semibold border-l-2 border-[#C6A04A]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Film size={15} />
                <span>Films Catalog</span>
              </NavLink>
              <NavLink
                to="/admin/production/ads"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E1A11] text-white font-semibold border-l-2 border-[#C6A04A]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Tv size={15} />
                <span>Commercial Advertisements</span>
              </NavLink>
            </div>

            {/* 4. Brand & Media Assets */}
            <div className="space-y-1">
              <div className="px-3 py-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">
                <FolderOpen size={11} />
                <span>Media & Brand Assets</span>
              </div>
              <NavLink
                to="/admin/media"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <ImageIcon size={15} />
                <span>Media Library (B2)</span>
              </NavLink>
              <NavLink
                to="/admin/clients"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Users size={15} />
                <span>Clients & Partners</span>
              </NavLink>
              <NavLink
                to="/admin/testimonials"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <MessageCircle size={15} />
                <span>Client Testimonials</span>
              </NavLink>
              <NavLink
                to="/admin/banners"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Bookmark size={15} />
                <span>Hero Banners</span>
              </NavLink>
            </div>

            {/* 4. Contact Inquiries & Settings */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                <span>Communications & Config</span>
              </div>
              <NavLink
                to="/admin/enquiries"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={15} />
                  <span>Contact Inquiries</span>
                </div>
              </NavLink>
              <NavLink
                to="/admin/settings"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Settings size={15} />
                <span>Basic Settings</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom User Bar */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div>
              <span className="text-xs font-semibold text-white block">
                {user?.username || 'Administrator'}
              </span>
              <span className="text-[10px] text-zinc-500 truncate block max-w-[130px]">
                {user?.email || 'admin@superway.com'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div className="pt-2 border-t border-white/5 flex gap-2">
            <Link
              to="/studio"
              target="_blank"
              className="flex-1 py-1 text-center rounded bg-[#172B55]/50 hover:bg-[#172B55] text-[10px] font-semibold text-[#A78BFA] transition-colors"
            >
              View Studio ↗
            </Link>
            <Link
              to="/production"
              target="_blank"
              className="flex-1 py-1 text-center rounded bg-[#1E1A11] hover:bg-[#2A2315] text-[10px] font-semibold text-[#D9B96E] transition-colors"
            >
              View Production ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
