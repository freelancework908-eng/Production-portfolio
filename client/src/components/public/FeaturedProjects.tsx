import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
import { Project } from '../../types';

interface FeaturedProjectsProps {
  projects: Project[];
  onPlayTrailer?: (url: string, title: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, onPlayTrailer }) => {
  return (
    <section className="py-24 bg-[#090B0E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/5 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-2">
              Selected Works
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F3EF] tracking-tight">
              Featured Film & Narrative Projects
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#C6A66A] hover:text-[#DFC38A] transition-colors"
          >
            <span>View Complete Archive</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Projects Showcase - Asymmetrical Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {projects.map((project, index) => {
            const isWide = index === 0;

            return (
              <div
                key={project.id}
                className={`group relative bg-[#11151B] border border-white/5 hover:border-white/20 rounded-sm overflow-hidden transition-all duration-500 flex flex-col ${
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                {/* Media Image Box */}
                <div
                  className={`relative w-full overflow-hidden bg-black ${
                    isWide ? 'h-[420px] md:h-[520px]' : 'h-80 md:h-96'
                  }`}
                >
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.75] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151B] via-transparent to-black/40" />

                  {/* Play trailer button if available */}
                  {project.video_url && onPlayTrailer && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPlayTrailer(project.video_url || '', project.title);
                      }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#C6A66A]/90 hover:bg-[#C6A66A] text-[#090B0E] flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                      aria-label={`Play trailer for ${project.title}`}
                    >
                      <Play size={20} className="fill-current ml-0.5" />
                    </button>
                  )}

                  {/* Year Tag */}
                  <div className="absolute top-5 right-5 text-xs font-cinzel font-semibold tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                    {project.release_year}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] uppercase tracking-widest font-semibold text-[#C6A66A] bg-[#C6A66A]/10 px-2 py-0.5 rounded-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link to={`/projects/${project.slug || project.id}`}>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#F5F3EF] group-hover:text-[#C6A66A] transition-colors mb-2">
                        {project.title}
                      </h3>
                    </Link>

                    {/* Role / Credit */}
                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-3">
                      Role: <span className="text-white">{project.role}</span>
                    </p>

                    {/* Logline */}
                    <p className="text-sm font-light text-[#A7A9AD] line-clamp-2 leading-relaxed mb-6">
                      {project.logline || project.synopsis}
                    </p>
                  </div>

                  {/* Bottom link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 italic">
                      {project.client_production || 'Independent Cinema'}
                    </span>
                    <Link
                      to={`/projects/${project.slug || project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#F5F3EF] group-hover:text-[#C6A66A] font-medium transition-colors"
                    >
                      <span>Project Details</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
