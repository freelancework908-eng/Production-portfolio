import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Film, ArrowLeft, ArrowRight, Play, ChevronRight, Video, Calendar, User } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';
import { VideoModal } from '../../components/common/VideoModal';

export const ProductionProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);

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
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[#C6A04A] border-t-white animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#101010] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Project Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested film or advertisement could not be found.</p>
        <Link
          to="/production/films"
          className="px-5 py-2.5 rounded bg-[#1B1B1B] hover:bg-[#252525] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Back to Films Archive
        </Link>
      </div>
    );
  }

  const videoUrl = project.video_url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4';

  return (
    <div className="min-h-screen bg-[#101010] text-[#FFFFFF] pt-32 pb-24 px-6 md:px-12 selection:bg-[#C6A04A]/40">
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={project.title}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 mb-8">
          <Link to="/production" className="hover:text-white transition-colors">
            Production
          </Link>
          <ChevronRight size={12} />
          <Link to="/production/films" className="hover:text-white transition-colors">
            Films & Ads
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#D9B96E] font-medium truncate max-w-xs">{project.title}</span>
        </div>

        {/* Title & Logline */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1B1B1B] border border-[#C6A04A]/30 text-xs font-semibold uppercase tracking-wider text-[#D9B96E] mb-4">
            <Film size={13} />
            <span>{project.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            {project.title}
          </h1>

          <p className="text-base md:text-lg text-[#A1A1AA] font-light leading-relaxed max-w-3xl">
            {project.short_description || project.logline}
          </p>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-xl bg-[#1B1B1B] border border-white/5 text-xs mb-12">
          <div>
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Year / Date</span>
            <span className="font-semibold text-white">{project.project_date || project.release_year || '2024'}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Production / Client</span>
            <span className="font-semibold text-white truncate block">{project.client_production || project.client_name || 'Superway Motion Pictures'}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Credits / Role</span>
            <span className="font-semibold text-white truncate block">{project.role || 'Director'}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-1">Deliverable</span>
            <span className="font-semibold text-[#D9B96E] truncate block">{project.deliverables || '4K Theatrical Master'}</span>
          </div>
        </div>

        {/* Interactive Video / Banner Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C6A04A]/30 mb-14 bg-black aspect-video group">
          <img
            src={project.main_image_url || project.banner_image || project.thumbnail_image || project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-20 h-20 rounded-full bg-[#C6A04A] hover:bg-[#D9B96E] text-black flex items-center justify-center shadow-2xl scale-95 group-hover:scale-105 transition-all"
              aria-label="Play video"
            >
              <Play size={30} className="fill-black ml-1.5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 text-xs bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-white flex items-center gap-2">
            <Video size={14} className="text-[#C6A04A]" />
            <span>Click to watch embedded video / trailer</span>
          </div>
        </div>

        {/* Synopsis & Production Notes */}
        <div className="space-y-6 text-sm md:text-base font-light text-[#A1A1AA] leading-relaxed mb-16 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-white pt-4">Synopsis & Directorial Notes</h2>
          <p className="whitespace-pre-line">
            {project.full_description || project.synopsis}
          </p>

          {project.credits && (
            <div className="p-4 rounded-lg bg-[#1B1B1B] border border-white/5 text-xs text-zinc-300">
              <span className="font-bold text-[#D9B96E] uppercase tracking-wider block mb-1">Production Credits</span>
              <p>{project.credits}</p>
            </div>
          )}
        </div>

        {/* Production Stills */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Production Stills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery_images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
                  <img src={img} alt={`${project.title} still ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation & Collaborate */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/production/films"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Films & Commercials</span>
          </Link>

          <Link
            to={`/contact?division=PRODUCTION&service=${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black text-xs uppercase tracking-wider font-semibold rounded-sm shadow-xl shadow-[#C6A04A]/20 hover:scale-105 transition-all"
          >
            <span>Collaborate on Similar Project</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
