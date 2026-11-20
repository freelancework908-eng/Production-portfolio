import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Film, ArrowRight, ShieldCheck, CheckCircle2, Globe, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090C] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 selection:bg-[#7952D9]/30">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 mb-6">
            <span>About Superway</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-cinzel font-bold text-white mb-6">
            Two Creative Divisions. One Relentless Standard.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 font-light leading-relaxed">
            Superway was established on a radical premise: that world-class software engineers and auteur filmmakers should operate under one unified creative roof.
          </p>
        </div>

        {/* Dual Division Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Studio Division */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#10152D] via-[#172B55] to-[#0B1020] border border-[#7952D9]/30 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={20} />
              </span>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#A78BFA] font-bold block">Division 01</span>
                <h2 className="text-2xl font-serif font-bold text-white">Superway Studio</h2>
              </div>
            </div>

            <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
              Our Studio division architects digital identities and software systems for ambitious startups, tech scaleups, and global luxury brands. We believe digital products should possess both architectural rigor and tactile visual elegance.
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#A78BFA]" />
                <span>Brand Identity, Monolithic Typography & Packaging Design</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#A78BFA]" />
                <span>High-Retention UI/UX, Design Systems & Mobile Apps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#A78BFA]" />
                <span>Full-Stack Web Software, SaaS Dashboards & Cloud APIs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#A78BFA]" />
                <span>3D Kinetic Animation, Explainer Videos & Brand Stingers</span>
              </li>
            </ul>

            <Link
              to="/studio"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#A78BFA] hover:text-white transition-colors"
            >
              <span>Explore Studio Division</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Production Division */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#101010] border border-[#C6A04A]/30 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6A04A] to-[#D9B96E] flex items-center justify-center text-black shadow-lg">
                <Film size={20} />
              </span>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#D9B96E] font-bold block">Division 02</span>
                <h2 className="text-2xl font-serif font-bold text-white">Superway Production</h2>
              </div>
            </div>

            <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
              Our Production division produces compelling cinema and high-impact commercial advertisements. Rooted in classical dramatic storytelling and optical anamorphic craftsmanship, we create films that resonate across festivals and global markets.
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#C6A04A]" />
                <span>Independent Feature Films, Documentaries & Web Series</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#C6A04A]" />
                <span>National TV Commercials & Luxury Brand Promos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#C6A04A]" />
                <span>Directorial Leadership, Anamorphic Cinematography & Casting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#C6A04A]" />
                <span>Offline Editing, DaVinci Resolve Grading & Dolby Atmos Sound</span>
              </li>
            </ul>

            <Link
              to="/production"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#D9B96E] hover:text-white transition-colors"
            >
              <span>Explore Production Division</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Global Footprint */}
        <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/5 mb-20 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 mb-3">
            <Globe size={15} />
            <span>Locations & Global Production Network</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">
            Operating Across Three Creative Capitals
          </h3>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Headquartered in Mumbai with active digital engineering nodes in Bengaluru and international co-production partnerships in London and Paris.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="p-5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs uppercase tracking-widest text-[#A78BFA] block mb-1">Hub 01</span>
              <h4 className="text-base font-bold text-white mb-1">Mumbai, India</h4>
              <p className="text-xs text-zinc-400">Principal Film Production Stages, Casting & Narrative Sound</p>
            </div>
            <div className="p-5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs uppercase tracking-widest text-[#7952D9] block mb-1">Hub 02</span>
              <h4 className="text-base font-bold text-white mb-1">Bengaluru, India</h4>
              <p className="text-xs text-zinc-400">Digital Product Engineering, UI/UX Design & Full-Stack Lab</p>
            </div>
            <div className="p-5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs uppercase tracking-widest text-[#D9B96E] block mb-1">Hub 03</span>
              <h4 className="text-base font-bold text-white mb-1">London, UK</h4>
              <p className="text-xs text-zinc-400">European Commercial Representation & Festival Distribution</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center pt-8 border-t border-white/10">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            Partner With Superway
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mb-6">
            Whether your project requires bespoke digital software or cinematic production, our executive team is ready to collaborate.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            <span>Initiate Conversation</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
