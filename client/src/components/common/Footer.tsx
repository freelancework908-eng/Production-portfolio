import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Film, ArrowRight, Lock } from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090C] border-t border-white/5 pt-16 pb-12 text-[#A7A9AD]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/5">
          {/* Col 1 & 2: Unified Company Vision */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-block tracking-[0.25em] text-[#F8FAFC] uppercase font-cinzel text-xl font-bold"
            >
              SUPERWAY
            </Link>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Studio & Production · Two Creative Divisions
            </p>
            <p className="text-sm font-light text-zinc-400 max-w-sm leading-relaxed pt-2">
              An integrated creative company uniting digital product engineering, brand design, and cinematic filmmaking under a single relentless standard.
            </p>
            <div className="pt-2 text-xs text-zinc-500 tracking-wider">
              Mumbai · Bengaluru · London
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <LinkedinIcon size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Twitter">
                <TwitterIcon size={16} />
              </a>
            </div>
          </div>

          {/* Col 3: Studio Division */}
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#A78BFA] font-semibold mb-4">
              <Sparkles size={14} />
              <span>Studio</span>
            </div>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest text-zinc-400">
              <li>
                <Link to="/studio" className="hover:text-white transition-colors">
                  Studio Overview
                </Link>
              </li>
              <li>
                <Link to="/studio/services" className="hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/studio/work" className="hover:text-white transition-colors">
                  Design & Code Portfolio
                </Link>
              </li>
              <li>
                <Link to="/studio/services?category=Graphic and Brand Design" className="hover:text-[#A78BFA] transition-colors">
                  Brand & Graphic Design
                </Link>
              </li>
              <li>
                <Link to="/studio/services?category=UI/UX and Web Design" className="hover:text-[#A78BFA] transition-colors">
                  UI/UX & Web Design
                </Link>
              </li>
              <li>
                <Link to="/studio/services?category=Web and Software Development" className="hover:text-[#A78BFA] transition-colors">
                  Web & Software Dev
                </Link>
              </li>
              <li>
                <Link to="/studio/services?category=Motion and Digital Creativity" className="hover:text-[#A78BFA] transition-colors">
                  Motion & Digital Creatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Production Division */}
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#D9B96E] font-semibold mb-4">
              <Film size={14} />
              <span>Production</span>
            </div>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest text-zinc-400">
              <li>
                <Link to="/production" className="hover:text-white transition-colors">
                  Production Overview
                </Link>
              </li>
              <li>
                <Link to="/production/films" className="hover:text-white transition-colors">
                  Films Portfolio
                </Link>
              </li>
              <li>
                <Link to="/production/ads" className="hover:text-white transition-colors">
                  Commercials & Ads
                </Link>
              </li>
              <li>
                <Link to="/production/films?category=Short Films" className="hover:text-[#D9B96E] transition-colors">
                  Short Films
                </Link>
              </li>
              <li>
                <Link to="/production/ads?category=TV Advertisements" className="hover:text-[#D9B96E] transition-colors">
                  TV Advertisements
                </Link>
              </li>
              <li>
                <Link to="/production/ads?category=Brand Promotional Films" className="hover:text-[#D9B96E] transition-colors">
                  Brand Films
                </Link>
              </li>
              <li>
                <Link to="/contact?division=PRODUCTION" className="hover:text-[#D9B96E] transition-colors">
                  Film Collaborations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F8FAFC] font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-widest text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Group
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-500">
                  <Lock size={11} />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>

            <div className="mt-8 p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-1">
                Direct Inquiries
              </span>
              <a
                href="mailto:contact@superway.com"
                className="text-xs text-white hover:underline block truncate"
              >
                contact@superway.com
              </a>
              <span className="text-[11px] text-zinc-400 block mt-1">
                +91 (0) 98200 45678
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} Superway. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Studio: Blue & Purple Gradient</span>
            <span>•</span>
            <span>Production: Cinematic Dark & Gold</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
