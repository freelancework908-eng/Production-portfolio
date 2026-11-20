import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Film, ArrowRight, Layers, Clapperboard, CheckCircle2, ChevronRight, Mail } from 'lucide-react';

export const MainHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090C] text-white flex flex-col justify-between selection:bg-[#7952D9]/30">
      {/* Top Hero Brand Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>One Company · Two Creative Divisions</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-cinzel font-bold tracking-tight text-white mb-6 leading-tight">
          SUPERWAY
        </h1>

        <p className="text-base md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed mb-8">
          An integrated creative powerhouse unifying high-performance digital software engineering and auteur cinematic film production.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
          <Link
            to="/about"
            className="px-5 py-2.5 rounded-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
          >
            About Our Company
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white hover:bg-zinc-200 text-black transition-colors"
          >
            <Mail size={14} />
            <span>Contact Both Divisions</span>
          </Link>
        </div>
      </section>

      {/* Main Dual Division Split Screen / 2-Column Section */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* DIVISION 1: STUDIO (Blue & Purple Gradient) */}
          <div className="group relative rounded-2xl overflow-hidden p-8 md:p-12 flex flex-col justify-between border border-[#7952D9]/30 bg-gradient-to-br from-[#10152D] via-[#172B55] to-[#0B1020] hover:border-[#A78BFA]/60 shadow-2xl transition-all duration-500 min-h-[520px]">
            {/* Ambient Gradient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7952D9]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#7952D9]/30 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4263EB]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge & Division Icon */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-white shadow-lg shadow-[#7952D9]/40">
                  <Sparkles size={20} />
                </span>
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block">
                    DIVISION 01
                  </span>
                  <span className="text-sm font-semibold text-white tracking-wider">
                    Creative Digital Studio
                  </span>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-[#7952D9]/20 border border-[#7952D9]/40 text-[#A78BFA] font-mono">
                /studio
              </span>
            </div>

            {/* Main Visual & Content */}
            <div className="relative z-10 my-auto py-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 group-hover:text-violet-100 transition-colors">
                Design Systems, Branding & Software Engineering
              </h2>
              <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed mb-6">
                End-to-end digital solutions spanning modern brand identities, high-conversion UI/UX design, bespoke web applications, SaaS dashboards, and 3D motion graphics.
              </p>

              {/* Four Core Categories preview */}
              <div className="grid grid-cols-2 gap-2.5 mb-8 text-xs text-zinc-300">
                <div className="flex items-center gap-2 bg-[#10152D]/80 p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#A78BFA]" />
                  <span>Brand & Graphic Design</span>
                </div>
                <div className="flex items-center gap-2 bg-[#10152D]/80 p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#A78BFA]" />
                  <span>UI/UX & Web Design</span>
                </div>
                <div className="flex items-center gap-2 bg-[#10152D]/80 p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#A78BFA]" />
                  <span>Web & Software Dev</span>
                </div>
                <div className="flex items-center gap-2 bg-[#10152D]/80 p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#A78BFA]" />
                  <span>Motion & Animation</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/studio"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-sm bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#7952D9]/30 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Studio</span>
                <ArrowRight size={15} />
              </Link>

              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <Link to="/studio/services" className="hover:text-[#A78BFA] transition-colors">
                  Services
                </Link>
                <span>•</span>
                <Link to="/studio/work" className="hover:text-[#A78BFA] transition-colors">
                  Portfolio
                </Link>
              </div>
            </div>
          </div>

          {/* DIVISION 2: PRODUCTION (Cinematic Dark & Gold) */}
          <div className="group relative rounded-2xl overflow-hidden p-8 md:p-12 flex flex-col justify-between border border-[#C6A04A]/30 bg-[#101010] hover:border-[#D9B96E]/60 shadow-2xl transition-all duration-500 min-h-[520px]">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A04A]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C6A04A]/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9B96E]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge & Division Icon */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6A04A] to-[#D9B96E] flex items-center justify-center text-black shadow-lg shadow-[#C6A04A]/20">
                  <Film size={20} />
                </span>
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D9B96E] font-bold block">
                    DIVISION 02
                  </span>
                  <span className="text-sm font-semibold text-white tracking-wider">
                    Film & Video Production
                  </span>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-[#C6A04A]/15 border border-[#C6A04A]/30 text-[#D9B96E] font-mono">
                /production
              </span>
            </div>

            {/* Main Visual & Content */}
            <div className="relative z-10 my-auto py-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 group-hover:text-amber-100 transition-colors">
                Cinematic Films, Commercials & Visual Storytelling
              </h2>
              <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed mb-6">
                Auteur filmmaking house specializing in narrative short films, theatrical feature projects, broadcast television commercials, and complete post-production color grading.
              </p>

              {/* Four Production Categories preview */}
              <div className="grid grid-cols-2 gap-2.5 mb-8 text-xs text-zinc-300">
                <div className="flex items-center gap-2 bg-[#1B1B1B] p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#C6A04A]" />
                  <span>Feature & Short Films</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1B1B1B] p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#C6A04A]" />
                  <span>Commercial Advertisements</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1B1B1B] p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#C6A04A]" />
                  <span>Creative Music Videos</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1B1B1B] p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-[#C6A04A]" />
                  <span>Directorial & Post-Production</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/production"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-sm bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#C6A04A]/20 group-hover:translate-x-1 transition-all"
              >
                <span>Explore Production</span>
                <ArrowRight size={15} />
              </Link>

              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <Link to="/production/films" className="hover:text-[#D9B96E] transition-colors">
                  Films
                </Link>
                <span>•</span>
                <Link to="/production/ads" className="hover:text-[#D9B96E] transition-colors">
                  Commercials
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Division Switcher Banner */}
        <div className="mt-12 p-6 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Looking to commission both digital engineering and commercial film?
              </h3>
              <p className="text-xs text-zinc-400 font-light">
                Our unified team handles end-to-end brand identity, web software deployment, and commercial film campaigns.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-sm bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Start Combined Project
          </Link>
        </div>
      </section>
    </div>
  );
};
