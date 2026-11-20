import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronRight, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const StudioWorkPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';

  const categories = [
    'All',
    'Graphic and Brand Design',
    'UI/UX and Web Design',
    'Web and Software Development',
    'Motion and Digital Creativity'
  ];

  useEffect(() => {
    async function loadWork() {
      try {
        setLoading(true);
        const data = await api.getProjects({
          division: 'STUDIO',
          category: currentCategory !== 'All' ? currentCategory : undefined,
          status: 'published'
        });
        setProjects(data);
      } catch (err) {
        console.error('Failed to load studio work', err);
      } finally {
        setLoading(false);
      }
    }
    loadWork();
  }, [currentCategory]);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 selection:bg-[#7952D9]/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172B55]/60 border border-[#7952D9]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA] mb-4">
            <Sparkles size={14} />
            <span>Studio Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Selected Digital Work & Case Studies
          </h1>
          <p className="text-sm md:text-base text-zinc-300 font-light max-w-2xl leading-relaxed">
            Explore our body of work spanning brand systems, user experience redesigns, production web platforms, and kinetic motion branding.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 pb-8 mb-12 border-b border-white/5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white shadow-md shadow-[#7952D9]/30'
                    : 'bg-[#10152D] hover:bg-[#172B55] text-zinc-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400">Loading portfolio projects...</div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">No studio projects found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/studio/work/${p.slug}`}
                className="group studio-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-video overflow-hidden bg-[#10152D]">
                  <img
                    src={p.thumbnail_image || p.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0B1020]/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA] border border-[#7952D9]/30">
                    {p.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#A78BFA] transition-colors mb-2 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed mb-4">
                      {p.short_description || p.logline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>{p.project_date || p.release_year || '2025'}</span>
                    <span className="flex items-center gap-1 text-[#A78BFA] group-hover:translate-x-1 transition-transform font-medium">
                      <span>View Case Study</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
