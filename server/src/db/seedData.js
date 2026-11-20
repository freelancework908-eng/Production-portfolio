import bcrypt from 'bcryptjs';

export const getSeedData = async () => {
  const adminPasswordHash = await bcrypt.hash('cinematic2025!', 10);

  return {
    admins: [
      {
        id: 'adm-01',
        username: 'admin',
        email: 'admin@superway.com',
        password_hash: adminPasswordHash,
        created_at: new Date().toISOString()
      },
      {
        id: 'adm-02',
        username: 'arjunadmin',
        email: 'admin@arjun-dev.com',
        password_hash: adminPasswordHash,
        created_at: new Date().toISOString()
      }
    ],
    site_settings: {
      id: 'settings-01',
      company_name: 'SUPERWAY',
      tagline: 'Two Creative Divisions. One Relentless Standard.',
      studio_name: 'SUPERWAY STUDIO',
      studio_tagline: 'Creative Design, Branding, Digital Solutions & Software Engineering',
      production_name: 'SUPERWAY PRODUCTION',
      production_tagline: 'Cinematic Film, Commercials, Visual Storytelling & Video Production',
      email: 'contact@superway.com',
      phone: '+91 (0) 98200 45678',
      location: 'Mumbai · Bengaluru · London',
      about_company: 'Superway is an integrated creative powerhouse uniting digital product engineering and high-end film production under a single relentless creative standard. Our Studio division crafts world-class brand identities, UI/UX experiences, and scalable web software, while our Production division produces gripping narrative films, award-winning short films, and tier-one commercial advertisements.',
      social: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        vimeo: 'https://vimeo.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      },
      updated_at: new Date().toISOString()
    },
    services: [
      // STUDIO CATEGORY A: Graphic and Brand Design
      {
        id: 'srv-01',
        name: 'Logo & Brand Identity Systems',
        division: 'STUDIO',
        category: 'Graphic and Brand Design',
        description: 'Complete brand architecture, bespoke logo typography, brand guidelines, color palettes, and brand voice definition tailored to make your company unmistakable.',
        icon: 'Palette',
        display_order: 1,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-02',
        name: 'Packaging, Print & Collateral Design',
        division: 'STUDIO',
        category: 'Graphic and Brand Design',
        description: 'Premium physical product packaging, tactile luxury business cards, brochures, posters, and marketing print collateral crafted with precision finishes.',
        icon: 'Package',
        display_order: 2,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-03',
        name: 'Social Media & Marketing Creatives',
        division: 'STUDIO',
        category: 'Graphic and Brand Design',
        description: 'High-converting visual campaign assets, digital billboard banners, social media design suites, and performance marketing creative sets.',
        icon: 'Megaphone',
        display_order: 3,
        is_active: true,
        created_at: new Date().toISOString()
      },

      // STUDIO CATEGORY B: UI/UX and Web Design
      {
        id: 'srv-04',
        name: 'Website UI/UX & Landing Pages',
        division: 'STUDIO',
        category: 'UI/UX and Web Design',
        description: 'Award-winning user experience architectures, responsive layout systems, and high-conversion landing page design focused on visual delight and measurable user retention.',
        icon: 'Layout',
        display_order: 4,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-05',
        name: 'Mobile App UI/UX Design',
        division: 'STUDIO',
        category: 'UI/UX and Web Design',
        description: 'Intuitive iOS and Android user journeys, interactive micro-interactions, clickable prototypes, and comprehensive Figma design components.',
        icon: 'Smartphone',
        display_order: 5,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-06',
        name: 'Enterprise Dashboard & SaaS Design',
        division: 'STUDIO',
        category: 'UI/UX and Web Design',
        description: 'Complex data visualizations, analytics dashboards, multi-tenant workspace interfaces, and full design system foundations.',
        icon: 'Layers',
        display_order: 6,
        is_active: true,
        created_at: new Date().toISOString()
      },

      // STUDIO CATEGORY C: Web and Software Development
      {
        id: 'srv-07',
        name: 'Dynamic Websites & Headless E-Commerce',
        division: 'STUDIO',
        category: 'Web and Software Development',
        description: 'Blazing-fast modern websites, custom content management systems, and Shopify / headless e-commerce platforms engineered for speed and SEO supremacy.',
        icon: 'Globe',
        display_order: 7,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-08',
        name: 'Custom Web Applications & SaaS Platforms',
        division: 'STUDIO',
        category: 'Web and Software Development',
        description: 'Full-stack single-page applications, multi-tier SaaS architectures, real-time collaboration engines, and resilient cloud software.',
        icon: 'Code',
        display_order: 8,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-09',
        name: 'Backend, REST & GraphQL API Engineering',
        division: 'STUDIO',
        category: 'Web and Software Development',
        description: 'Scalable Node.js and SQL/NoSQL databases, authenticated API gateways, third-party payment gateways, and enterprise integrations.',
        icon: 'Server',
        display_order: 9,
        is_active: true,
        created_at: new Date().toISOString()
      },

      // STUDIO CATEGORY D: Motion and Digital Creativity
      {
        id: 'srv-10',
        name: '2D Animation & Motion Graphics',
        division: 'STUDIO',
        category: 'Motion and Digital Creativity',
        description: 'Fluid character animations, typographic kinetic videos, and visual storytelling pieces that bring abstract concepts to vivid life.',
        icon: 'Film',
        display_order: 10,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-11',
        name: 'Logo Animation & Sonic Identity',
        division: 'STUDIO',
        category: 'Motion and Digital Creativity',
        description: 'Signature kinetic logo reveals, brand stingers, UI loading animations, and audio-reactive digital splash sequences for high-impact brand presence.',
        icon: 'Sparkles',
        display_order: 11,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-12',
        name: 'Explainer Videos & Product Teasers',
        division: 'STUDIO',
        category: 'Motion and Digital Creativity',
        description: 'Engaging product walk-through animations, technical explainer videos, and social media reels designed to boost conversions and brand clarity.',
        icon: 'Video',
        display_order: 12,
        is_active: true,
        created_at: new Date().toISOString()
      },

      // PRODUCTION SERVICES
      {
        id: 'srv-13',
        name: 'Commercial & Brand Film Production',
        division: 'PRODUCTION',
        category: 'Commercial Production',
        description: 'High-end TV commercials, digital brand promotional films, and product cinematics produced with full cinema-grade crews and equipment.',
        icon: 'Tv',
        display_order: 13,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-14',
        name: 'Narrative Film & Series Production',
        division: 'PRODUCTION',
        category: 'Film Production',
        description: 'Full-cycle production for short films, independent feature cinema, documentaries, and episodic web series from script to final screen.',
        icon: 'Clapperboard',
        display_order: 14,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-15',
        name: 'Directorial & Cinematography Services',
        division: 'PRODUCTION',
        category: 'Production Services',
        description: 'Auteur film direction, anamorphic cinematography, lighting design, casting direction, and on-set technical leadership.',
        icon: 'Camera',
        display_order: 15,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'srv-16',
        name: 'Post-Production, Color & Sound Design',
        division: 'PRODUCTION',
        category: 'Production Services',
        description: 'Master editing suites, DaVinci Resolve color grading, Foley sound design, original soundtrack composition, and DCP delivery mastering.',
        icon: 'Sliders',
        display_order: 16,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ],
    projects: [
      // ==========================================
      // STUDIO PROJECTS
      // ==========================================
      {
        id: 'proj-std-01',
        division: 'STUDIO',
        title: 'Nexus AI Observability & Analytics Platform',
        slug: 'nexus-ai-analytics-platform',
        category: 'Web and Software Development',
        categories: ['Web and Software Development', 'UI/UX and Web Design'],
        short_description: 'An enterprise cloud telemetry dashboard providing real-time model monitoring and anomaly detection with sub-second streaming latency.',
        full_description: 'Nexus AI required a complete digital transformation spanning front-end architecture and interface engineering. Our studio designed and built a high-density analytics suite capable of visualizing millions of streaming metrics in real time. Built with React, high-performance canvas chart rendering, and an ultra-secure REST API backend, the platform reduces diagnostic mean-time-to-resolution by 64% while maintaining a sleek, dark-mode ergonomic UI.',
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1800&auto=format&fit=crop',
        video_url: '',
        gallery_images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2025',
        release_year: 2025,
        role: 'Lead System Architect & UI Engineering',
        client_production: 'Nexus Telemetry Systems (San Francisco)',
        client_name: 'Nexus Telemetry Systems',
        deliverables: 'Web App, Design System, Custom Charts, REST API',
        live_url: 'https://nexus-demo.superway.com',
        is_featured: true,
        status: 'published',
        sort_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-std-02',
        division: 'STUDIO',
        title: 'Velox Digital Banking & Fintech Mobile Ecosystem',
        slug: 'velox-digital-banking-app',
        category: 'UI/UX and Web Design',
        categories: ['UI/UX and Web Design', 'Web and Software Development'],
        short_description: 'Next-generation cross-border banking app featuring biometric security, micro-investing flows, and a fluid dark-mode design system.',
        full_description: 'Velox challenged our team to rethink the digital banking journey for digital natives and international entrepreneurs. We conducted comprehensive user behavior studies, crafted 200+ Figma components adhering to WCAG AAA standards, and architected an ultra-smooth interaction model. The result is a fluid, thumb-friendly fintech interface that increased multi-currency conversion rates by 42% within three months of public rollout.',
        cover_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1800&auto=format&fit=crop',
        video_url: '',
        gallery_images: [
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2025',
        release_year: 2025,
        role: 'Product Designer & Design System Lead',
        client_production: 'Velox Financial Technologies',
        client_name: 'Velox Financial Technologies',
        deliverables: 'Mobile App UX/UI, Design Tokens, Interactive Prototype',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-std-03',
        division: 'STUDIO',
        title: 'Botanical Paris Rebrand & Sustainable Luxury Packaging',
        slug: 'botanical-luxury-packaging',
        category: 'Graphic and Brand Design',
        categories: ['Graphic and Brand Design'],
        short_description: 'Monolithic bespoke typography, embossed packaging systems, and comprehensive brand guidelines for an organic luxury fragrance label.',
        full_description: 'Botanical Paris sought a timeless visual identity that bridged Scandinavian minimalism with artisanal botanical heritage. We developed an original serif typeface for the wordmark, selected 100% post-consumer biodegradable cotton paper stocks with blind debossing, and codified a complete brand manual governing worldwide flagship boutique retail applications.',
        cover_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1800&auto=format&fit=crop',
        video_url: '',
        gallery_images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Creative Director & Identity Designer',
        client_production: 'Botanical Paris',
        client_name: 'Botanical Paris',
        deliverables: 'Brand Identity, Packaging Suite, Typography, Print Specifications',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-std-04',
        division: 'STUDIO',
        title: 'CyberPulse 3D Kinetic Identity & Launch Campaign',
        slug: 'cyberpulse-kinetic-identity',
        category: 'Motion and Digital Creativity',
        categories: ['Motion and Digital Creativity', 'Graphic and Brand Design'],
        short_description: 'An audio-reactive kinetic motion package, 3D particle title sequence, and dynamic promo reels for an international electronic music festival.',
        full_description: 'For CyberPulse Festival, we engineered a modular motion package combining generative geometry with electronic audio waveforms. The assets included 4K LED festival stage visuals, 60fps logo stingers, social media promo reels, and interactive web motion graphics that synchronized seamlessly with live BPM counters.',
        cover_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Motion Director & 3D Artist',
        client_production: 'CyberPulse Festival UK',
        client_name: 'CyberPulse Festival UK',
        deliverables: '3D Animations, Stage Visuals, Kinetic Logo Reveals, Reels',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 4,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-std-05',
        division: 'STUDIO',
        title: 'Synthetix Headless E-Commerce Platform',
        slug: 'synthetix-headless-ecommerce',
        category: 'Web and Software Development',
        categories: ['Web and Software Development'],
        short_description: 'Blazing fast dynamic store with instant sub-50ms search, real-time inventory synchronization, and Stripe multi-currency checkout.',
        full_description: 'Synthetix demanded an ultra-high performance storefront engineered to eliminate checkout drop-offs during high-traffic product drops. Leveraging Next.js and optimized server-side rendering with edge caching, our studio delivered a custom headless architecture that achieved a 99 Google Lighthouse performance score and handled 50,000 concurrent shoppers without latency degradation.',
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1800&auto=format&fit=crop',
        video_url: '',
        gallery_images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Full-Stack Technical Lead',
        client_production: 'Synthetix Apparel Group',
        client_name: 'Synthetix Apparel Group',
        deliverables: 'Headless Web Store, Custom CMS, Payment Gateway Integration',
        live_url: '',
        is_featured: false,
        status: 'published',
        sort_order: 5,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-std-06',
        division: 'STUDIO',
        title: 'Kinetics Global SaaS Design System',
        slug: 'kinetics-global-design-system',
        category: 'UI/UX and Web Design',
        categories: ['UI/UX and Web Design', 'Web and Software Development'],
        short_description: 'A unified multi-product design system with accessible components, semantic design tokens, and synchronized React code libraries.',
        full_description: 'When Kinetics expanded into four distinct enterprise software lines, engineering speed stalled due to UI fragmentation. Our studio designed and codified a central design system with 250+ accessible components, automated theme tokens for light/dark modes, and documentation for both Figma designers and React software engineers.',
        cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1800&auto=format&fit=crop',
        video_url: '',
        gallery_images: [
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Design System Architect',
        client_production: 'Kinetics Software Inc.',
        client_name: 'Kinetics Software Inc.',
        deliverables: 'Component Library, Token Architecture, Documentation Portal',
        live_url: '',
        is_featured: false,
        status: 'published',
        sort_order: 6,
        created_at: new Date().toISOString()
      },

      // ==========================================
      // PRODUCTION PROJECTS
      // ==========================================
      {
        id: 'proj-prd-01',
        division: 'PRODUCTION',
        title: 'The Midnight Solitude',
        slug: 'the-midnight-solitude',
        category: 'Film Production',
        categories: ['Film Production', 'Feature Films'],
        short_description: 'An estranged acoustic researcher in a fog-bound coastal town accidentally captures an unsolved crime on tape, pulling him into a web of political deception.',
        full_description: 'Set along the windswept headlands of Northern Brittany, The Midnight Solitude explores the fragile boundary between objective truth and subjective trauma. Julian, a retired acoustic researcher who lives in voluntary seclusion, records the nocturnal ambient soundscapes of the sea caves. When his high-gain binaural microphones intercept a hushed conversation followed by an undeniable splash, Julian becomes entangled in the disappearance of a prominent investigative journalist.',
        cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Director & Executive Producer',
        credits: 'Starring Kabir Mehta, Elena Vance | Cinematography by Marcus Roy',
        client_production: 'Nocturne Motion Pictures · Canal+ International',
        client_name: 'Nocturne Motion Pictures',
        deliverables: 'Theatrical Feature Film, 4K DCP, International Distribution',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-prd-02',
        division: 'PRODUCTION',
        title: 'Apex Chrono – The Precision of Time',
        slug: 'apex-chrono-precision-of-time',
        category: 'Commercial Production',
        categories: ['Commercial Production', 'Brand Promotional Films'],
        short_description: 'A cinematic luxury timepiece commercial shot with custom anamorphic lenses and dynamic macro lighting exploring horological perfection.',
        full_description: 'Commissioned by Swiss watchmaker Apex Chrono, this brand film marries the tactile world of hand-assembled micro-engineering with the grand scale of mountain summits. Filmed with ARRI Alexa Mini LF and bespoke probe lenses, every tick of the escapement wheel is rendered with visceral clarity and dramatic sound design.',
        cover_image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2025',
        release_year: 2025,
        role: 'Director & Cinematographer',
        credits: 'Produced by Superway Production · Sound Design by Resonate Studios Zurich',
        client_production: 'Apex Chrono Horology Geneva',
        client_name: 'Apex Chrono Horology Geneva',
        deliverables: '60s Cinema Commercial, 30s TV Broadcast Cut, Social Formats',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-prd-03',
        division: 'PRODUCTION',
        title: 'Vortex EV: Beyond the Horizon',
        slug: 'vortex-ev-beyond-horizon',
        category: 'Commercial Production',
        categories: ['Commercial Production', 'TV Advertisements'],
        short_description: 'High-octane commercial for a next-generation electric hypercar filmed across extreme high-altitude alpine switchbacks at twilight.',
        full_description: 'Capturing silent velocity and sustainable horsepower, this national TV spot followed the Vortex EV traversing the Swiss Furka Pass during the golden hour. Utilizing Russian Arm camera chase cars and high-speed drone tracking, our production delivered visceral speed aesthetics and precision color grading in DaVinci Resolve.',
        cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Director & Stunt Unit Lead',
        credits: 'Cinematography by David Sterling | Color by The Mill London',
        client_production: 'Vortex Automotive International',
        client_name: 'Vortex Automotive International',
        deliverables: 'National Broadcast Commercial, Digital Pre-rolls',
        live_url: '',
        is_featured: true,
        status: 'published',
        sort_order: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-prd-04',
        division: 'PRODUCTION',
        title: 'Echoes of the Valley',
        slug: 'echoes-of-the-valley',
        category: 'Film Production',
        categories: ['Film Production', 'Independent Films'],
        short_description: 'A poetic exploration of a remote Himalayan village confronting ancestral climate shifts through the eyes of an elderly shepherd and his granddaughter.',
        full_description: 'Winner of Best Cinematography at the Nordic Mountain Film Festival, Echoes of the Valley was captured over forty days in Spiti Valley utilizing solely available sunlight and firelight. The narrative contrasts vanishing oral folklore with unstoppable environmental realities.',
        cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Director & Screenwriter',
        credits: 'Starring Tenzin Norbu, Maya Sharma',
        client_production: 'Mountain Song Pictures · Indie Fund Europe',
        client_name: 'Mountain Song Pictures',
        deliverables: 'Feature Film, Festival Circuit Screener, Soundtrack Album',
        live_url: '',
        is_featured: false,
        status: 'published',
        sort_order: 4,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-prd-05',
        division: 'PRODUCTION',
        title: 'A Forgotten Sonata',
        slug: 'a-forgotten-sonata',
        category: 'Film Production',
        categories: ['Film Production', 'Short Films'],
        short_description: 'An aging violin restorer discovers an unfinished manuscript hidden inside the soundpost of an 18th-century instrument.',
        full_description: 'A 24-minute dramatic chamber short film exploring memory, grief, and the artistic obsession of resurrection. Filmed in an authentic heritage luthier workshop in Vienna with classical period microphones and 35mm film stock, the project premiered in competition at the Venice Horizons short film festival.',
        cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2023',
        release_year: 2023,
        role: 'Director & Producer',
        credits: 'Original Score performed by Vienna Soloists Chamber Ensemble',
        client_production: 'Klangfilm Vienna · Superway Production',
        client_name: 'Klangfilm Vienna',
        deliverables: 'Short Film, Festival Master, Original Score',
        live_url: '',
        is_featured: false,
        status: 'published',
        sort_order: 5,
        created_at: new Date().toISOString()
      },
      {
        id: 'proj-prd-06',
        division: 'PRODUCTION',
        title: 'Luminary: Electric Dreams (Official Video)',
        slug: 'luminary-electric-dreams-music-video',
        category: 'Creative Video Production',
        categories: ['Creative Video Production', 'Commercial Production'],
        short_description: 'Atmospheric neon-noir music video blending kinetic performance with dystopian visual storytelling.',
        full_description: 'Shot in underground tunnel complexes and neon-lit rainy alleys, this music video for electronic synthwave act Luminary captures a runaway cyborg discovering human vulnerability. The project features practical anamorphic lens flares, mechanical lighting rigs, and fast-paced editing synchronized with pulsing 128bpm synthesizer rhythms.',
        cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        banner_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1800&auto=format&fit=crop',
        thumbnail_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        main_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1800&auto=format&fit=crop',
        video_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        gallery_images: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
        ],
        project_date: '2024',
        release_year: 2024,
        role: 'Director & Concept Artist',
        credits: 'Starring Anya Kova · Label: Warp Resonance Records',
        client_production: 'Warp Resonance Records',
        client_name: 'Warp Resonance Records',
        deliverables: 'Music Video 4K Master, Vertical Reels, Press Stills',
        live_url: '',
        is_featured: false,
        status: 'published',
        sort_order: 6,
        created_at: new Date().toISOString()
      }
    ],
    gallery: [
      {
        id: 'gal-01',
        title: 'Director Framing on Coastal Set',
        caption: 'Shooting anamorphic coverage during twilight at Brittany coast.',
        category: 'Behind the Scenes',
        image_url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop',
        photographer: 'Elena Rostova',
        display_order: 1,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'gal-02',
        title: 'Production Camera Rig & Cinema Lenses',
        caption: 'ARRI Alexa setup ready for high-speed tracking pass.',
        category: 'Behind the Scenes',
        image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
        photographer: 'Marcus Roy',
        display_order: 2,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'gal-03',
        title: 'Studio UI/UX Lab & Typography Review',
        caption: 'Digital designers stress-testing design system prototypes.',
        category: 'Studio Moments',
        image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
        photographer: 'Dev Team',
        display_order: 3,
        is_published: true,
        created_at: new Date().toISOString()
      }
    ],
    media: [
      {
        id: 'med-01',
        title: 'Brand Hero Concept',
        file_name: 'hero-banner.jpg',
        file_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        file_type: 'image',
        file_size: '2.4 MB',
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString()
      }
    ],
    enquiries: [
      {
        id: 'enq-01',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@lumenglobal.io',
        phone: '+1 (415) 882-9011',
        division: 'STUDIO',
        service_interest: 'Custom Web Applications & SaaS Platforms',
        message: 'Looking for an end-to-end studio team to design our fintech SaaS analytics suite and implement the React frontend.',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'enq-02',
        name: 'Marcus Thorne',
        email: 'm.thorne@apexfilmworks.co.uk',
        phone: '+44 20 7946 0992',
        division: 'PRODUCTION',
        service_interest: 'Commercial & Brand Film Production',
        message: 'We are seeking an auteur directorial and production crew for our upcoming luxury sports car cinema campaign filming in Q2.',
        is_read: true,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ],
    categories: {
      studio: [
        'Graphic and Brand Design',
        'UI/UX and Web Design',
        'Web and Software Development',
        'Motion and Digital Creativity'
      ],
      production: [
        'Film Production',
        'Commercial Production',
        'Creative Video Production',
        'Production Services'
      ]
    },
    clients: [
      { id: 'cli-01', name: 'Nexus Telemetry Systems', division: 'STUDIO', website_url: 'https://nexus.io', display_order: 1 },
      { id: 'cli-02', name: 'Velox Financial Technologies', division: 'STUDIO', website_url: 'https://velox.finance', display_order: 2 },
      { id: 'cli-03', name: 'Botanical Paris', division: 'STUDIO', website_url: 'https://botanicalparis.fr', display_order: 3 },
      { id: 'cli-04', name: 'Apex Chrono Geneva', division: 'PRODUCTION', website_url: 'https://apexchrono.ch', display_order: 4 },
      { id: 'cli-05', name: 'Vortex Automotive International', division: 'PRODUCTION', website_url: 'https://vortexev.com', display_order: 5 },
      { id: 'cli-06', name: 'Nocturne Motion Pictures', division: 'PRODUCTION', website_url: 'https://nocturnepictures.com', display_order: 6 }
    ],
    testimonials: [
      {
        id: 'test-01',
        client_name: 'David Chen',
        client_role: 'Chief Technology Officer',
        company: 'Nexus Telemetry Systems (San Francisco)',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        division: 'STUDIO',
        quote: 'Superway Studio completely re-engineered our SaaS observability interface. Our conversion jumped 42% in ninety days and client feedback has been universally ecstatic.',
        rating: 5,
        display_order: 1,
        is_featured: true,
        is_published: true
      },
      {
        id: 'test-02',
        client_name: 'Camille Laurent',
        client_role: 'Founder & Creative Lead',
        company: 'Botanical Paris',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        division: 'STUDIO',
        quote: 'Their brand identity and luxury packaging work for our perfume label won international awards. Pure craftsmanship and relentless attention to detail.',
        rating: 5,
        display_order: 2,
        is_featured: true,
        is_published: true
      },
      {
        id: 'test-03',
        client_name: 'Henri Vane',
        client_role: 'Head of Global Marketing',
        company: 'Apex Chrono (Geneva)',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
        division: 'PRODUCTION',
        quote: 'The commercial spots directed by Superway Production captured the micro-mechanics of our luxury timepieces with breathtaking anamorphic beauty.',
        rating: 5,
        display_order: 3,
        is_featured: true,
        is_published: true
      }
    ],
    banners: [
      {
        id: 'ban-01',
        title: 'SUPERWAY',
        subtitle: 'Two Independent Creative Divisions. One Relentless Creative Standard.',
        division: 'PORTAL',
        cta_label: 'Explore Divisions',
        cta_link: '/studio',
        media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
        display_order: 1,
        is_active: true
      },
      {
        id: 'ban-02',
        title: 'Creative Design, Branding & Digital Engineering',
        subtitle: 'Award-winning UI/UX interfaces, bespoke brand identities, and resilient web software.',
        division: 'STUDIO',
        cta_label: 'View Studio Work',
        cta_link: '/studio/work',
        media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1800&auto=format&fit=crop',
        display_order: 2,
        is_active: true
      },
      {
        id: 'ban-03',
        title: 'Light. Silence. Narrative Truth.',
        subtitle: 'Independent cinema, dramatic short films, and high-impact commercial advertisements.',
        division: 'PRODUCTION',
        cta_label: 'Explore Films',
        cta_link: '/production/films',
        media_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800&auto=format&fit=crop',
        display_order: 3,
        is_active: true
      }
    ],
    navigation: [
      { id: 'nav-01', label: 'Home', url: '/', division: 'PORTAL', display_order: 1, is_active: true },
      { id: 'nav-02', label: 'Studio Division', url: '/studio', division: 'PORTAL', display_order: 2, is_active: true },
      { id: 'nav-03', label: 'Production Division', url: '/production', division: 'PORTAL', display_order: 3, is_active: true },
      { id: 'nav-04', label: 'About Company', url: '/about', division: 'PORTAL', display_order: 4, is_active: true },
      { id: 'nav-05', label: 'Contact', url: '/contact', division: 'PORTAL', display_order: 5, is_active: true },
      { id: 'nav-06', label: 'Overview', url: '/studio', division: 'STUDIO', display_order: 1, is_active: true },
      { id: 'nav-07', label: 'Services', url: '/studio/services', division: 'STUDIO', display_order: 2, is_active: true },
      { id: 'nav-08', label: 'Work', url: '/studio/work', division: 'STUDIO', display_order: 3, is_active: true },
      { id: 'nav-09', label: 'Overview', url: '/production', division: 'PRODUCTION', display_order: 1, is_active: true },
      { id: 'nav-10', label: 'Films', url: '/production/films', division: 'PRODUCTION', display_order: 2, is_active: true },
      { id: 'nav-11', label: 'Commercials', url: '/production/ads', division: 'PRODUCTION', display_order: 3, is_active: true }
    ]
  };
};
