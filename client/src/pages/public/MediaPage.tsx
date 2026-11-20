import React, { useEffect, useState } from 'react';
import { Play, Film, Mic, Video as VideoIcon, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { MediaAsset, Project } from '../../types';
import { VideoModal } from '../../components/common/VideoModal';

export const MediaPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Video Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    async function loadMedia() {
      try {
        const [med, projs] = await Promise.all([
          api.getMedia('video').catch(() => []),
          api.getProjects().catch(() => [])
        ]);
        setMediaItems(med);
        setProjects(projs);
      } catch (err) {
        console.error('Failed to load media items', err);
      } finally {
        setLoading(false);
      }
    }
    loadMedia();
  }, []);

  const handlePlayVideo = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setModalOpen(true);
  };

  // Video entries combining projects and media assets
  const videoList = [
    {
      id: 'vid-1',
      title: 'Arjun Dev · Official 2025 Showreel',
      type: 'Showreel',
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
      duration: '3:45',
      description: 'Comprehensive retrospective of dramatic lead roles and atmospheric directorial sequences.'
    },
    {
      id: 'vid-2',
      title: 'The Midnight Solitude · Official Festival Trailer',
      type: 'Film Trailer',
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
      duration: '2:15',
      description: 'Atmospheric neo-noir thriller directed by Arjun Dev. Lucerne Grand Jury Prize Winner.'
    },
    {
      id: 'vid-3',
      title: 'Echoes of the Valley · Official Sneak Peek',
      type: 'Film Trailer',
      url: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      duration: '2:30',
      description: 'Starring Arjun Dev as Dr. Samar Roy in a high-altitude psychological chamber drama.'
    },
    {
      id: 'vid-4',
      title: 'Masterclass: Writing Tension and Subtext for Screen',
      type: 'Interview & Masterclass',
      url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
      duration: '45:10',
      description: 'In-depth craft conversation at the International Filmmakers Forum on dialogue pacing.'
    },
    {
      id: 'vid-5',
      title: 'Rhythms of Dawn · Original Musical Score & Lyrics',
      type: 'Music & Lyrics',
      url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      duration: '4:20',
      description: 'Orchestral composition featuring poetic riverine verses penned by Arjun Dev.'
    },
    {
      id: 'vid-6',
      title: 'Shadows Beneath · Cinematic Excerpt & Director Commentary',
      type: 'Behind the Scenes',
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      duration: '8:40',
      description: 'Directorial analysis on anamorphic lens choices and nighttime lighting design.'
    }
  ];

  return (
    <div className="bg-[#090B0E] text-[#F5F3EF] pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A] font-semibold block mb-3">
            Motion & Audio Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#F5F3EF] tracking-tight leading-[1.08] mb-6">
            Media & Showreels
          </h1>
          <p className="text-base sm:text-lg text-[#A7A9AD] font-light leading-relaxed">
            Curated film trailers, directorial showreels, media appearances, panel discussions, and musical compositions.
          </p>
        </div>

        {/* Featured Big Showreel Banner */}
        <div className="relative rounded-sm overflow-hidden border border-white/10 bg-black shadow-2xl mb-16 group">
          <div className="relative aspect-[21/9] sm:aspect-[16/8] md:aspect-[21/9] w-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=2000&auto=format&fit=crop"
              alt="Arjun Dev Feature Reel"
              className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.1] group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button
                onClick={() => handlePlayVideo(videoList[0].url, videoList[0].title)}
                className="w-20 h-20 rounded-full bg-[#C6A66A] text-[#090B0E] flex items-center justify-center shadow-[0_0_35px_rgba(198,166,106,0.4)] hover:scale-110 transition-transform mb-4 cursor-pointer"
                aria-label="Play showreel"
              >
                <Play size={28} className="fill-current ml-1" />
              </button>
              <div className="text-xs uppercase tracking-widest text-[#DFC38A] font-medium mb-1">
                Featured Showreel
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif text-white max-w-xl">
                Arjun Dev · Feature Filmmaker & Performer (2025 Reel)
              </h2>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoList.map((vid) => (
            <div
              key={vid.id}
              onClick={() => handlePlayVideo(vid.url, vid.title)}
              className="group bg-[#11151B] border border-white/5 hover:border-[#C6A66A]/30 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover filter brightness-[0.75] group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/90 bg-black/70 px-2 py-0.5 rounded-sm border border-white/10">
                  {vid.duration}
                </span>

                {/* Play Icon */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 group-hover:bg-[#C6A66A] text-white group-hover:text-black flex items-center justify-center border border-white/20 transition-all">
                  <Play size={18} className="fill-current ml-0.5" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold block mb-2">
                    {vid.type}
                  </span>
                  <h3 className="text-xl font-serif text-white group-hover:text-[#C6A66A] transition-colors mb-2 leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs font-light text-[#A7A9AD] leading-relaxed mb-4">
                    {vid.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-[11px] uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                  <Play size={12} className="text-[#C6A66A]" />
                  <span>Click To Watch</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={videoUrl}
        title={videoTitle}
      />
    </div>
  );
};
