import React from 'react';
import { Link } from 'react-router-dom';
import { Award as AwardIcon, ArrowUpRight } from 'lucide-react';
import { Award } from '../../types';

interface AwardsTickerProps {
  awards: Award[];
}

export const AwardsTicker: React.FC<AwardsTickerProps> = ({ awards }) => {
  const displayAwards = awards.slice(0, 4);

  return (
    <section className="py-20 bg-[#07090C] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-white/5 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-1">
              Honors & Laurels
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-[#F5F3EF] tracking-tight">
              Selected Accolades
            </h2>
          </div>
          <Link
            to="/awards"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C6A66A] hover:text-[#DFC38A] font-medium"
          >
            <span>View All Laurels</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayAwards.map((award) => (
            <div
              key={award.id}
              className="p-6 bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/30 rounded-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-full bg-[#C6A66A]/10 border border-[#C6A66A]/30 flex items-center justify-center text-[#C6A66A]">
                    <AwardIcon size={18} />
                  </div>
                  <span className="text-xs font-cinzel font-semibold text-zinc-400">
                    {award.year}
                  </span>
                </div>

                <h4 className="text-base font-serif text-[#F5F3EF] mb-1.5 leading-snug">
                  {award.title}
                </h4>
                <p className="text-xs text-[#C6A66A] uppercase tracking-wider font-medium mb-3">
                  {award.organization}
                </p>
              </div>

              {award.project_name && (
                <div className="pt-3 border-t border-white/5 text-[11px] text-zinc-400 font-light">
                  Work: <span className="text-zinc-200">{award.project_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
