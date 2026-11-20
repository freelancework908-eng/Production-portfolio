import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle2, Eye, X, Phone, User, Tag, Sparkles, Film } from 'lucide-react';
import { api } from '../../services/api';
import { Enquiry } from '../../types';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDivision, setFilterDivision] = useState<'ALL' | 'STUDIO' | 'PRODUCTION'>('ALL');
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleRead = async (enquiry: Enquiry) => {
    try {
      const updated = await api.markEnquiryRead(enquiry.id, !enquiry.is_read);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? updated : e))
      );
      if (selectedEnquiry?.id === enquiry.id) {
        setSelectedEnquiry(updated);
      }
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;
    try {
      await api.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      loadData();
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  const handleOpenDetail = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    if (!enquiry.is_read) {
      try {
        const updated = await api.markEnquiryRead(enquiry.id, true);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiry.id ? updated : e))
        );
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
  };

  // Filter inquiries
  const filtered = enquiries.filter((e) => {
    const eDiv = (e.division || 'GENERAL').toUpperCase();
    const matchesDiv = filterDivision === 'ALL' ? true : eDiv === filterDivision;
    const matchesUnread = filterUnread ? !e.is_read : true;
    return matchesDiv && matchesUnread;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
            Inbound Communications
          </span>
          <h1 className="text-3xl font-serif text-white">Contact Inquiries</h1>
        </div>
        <div className="text-xs text-zinc-400 font-medium">
          {enquiries.filter((e) => !e.is_read).length} unread of {enquiries.length} total
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterDivision('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              filterDivision === 'ALL' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Divisions
          </button>
          <button
            onClick={() => setFilterDivision('STUDIO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              filterDivision === 'STUDIO'
                ? 'bg-[#172B55] text-[#A78BFA] border border-[#7952D9]/40'
                : 'text-zinc-400 hover:text-[#A78BFA]'
            }`}
          >
            <Sparkles size={12} />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setFilterDivision('PRODUCTION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              filterDivision === 'PRODUCTION'
                ? 'bg-[#1E1A11] text-[#D9B96E] border border-[#C6A04A]/40'
                : 'text-zinc-400 hover:text-[#D9B96E]'
            }`}
          >
            <Film size={12} />
            <span>Production</span>
          </button>
        </div>

        <button
          onClick={() => setFilterUnread(!filterUnread)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors border ${
            filterUnread
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-black/30 text-zinc-400 border-white/10 hover:text-white'
          }`}
        >
          {filterUnread ? 'Showing Unread Only' : 'Show Unread Only'}
        </button>
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500">Loading inquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-zinc-500">No contact inquiries found.</div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.01]">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Service Interest</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((enq) => {
                const isStudio = (enq.division || '').toUpperCase() === 'STUDIO';
                const isProduction = (enq.division || '').toUpperCase() === 'PRODUCTION';

                return (
                  <tr
                    key={enq.id}
                    className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      !enq.is_read ? 'bg-white/[0.02] font-medium' : ''
                    }`}
                    onClick={() => handleOpenDetail(enq)}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleRead(enq)}
                        className={`w-2.5 h-2.5 rounded-full transition-transform ${
                          !enq.is_read ? 'bg-amber-400 scale-125' : 'bg-zinc-700'
                        }`}
                        title={enq.is_read ? 'Mark as unread' : 'Mark as read'}
                      />
                    </td>
                    <td className="py-3.5 px-4">
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
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{enq.name}</span>
                      <span className="text-[11px] text-zinc-400">{enq.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      {enq.service_interest || enq.project_type || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {enq.message}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 text-[11px] whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(enq)}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                          title="View Full Inquiry"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id, enq.name)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400"
                          title="Delete Inquiry"
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

      {/* Inquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10141D] border border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#7952D9]/20 text-[#A78BFA]">
                  {selectedEnquiry.division} INQUIRY
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-2">
                  Message from {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-white hover:underline font-medium">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Phone</span>
                  <span className="text-white font-medium">{selectedEnquiry.phone || 'Not provided'}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Project Interest</span>
                  <span className="text-[#A78BFA] font-medium">{selectedEnquiry.service_interest || selectedEnquiry.project_type}</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-2">Message Body</span>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-zinc-200 leading-relaxed whitespace-pre-wrap font-light">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="text-[11px] text-zinc-500">
                Submitted on {new Date(selectedEnquiry.created_at).toLocaleString()}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleRead(selectedEnquiry)}
                className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-semibold"
              >
                {selectedEnquiry.is_read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Regarding your ${selectedEnquiry.division} Inquiry`}
                  className="px-4 py-2 rounded bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
