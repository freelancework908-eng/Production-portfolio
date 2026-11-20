import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Check, X, Search, Sparkles, Film, ArrowUpDown } from 'lucide-react';
import { api } from '../../services/api';
import { Service } from '../../types';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION'>('STUDIO');
  const [category, setCategory] = useState('Graphic and Brand Design');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const studioCategories = [
    'Graphic and Brand Design',
    'UI/UX and Web Design',
    'Web and Software Development',
    'Motion and Digital Creativity'
  ];

  const productionCategories = [
    'Film Production',
    'Commercial Production',
    'Creative Video Production',
    'Production Services'
  ];

  const availableCategories = division === 'STUDIO' ? studioCategories : productionCategories;

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getServices({ all: true });
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDivision('STUDIO');
    setCategory('Graphic and Brand Design');
    setDescription('');
    setIcon('Layers');
    setDisplayOrder(services.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setDivision(s.division || 'STUDIO');
    setCategory(s.category);
    setDescription(s.description);
    setIcon(s.icon || 'Layers');
    setDisplayOrder(s.display_order || 1);
    setIsActive(s.is_active !== false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, serviceName: string) => {
    if (!window.confirm(`Delete service "${serviceName}"?`)) return;
    try {
      await api.deleteService(id);
      loadData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const handleToggleActive = async (s: Service) => {
    try {
      await api.updateService(s.id, { is_active: !s.is_active });
      loadData();
    } catch (err) {
      alert('Failed to update service status');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        division,
        category,
        description,
        icon,
        display_order: Number(displayOrder),
        is_active: Boolean(isActive)
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.division.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
            Studio Management
          </span>
          <h1 className="text-3xl font-serif text-white">Services Catalog</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#7952D9]/20 transition-all hover:scale-105"
        >
          <Plus size={14} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title, division or category..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#7952D9]"
          />
        </div>
        <div className="text-xs text-zinc-400 font-medium whitespace-nowrap">
          {filtered.length} service{filtered.length === 1 ? '' : 's'} total
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500">Loading services...</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-zinc-500">No services found.</div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.01]">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s) => {
                const isStudio = (s.division || 'STUDIO').toUpperCase() === 'STUDIO';

                return (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-zinc-500">#{s.display_order}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{s.name}</span>
                      <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-sm">{s.description}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          isStudio
                            ? 'bg-[#7952D9]/20 text-[#A78BFA] border border-[#7952D9]/30'
                            : 'bg-[#C6A04A]/20 text-[#D9B96E] border border-[#C6A04A]/30'
                        }`}
                      >
                        {s.division || 'STUDIO'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">{s.category}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{s.icon || 'Layers'}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                          s.is_active
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {s.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400"
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10141D] border border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website UI/UX & Redesign"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => {
                      const div = e.target.value as 'STUDIO' | 'PRODUCTION';
                      setDivision(div);
                      setCategory(div === 'STUDIO' ? studioCategories[0] : productionCategories[0]);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#141822] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="STUDIO">STUDIO</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#141822] border border-white/10 text-white text-xs focus:outline-none"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the deliverables and methodology..."
                  className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Palette, Code..."
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase transition-colors ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white text-xs font-semibold uppercase shadow-md shadow-[#7952D9]/30"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
