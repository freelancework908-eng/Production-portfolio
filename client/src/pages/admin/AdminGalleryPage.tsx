import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image, Camera, Check, X } from 'lucide-react';
import { api } from '../../services/api';
import { GalleryItem } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>('Portraits');
  const [imageUrl, setImageUrl] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const categories = [
    'Portraits',
    'On Set',
    'Behind the Scenes',
    'Events',
    'Professional Moments'
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery({ all: true });
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items', err);
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
    setCaption('');
    setCategory('Portraits');
    setImageUrl('');
    setPhotographer('');
    setDisplayOrder(items.length + 1);
    setIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCaption(item.caption || '');
    setCategory(item.category);
    setImageUrl(item.image_url);
    setPhotographer(item.photographer || '');
    setDisplayOrder(item.display_order || 1);
    setIsPublished(item.is_published);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateGalleryItem(editingItem.id, {
          title,
          caption,
          category,
          image_url: imageUrl,
          photographer,
          display_order: displayOrder,
          is_published: isPublished
        });
      } else {
        await api.createGalleryItem({
          title,
          caption,
          category,
          image_url: imageUrl,
          photographer,
          display_order: displayOrder,
          is_published: isPublished
        });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save gallery still');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete photo "${name}"?`)) return;
    try {
      await api.deleteGalleryItem(id);
      loadData();
    } catch (err) {
      alert('Failed to delete gallery item');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
            Visual Catalog
          </span>
          <h1 className="text-3xl font-serif text-white">
            Gallery Management
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Photo Still</span>
        </button>
      </div>

      {/* Grid of gallery stills */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
            Loading Gallery...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#11151B] border border-white/5 hover:border-white/20 rounded-sm overflow-hidden flex flex-col justify-between group transition-all"
            >
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[#C6A66A] rounded-sm border border-white/10 font-semibold">
                  {item.category}
                </span>
                <span
                  className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold ${
                    item.is_published
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-serif text-white truncate" title={item.title}>
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-zinc-400 line-clamp-2 font-light">
                    {item.caption}
                  </p>
                )}
                {item.photographer && (
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Camera size={11} className="text-[#C6A66A]" />
                    <span>{item.photographer}</span>
                  </p>
                )}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-mono text-[11px]">#{item.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-zinc-400 hover:text-[#C6A66A] rounded-sm hover:bg-white/5"
                      title="Edit Photo"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-sm hover:bg-white/5"
                      title="Delete Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#11151B] border border-white/10 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-serif text-white">
              {editingItem ? 'Edit Gallery Still' : 'Add Photo to Gallery'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setting the Scene under Tungsten"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Image URL *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
                  Photographer Credit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Joshi"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Caption / Scene Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief context about location, scene, or setup..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="accent-[#C6A66A] w-4 h-4"
                />
                <label htmlFor="pubCheck" className="text-xs text-zinc-300">
                  Published (Visible in public gallery)
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
