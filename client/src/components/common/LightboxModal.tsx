import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, currentIndex, items.length, onNavigate]);

  if (!isOpen || !items[currentIndex]) return null;

  const current = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 md:p-8 bg-black/95 backdrop-blur-lg">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-10 text-white/80">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#C6A66A] font-semibold border border-[#C6A66A]/30 px-2.5 py-1 rounded-sm">
            {current.category}
          </span>
          <span className="text-xs tracking-wider text-zinc-400">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 w-full flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-6 z-20 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full border border-white/10 transition-all backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <img
          src={current.image_url}
          alt={current.title}
          className="max-h-[78vh] max-w-full object-contain select-none shadow-2xl transition-all duration-300"
          loading="eager"
        />

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-6 z-20 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full border border-white/10 transition-all backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Caption & Metadata Footer */}
      <div className="w-full max-w-3xl text-center z-10 bg-black/40 border border-white/5 p-4 rounded-sm backdrop-blur-sm">
        <h4 className="text-lg font-serif text-[#F5F3EF] tracking-wide mb-1">
          {current.title}
        </h4>
        {current.caption && (
          <p className="text-sm text-[#A7A9AD] font-light max-w-2xl mx-auto">
            {current.caption}
          </p>
        )}
        {current.photographer && (
          <p className="text-xs text-[#C6A66A]/80 tracking-widest uppercase mt-2 flex items-center justify-center gap-1.5">
            <Camera size={13} />
            <span>Photography by {current.photographer}</span>
          </p>
        )}
      </div>
    </div>
  );
};
