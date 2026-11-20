import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryPreviewProps {
  items: GalleryItem[];
  onOpenLightbox: (index: number) => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ items, onOpenLightbox }) => {
  const displayItems = items.slice(0, 4);

  return (
    <section className="py-24 bg-[#090B0E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/5 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-2">
              Visual Narrative
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F3EF] tracking-tight">
              Selected Stills & Set Photography
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#C6A66A] hover:text-[#DFC38A] transition-colors"
          >
            <span>Explore Full Gallery</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(idx)}
              className="group relative aspect-[3/4] bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/40 rounded-sm overflow-hidden cursor-pointer transition-all duration-500"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Info */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="self-end p-2 rounded-full bg-black/60 text-white/90 backdrop-blur-sm">
                  <Maximize2 size={14} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-serif text-white tracking-wide leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
