import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, ExternalLink, Calendar, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const StudioProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getProject(slug);
        setProject(data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[#7952D9] border-t-white animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Project Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested studio case study could not be located.</p>
        <Link
          to="/studio/work"
          className="px-5 py-2.5 rounded bg-[#172B55] hover:bg-[#1f376a] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Back to Studio Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 selection:bg-[#7952D9]/40">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 mb-8">
          <Link to="/studio" className="hover:text-white transition-colors">
            Studio
          </Link>
          <ChevronRight size={12} />
          <Link to="/studio/work" className="hover:text-white transition-colors">
            Work
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#A78BFA] font-medium truncate max-w-xs">{project.title}</span>
        </div>

        {/* Project Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#172B55] border border-[#7952D9]/30 text-xs font-semibold uppercase tracking-wider text-[#A78BFA] mb-4">
            <Sparkles size={13} />
            <span>{project.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            {project.title}
          </h1>

          <p className="text-base md:text-lg text-zinc-300 font-light leading-relaxed max-w-3xl">
            {project.short_description || project.logline}
          </p>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-xl bg-[#10152D] border border-white/5 text-xs mb-12">
          <div>
            <span className="text-zinc-400 uppercase tracking-widest block text-[10px] mb-1">Timeline</span>
            <span className="font-semibold text-white">{project.project_date || project.release_year || '2025'}</span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase tracking-widest block text-[10px] mb-1">Client / Partner</span>
            <span className="font-semibold text-white truncate block">{project.client_name || project.client_production || 'Superway Confidential'}</span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase tracking-widest block text-[10px] mb-1">Role / Scope</span>
            <span className="font-semibold text-white truncate block">{project.role || 'Design & Engineering'}</span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase tracking-widest block text-[10px] mb-1">Deliverables</span>
            <span className="font-semibold text-[#A78BFA] truncate block">{project.deliverables || 'Full Case Study'}</span>
          </div>
        </div>

        {/* Main Cover / Banner Image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-14 bg-[#10152D] aspect-video">
          <img
            src={project.main_image_url || project.banner_image || project.thumbnail_image || project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-6 text-sm md:text-base font-light text-zinc-300 leading-relaxed mb-16 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-white pt-4">Project Overview & Strategic Execution</h2>
          <p className="whitespace-pre-line">
            {project.full_description || project.synopsis}
          </p>
        </div>

        {/* Gallery Images Stills */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Interface & Brand Stills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery_images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-[#10152D] aspect-video">
                  <img src={img} alt={`${project.title} preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next CTA / Navigation */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/studio/work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Studio Projects</span>
          </Link>

          <Link
            to={`/contact?division=STUDIO&service=${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white text-xs uppercase tracking-wider font-semibold rounded-sm shadow-lg shadow-[#7952D9]/30 hover:scale-105 transition-all"
          >
            <span>Commission Similar Project</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
