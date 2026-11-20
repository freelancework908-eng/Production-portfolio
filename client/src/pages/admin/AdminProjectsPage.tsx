import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Film,
  Check,
  X,
  Search,
  ExternalLink,
  Upload,
  Eye,
  Star,
  Tv
} from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

interface AdminProjectsPageProps {
  initialDivision?: 'STUDIO' | 'PRODUCTION' | 'ALL';
  initialCategory?: string;
  titleOverride?: string;
}

export const AdminProjectsPage: React.FC<AdminProjectsPageProps> = ({
  initialDivision,
  initialCategory,
  titleOverride
}) => {
  const { pathname } = useLocation();

  // Deduce default division from path if not passed as prop
  let defaultDiv: 'STUDIO' | 'PRODUCTION' | 'ALL' = initialDivision || 'ALL';
  if (pathname.includes('/studio/projects')) defaultDiv = 'STUDIO';
  else if (pathname.includes('/production/')) defaultDiv = 'PRODUCTION';

  const [activeDivisionTab, setActiveDivisionTab] = useState<'ALL' | 'STUDIO' | 'PRODUCTION'>(defaultDiv);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION'>(
    defaultDiv === 'PRODUCTION' ? 'PRODUCTION' : 'STUDIO'
  );
  const [category, setCategory] = useState('Web and Software Development');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [projectDate, setProjectDate] = useState(String(new Date().getFullYear()));
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [clientName, setClientName] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [credits, setCredits] = useState('');

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const studioCategories = [
    'Graphic and Brand Design',
    'UI/UX and Web Design',
    'Web and Software Development',
    'Motion and Digital Creativity'
  ];

  const productionCategories = [
    'Film Production',
    'Short Films',
    'Feature Films',
    'Commercial Production',
    'TV Advertisements',
    'Brand Promotional Films',
    'Creative Video Production',
    'Production Services'
  ];

  const availableCategories = division === 'STUDIO' ? studioCategories : productionCategories;

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProjectsAdmin();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    const targetDiv = activeDivisionTab === 'PRODUCTION' ? 'PRODUCTION' : 'STUDIO';
    setDivision(targetDiv);
    setCategory(targetDiv === 'STUDIO' ? 'Web and Software Development' : 'Film Production');
    setShortDescription('');
    setFullDescription('');
    setThumbnailImage('');
    setMainImageUrl('');
    setVideoUrl('');
    setProjectDate(String(new Date().getFullYear()));
    setIsFeatured(false);
    setStatus('published');
    setSortOrder(projects.length + 1);
    setClientName('');
    setDeliverables('');
    setCredits('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    const div = (p.division || 'STUDIO').toUpperCase() as 'STUDIO' | 'PRODUCTION';
    setDivision(div);
    setCategory(p.category || (div === 'STUDIO' ? studioCategories[0] : productionCategories[0]));
    setShortDescription(p.short_description || p.logline || '');
    setFullDescription(p.full_description || p.synopsis || '');
    setThumbnailImage(p.thumbnail_image || p.cover_image || '');
    setMainImageUrl(p.main_image_url || p.banner_image || '');
    setVideoUrl(p.video_url || '');
    setProjectDate(p.project_date || String(p.release_year || new Date().getFullYear()));
    setIsFeatured(Boolean(p.is_featured));
    setStatus(p.status || 'published');
    setSortOrder(p.sort_order || 1);
    setClientName(p.client_name || p.client_production || '');
    setDeliverables(p.deliverables || '');
    setCredits(p.credits || '');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await api.uploadMedia(file, `${title || 'Project'} Thumbnail`);
      setThumbnailImage(uploaded.file_url);
      if (!mainImageUrl) setMainImageUrl(uploaded.file_url);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!window.confirm(`Permanently delete project "${projectTitle}"?`)) return;
    try {
      await api.deleteProject(id);
      loadData();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      await api.updateProject(p.id, { is_featured: !p.is_featured });
      loadData();
    } catch (err) {
      alert('Failed to update featured status');
    }
  };

  const handleToggleStatus = async (p: Project) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateProject(p.id, { status: newStatus });
      loadData();
    } catch (err) {
      alert('Failed to update publish status');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Project title is required');
      return;
    }

    try {
      const payload: Partial<Project> = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9_-]+/g, '-'),
        division,
        category,
        categories: [category],
        short_description: shortDescription,
        full_description: fullDescription,
        thumbnail_image: thumbnailImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        main_image_url: mainImageUrl || thumbnailImage,
        video_url: videoUrl,
        project_date: projectDate,
        release_year: Number(projectDate) || new Date().getFullYear(),
        is_featured: Boolean(isFeatured),
        status,
        sort_order: Number(sortOrder),
        client_name: clientName,
        client_production: clientName,
        deliverables,
        credits
      };

      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
      } else {
        await api.createProject(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  // Filter projects by tab and search
  const filtered = projects.filter((p) => {
    const pDiv = (p.division || 'STUDIO').toUpperCase();
    const matchesTab =
      activeDivisionTab === 'ALL' ? true : pDiv === activeDivisionTab;

    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.short_description && p.short_description.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getPageHeading = () => {
    if (titleOverride) return titleOverride;
    if (activeDivisionTab === 'STUDIO') return 'Studio Projects Catalog';
    if (activeDivisionTab === 'PRODUCTION') return 'Production Projects Catalog';
    return 'All Projects Catalog';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
            Portfolio Management
          </span>
          <h1 className="text-3xl font-serif text-white">{getPageHeading()}</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#7952D9]/20 transition-all hover:scale-105"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Division Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDivisionTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              activeDivisionTab === 'ALL'
                ? 'bg-white/20 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Divisions
          </button>
          <button
            onClick={() => setActiveDivisionTab('STUDIO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              activeDivisionTab === 'STUDIO'
                ? 'bg-[#172B55] text-[#A78BFA] border border-[#7952D9]/40'
                : 'text-zinc-400 hover:text-[#A78BFA]'
            }`}
          >
            <Sparkles size={12} />
            <span>Studio Only</span>
          </button>
          <button
            onClick={() => setActiveDivisionTab('PRODUCTION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
              activeDivisionTab === 'PRODUCTION'
                ? 'bg-[#1E1A11] text-[#D9B96E] border border-[#C6A04A]/40'
                : 'text-zinc-400 hover:text-[#D9B96E]'
            }`}
          >
            <Film size={12} />
            <span>Production Only</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#7952D9]"
          />
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="py-24 text-center text-zinc-500">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-zinc-500">No projects found.</div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.01]">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Thumb</th>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => {
                const isStudio = (p.division || 'STUDIO').toUpperCase() === 'STUDIO';

                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.thumbnail_image || p.cover_image}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-white/10"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-white block truncate">{p.title}</span>
                      <span className="text-[11px] text-zinc-400 line-clamp-1">
                        {p.short_description || p.logline}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                        /{p.slug} · {p.project_date || p.release_year}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          isStudio
                            ? 'bg-[#7952D9]/20 text-[#A78BFA] border border-[#7952D9]/30'
                            : 'bg-[#C6A04A]/20 text-[#D9B96E] border border-[#C6A04A]/30'
                        }`}
                      >
                        {p.division || 'STUDIO'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{p.category}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1 rounded transition-colors ${
                          p.is_featured
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                        title={p.is_featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        <Star size={16} className={p.is_featured ? 'fill-amber-400' : ''} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${
                          p.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {p.status || 'published'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={isStudio ? `/studio/work/${p.slug}` : `/production/work/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                          title="Preview Public Page"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                          title="Edit Project"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400"
                          title="Delete Project"
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

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#10141D] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Division Selector */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-2">
                  Project Division *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDivision('STUDIO');
                      setCategory(studioCategories[0]);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                      division === 'STUDIO'
                        ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white border-transparent'
                        : 'bg-black/40 text-zinc-400 border-white/10'
                    }`}
                  >
                    <Sparkles size={13} />
                    <span>STUDIO DIVISION</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDivision('PRODUCTION');
                      setCategory(productionCategories[0]);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                      division === 'PRODUCTION'
                        ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black border-transparent'
                        : 'bg-black/40 text-zinc-400 border-white/10'
                    }`}
                  >
                    <Film size={13} />
                    <span>PRODUCTION DIVISION</span>
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingProject) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Nexus AI Observability"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. nexus-ai-observability"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Project Date / Year
                  </label>
                  <input
                    type="text"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    placeholder="2025"
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                  Short Description / Logline *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One or two sentences summarizing the project..."
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                  Full Description / Case Study Synopsis
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Comprehensive case study or film narrative synopsis..."
                  className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Thumbnail Image + Upload Control */}
              <div>
                <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                  Thumbnail Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailImage}
                    onChange={(e) => setThumbnailImage(e.target.value)}
                    placeholder="https://... or uploaded image URL"
                    className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-white/10 hover:bg-white/15 text-xs text-white rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Upload size={13} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </div>
              </div>

              {/* Main Image or Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Main Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Video URL (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Client, Credits & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Client / Production
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Apex Chrono"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Deliverables
                  </label>
                  <input
                    type="text"
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                    placeholder="e.g. 60s Spot, Web App"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Credits / Cast
                  </label>
                  <input
                    type="text"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder="e.g. Starring Kabir Mehta"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3 py-2 rounded-lg bg-[#141822] border border-white/10 text-white text-xs"
                  >
                    <option value="published">PUBLISHED</option>
                    <option value="draft">DRAFT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Featured Item
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase transition-colors ${
                      isFeatured
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isFeatured ? '★ Featured' : 'Standard'}
                  </button>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
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
                  {editingProject ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
