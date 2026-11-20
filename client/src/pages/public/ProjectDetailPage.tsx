import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, User, Film, Tag, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';
import { VideoModal } from '../../components/common/VideoModal';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProjectById(id);
        setProject(data);

        // Fetch related projects in same category
        if (data.categories && data.categories.length > 0) {
          const allInCategory = await api.getProjects({ category: data.categories[0] });
          setRelatedProjects(allInCategory.filter(p => p.id !== data.id).slice(0, 3));
        }
      } catch (err) {
        console.error('Project not found', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B0E] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#090B0E] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif mb-4">Project Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">
          The requested project could not be found or has been moved.
        </p>
        <Link
          to="/portfolio"
          className="px-6 py-2.5 bg-[#C6A66A] text-black text-xs uppercase tracking-widest font-semibold rounded-sm"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] min-h-screen pb-24">
      {/* Immersive Cinematic Hero Header */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden">
        <img
          src={project.banner_image || project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/60 to-black/80" />

        {/* Top Back Button */}
        <div className="absolute top-28 left-6 md:left-12 z-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-sm text-xs uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Works</span>
          </button>
        </div>

        {/* Hero Title and Meta Overlay */}
        <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 z-20 max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.categories.map((c) => (
              <span
                key={c}
                className="text-[11px] uppercase tracking-widest font-semibold text-[#DFC38A] bg-[#C6A66A]/20 px-3 py-1 rounded-sm border border-[#C6A66A]/30"
              >
                {c}
              </span>
            ))}
            <span className="text-xs font-cinzel text-zinc-400 ml-2">
              Year of Release: {project.release_year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F5F3EF] tracking-tight leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light max-w-3xl leading-relaxed">
            {project.logline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 bg-[#11151B] border border-white/5 rounded-sm mb-16">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Role & Responsibility
            </span>
            <span className="text-sm font-serif text-white font-medium">
              {project.role}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Release Year
            </span>
            <span className="text-sm font-serif text-white font-medium">
              {project.release_year}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Production / Client
            </span>
            <span className="text-sm font-serif text-white font-medium">
              {project.client_production || 'Studio Aurora'}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Credits & Cast
            </span>
            <span className="text-sm font-serif text-white font-medium truncate block" title={project.credits}>
              {project.credits || 'Feature Celluloid'}
            </span>
          </div>
        </div>

        {/* Synopsis & Video Trailer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Synopsis */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F3EF]">
              Narrative Synopsis & Background
            </h2>
            <div className="prose prose-invert max-w-none text-zinc-300 font-light text-base leading-relaxed space-y-4">
              <p>{project.synopsis}</p>
            </div>

            {project.credits && (
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs uppercase tracking-widest text-[#C6A66A] font-semibold mb-2">
                  Key Production Credits
                </h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {project.credits}
                </p>
              </div>
            )}
          </div>

          {/* Video / Trailer Box */}
          <div className="lg:col-span-5">
            {project.video_url ? (
              <div className="relative rounded-sm overflow-hidden border border-white/10 bg-black shadow-2xl group">
                <div className="relative aspect-video w-full">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover filter brightness-[0.6] group-hover:brightness-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#C6A66A] text-[#090B0E] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Play project trailer"
                  >
                    <Play size={22} className="fill-current ml-1" />
                  </button>
                </div>
                <div className="p-4 bg-[#11151B]">
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold block mb-1">
                    Featured Media
                  </span>
                  <h4 className="text-sm font-serif text-white">
                    Watch Official Festival Trailer
                  </h4>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm text-center">
                <Film size={28} className="mx-auto text-zinc-500 mb-3" />
                <h4 className="text-sm font-serif text-white mb-1">Theatrical Screening Exclusive</h4>
                <p className="text-xs text-zinc-400">
                  Trailer available upon formal distributor request.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Stills */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="border-t border-white/5 pt-16 mb-20">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F3EF] mb-8">
              Production Stills & Cinematography
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery_images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] bg-[#11151B] border border-white/5 rounded-sm overflow-hidden group"
                >
                  <img
                    src={img}
                    alt={`${project.title} still ${i + 1}`}
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-white/5 pt-16">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F3EF] mb-8">
              Related Projects in {project.categories[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/projects/${rp.slug || rp.id}`}
                  className="group block bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/30 rounded-sm overflow-hidden transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={rp.cover_image}
                      alt={rp.title}
                      className="w-full h-full object-cover filter brightness-75 group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold block mb-1">
                      {rp.release_year} · {rp.role}
                    </span>
                    <h4 className="text-lg font-serif text-white group-hover:text-[#C6A66A] transition-colors">
                      {rp.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {project.video_url && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={project.video_url}
          title={`${project.title} - Official Video Preview`}
        />
      )}
    </div>
  );
};
