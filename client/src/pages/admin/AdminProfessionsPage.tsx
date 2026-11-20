import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { Profession } from '../../types';

export const AdminProfessionsPage: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Profession | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getProfessions(true); // all
      setProfessions(data);
    } catch (err) {
      console.error('Failed to load professions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setTagline('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(professions.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Profession) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setTagline(item.tagline || '');
    setDescription(item.description);
    setImageUrl(item.image_url);
    setDisplayOrder(item.display_order || 1);
    setIsActive(item.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateProfession(editingItem.id, {
          title,
          slug,
          tagline,
          description,
          image_url: imageUrl,
          display_order: displayOrder,
          is_active: isActive
        });
      } else {
        await api.createProfession({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tagline,
          description,
          image_url: imageUrl,
          display_order: displayOrder,
          is_active: isActive
        });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save profession');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProfession(id);
      loadData();
    } catch (err) {
      alert('Failed to delete profession');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
            Disciplines Management
          </span>
          <h1 className="text-3xl font-serif text-white">
            Profession Roles
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Profession Role</span>
        </button>
      </div>

      {/* Professions Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
            Loading Roles...
          </span>
        </div>
      ) : (
        <div className="bg-[#11151B] border border-white/5 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090B0E] text-zinc-400 uppercase tracking-wider border-b border-white/5 text-[11px]">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Role Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {professions.map((prof) => (
                  <tr key={prof.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-semibold text-[#C6A66A]">
                      #{prof.display_order}
                    </td>
                    <td className="p-4">
                      <img
                        src={prof.image_url}
                        alt={prof.title}
                        className="w-12 h-12 object-cover rounded-sm border border-white/10"
                      />
                    </td>
                    <td className="p-4">
                      <strong className="text-white block font-serif text-sm">
                        {prof.title}
                      </strong>
                      <span className="text-[11px] text-zinc-500 font-light truncate max-w-xs block">
                        {prof.tagline}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400">
                      {prof.slug}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold ${
                          prof.is_active
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {prof.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prof)}
                        className="p-1.5 text-zinc-400 hover:text-[#C6A66A] rounded-sm hover:bg-white/5"
                        title="Edit Role"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(prof.id, prof.title)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-sm hover:bg-white/5"
                        title="Delete Role"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#11151B] border border-white/10 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xl font-serif text-white">
                {editingItem ? 'Edit Profession Role' : 'Add New Profession'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Screenplay Writer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. screenplay-writer"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precise scene tension and subtext-rich dialogue."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full description of this craft discipline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#C6A66A] w-4 h-4"
                />
                <label htmlFor="isActiveCheck" className="text-xs text-zinc-300">
                  Active (Displayed on public pages)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm"
                >
                  Save Profession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
