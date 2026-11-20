import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Film, ArrowRightLeft } from 'lucide-react';

interface DivisionSwitcherProps {
  variant?: 'floating' | 'inline' | 'compact';
}

export const DivisionSwitcher: React.FC<DivisionSwitcherProps> = ({ variant = 'floating' }) => {
  const { pathname } = useLocation();

  const isStudio = pathname.startsWith('/studio');
  const isProduction = pathname.startsWith('/production');

  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
        <Link
          to="/studio"
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
            isStudio
              ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles size={13} className={isStudio ? 'text-violet-200' : 'text-zinc-400'} />
          <span>STUDIO</span>
        </Link>
        <Link
          to="/production"
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
            isProduction
              ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film size={13} className={isProduction ? 'text-black' : 'text-zinc-400'} />
          <span>PRODUCTION</span>
        </Link>
      </div>
    );
  }

  // Floating Switcher for easy navigation anywhere on the site
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isStudio ? (
        <Link
          to="/production"
          className="group flex items-center gap-3 px-4 py-2.5 bg-[#101010]/95 hover:bg-[#1B1B1B] text-[#D9B96E] rounded-full border border-[#C6A04A]/40 shadow-2xl backdrop-blur-md hover:border-[#C6A04A] hover:scale-105 transition-all duration-300"
          title="Switch to Film & Ad Production division"
        >
          <span className="w-6 h-6 rounded-full bg-[#C6A04A]/20 flex items-center justify-center text-[#C6A04A] group-hover:rotate-180 transition-transform duration-500">
            <ArrowRightLeft size={13} />
          </span>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block leading-none">
              Explore Division
            </span>
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] group-hover:text-[#D9B96E] transition-colors">
              Go to PRODUCTION
            </span>
          </div>
          <Film size={15} className="text-[#C6A04A]" />
        </Link>
      ) : isProduction ? (
        <Link
          to="/studio"
          className="group flex items-center gap-3 px-4 py-2.5 bg-[#10152D]/95 hover:bg-[#172B55] text-[#A78BFA] rounded-full border border-[#7952D9]/40 shadow-2xl backdrop-blur-md hover:border-[#A78BFA] hover:scale-105 transition-all duration-300"
          title="Switch to Creative Design & Software Studio"
        >
          <span className="w-6 h-6 rounded-full bg-[#7952D9]/30 flex items-center justify-center text-[#A78BFA] group-hover:rotate-180 transition-transform duration-500">
            <ArrowRightLeft size={13} />
          </span>
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block leading-none">
              Explore Division
            </span>
            <span className="text-xs font-bold tracking-wider text-[#FFFFFF] group-hover:text-[#A78BFA] transition-colors">
              Go to STUDIO
            </span>
          </div>
          <Sparkles size={15} className="text-[#7952D9]" />
        </Link>
      ) : (
        <div className="flex items-center gap-2 p-1.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
          <Link
            to="/studio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-violet-300 hover:bg-[#7952D9]/20 transition-colors"
          >
            <Sparkles size={12} />
            <span>Studio</span>
          </Link>
          <span className="text-zinc-600 text-xs">|</span>
          <Link
            to="/production"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 hover:bg-[#C6A04A]/20 transition-colors"
          >
            <Film size={12} />
            <span>Production</span>
          </Link>
        </div>
      )}
    </div>
  );
};
