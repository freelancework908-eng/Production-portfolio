import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Trophy, Award as AwardIcon } from 'lucide-react';
import { api } from '../../services/api';
import { Award } from '../../types';

export const AdminAwardsPage: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAwards();
      setAwards(data);
    } catch (err) {
      console.error('Failed to load awards', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingAward(null);
    setTitle('');
    setOrganization('');
    setYear(new Date().getFullYear());
    setProjectName('');
    setCategory('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(awards.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Award) => {
    setEditingAward(a);
    setTitle(a.title);
    setOrganization(a.organization);
    setYear(a.year);
    setProjectName(a.project_name || '');
    setCategory(a.category || '');
    setDescription(a.description || '');
    setImageUrl(a.image_url || '');
    setDisplayOrder(a.display_order || 1);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAward) {
        await api.updateAward(editingAward.id, {
          title,
          organization,
          year: Number(year),
          project_name: projectName,
          category,
          description,
          image_url: imageUrl,
          display_order: Number(displayOrder)
        });
      } else {
        await api.createAward({
          title,
          organization,
          year: Number(year),
          project_name: projectName,
          category,
          description,
          image_url: imageUrl,
          display_order: Number(displayOrder)
        });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save award');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete honor "${name}"?`)) return;
    try {
      await api.deleteAward(id);
      loadData();
    } catch (err) {
      alert('Failed to delete award');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
            Industry Accolades
          </span>
          <h1 className="text-3xl font-serif text-white">
            Awards & Laurels Management
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Award Record</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
            Loading Honors...
          </span>
        </div>
      ) : (
        <div className="bg-[#11151B] border border-white/5 rounded-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090B0E] text-zinc-400 uppercase tracking-wider border-b border-white/5 text-[11px]">
              <tr>
                <th className="p-4">Year</th>
                <th className="p-4">Award Title</th>
                <th className="p-4">Organization / Festival</th>
                <th className="p-4">Associated Work</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {awards.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-cinzel font-semibold text-[#C6A66A]">
                    {a.year}
                  </td>
                  <td className="p-4">
                    <strong className="text-white block font-serif text-sm">
                      {a.title}
                    </strong>
                    <span className="text-[11px] text-zinc-500 font-light truncate max-w-sm block">
                      {a.description}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300">
                    {a.organization}
                  </td>
                  <td className="p-4 font-serif text-white">
                    {a.project_name || 'Career Achievement'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="p-1.5 text-zinc-400 hover:text-[#C6A66A] rounded-sm hover:bg-white/5"
                      title="Edit Award"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-sm hover:bg-white/5"
                      title="Delete Award"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#11151B] border border-white/10 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-serif text-white">
              {editingAward ? 'Edit Award Record' : 'Add New Award'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Award Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Jury Prize for Best Direction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Organization / Festival *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lucerne International Cinema Showcase"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Project / Work Associated
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Midnight Solitude"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Feature Direction"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Description / Citation
                </label>
                <textarea
                  rows={3}
                  placeholder="Jury citation or context of the honor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Laurel / Certificate Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
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
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
