import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clapperboard, Video, PenTool, FileText, Music, Mic, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Profession, Project } from '../../types';

export const ProfessionsPage: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfessionsData() {
      try {
        const [profs, projs] = await Promise.all([
          api.getProfessions().catch(() => []),
          api.getProjects().catch(() => [])
        ]);
        setProfessions(profs);
        setProjects(projs);
      } catch (err) {
        console.error('Error loading professions', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfessionsData();
  }, []);

  const mapTitleToCategory = (title: string): string => {
    if (title.toLowerCase().includes('director')) return 'Direction';
    if (title.toLowerCase().includes('actor')) return 'Acting';
    if (title.toLowerCase().includes('story')) return 'Story Writing';
    if (title.toLowerCase().includes('screenplay')) return 'Screenplay';
    if (title.toLowerCase().includes('lyric')) return 'Lyrics';
    return 'All';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B0E] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
            Multi-Faceted Creative Expression
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6">
            Disciplines & Craft Identities
          </h1>
          <p className="text-base sm:text-lg text-[#A7A9AD] font-light leading-relaxed">
            Spanning the core pillars of cinematic storytelling: from initial narrative conception and screenplay architecture to directorial vision, screen performance, and musical lyricism.
          </p>
        </div>

        {/* Deep Dive Profession Cards */}
        <div className="space-y-16">
          {professions.map((prof, index) => {
            const category = mapTitleToCategory(prof.title);
            const matchingProjects = projects.filter(p =>
              Array.isArray(p.categories) &&
              p.categories.some(c => c.toLowerCase() === category.toLowerCase())
            );
            const isReversed = index % 2 === 1;

            return (
              <div
                key={prof.id}
                id={prof.slug}
                className="p-8 md:p-12 bg-[#11151B] border border-white/5 rounded-sm transition-all duration-300 hover:border-[#C6A66A]/30"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Image Column */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-black border border-white/10 shadow-xl group">
                      <img
                        src={prof.image_url}
                        alt={prof.title}
                        className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                        {matchingProjects.length} Works in Archive
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-7 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A66A] font-semibold mb-2">
                        <span>Role #{index + 1}</span>
                        <span>·</span>
                        <span>{prof.tagline || 'Master of Craft'}</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F5F3EF]">
                        {prof.title}
                      </h2>
                    </div>

                    <p className="text-base text-[#A7A9AD] font-light leading-relaxed">
                      {prof.description}
                    </p>

                    {/* Associated Projects preview */}
                    {matchingProjects.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-3 font-medium">
                          Notable Titles in this Role:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {matchingProjects.map((p) => (
                            <Link
                              key={p.id}
                              to={`/projects/${p.slug || p.id}`}
                              className="text-xs text-white/90 bg-white/5 hover:bg-[#C6A66A]/20 hover:text-[#C6A66A] border border-white/10 px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5"
                            >
                              <span>{p.title}</span>
                              <span className="text-zinc-500 font-cinzel">({p.release_year})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center gap-6">
                      <Link
                        to={`/portfolio?category=${encodeURIComponent(category)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#090B0E] bg-[#C6A66A] hover:bg-[#DFC38A] transition-all rounded-sm"
                      >
                        <span>View All {prof.title} Projects</span>
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
