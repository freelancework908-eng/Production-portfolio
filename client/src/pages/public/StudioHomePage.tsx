import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Palette,
  Layout,
  Code,
  Film,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Cpu,
  Monitor,
  Flame,
  Star
} from 'lucide-react';
import { api } from '../../services/api';
import { Service, Project } from '../../types';

export const StudioHomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudioData() {
      try {
        const [srvData, projData] = await Promise.all([
          api.getServices({ division: 'STUDIO' }).catch(() => []),
          api.getProjects({ division: 'STUDIO', status: 'published' }).catch(() => [])
        ]);
        setServices(srvData);
        setProjects(projData);
      } catch (err) {
        console.error('Failed to load Studio homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudioData();
  }, []);

  const serviceCategories = [
    {
      title: 'Graphic and Brand Design',
      icon: <Palette size={22} className="text-[#A78BFA]" />,
      desc: 'Bespoke wordmarks, tactile packaging systems, brochures, and brand guidelines crafted to set your company apart.',
      items: ['Logo & Brand Identity', 'Packaging & Print Design', 'Marketing Creatives & Social Assets']
    },
    {
      title: 'UI/UX and Web Design',
      icon: <Layout size={22} className="text-[#7952D9]" />,
      desc: 'Intuitive user architectures, accessible design systems, and responsive desktop/mobile landing experiences.',
      items: ['Website UI/UX & Redesign', 'Mobile App Interfaces (iOS/Android)', 'Enterprise Dashboards & Design Systems']
    },
    {
      title: 'Web and Software Development',
      icon: <Code size={22} className="text-[#4263EB]" />,
      desc: 'Clean full-stack engineering, headless e-commerce, custom SaaS platforms, and resilient API architectures.',
      items: ['Dynamic & E-Commerce Web Platforms', 'Custom Web Apps & SaaS Systems', 'Backend & Cloud API Engineering']
    },
    {
      title: 'Motion and Digital Creativity',
      icon: <Film size={22} className="text-[#A78BFA]" />,
      desc: 'High-impact 2D/3D motion graphics, kinetic typography, explainer animations, and dynamic social media reels.',
      items: ['2D Animation & Motion Graphics', 'Logo Reveals & Sonic Ident', 'Product Explainer Videos & Reels']
    }
  ];

  const processSteps = [
    {
      num: '01',
      phase: 'Discover',
      desc: 'Deep-dive into business objectives, audience psychology, competitive landscapes, and technical requirements.'
    },
    {
      num: '02',
      phase: 'Design',
      desc: 'Wireframing, iterative visual design systems, brand guidelines, and interactive high-fidelity Figma prototypes.'
    },
    {
      num: '03',
      phase: 'Develop',
      desc: 'Modern web architectures, clean semantic code, automated testing, API integration, and performance benchmarking.'
    },
    {
      num: '04',
      phase: 'Deliver',
      desc: 'Seamless production deployment, cross-browser validation, SEO audit, analytics setup, and ongoing iteration.'
    }
  ];

  const testimonials = [
    {
      quote: "Superway Studio completely re-engineered our SaaS observability interface. Our conversion jumped 42% in ninety days and client feedback has been universally ecstatic.",
      author: "David Chen",
      role: "CTO · Nexus Telemetry Systems",
      location: "San Francisco"
    },
    {
      quote: "Their brand identity and luxury packaging work for our perfume label won international awards. Pure craftsmanship and relentless attention to detail.",
      author: "Camille Laurent",
      role: "Founder · Botanical Paris",
      location: "Paris"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] selection:bg-[#7952D9]/40">
      {/* SECTION 1: HERO – Creative Digital Solutions */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 md:px-12 overflow-hidden studio-gradient-hero">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#7952D9]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#4263EB]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172B55]/60 border border-[#7952D9]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA] mb-8">
            <Sparkles size={14} />
            <span>Studio Division · Digital Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Creative Design, Branding & Software Engineering.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 font-light max-w-2xl leading-relaxed mb-10">
            We partner with ambitious brands to engineer bespoke visual identities, award-winning UI/UX interfaces, and high-performance full-stack web software.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/studio/work"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white font-semibold text-xs uppercase tracking-wider rounded-sm shadow-lg shadow-[#7952D9]/30 transition-all hover:scale-[1.02]"
            >
              <span>Explore Selected Work</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/studio/services"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#172B55]/50 hover:bg-[#172B55] text-white font-semibold text-xs uppercase tracking-wider rounded-sm border border-[#7952D9]/30 transition-all"
            >
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVICES – Four Main Service Categories */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block mb-2">
              Our Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Four Core Service Divisions
            </h2>
          </div>
          <Link
            to="/studio/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A78BFA] hover:text-white font-semibold"
          >
            <span>Browse Complete Service Catalog</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((cat, idx) => (
            <div
              key={idx}
              className="studio-card p-7 rounded-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#10152D] border border-white/10 flex items-center justify-center mb-6">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-3">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed mb-6 font-light">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                {cat.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-300">
                    <CheckCircle2 size={12} className="text-[#A78BFA] shrink-0" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SELECTED WORK – Dynamic Project Gallery */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block mb-2">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Selected Digital Work
            </h2>
          </div>
          <Link
            to="/studio/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#172B55] hover:bg-[#1f376a] text-white font-semibold text-xs uppercase tracking-wider border border-[#7952D9]/30 transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-zinc-400">Loading studio portfolio...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                to={`/studio/work/${project.slug}`}
                className="group studio-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-video overflow-hidden bg-[#10152D]">
                  <img
                    src={project.thumbnail_image || project.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0B1020]/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#A78BFA] border border-[#7952D9]/30">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#A78BFA] transition-colors mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed mb-4">
                      {project.short_description || project.logline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>{project.project_date || project.release_year || '2025'}</span>
                    <span className="flex items-center gap-1 text-[#A78BFA] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: CAPABILITIES – Design & Development Stack */}
      <section className="py-24 px-6 md:px-12 bg-[#10152D]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block mb-2">
              Modern Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Engineering Built for Speed, Scale & Visual Majesty.
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
              We eliminate technical debt by marrying cutting-edge component systems with resilient cloud backends. Every digital deliverable undergoes rigorous performance profiling and accessibility audits.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-[#172B55] text-[#A78BFA]">
                  <Monitor size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Full-Stack Component Systems</h4>
                  <p className="text-xs text-zinc-400 font-light">React, TypeScript, Tailwind CSS, Next.js, and multi-tenant architectures.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-[#172B55] text-[#A78BFA]">
                  <Cpu size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">High-Concurrency Cloud Backends</h4>
                  <p className="text-xs text-zinc-400 font-light">Node.js, Express, MySQL/TiDB, REST APIs, and instant telemetry streaming.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="studio-card p-8 rounded-2xl border border-[#7952D9]/30">
            <h3 className="text-lg font-serif font-bold text-white mb-4">Our Technology Ecosystem</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {['TypeScript', 'React 19', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL / TiDB', 'Figma', 'Next.js', 'GraphQL', 'Docker', 'After Effects', 'Cinema 4D'].map((tech) => (
                <div key={tech} className="p-3 rounded-lg bg-[#0B1020] border border-white/5 text-center text-zinc-300 hover:text-white hover:border-[#7952D9]/40 transition-colors">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OUR PROCESS – Discover, Design, Develop, Deliver */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block mb-2">
            Methodology
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Our Four-Stage Process
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-light">
            A battle-tested creative framework delivering predictable excellence from discovery to production launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div key={step.num} className="studio-card p-7 rounded-xl border border-white/5 relative">
              <span className="text-4xl font-serif font-bold text-[#7952D9]/30 block mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-serif font-bold text-white mb-2">{step.phase}</h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-24 px-6 md:px-12 bg-[#10152D]/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-bold block mb-2">
              Endorsements
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Trusted by Ambitious Founders & Tech Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="studio-card p-8 rounded-xl border border-white/10 flex flex-col justify-between">
                <p className="text-sm md:text-base text-zinc-200 font-light italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <span className="text-xs text-[#A78BFA] block">{t.role}</span>
                  <span className="text-[11px] text-zinc-500 block">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CONTACT CTA */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="studio-card p-12 md:p-16 rounded-3xl border border-[#7952D9]/40 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#7952D9]/30 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 relative z-10">
            Have a Digital Product or Brand in Mind?
          </h2>
          <p className="text-sm md:text-base text-zinc-300 font-light max-w-xl mx-auto mb-8 relative z-10">
            Let's build something exceptional together. Discuss your scope with our design and engineering leads today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/contact?division=STUDIO"
              className="px-8 py-4 rounded-sm bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#7952D9]/30 transition-all hover:scale-105"
            >
              Start Studio Project
            </Link>
            <Link
              to="/studio/services"
              className="px-8 py-4 rounded-sm bg-[#172B55] hover:bg-[#1f376a] text-white font-semibold text-xs uppercase tracking-wider border border-white/10 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
