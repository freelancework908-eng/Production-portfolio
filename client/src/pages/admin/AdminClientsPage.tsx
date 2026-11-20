import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Building, Globe, Check, X, Search, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { Client } from '../../types';

export const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'ALL' | 'STUDIO' | 'PRODUCTION' | 'BOTH'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION' | 'BOTH'>('BOTH');
  const [logoUrl, setLogoUrl] = useState('');
  const [b2Key, setB2Key] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      console.error('Failed to load clients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingClient(null);
    setName('');
    setDivision('BOTH');
    setLogoUrl('');
    setB2Key('');
    setWebsiteUrl('');
    setDisplayOrder(clients.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setDivision(c.division || 'BOTH');
    setLogoUrl(c.logo_url || '');
    setB2Key(c.b2_key || '');
    setWebsiteUrl(c.website_url || '');
    setDisplayOrder(c.display_order || 1);
    setIsActive(c.is_active !== false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!window.confirm(`Delete client partner "${clientName}"?`)) return;
    try {
      await api.deleteClient(id);
      loadData();
    } catch (err) {
      alert('Failed to delete client');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Client> = {
        name,
        division,
        logo_url: logoUrl,
        b2_key: b2Key,
        website_url: websiteUrl,
        display_order: Number(displayOrder) || 1,
        is_active: isActive
      };

      if (editingClient) {
        await api.updateClient(editingClient.id, payload);
      } else {
        await api.createClient(payload);
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesDiv = divisionFilter === 'ALL' || c.division === divisionFilter || c.division === 'BOTH';
    return matchesSearch && matchesDiv;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-violet-400 block mb-1">
            Database & Cloud Persistence
          </span>
          <h1 className="text-2xl font-bold font-cinzel text-white">Clients & Brand Partners</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage brands, corporate partners, and production clients across Studio and Production.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-violet-500/20 transition-all self-start"
        >
          <Plus size={16} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0F1218] p-4 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search clients..."
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

      {/* Clients Grid */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs">Loading client partners...</div>
      ) : filteredClients.length === 0 ? (
        <div className="py-24 text-center text-zinc-500 text-xs bg-[#0F1218] rounded-xl border border-white/5">
          No clients found matching the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(c => (
            <div
              key={c.id}
              className="bg-[#0F1218] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      c.division === 'STUDIO'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : c.division === 'PRODUCTION'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {c.division}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[11px] font-medium ${
                      c.is_active ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${c.is_active ? 'bg-emerald-400' : 'bg-zinc-600'}`}
                    />
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building size={20} className="text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{c.name}</h3>
                    {c.website_url && (
                      <a
                        href={c.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-zinc-400 hover:text-violet-400 flex items-center gap-1 mt-0.5"
                      >
                        <Globe size={11} />
                        <span className="truncate max-w-[150px]">{c.website_url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </div>
                </div>

                {c.b2_key && (
                  <div className="text-[10px] text-zinc-500 font-mono truncate bg-black/30 px-2 py-1 rounded">
                    B2: {c.b2_key}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <span className="text-[10px] text-zinc-500">Order: #{c.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-all"
                    title="Edit Client"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 transition-all"
                    title="Delete Client"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F1218] border border-white/10 rounded-xl w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-base font-bold font-cinzel text-white">
                {editingClient ? 'Edit Client Partner' : 'Add New Client Partner'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Acme Studios"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Division
                  </label>
                  <select
                    value={division}
                    onChange={e => setDivision(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="BOTH">Both (Shared Partner)</option>
                    <option value="STUDIO">Studio Only</option>
                    <option value="PRODUCTION">Production Only</option>
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
                  Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Cloudflare B2 Object Key (Optional)
                </label>
                <input
                  type="text"
                  value={b2Key}
                  onChange={e => setB2Key(e.target.value)}
                  placeholder="e.g. clients/logo-acme.png"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://clientwebsite.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="clientIsActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-violet-600 focus:ring-0"
                />
                <label htmlFor="clientIsActive" className="text-xs text-zinc-300">
                  Active (Visible on public portfolio)
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
                  {submitting ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminClientsPage;
