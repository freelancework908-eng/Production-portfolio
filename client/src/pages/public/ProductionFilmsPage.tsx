import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Film, Play, ArrowRight, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';
import { VideoModal } from '../../components/common/VideoModal';

export const ProductionFilmsPage: React.FC = () => {
  const [films, setFilms] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';

  // Video Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

  const categories = [
    'All',
    'Feature Films',
    'Short Films',
    'Independent Films',
    'Film Production'
  ];

  useEffect(() => {
    async function loadFilms() {
      try {
        setLoading(true);
        const data = await api.getProjects({
          division: 'PRODUCTION',
          category: currentCategory !== 'All' ? currentCategory : undefined,
          status: 'published'
        });
        // Filter out purely commercial ads if 'All' is selected, to showcase narrative cinema
        const filtered = currentCategory === 'All' 
          ? data.filter(p => p.category !== 'Commercial Production' && !(p.categories && p.categories.includes('TV Advertisements')))
          : data;
        setFilms(filtered);
      } catch (err) {
        console.error('Failed to load films', err);
      } finally {
        setLoading(false);
      }
    }
    loadFilms();
  }, [currentCategory]);

  const openVideo = (url: string, title: string) => {
    setActiveVideo({ url: url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4', title });
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#FFFFFF] pt-32 pb-24 px-6 md:px-12 selection:bg-[#C6A04A]/40">
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1B1B] border border-[#C6A04A]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9B96E] mb-4">
            <Film size={14} />
            <span>Narrative Cinema</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Films, Short Cinema & Festival Laurels
          </h1>
          <p className="text-sm md:text-base text-[#A1A1AA] font-light max-w-2xl leading-relaxed">
            A curated filmography of independent feature cinema, psychological thrillers, and award-winning short films premiering at regional and international festivals.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2.5 pb-8 mb-12 border-b border-white/5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black shadow-md shadow-[#C6A04A]/20'
                    : 'bg-[#1B1B1B] hover:bg-[#252525] text-zinc-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Film Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400">Loading cinematic filmography...</div>
        ) : films.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">No films found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {films.map((film) => (
              <div
                key={film.id}
                className="group production-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={film.thumbnail_image || film.cover_image}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button
                    onClick={() => openVideo(film.video_url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4', film.title)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm"
                  >
                    <span className="w-12 h-12 rounded-full bg-[#C6A04A] text-black flex items-center justify-center shadow-lg">
                      <Play size={18} className="fill-black ml-0.5" />
                    </span>
                  </button>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-[#D9B96E] border border-[#C6A04A]/30">
                    {film.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D9B96E] transition-colors mb-2 line-clamp-1">
                      {film.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] font-light line-clamp-2 leading-relaxed mb-4">
                      {film.short_description || film.logline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">{film.project_date || film.release_year}</span>
                    <Link
                      to={`/production/work/${film.slug}`}
                      className="flex items-center gap-1 text-[#D9B96E] hover:text-white font-semibold transition-colors"
                    >
                      <span>Film Details</span>
                      <ChevronRight size={13} />
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
