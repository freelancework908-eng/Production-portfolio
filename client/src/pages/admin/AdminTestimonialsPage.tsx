import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, Quote, Search, X } from 'lucide-react';
import { api } from '../../services/api';
import { Testimonial } from '../../types';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'ALL' | 'STUDIO' | 'PRODUCTION' | 'BOTH'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [b2Key, setB2Key] = useState('');
  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION' | 'BOTH'>('BOTH');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getTestimonials({ all: true });
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setClientName('');
    setClientRole('');
    setCompany('');
    setAvatarUrl('');
    setB2Key('');
    setDivision('BOTH');
    setQuote('');
    setRating(5);
    setDisplayOrder(testimonials.length + 1);
    setIsFeatured(true);
    setIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setClientName(t.client_name);
    setClientRole(t.client_role || '');
    setCompany(t.company || '');
    setAvatarUrl(t.avatar_url || '');
    setB2Key(t.b2_key || '');
    setDivision(t.division || 'BOTH');
    setQuote(t.quote);
    setRating(t.rating || 5);
    setDisplayOrder(t.display_order || 1);
    setIsFeatured(t.is_featured !== false);
    setIsPublished(t.is_published !== false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      loadData();
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Testimonial> = {
        client_name: clientName,
        client_role: clientRole,
        company,
        avatar_url: avatarUrl,
        b2_key: b2Key,
        division,
        quote,
        rating: Number(rating) || 5,
        display_order: Number(displayOrder) || 1,
        is_featured: isFeatured,
        is_published: isPublished
      };

      if (editingTestimonial) {
        await api.updateTestimonial(editingTestimonial.id, payload);
      } else {
        await api.createTestimonial(payload);
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch =
      t.client_name.toLowerCase().includes(search.toLowerCase()) ||
      (t.company || '').toLowerCase().includes(search.toLowerCase()) ||
      t.quote.toLowerCase().includes(search.toLowerCase());
    const matchesDiv = divisionFilter === 'ALL' || t.division === divisionFilter || t.division === 'BOTH';
    return matchesSearch && matchesDiv;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-violet-400 block mb-1">
            Client Feedback & Endorsements
          </span>
          <h1 className="text-2xl font-bold font-cinzel text-white">Client Testimonials</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage verified client reviews and director testimonials across Studio & Production divisions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-violet-500/20 transition-all self-start"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0F1218] p-4 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search reviews, clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'STUDIO', 'PRODUCTION', 'BOTH'] as const).map(div => (
            <button
              key={div}
              onClick={() => setDivisionFilter(div)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                divisionFilter === div
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs">Loading testimonials...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 text-xs bg-[#0F1218] rounded-xl border border-white/5">
          No testimonials found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map(t => (
            <div
              key={t.id}
              className="bg-[#0F1218] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all flex flex-col justify-between relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      t.division === 'STUDIO'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : t.division === 'PRODUCTION'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {t.division}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < (t.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative pt-2">
                  <Quote size={20} className="text-zinc-600 mb-2 opacity-50" />
                  <p className="text-xs text-zinc-300 italic line-clamp-4 leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-violet-900/30 border border-violet-500/20 overflow-hidden flex items-center justify-center shrink-0">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.client_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-violet-300">
                        {t.client_name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.client_name}</h4>
                    <p className="text-[10px] text-zinc-400">
                      {t.client_role}
                      {t.company ? ` · ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                <span className="text-[10px] text-zinc-500">Order #{t.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-all"
                    title="Edit Testimonial"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.client_name)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 transition-all"
                    title="Delete Testimonial"
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={e => setClientRole(e.target.value)}
                    placeholder="e.g. Head of Marketing"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Paramount Networks"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Division
                  </label>
                  <select
                    value={division}
                    onChange={e => setDivision(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="BOTH">Both (Shared)</option>
                    <option value="STUDIO">Studio</option>
                    <option value="PRODUCTION">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Quote / Testimonial *
                </label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  placeholder="The team delivered exceptional cinematic visual quality..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Great)</option>
                    <option value={3}>3 Stars (Good)</option>
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-violet-600 focus:ring-0"
                  />
                  Featured Testimonial
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-violet-600 focus:ring-0"
                  />
                  Published
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
                  {submitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTestimonialsPage;
