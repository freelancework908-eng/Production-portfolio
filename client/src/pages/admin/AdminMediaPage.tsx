import React, { useEffect, useState } from 'react';
import { Upload, Plus, Trash2, Copy, Check, ExternalLink, Image, Video, Music, FileText, FolderOpen } from 'lucide-react';
import { api } from '../../services/api';
import { MediaAsset } from '../../types';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | 'pdf'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getMedia(filterType === 'all' ? undefined : filterType);
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterType]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media asset "${name}"?`)) return;
    try {
      await api.deleteMedia(id);
      loadData();
    } catch (err) {
      alert('Failed to delete media asset');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        if (title) formData.append('title', title);
        await api.uploadMediaFile(formData);
      } else if (externalUrl) {
        await api.createMedia({
          title: title || 'External Asset',
          file_url: externalUrl,
          file_name: externalUrl.split('/').pop() || 'asset',
          file_type: mediaType,
          file_size: 'Cloud Stream',
          mime_type: `${mediaType}/*`
        });
      } else {
        alert('Please choose a file to upload or enter a URL.');
        setIsSubmitting(false);
        return;
      }
      setModalOpen(false);
      setUploadFile(null);
      setExternalUrl('');
      setTitle('');
      loadData();
    } catch (err) {
      alert('Failed to register media asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-[#C6A66A]" />;
      case 'audio':
        return <Music size={16} className="text-[#C6A66A]" />;
      case 'pdf':
        return <FileText size={16} className="text-[#C6A66A]" />;
      default:
        return <Image size={16} className="text-[#C6A66A]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
            Asset Storage & Cloud Management
          </span>
          <h1 className="text-3xl font-serif text-white">
            Media Library
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Upload size={15} />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2">
        {['all', 'image', 'video', 'audio', 'pdf'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
              filterType === t
                ? 'bg-[#C6A66A] text-[#090B0E] font-semibold'
                : 'bg-[#11151B] text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
            Loading Media Assets...
          </span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-12 text-center bg-[#11151B] border border-white/5 rounded-sm">
          <FolderOpen size={36} className="mx-auto text-zinc-500 mb-3" />
          <p className="text-sm font-serif text-white">No media assets found</p>
          <p className="text-xs text-zinc-400">Click "Add Media Asset" to register an image or video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-[#11151B] border border-white/5 hover:border-white/20 rounded-sm overflow-hidden flex flex-col justify-between group transition-all"
            >
              {/* Thumbnail / Icon preview */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                    {getTypeIcon(item.file_type)}
                    <span className="text-[10px] uppercase tracking-wider font-mono">
                      {item.file_type}
                    </span>
                  </div>
                )}
                <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-black/70 backdrop-blur-sm text-zinc-300 rounded-sm">
                  {item.file_size}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#C6A66A] uppercase tracking-widest font-medium">
                  {getTypeIcon(item.file_type)}
                  <span>{item.file_type}</span>
                </div>
                <h4 className="text-xs font-serif text-white font-medium truncate" title={item.title}>
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-500 font-mono truncate" title={item.file_url}>
                  {item.file_url}
                </p>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(item.file_url, item.id)}
                    className="text-[11px] text-zinc-400 hover:text-[#C6A66A] flex items-center gap-1 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-zinc-400 hover:text-white"
                      title="Open Asset in Tab"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1 text-zinc-400 hover:text-rose-400"
                      title="Delete Asset"
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

      {/* Upload / Register Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#11151B] border border-white/10 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-serif text-white">
              Add Media Asset
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Director On-Set Still 35mm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Option A: Upload File Directly
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-zinc-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-sm file:border-0 file:text-xs file:bg-[#C6A66A] file:text-black file:font-semibold"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Option B: External / Cloud URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://youtube.com/..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">
                  Asset Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A]"
                >
                  <option value="image">Image (Photograph / Poster)</option>
                  <option value="video">Video (Showreel / Trailer / Embed)</option>
                  <option value="audio">Audio (Soundtrack / Vocal Track)</option>
                  <option value="pdf">Document (PDF Press Kit)</option>
                </select>
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
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-wider rounded-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Save Media Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
