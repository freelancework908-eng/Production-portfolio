import React, { useEffect, useState } from 'react';
import { Award as AwardIcon, Trophy, Sparkles, Star } from 'lucide-react';
import { api } from '../../services/api';
import { Award } from '../../types';

export const AwardsPage: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAwards() {
      try {
        const data = await api.getAwards();
        setAwards(data);
      } catch (err) {
        console.error('Failed to load awards', err);
      } finally {
        setLoading(false);
      }
    }
    loadAwards();
  }, []);

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
            Honors & Recognitions
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6">
            Awards & Laurels
          </h1>
          <p className="text-base sm:text-lg text-[#A7A9AD] font-light leading-relaxed">
            International film festival prizes, dramatic guild honors, and literary recognitions celebrating Arjun Dev's directional, acting, and songwriting contributions.
          </p>
        </div>

        {/* Awards Editorial Timeline / Cards */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-4" />
            <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
              Loading Honors...
            </span>
          </div>
        ) : (
          <div className="space-y-8">
            {awards.map((award, index) => (
              <div
                key={award.id}
                className="p-8 md:p-10 bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/30 rounded-sm transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Laurel & Year */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
                    <div className="w-12 h-12 rounded-full bg-[#C6A66A]/10 border border-[#C6A66A]/30 flex items-center justify-center text-[#C6A66A] mb-3">
                      <Trophy size={22} />
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-cinzel font-bold text-white block">
                        {award.year}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                        {award.category || 'Film & Creative Honor'}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Award Title & Description */}
                  <div className="md:col-span-6 space-y-3">
                    <span className="text-xs uppercase tracking-widest text-[#C6A66A] font-semibold">
                      {award.organization}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F3EF] leading-snug">
                      {award.title}
                    </h3>
                    <p className="text-sm font-light text-[#A7A9AD] leading-relaxed">
                      {award.description}
                    </p>
                  </div>

                  {/* Right Column: Project Associated */}
                  <div className="md:col-span-3 md:pl-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                      Honored Work
                    </span>
                    <span className="text-base font-serif text-white font-medium block">
                      {award.project_name || 'Body of Work'}
                    </span>
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
