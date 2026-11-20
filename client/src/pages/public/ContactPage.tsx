import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Film, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDivision = (searchParams.get('division')?.toUpperCase() as 'STUDIO' | 'PRODUCTION') || 'STUDIO';
  const initialService = searchParams.get('service') || '';

  const [division, setDivision] = useState<'STUDIO' | 'PRODUCTION'>(
    initialDivision === 'PRODUCTION' ? 'PRODUCTION' : 'STUDIO'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceInterest, setServiceInterest] = useState(initialService);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic service interest options depending on division
  const studioOptions = [
    'Logo & Brand Identity Systems',
    'Packaging, Print & Collateral Design',
    'Website UI/UX & Redesign',
    'Mobile App UI/UX Design',
    'Enterprise Dashboard & SaaS Design',
    'Dynamic Websites & Headless E-Commerce',
    'Custom Web Applications & SaaS Platforms',
    'Backend, Cloud & API Development',
    '2D Animation & Motion Graphics',
    'Other Studio Requirement'
  ];

  const productionOptions = [
    'Commercial & Brand Film Production',
    'TV & Broadcast Commercials',
    'Narrative Feature Film Collaboration',
    'Short Film Production',
    'Music Video & Creative Production',
    'Film Direction & Cinematography Services',
    'Post-Production, Color & Sound Design',
    'Other Production Requirement'
  ];

  const activeOptions = division === 'STUDIO' ? studioOptions : productionOptions;

  useEffect(() => {
    if (initialService) {
      setServiceInterest(initialService);
    } else {
      setServiceInterest(activeOptions[0]);
    }
  }, [division]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !message) {
      setError('Please provide your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      await api.submitEnquiry({
        name,
        email,
        phone,
        division,
        service_interest: serviceInterest,
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 selection:bg-[#7952D9]/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 mb-4">
            <Mail size={13} />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-cinzel font-bold text-white mb-4">
            Start a Collaboration
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
            Direct your inquiry to either our Studio division for digital software and branding, or our Production division for film and commercials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <h3 className="text-xl font-serif font-bold text-white">Our Offices & Direct Lines</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-zinc-300 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-0.5">General Email</span>
                    <a href="mailto:contact@superway.com" className="text-white hover:underline font-medium">
                      contact@superway.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-zinc-300 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-0.5">Phone Line</span>
                    <span className="text-white font-medium">+91 (0) 98200 45678</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-zinc-300 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-widest block text-[10px] mb-0.5">Headquarters</span>
                    <span className="text-white font-medium block">Mumbai · Film Production Stages</span>
                    <span className="text-zinc-400 block mt-0.5">Bengaluru · Digital Engineering Lab</span>
                    <span className="text-zinc-400 block mt-0.5">London · European Commercial Office</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Division specific info card */}
            <div className={`p-6 rounded-xl border transition-all ${
              division === 'STUDIO'
                ? 'bg-[#10152D]/80 border-[#7952D9]/40'
                : 'bg-[#171717] border-[#C6A04A]/40'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {division === 'STUDIO' ? (
                  <>
                    <Sparkles size={16} className="text-[#A78BFA]" />
                    <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider">Studio Routing Active</span>
                  </>
                ) : (
                  <>
                    <Film size={16} className="text-[#D9B96E]" />
                    <span className="text-xs font-bold text-[#D9B96E] uppercase tracking-wider">Production Routing Active</span>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {division === 'STUDIO'
                  ? 'Your message will be directly reviewed by our Creative Technology Director and Brand Strategy leads. Expect a scoped proposal within 24-48 business hours.'
                  : 'Your project brief will be reviewed by our Executive Producers and Director Arjun Dev. Treatment discussions and director availability will be provided promptly.'}
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0F1218] border border-white/10 shadow-2xl">
              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Inquiry Dispatched Successfully</h3>
                  <p className="text-sm text-zinc-300 font-light max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Superway. Our division leads have received your details and will get in touch shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Division Selection Switch */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-2.5">
                      1. Select Division for this Inquiry *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDivision('STUDIO')}
                        className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                          division === 'STUDIO'
                            ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white border-transparent shadow-lg shadow-[#7952D9]/30'
                            : 'bg-black/40 text-zinc-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Sparkles size={14} />
                        <span>Studio Division</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDivision('PRODUCTION')}
                        className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                          division === 'PRODUCTION'
                            ? 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] text-black border-transparent shadow-lg shadow-[#C6A04A]/20'
                            : 'bg-black/40 text-zinc-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Film size={14} />
                        <span>Production Division</span>
                      </button>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@company.com"
                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Service Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98200 12345"
                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                        Service or Project Interest *
                      </label>
                      <select
                        value={serviceInterest}
                        onChange={(e) => setServiceInterest(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#141720] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9] transition-colors"
                      >
                        {activeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                      Project Scope & Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your timeline, deliverables, vision, and objectives..."
                      className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                      division === 'STUDIO'
                        ? 'bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white shadow-[#7952D9]/30'
                        : 'bg-gradient-to-r from-[#C6A04A] to-[#D9B96E] hover:from-[#b9943f] hover:to-[#cdae60] text-black shadow-[#C6A04A]/20'
                    } disabled:opacity-50`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit to {division === 'STUDIO' ? 'Studio' : 'Production'} Team</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
