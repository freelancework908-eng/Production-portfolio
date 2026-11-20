import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Film, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  const isStudio = pathname.startsWith('/studio');
  const isProduction = pathname.startsWith('/production');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Determine navigation items according to current context
  let navLinks: { label: string; path: string }[] = [];
  if (isStudio) {
    navLinks = [
      { label: 'Overview', path: '/studio' },
      { label: 'Services', path: '/studio/services' },
      { label: 'Work', path: '/studio/work' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ];
  } else if (isProduction) {
    navLinks = [
      { label: 'Overview', path: '/production' },
      { label: 'Films', path: '/production/films' },
      { label: 'Commercials', path: '/production/ads' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ];
  } else {
    navLinks = [
      { label: 'Home', path: '/' },
      { label: 'Studio Division', path: '/studio' },
      { label: 'Production Division', path: '/production' },
      { label: 'About Company', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ];
  }

  // Theme styling based on active division
  const headerBgClass = isScrolled
    ? isStudio
      ? 'bg-[#0B1020]/95 border-b border-[#7952D9]/20 backdrop-blur-md py-4'
      : isProduction
      ? 'bg-[#101010]/95 border-b border-[#C6A04A]/20 backdrop-blur-md py-4'
      : 'bg-[#090B0E]/95 border-b border-white/10 backdrop-blur-md py-4'
    : 'bg-transparent py-6';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-3">
            {isStudio ? (
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#7952D9]/30">
                  <Sparkles size={16} />
                </span>
                <div>
                  <span className="font-cinzel text-base md:text-lg font-bold tracking-wider text-white block leading-none">
                    SUPERWAY STUDIO
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A78BFA] font-medium block mt-1">
                    Design & Digital Solutions
                  </span>
                </div>
              </div>
            ) : isProduction ? (
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C6A04A] to-[#D9B96E] flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-[#C6A04A]/20">
                  <Film size={16} />
                </span>
                <div>
                  <span className="font-cinzel text-base md:text-lg font-bold tracking-wider text-white block leading-none">
                    SUPERWAY PRODUCTION
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D9B96E] font-medium block mt-1">
                    Film & Commercials
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-white font-cinzel font-bold text-xs">
                  SW
                </span>
                <div>
                  <span className="font-cinzel text-base md:text-lg font-bold tracking-wider text-white block leading-none">
                    SUPERWAY
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-medium block mt-1">
                    Studio & Production
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.18em] font-medium text-zinc-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const activeColorClass = isStudio
              ? 'text-[#A78BFA] font-semibold'
              : isProduction
              ? 'text-[#D9B96E] font-semibold'
              : 'text-white font-semibold';
            const underlineColorClass = isStudio
              ? 'bg-[#7952D9]'
              : isProduction
              ? 'bg-[#C6A04A]'
              : 'bg-white';

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 transition-colors hover:text-white ${isActive ? activeColorClass : ''}`}
              >
                {link.label}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] ${underlineColorClass}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Switcher & CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isStudio && (
            <Link
              to="/production"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#D9B96E] bg-[#101010] border border-[#C6A04A]/40 hover:border-[#C6A04A] transition-all"
            >
              <Film size={12} className="text-[#C6A04A]" />
              <span>Production</span>
              <ArrowRight size={12} />
            </Link>
          )}

          {isProduction && (
            <Link
              to="/studio"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#A78BFA] bg-[#10152D] border border-[#7952D9]/40 hover:border-[#A78BFA] transition-all"
            >
              <Sparkles size={12} className="text-[#A78BFA]" />
              <span>Studio</span>
              <ArrowRight size={12} />
            </Link>
          )}

          {!isStudio && !isProduction && (
            <div className="flex items-center gap-2">
              <Link
                to="/studio"
                className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#A78BFA] border border-[#7952D9]/40 hover:bg-[#7952D9]/20 transition-all"
              >
                Studio
              </Link>
              <Link
                to="/production"
                className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#D9B96E] border border-[#C6A04A]/40 hover:bg-[#C6A04A]/20 transition-all"
              >
                Production
              </Link>
            </div>
          )}

          <Link
            to="/contact"
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all ${
              isStudio
                ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white'
                : isProduction
                ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black'
                : 'bg-white hover:bg-zinc-200 text-black'
            }`}
          >
            Get In Touch
          </Link>

          {isAuthenticated && (
            <Link
              to="/admin"
              className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10"
              title="Admin Dashboard"
            >
              <Lock size={13} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-zinc-300 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090B0E]/98 border-b border-white/10 px-6 py-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs uppercase tracking-widest text-zinc-400">Select Division:</span>
            <div className="flex gap-2">
              <Link
                to="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                  isStudio ? 'bg-[#7952D9] text-white' : 'text-zinc-400 border border-white/10'
                }`}
              >
                Studio
              </Link>
              <Link
                to="/production"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                  isProduction ? 'bg-[#C6A04A] text-black' : 'text-zinc-400 border border-white/10'
                }`}
              >
                Production
              </Link>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-wider py-1.5 ${
                  pathname === link.path
                    ? isStudio ? 'text-[#A78BFA] font-bold' : isProduction ? 'text-[#D9B96E] font-bold' : 'text-white font-bold'
                    : 'text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-center py-2.5 text-xs uppercase tracking-wider font-bold rounded-sm ${
                isStudio
                  ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white'
                  : isProduction
                  ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black'
                  : 'bg-white text-black'
              }`}
            >
              Contact Division
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-zinc-400 hover:text-white py-1 flex items-center justify-center gap-1.5"
            >
              <Lock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
