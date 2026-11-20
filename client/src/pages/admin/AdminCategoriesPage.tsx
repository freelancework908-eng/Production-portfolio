import React, { useEffect, useState } from 'react';
import { Layers, Sparkles, Film, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Service, Project } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [srvs, projs] = await Promise.all([
          api.getServices({ all: true }),
          api.getAllProjectsAdmin()
        ]);
        setServices(srvs);
        setProjects(projs);
      } catch (err) {
        console.error('Failed to load categories data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const studioCategories = [
    {
      name: 'Graphic and Brand Design',
      desc: 'Logo Design, Brand Identity, Business Cards, Posters, Packaging Design',
      subcategories: ['Logo Design', 'Brand Identity', 'Packaging Design', 'Posters & Flyers', 'Social Media Creatives']
    },
    {
      name: 'UI/UX and Web Design',
      desc: 'Website UI/UX, Landing Page Design, Mobile App UI, Dashboard Design',
      subcategories: ['Website UI/UX', 'Mobile App Interfaces', 'Dashboard Design', 'E-commerce UI Design']
    },
    {
      name: 'Web and Software Development',
      desc: 'Dynamic Websites, Web Apps, SaaS Platforms, Admin Dashboards, APIs',
      subcategories: ['Static & Dynamic Websites', 'E-commerce Platforms', 'Custom Web Applications', 'API & Cloud Backend']
    },
    {
      name: 'Motion and Digital Creativity',
      desc: '2D Animation, Motion Graphics, Logo Animation, Explainer Videos, Reels',
      subcategories: ['2D Animation', 'Motion Graphics', 'Logo Ident Animation', 'Social Media Reels']
    }
  ];

  const productionCategories = [
    {
      name: 'Film Production',
      desc: 'Short Films, Feature Films, Independent Films, Documentaries, Web Series',
      subcategories: ['Short Films', 'Feature Films', 'Independent Cinema', 'Documentaries']
    },
    {
      name: 'Commercial Production',
      desc: 'TV Advertisements, Digital Advertisements, Brand Promotional Films, Product Commercials',
      subcategories: ['TV Commercials', 'Digital Brand Ads', 'Product Cinematics', 'Corporate Videos']
    },
    {
      name: 'Creative Video Production',
      desc: 'Music Videos, Artist Promotional Videos, Event Films, Social Media Campaigns',
      subcategories: ['Music Videos', 'Artist Promos', 'Live Event Cinematics', 'Social Campaigns']
    },
    {
      name: 'Production Services',
      desc: 'Story Development, Scriptwriting, Direction, Cinematography, Casting, Editing',
      subcategories: ['Scriptwriting', 'Film Direction', 'Cinematography', 'Color & Sound Post']
    }
  ];

  if (loading) {
    return <div className="py-24 text-center text-zinc-500">Loading categories...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
          Taxonomy & Structure
        </span>
        <h1 className="text-3xl font-serif text-white">Categories Management</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review the classification taxonomies across both Studio and Production divisions.
        </p>
      </div>

      {/* Studio Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#A78BFA]" />
          <h2 className="text-lg font-serif font-bold text-white">STUDIO Service Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studioCategories.map((cat) => {
            const catServices = services.filter(
              (s) => s.category?.toLowerCase() === cat.name.toLowerCase()
            );
            const catProjects = projects.filter(
              (p) =>
                (p.division || '').toUpperCase() === 'STUDIO' &&
                (p.category?.toLowerCase() === cat.name.toLowerCase() ||
                  (p.categories && p.categories.some((c) => c.toLowerCase() === cat.name.toLowerCase())))
            );

            return (
              <div key={cat.name} className="p-6 rounded-xl bg-[#10152D]/60 border border-[#7952D9]/30 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-serif font-bold text-white">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7952D9]/20 text-[#A78BFA]">
                      {catServices.length} Services
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4263EB]/20 text-blue-300">
                      {catProjects.length} Projects
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">{cat.desc}</p>

                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-2.5 py-1 rounded bg-black/40 text-zinc-400 border border-white/5"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Categories Grid */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-[#D9B96E]" />
          <h2 className="text-lg font-serif font-bold text-white">PRODUCTION Project Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productionCategories.map((cat) => {
            const catProjects = projects.filter(
              (p) =>
                (p.division || 'PRODUCTION').toUpperCase() === 'PRODUCTION' &&
                (p.category?.toLowerCase() === cat.name.toLowerCase() ||
                  (p.categories && p.categories.some((c) => c.toLowerCase() === cat.name.toLowerCase())))
            );

            return (
              <div key={cat.name} className="p-6 rounded-xl bg-[#171717] border border-[#C6A04A]/30 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-serif font-bold text-white">{cat.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C6A04A]/20 text-[#D9B96E]">
                    {catProjects.length} Projects
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">{cat.desc}</p>

                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-2.5 py-1 rounded bg-black/40 text-zinc-400 border border-white/5"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
