import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Play,
  ArrowRight,
  Tv,
  Clapperboard,
  Camera,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Video,
  Award,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Project, GalleryItem } from '../../types';
import { VideoModal } from '../../components/common/VideoModal';

export const ProductionHomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryStills, setGalleryStills] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

  useEffect(() => {
    async function loadProductionData() {
      try {
        const [projData, stillsData] = await Promise.all([
          api.getProjects({ division: 'PRODUCTION', status: 'published' }).catch(() => []),
          api.getGallery().catch(() => [])
        ]);
        setProjects(projData);
        setGalleryStills(stillsData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load production homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductionData();
  }, []);

  const featuredFilms = projects.filter(
    (p) => p.category === 'Film Production' || (p.categories && p.categories.includes('Film Production'))
  );

  const shortFilms = projects.filter(
    (p) =>
      p.category === 'Short Films' ||
      (p.categories && p.categories.includes('Short Films')) ||
      (p.title && p.title.toLowerCase().includes('sonata'))
  );

  const commercialAds = projects.filter(
    (p) =>
      p.category === 'Commercial Production' ||
      (p.categories && p.categories.includes('Commercial Production')) ||
      (p.title && (p.title.includes('Chrono') || p.title.includes('Vortex')))
  );

  const productionServicesList = [
    { title: 'Story Development & Scriptwriting', desc: 'Narrative world-building, treatment creation, high-tension screenplays, and character psychology architectures.' },
    { title: 'Film Direction & Auteur Leadership', desc: 'Anamorphic visual framing, meticulous pacing, atmospheric mise-en-scène, and authentic dramatic performances.' },
    { title: 'Commercial & Brand Advertising', desc: 'TV broadcast commercials, digital campaigns, and cinematic product films with high emotional resonance.' },
    { title: 'Cinematography & Camera Operation', desc: 'ARRI and RED cinema ecosystems, custom vintage anamorphic optics, high-speed tracking rigs, and dynamic lighting.' },
    { title: 'Casting & Talent Direction', desc: 'Comprehensive casting calls, screen chemistry tests, dialect coaching, and principal actor rehearsal.' },
    { title: 'Editing & Post-Production Suite', desc: 'Offline narrative rhythm cutting, DaVinci Resolve color grading, surround Dolby sound design, and 4K DCP mastering.' }
  ];

  const openVideo = (url: string, title: string) => {
    setActiveVideo({ url: url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4', title });
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#FFFFFF] selection:bg-[#C6A04A]/40">
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
      />

      {/* SECTION 1: CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-6 md:px-12 overflow-hidden">
        {/* Background Film Backdrop with subtle pan zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
            alt="Cinematic production set"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/70 to-[#101010]/40" />
          <div className="cinematic-radial-glow absolute inset-0 pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1B1B]/80 border border-[#C6A04A]/30 text-xs font-semibold uppercase tracking-[0.25em] text-[#D9B96E] mb-2">
            <Film size={14} className="text-[#C6A04A]" />
            <span>Production Division · Cinema & Commercials</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            Light. Silence. Narrative Truth.
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1AA] font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Independent cinema, high-tension dramatic short films, and tier-one commercial advertisements crafted with uncompromising cinematic vision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={() => openVideo('https://www.youtube.com/watch?v=ScMzIvxBSi4', 'Superway Production · Cinematic Reel')}
              className="inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black font-semibold text-xs uppercase tracking-wider rounded-sm shadow-xl shadow-[#C6A04A]/20 transition-all hover:scale-105"
            >
              <Play size={15} className="fill-black" />
              <span>Watch Showreel</span>
            </button>

            <Link
              to="/production/films"
              className="inline-flex items-center gap-3 px-7 py-4 bg-[#1B1B1B] hover:bg-[#252525] text-white font-semibold text-xs uppercase tracking-wider rounded-sm border border-[#C6A04A]/30 transition-all"
            >
              <span>Explore Films</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED FILMS */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
              Feature Cinema
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Featured Narrative Films
            </h2>
          </div>
          <Link
            to="/production/films"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9B96E] hover:text-white font-semibold"
          >
            <span>All Feature & Short Films</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {(featuredFilms.length > 0 ? featuredFilms : projects).slice(0, 2).map((film) => (
            <div
              key={film.id}
              className="group production-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={film.banner_image || film.cover_image || film.thumbnail_image}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-transparent to-transparent opacity-80" />

                <button
                  onClick={() => openVideo(film.video_url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4', film.title)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm"
                  aria-label={`Play trailer for ${film.title}`}
                >
                  <span className="w-16 h-16 rounded-full bg-[#C6A04A] text-black flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play size={24} className="fill-black ml-1" />
                  </span>
                </button>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-sm bg-black/70 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-[#D9B96E] border border-[#C6A04A]/30">
                  {film.category}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#D9B96E] transition-colors mb-3">
                    {film.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] font-light leading-relaxed mb-6 line-clamp-3">
                    {film.short_description || film.logline || film.synopsis}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#A1A1AA]">{film.project_date || film.release_year} · {film.role || 'Production'}</span>
                  <Link
                    to={`/production/work/${film.slug}`}
                    className="flex items-center gap-1.5 text-[#D9B96E] hover:text-white font-bold tracking-wider uppercase"
                  >
                    <span>View Stills & Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SHORT FILMS */}
      <section className="py-24 px-6 md:px-12 bg-[#171717]/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
                Festival Circuit
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
                Short Films & Narrative Projects
              </h2>
            </div>
            <Link
              to="/production/films"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9B96E] hover:text-white font-semibold"
            >
              <span>Explore Short Film Archive</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(shortFilms.length > 0 ? shortFilms : projects.slice(2, 5)).map((film) => (
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
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D9B96E] transition-colors mb-2 line-clamp-1">
                      {film.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] font-light line-clamp-2 leading-relaxed mb-4">
                      {film.short_description || film.logline}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">{film.project_date || film.release_year}</span>
                    <Link to={`/production/work/${film.slug}`} className="text-[#D9B96E] hover:underline font-medium">
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: COMMERCIAL ADVERTISEMENTS */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
              Commercial Division
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Commercial Advertisements & Brand Films
            </h2>
          </div>
          <Link
            to="/production/ads"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#D9B96E] hover:text-white font-semibold"
          >
            <span>View All Commercial Work</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(commercialAds.length > 0 ? commercialAds : projects.slice(0, 2)).map((ad) => (
            <div
              key={ad.id}
              className="group production-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={ad.banner_image || ad.cover_image || ad.thumbnail_image}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button
                  onClick={() => openVideo(ad.video_url || 'https://www.youtube.com/watch?v=ScMzIvxBSi4', ad.title)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm"
                >
                  <span className="w-14 h-14 rounded-full bg-[#C6A04A] text-black flex items-center justify-center shadow-lg">
                    <Play size={20} className="fill-black ml-0.5" />
                  </span>
                </button>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#D9B96E] border border-[#C6A04A]/30">
                  {ad.category}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D9B96E] transition-colors mb-2">
                    {ad.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed mb-4 line-clamp-2">
                    {ad.short_description || ad.logline}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{ad.client_production || 'Brand Commercial'}</span>
                  <Link to={`/production/work/${ad.slug}`} className="text-[#D9B96E] hover:underline font-bold">
                    Watch & Read Case Study →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: BEHIND THE SCENES */}
      <section className="py-24 px-6 md:px-12 bg-[#151515] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
              On Location
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
              Behind the Scenes
            </h2>
            <p className="text-xs md:text-sm text-[#A1A1AA] font-light">
              Glimpses into our production process, on-set cinematography rigs, and sound stages across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryStills.map((still) => (
              <div key={still.id} className="group relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                <img
                  src={still.image_url}
                  alt={still.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <h4 className="text-sm font-bold text-white">{still.title}</h4>
                  <p className="text-[11px] text-[#D9B96E]">{still.category} · {still.photographer || 'Production Crew'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: ABOUT PRODUCTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
              Filmmaking Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Cinema Born from Discipline and Aesthetic Patience.
            </h2>
            <p className="text-sm text-[#A1A1AA] font-light leading-relaxed mb-6">
              We reject sensory clutter. Our production house approaches every commercial and feature project as an auteur craft: framing through custom optical glass, respecting the silence between words, and sculpting visceral lighting that elevates the story.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-[#1B1B1B] border border-white/5">
                <span className="text-2xl font-serif font-bold text-[#D9B96E] block mb-1">4K/8K</span>
                <span className="text-zinc-400">Anamorphic & Large Format Cinema Capture</span>
              </div>
              <div className="p-4 rounded-lg bg-[#1B1B1B] border border-white/5">
                <span className="text-2xl font-serif font-bold text-[#D9B96E] block mb-1">Dolby Atmos</span>
                <span className="text-zinc-400">Master Sound Mixing & Sonic Architecture</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#C6A04A]/30 relative aspect-4/3 bg-black">
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop"
              alt="Director on set with camera"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs text-zinc-300 italic font-light">
                "Light is not merely illumination—it is the moral weight of the narrative."
              </p>
              <span className="text-[11px] text-[#C6A04A] font-semibold uppercase tracking-wider block mt-1">
                Superway Production Directorial Creed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRODUCTION SERVICES */}
      <section className="py-24 px-6 md:px-12 bg-[#171717]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A04A] font-bold block mb-2">
              Full Spectrum Execution
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
              Production Capabilities
            </h2>
            <p className="text-xs md:text-sm text-[#A1A1AA] font-light">
              From original concept treatments through principal photography and finishing mastering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productionServicesList.map((svc, i) => (
              <div key={i} className="production-card p-7 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-black border border-[#C6A04A]/30 flex items-center justify-center text-[#C6A04A] mb-4">
                  <Clapperboard size={18} />
                </div>
                <h3 className="text-base font-serif font-bold text-white mb-2">{svc.title}</h3>
                <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT / COLLABORATE CTA */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="production-card p-12 md:p-16 rounded-3xl border border-[#C6A04A]/40 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#C6A04A]/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 relative z-10">
            Have a Film or Commercial Campaign to Produce?
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] font-light max-w-xl mx-auto mb-8 relative z-10">
            Let's collaborate on cinematic storytelling that moves audiences and commands respect.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/contact?division=PRODUCTION"
              className="px-8 py-4 rounded-sm bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black font-semibold text-xs uppercase tracking-wider shadow-xl shadow-[#C6A04A]/20 transition-all hover:scale-105"
            >
              Collaborate With Production
            </Link>
            <Link
              to="/production/films"
              className="px-8 py-4 rounded-sm bg-[#1B1B1B] hover:bg-[#252525] text-white font-semibold text-xs uppercase tracking-wider border border-white/10 transition-colors"
            >
              Explore Films Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
