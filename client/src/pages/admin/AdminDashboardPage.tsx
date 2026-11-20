import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Film,
  Layers,
  MessageSquare,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Tv,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats, Project, Enquiry, Service } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [st, projs, enqs] = await Promise.all([
          api.getStats().catch(() => null),
          api.getAllProjectsAdmin().catch(() => []),
          api.getEnquiries().catch(() => [])
        ]);
        setStats(st);
        setRecentProjects(projs.slice(0, 6));
        setRecentEnquiries(enqs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await api.markEnquiryRead(id, !currentStatus);
      setRecentEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_read: !currentStatus } : e))
      );
      if (stats) {
        setStats({
          ...stats,
          unreadInquiries: currentStatus
            ? stats.unreadInquiries + 1
            : Math.max(0, stats.unreadInquiries - 1)
        });
      }
    } catch (err) {
      console.error('Failed to toggle read', err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.deleteEnquiry(id);
      setRecentEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (stats) {
        setStats({
          ...stats,
          totalInquiries: Math.max(0, stats.totalInquiries - 1)
        });
      }
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 rounded-full border border-violet-500 border-t-white animate-spin mx-auto mb-4" />
        <span className="text-xs uppercase tracking-widest text-[#A78BFA]">
          Loading Central Command Analytics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
            Central Management System
          </span>
          <h1 className="text-3xl font-serif text-white">
            Dual-Division Operations Command
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/studio/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#7952D9]/20 transition-all hover:scale-105"
          >
            <Plus size={14} />
            <span>New Studio Project</span>
          </Link>
          <Link
            to="/admin/production/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#C6A04A]/20 transition-all hover:scale-105"
          >
            <Plus size={14} />
            <span>New Production Film/Ad</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics: Section 6 requirement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Studio Projects */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10152D] to-[#172B55]/60 border border-[#7952D9]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A78BFA]">
              Studio Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#7952D9]/20 flex items-center justify-center text-[#A78BFA]">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {stats?.totalStudioProjects || 0}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Design, SaaS & Web Apps</span>
            <Link to="/admin/studio/projects" className="text-[#A78BFA] hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Metric 2: Total Production Projects */}
        <div className="p-6 rounded-2xl bg-[#171717] border border-[#C6A04A]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#D9B96E]">
              Production Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A04A]/20 flex items-center justify-center text-[#C6A04A]">
              <Film size={18} />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {stats?.totalProductionProjects || 0}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Feature Films, Shorts & Ads</span>
            <Link to="/admin/production/projects" className="text-[#D9B96E] hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Metric 3: Total Services */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Active Services
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-zinc-300">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {stats?.totalServices || 0}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Across 4 Studio Categories</span>
            <Link to="/admin/studio/services" className="text-white hover:underline">
              Catalog →
            </Link>
          </div>
        </div>

        {/* Metric 4: Total Inquiries */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-zinc-300">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1 flex items-baseline gap-2">
            <span>{stats?.totalInquiries || stats?.totalEnquiries || 0}</span>
            {stats?.unreadInquiries ? (
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {stats.unreadInquiries} new
              </span>
            ) : null}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Studio & Production Leads</span>
            <Link to="/admin/enquiries" className="text-white hover:underline">
              Inbox →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Recent Studio & Production Projects */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="text-base font-serif font-bold text-white">Recent Projects</h3>
            <div className="flex items-center gap-3 text-xs">
              <Link to="/admin/studio/projects" className="text-[#A78BFA] hover:underline">
                Studio ({stats?.totalStudioProjects || 0})
              </Link>
              <span>•</span>
              <Link to="/admin/production/projects" className="text-[#D9B96E] hover:underline">
                Production ({stats?.totalProductionProjects || 0})
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {recentProjects.map((proj) => {
              const isStudio = (proj.division || '').toUpperCase() === 'STUDIO';
              return (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={proj.thumbnail_image || proj.cover_image}
                      alt={proj.title}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            isStudio
                              ? 'bg-[#7952D9]/20 text-[#A78BFA] border border-[#7952D9]/30'
                              : 'bg-[#C6A04A]/20 text-[#D9B96E] border border-[#C6A04A]/30'
                          }`}
                        >
                          {isStudio ? 'Studio' : 'Production'}
                        </span>
                        <span className="text-[10px] text-zinc-500">{proj.category}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{proj.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        proj.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <Link
                      to={isStudio ? '/admin/studio/projects' : '/admin/production/projects'}
                      className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                      title="Edit Project"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Inquiries */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="text-base font-serif font-bold text-white">Recent Client Inquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-zinc-400 hover:text-white">
              View All ({stats?.totalInquiries || stats?.totalEnquiries || 0}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No inquiries received yet.</div>
            ) : (
              recentEnquiries.map((enq) => {
                const isStudio = (enq.division || '').toUpperCase() === 'STUDIO';
                const isProduction = (enq.division || '').toUpperCase() === 'PRODUCTION';

                return (
                  <div
                    key={enq.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      !enq.is_read
                        ? 'bg-[#141822] border-violet-500/30'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              isStudio
                                ? 'bg-[#7952D9]/20 text-[#A78BFA] border border-[#7952D9]/30'
                                : isProduction
                                ? 'bg-[#C6A04A]/20 text-[#D9B96E] border border-[#C6A04A]/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {enq.division || 'General'}
                          </span>
                          <span className="text-xs font-bold text-white">{enq.name}</span>
                        </div>
                        <span className="text-[11px] text-zinc-400">{enq.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(enq.id, enq.is_read)}
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                            enq.is_read
                              ? 'bg-white/5 text-zinc-400 hover:text-white'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {enq.is_read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="p-1 hover:text-rose-400 text-zinc-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed">
                      {enq.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
