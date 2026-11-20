import React, { useEffect, useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import { api } from '../../services/api';
import { GalleryItem } from '../../types';
import { LightboxModal } from '../../components/common/LightboxModal';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    'All',
    'Portraits',
    'On Set',
    'Behind the Scenes',
    'Events',
    'Professional Moments'
  ];

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const data = await api.getGallery({
          category: selectedCategory === 'All' ? undefined : selectedCategory
        });
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [selectedCategory]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
            Cinematic Imagery
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6">
            Visual Gallery & Archives
          </h1>
          <p className="text-base sm:text-lg text-[#A7A9AD] font-light leading-relaxed">
            Dramatic set photography, candid behind-the-scenes glimpses, editorial character portraits, and festival moments documenting Arjun Dev's career.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 pb-6 border-b border-white/5 flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-sm cursor-pointer ${
                  isActive
                    ? 'bg-[#C6A66A] text-[#090B0E] font-semibold shadow-md'
                    : 'bg-[#11151B] text-[#A7A9AD] hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {cat === 'All' ? 'All Photos' : cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Masonry / Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-4" />
            <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
              Loading Visuals...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-sm p-12 bg-[#11151B]">
            <p className="text-lg font-serif text-zinc-400 mb-2">No photos in this category</p>
            <p className="text-xs text-zinc-500">
              Please choose another tab to view images.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative break-inside-avoid bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/40 rounded-sm overflow-hidden cursor-pointer transition-all duration-500 shadow-lg"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full object-cover filter brightness-[0.85] group-hover:brightness-105 group-hover:scale-102 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="self-end p-2 rounded-full bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
                    <Maximize2 size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-serif text-white tracking-wide leading-snug mb-1">
                      {item.title}
                    </h3>
                    {item.photographer && (
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Camera size={11} className="text-[#C6A66A]" />
                        <span>{item.photographer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={items}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};
