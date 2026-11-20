import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowUpRight, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';

export const PortfolioPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Acting',
    'Direction',
    'Story Writing',
    'Screenplay',
    'Lyrics',
    'Other Creative Work'
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await api.getProjects({
          category: selectedCategory === 'All' ? undefined : selectedCategory
        });
        setProjects(data);
      } catch (err) {
        console.error('Failed to load portfolio projects', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query) ||
      (p.logline && p.logline.toLowerCase().includes(query)) ||
      (p.credits && p.credits.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
            Creative Portfolio
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6">
            Film & Literary Works
          </h1>
          <p className="text-base sm:text-lg text-[#A7A9AD] font-light leading-relaxed">
            A comprehensive archive of feature films, dramatic performances, screenplay manuscripts, and lyrical recordings created by Arjun Dev.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-14 pb-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-sm cursor-pointer ${
                    isActive
                      ? 'bg-[#C6A66A] text-[#090B0E] font-semibold shadow-md'
                      : 'bg-[#11151B] text-[#A7A9AD] hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {cat === 'All' ? 'All Projects' : cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects by title or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#11151B] border border-white/10 rounded-sm text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-4" />
            <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
              Loading Catalog...
            </span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-sm p-12 bg-[#11151B]">
            <p className="text-lg font-serif text-zinc-400 mb-2">No projects found</p>
            <p className="text-xs text-zinc-500">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/30 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151B] via-transparent to-black/30" />

                  {/* Year Tag */}
                  <div className="absolute top-4 right-4 text-[11px] font-cinzel font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                    {project.release_year}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {project.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] uppercase tracking-widest font-semibold text-[#C6A66A] bg-[#C6A66A]/10 px-2 py-0.5 rounded-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link to={`/projects/${project.slug || project.id}`}>
                      <h3 className="text-2xl font-serif text-[#F5F3EF] group-hover:text-[#C6A66A] transition-colors mb-2 leading-tight">
                        {project.title}
                      </h3>
                    </Link>

                    {/* Role */}
                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-3">
                      Role: <span className="text-white">{project.role}</span>
                    </p>

                    {/* Short Description */}
                    <p className="text-xs font-light text-[#A7A9AD] line-clamp-3 leading-relaxed mb-6">
                      {project.logline || project.synopsis}
                    </p>
                  </div>

                  {/* Footer link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 italic">
                      {project.client_production || 'Feature Cinema'}
                    </span>
                    <Link
                      to={`/projects/${project.slug || project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#F5F3EF] group-hover:text-[#C6A66A] font-medium transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
