import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Layout,
  Code,
  Film,
  Package,
  Megaphone,
  Smartphone,
  Layers,
  Globe,
  Server,
  Video,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { Service } from '../../types';

export const StudioServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';

  const categories = [
    'All',
    'Graphic and Brand Design',
    'UI/UX and Web Design',
    'Web and Software Development',
    'Motion and Digital Creativity'
  ];

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const data = await api.getServices({
          division: 'STUDIO',
          category: currentCategory !== 'All' ? currentCategory : undefined
        });
        setServices(data);
      } catch (err) {
        console.error('Failed to load studio services', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [currentCategory]);

  const getServiceIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'palette': return <Palette size={22} className="text-[#A78BFA]" />;
      case 'package': return <Package size={22} className="text-[#A78BFA]" />;
      case 'megaphone': return <Megaphone size={22} className="text-[#A78BFA]" />;
      case 'layout': return <Layout size={22} className="text-[#7952D9]" />;
      case 'smartphone': return <Smartphone size={22} className="text-[#7952D9]" />;
      case 'layers': return <Layers size={22} className="text-[#7952D9]" />;
      case 'globe': return <Globe size={22} className="text-[#4263EB]" />;
      case 'code': return <Code size={22} className="text-[#4263EB]" />;
      case 'server': return <Server size={22} className="text-[#4263EB]" />;
      case 'film': return <Film size={22} className="text-[#A78BFA]" />;
      case 'sparkles': return <Sparkles size={22} className="text-[#A78BFA]" />;
      case 'video': return <Video size={22} className="text-[#A78BFA]" />;
      default: return <Sparkles size={22} className="text-[#7952D9]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 selection:bg-[#7952D9]/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172B55]/60 border border-[#7952D9]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA] mb-4">
            <Sparkles size={14} />
            <span>Studio Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Digital Engineering & Creative Capabilities
          </h1>
          <p className="text-sm md:text-base text-zinc-300 font-light max-w-2xl leading-relaxed">
            From initial brand strategy and high-fidelity UI design to scalable enterprise software and motion animation, discover how our Studio division can accelerate your brand.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 pb-8 mb-12 border-b border-white/5">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white shadow-md shadow-[#7952D9]/30'
                    : 'bg-[#10152D] hover:bg-[#172B55] text-zinc-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Service Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">No services found for this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="studio-card p-8 rounded-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#10152D] border border-[#7952D9]/20 flex items-center justify-center">
                      {getServiceIcon(service.icon)}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#172B55] text-[#A78BFA] border border-[#7952D9]/30">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white mb-3">
                    {service.name}
                  </h3>

                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Available Immediately</span>
                  <Link
                    to={`/contact?division=STUDIO&service=${encodeURIComponent(service.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#A78BFA] hover:text-white transition-colors"
                  >
                    <span>Request Service</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 p-10 rounded-2xl bg-gradient-to-r from-[#10152D] to-[#172B55] border border-[#7952D9]/30 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
            Looking for a Custom Package or Enterprise Scope?
          </h2>
          <p className="text-xs md:text-sm text-zinc-300 font-light max-w-xl mx-auto mb-6">
            We regularly architect cross-functional retainers combining brand identity, web application development, and ongoing motion design.
          </p>
          <Link
            to="/contact?division=STUDIO"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white font-semibold text-xs uppercase tracking-wider rounded-sm shadow-lg shadow-[#7952D9]/30 hover:scale-105 transition-all"
          >
            <span>Inquire About Custom Engagements</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
