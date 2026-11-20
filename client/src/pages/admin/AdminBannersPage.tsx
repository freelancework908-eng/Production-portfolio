import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Layout, ExternalLink, Search, X } from 'lucide-react';
import { api } from '../../services/api';
import { Banner } from '../../types';

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION' | 'PORTAL'>('PORTAL');
  const [ctaLabel, setCtaLabel] = useState('Explore');
  const [ctaLink, setCtaLink] = useState('/');
  const [mediaUrl, setMediaUrl] = useState('');
  const [b2Key, setB2Key] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getBanners();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setDivision('PORTAL');
    setCtaLabel('Explore');
    setCtaLink('/');
    setMediaUrl('');
    setB2Key('');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setDivision(b.division || 'PORTAL');
    setCtaLabel(b.cta_label || 'Explore');
    setCtaLink(b.cta_link || '/');
    setMediaUrl(b.media_url || '');
    setB2Key(b.b2_key || '');
    setDisplayOrder(b.display_order || 1);
    setIsActive(b.is_active !== false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete banner "${name}"?`)) return;
    try {
      await api.deleteBanner(id);
      loadData();
    } catch (err) {
      alert('Failed to delete banner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Banner> = {
        title,
        subtitle,
        division,
        cta_label: ctaLabel,
        cta_link: ctaLink,
        media_url: mediaUrl,
        b2_key: b2Key,
        display_order: Number(displayOrder) || 1,
        is_active: isActive
      };

      if (editingBanner) {
        await api.updateBanner(editingBanner.id, payload);
      } else {
        await api.createBanner(payload);
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBanners = banners.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.subtitle || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-violet-400 block mb-1">
            Visual Storytelling & Banners
          </span>
          <h1 className="text-2xl font-bold font-cinzel text-white">Promotional Banners & Heroes</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure dynamic homepage hero banners, division teasers, and call-to-action promotions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-violet-500/20 transition-all self-start"
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#0F1218] p-4 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search banners..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs">Loading banners...</div>
      ) : filteredBanners.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 text-xs bg-[#0F1218] rounded-xl border border-white/5">
          No banners found. Click "Add Banner" to configure hero visuals.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanners.map(b => (
            <div
              key={b.id}
              className="bg-[#0F1218] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-black/60 relative overflow-hidden">
                  {b.media_url ? (
                    <img src={b.media_url} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Layout size={32} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        b.division === 'STUDIO'
                          ? 'bg-blue-500/80 text-white'
                          : b.division === 'PRODUCTION'
                          ? 'bg-amber-500/80 text-white'
                          : 'bg-purple-500/80 text-white'
                      }`}
                    >
                      {b.division}
                    </span>
                  </div>
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      b.is_active ? 'bg-emerald-500/80 text-white' : 'bg-zinc-700/80 text-zinc-300'
                    }`}
                  >
                    {b.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-sm font-bold text-white leading-snug">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-zinc-400 line-clamp-2">{b.subtitle}</p>}
                  {b.cta_label && (
                    <div className="text-[11px] text-violet-400 font-semibold flex items-center gap-1 pt-1">
                      <span>CTA: {b.cta_label}</span>
                      <span className="text-zinc-500">→</span>
                      <span className="text-zinc-500 truncate max-w-[150px]">{b.cta_link}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <span className="text-[10px] text-zinc-500">Display Order #{b.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-all"
                    title="Edit Banner"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 transition-all"
                    title="Delete Banner"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F1218] border border-white/10 rounded-xl w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-base font-bold font-cinzel text-white">
                {editingBanner ? 'Edit Promotional Banner' : 'Create Hero Banner'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Elevating Brand Architecture"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="Enter compelling lead sentence..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Division Target
                  </label>
                  <select
                    value={division}
                    onChange={e => setDivision(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="PORTAL">Portal / Main Homepage</option>
                    <option value="STUDIO">Studio Division</option>
                    <option value="PRODUCTION">Production Division</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={e => setCtaLabel(e.target.value)}
                    placeholder="e.g. Discover Studio"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={e => setCtaLink(e.target.value)}
                    placeholder="e.g. /studio/work"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Background Media URL
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerIsActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-violet-600 focus:ring-0"
                />
                <label htmlFor="bannerIsActive" className="text-xs text-zinc-300">
                  Active (Displayed to site visitors)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-violet-500 transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBannersPage;
