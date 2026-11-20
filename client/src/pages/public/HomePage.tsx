import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';
import { api } from '../../services/api';
import { HomepageConfig, Profession, Project, GalleryItem, Award, Profile } from '../../types';
import { HeroSection } from '../../components/public/HeroSection';
import { RolesShowcase } from '../../components/public/RolesShowcase';
import { FeaturedProjects } from '../../components/public/FeaturedProjects';
import { ShowreelBanner } from '../../components/public/ShowreelBanner';
import { GalleryPreview } from '../../components/public/GalleryPreview';
import { AwardsTicker } from '../../components/public/AwardsTicker';
import { VideoModal } from '../../components/common/VideoModal';
import { LightboxModal } from '../../components/common/LightboxModal';

export const HomePage: React.FC = () => {
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig | undefined>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState('');
  const [videoModalTitle, setVideoModalTitle] = useState('');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [home, prof, roles, projs, gal, awds] = await Promise.all([
          api.getHomepage().catch(() => undefined),
          api.getProfile().catch(() => null),
          api.getProfessions().catch(() => []),
          api.getProjects({ featured: true }).catch(() => []),
          api.getGallery().catch(() => []),
          api.getAwards().catch(() => [])
        ]);

        setHomepageConfig(home);
        setProfile(prof);
        setProfessions(roles);
        setProjects(projs);
        setGallery(gal);
        setAwards(awds);
      } catch (err) {
        console.error('Failed to load homepage assets', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenShowreel = (url?: string, title?: string) => {
    setVideoModalUrl(url || homepageConfig?.showreel_url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4');
    setVideoModalTitle(title || 'Arjun Dev · Official Showreel');
    setVideoModalOpen(true);
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A]">
            Loading Cinema Experience...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF]">
      {/* 1. Hero Section */}
      <HeroSection
        config={homepageConfig}
        onOpenShowreel={() => handleOpenShowreel()}
      />

      {/* 2. Editorial Introduction Manifesto */}
      <section id="intro" className="py-24 md:py-32 bg-[#090B0E] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Atmospheric Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-[#11151B]">
                <img
                  src={profile?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'}
                  alt="Arjun Dev Portrait"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm">
                  <div className="text-xs uppercase tracking-widest text-[#C6A66A] font-medium mb-1">
                    Auteur & Performer
                  </div>
                  <div className="text-sm font-serif text-white">
                    Arjun Dev · Based in Mumbai & International
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Statement & Philosophy */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
                  Philosophy & Voice
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F5F3EF] leading-tight tracking-tight">
                  "Cinema is the alchemy of light, silence, and emotional truth."
                </h2>
              </div>

              <div className="relative pl-6 border-l-2 border-[#C6A66A]/40 space-y-4">
                <p className="text-base md:text-lg font-light text-[#A7A9AD] leading-relaxed">
                  {homepageConfig?.about_snippet || profile?.short_bio}
                </p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {profile?.philosophy}
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#090B0E] bg-[#C6A66A] hover:bg-[#DFC38A] transition-all rounded-sm"
                >
                  <span>Read Biography</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/portfolio"
                  className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Professional Roles */}
      <RolesShowcase professions={professions} projects={projects} />

      {/* 4. Featured Projects */}
      <FeaturedProjects
        projects={projects}
        onPlayTrailer={(url, title) => handleOpenShowreel(url, title)}
      />

      {/* 5. Featured Showreel Banner */}
      <ShowreelBanner
        showreelUrl={homepageConfig?.showreel_url}
        onOpen={() => handleOpenShowreel()}
      />

      {/* 6. Selected Stills Gallery Preview */}
      <GalleryPreview
        items={gallery}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* 7. Awards & Honors */}
      <AwardsTicker awards={awards} />

      {/* 8. Call to Action / Collaboration Invitation */}
      <section className="py-24 bg-[#090B0E] relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold">
            Collaborations & Representations
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F5F3EF] leading-tight">
            Let's Shape the Next Compelling Narrative.
          </h2>
          <p className="text-sm md:text-base font-light text-[#A7A9AD] max-w-2xl mx-auto leading-relaxed">
            Currently accepting select feature directing commissions, dramatic screen roles, original screenplays, and poetic lyrical collaborations.
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold text-[#090B0E] bg-[#C6A66A] hover:bg-[#DFC38A] transition-all rounded-sm shadow-xl"
            >
              <span>Initiate An Inquiry</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Universal Modals */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoModalUrl}
        title={videoModalTitle}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={gallery}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};
