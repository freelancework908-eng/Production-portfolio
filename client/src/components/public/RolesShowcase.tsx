import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clapperboard, Video, PenTool, FileText, Music, Mic } from 'lucide-react';
import { Profession, Project } from '../../types';

interface RolesShowcaseProps {
  professions: Profession[];
  projects: Project[];
}

// Icon helper per profession slug
const getRoleIcon = (slug: string) => {
  switch (slug) {
    case 'director':
      return <Video size={18} className="text-[#C6A66A]" />;
    case 'actor':
      return <Clapperboard size={18} className="text-[#C6A66A]" />;
    case 'story-writer':
      return <PenTool size={18} className="text-[#C6A66A]" />;
    case 'screenplay-writer':
      return <FileText size={18} className="text-[#C6A66A]" />;
    case 'lyricist':
      return <Music size={18} className="text-[#C6A66A]" />;
    case 'media-personality':
      return <Mic size={18} className="text-[#C6A66A]" />;
    default:
      return <Video size={18} className="text-[#C6A66A]" />;
  }
};

// Map profession title to project category filter
const mapTitleToCategory = (title: string): string => {
  if (title.toLowerCase().includes('director')) return 'Direction';
  if (title.toLowerCase().includes('actor')) return 'Acting';
  if (title.toLowerCase().includes('story')) return 'Story Writing';
  if (title.toLowerCase().includes('screenplay')) return 'Screenplay';
  if (title.toLowerCase().includes('lyric')) return 'Lyrics';
  return 'All';
};

export const RolesShowcase: React.FC<RolesShowcaseProps> = ({ professions, projects }) => {
  return (
    <section className="py-24 bg-[#090B0E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/5 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-2">
              Multi-Disciplinary Craft
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F3EF] tracking-tight">
              Disciplines & Creative Roles
            </h2>
          </div>
          <p className="text-sm font-light text-[#A7A9AD] max-w-md">
            Seamlessly bridging auteur film direction, intense dramatic performances, literature, and poetic lyrics.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professions.map((prof) => {
            const category = mapTitleToCategory(prof.title);
            const relatedCount = projects.filter(p => 
              Array.isArray(p.categories) && 
              p.categories.some(c => c.toLowerCase() === category.toLowerCase())
            ).length;

            return (
              <div
                key={prof.id}
                className="group relative bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/40 rounded-sm overflow-hidden transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image Aspect Box */}
                <div className="relative h-64 w-full overflow-hidden bg-black">
                  <img
                    src={prof.image_url}
                    alt={prof.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.7] group-hover:brightness-90 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151B] via-transparent to-black/30" />

                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-sm bg-[#090B0E]/80 backdrop-blur-md border border-white/10">
                    {getRoleIcon(prof.slug)}
                  </div>

                  {/* Project count pill */}
                  <div className="absolute top-4 right-4 text-[11px] uppercase tracking-wider font-medium text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                    {relatedCount > 0 ? `${relatedCount} Projects` : 'Active Craft'}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif text-[#F5F3EF] group-hover:text-[#C6A66A] transition-colors mb-2">
                      {prof.title}
                    </h3>
                    {prof.tagline && (
                      <p className="text-xs uppercase tracking-wider text-[#C6A66A]/80 font-medium mb-3">
                        {prof.tagline}
                      </p>
                    )}
                    <p className="text-sm font-light text-[#A7A9AD] line-clamp-3 leading-relaxed mb-6">
                      {prof.description}
                    </p>
                  </div>

                  {/* Footer link to portfolio */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/portfolio?category=${encodeURIComponent(category)}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#F5F3EF] group-hover:text-[#C6A66A] font-medium transition-colors"
                    >
                      <span>Explore {prof.title} Work</span>
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
