import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Play } from 'lucide-react';
import { HomepageConfig } from '../../types';

interface HeroSectionProps {
  config?: HomepageConfig;
  onOpenShowreel?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onOpenShowreel }) => {
  const bgImage = config?.hero_image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop';
  const headline = config?.hero_title || 'Stories. Visions. Emotions.';
  const subtitle = config?.hero_subtitle || 'Exploring human fragility and grandeur through the lens of independent cinema, dramatic performance, and poetic lyricism.';

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#090B0E]">
      {/* Background Image with Cinematic Pan/Zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Cinematic Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.4] contrast-[1.1] transition-transform duration-1000 ease-out"
        />
        {/* Layered Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/60 to-black/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#090B0E]/40 to-[#090B0E]" />
        <div className="cinematic-radial-glow absolute inset-0 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-20 flex flex-col items-center">
        {/* Identity Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C6A66A]/40 bg-[#090B0E]/70 backdrop-blur-md mb-8 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66A] animate-pulse" />
          <span className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-medium text-[#DFC38A]">
            Filmmaker · Actor · Writer · Lyricist
          </span>
        </div>

        {/* Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6 drop-shadow-md">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light text-[#A7A9AD] leading-relaxed mb-10 text-balance">
          {subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/portfolio"
            className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#090B0E] bg-[#C6A66A] hover:bg-[#DFC38A] transition-all duration-300 rounded-sm shadow-lg hover:shadow-[#C6A66A]/20"
          >
            {config?.hero_cta_primary || 'Explore My Work'}
          </Link>

          {onOpenShowreel && (
            <button
              onClick={onOpenShowreel}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-[#F5F3EF] border border-white/20 hover:border-[#C6A66A] hover:text-[#C6A66A] bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-all duration-300 rounded-sm"
            >
              <Play size={14} className="fill-current" />
              <span>Watch Showreel</span>
            </button>
          )}

          <Link
            to="/contact"
            className="w-full sm:w-auto px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-[#A7A9AD] hover:text-white border border-transparent hover:border-white/10 transition-all rounded-sm"
          >
            {config?.hero_cta_secondary || 'Get In Touch'}
          </Link>
        </div>
      </div>

      {/* Ambient Scroll Indicator */}
      <a
        href="#intro"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-500 hover:text-[#C6A66A] transition-colors"
        aria-label="Scroll down to content"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
          Scroll
        </span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
};
