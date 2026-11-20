import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface ShowreelBannerProps {
  showreelUrl?: string;
  onOpen: () => void;
}

export const ShowreelBanner: React.FC<ShowreelBannerProps> = ({ onOpen }) => {
  return (
    <section className="py-24 bg-[#07090C] relative border-t border-white/5 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute inset-0 bg-radial-gradient from-[#C6A66A]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative rounded-sm border border-white/10 overflow-hidden bg-black shadow-2xl">
          {/* Background image preview */}
          <div className="relative aspect-[21/9] sm:aspect-[16/8] md:aspect-[21/9] w-full min-h-[340px] md:min-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=2000&auto=format&fit=crop"
              alt="Arjun Dev Showreel 2025"
              className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button
                onClick={onOpen}
                className="group relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(198,166,106,0.4)] mb-6 cursor-pointer"
                aria-label="Play showreel"
              >
                <Play size={32} className="fill-current ml-1" />
                <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-25" />
              </button>

              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-semibold text-[#DFC38A] mb-2">
                <Sparkles size={14} />
                <span>Director & Actor Showreel · 2025</span>
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#F5F3EF] tracking-tight max-w-xl">
                The Architecture of Light and Restraint
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-3 max-w-md">
                A 3-minute journey through feature film direction, dramatic lead portrayals, and poetic visual rhythm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
