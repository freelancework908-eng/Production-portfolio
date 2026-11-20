import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Globe, Search, Share2 } from 'lucide-react';
import { api } from '../../services/api';
import { SEOSettings } from '../../types';

export const AdminSEOPage: React.FC = () => {
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadSEO() {
      try {
        const data = await api.getSEO();
        setSeo(data);
      } catch (err) {
        console.error('Failed to load SEO', err);
      } finally {
        setLoading(false);
      }
    }
    loadSEO();
  }, []);

  const handleChange = (field: keyof SEOSettings, value: string) => {
    if (!seo) return;
    setSeo({ ...seo, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setSaving(true);
    setFeedback(null);
    try {
      await api.updateSEO(seo);
      setFeedback({ type: 'success', message: 'SEO and Social Graph configurations saved!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update SEO.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
          Loading Search Configurations...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
          Search Visibility & Metadata
        </span>
        <h1 className="text-3xl font-serif text-white">
          SEO & Social Graph Settings
        </h1>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center gap-3 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Live Google Search Preview Card */}
      <div className="p-6 bg-[#11151B] border border-white/5 rounded-sm space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-[#C6A66A] font-semibold flex items-center gap-1.5">
          <Search size={13} />
          <span>Google Search SERP Preview</span>
        </span>
        <div className="p-4 bg-white rounded-sm text-black max-w-xl font-sans">
          <div className="text-[11px] text-zinc-500 mb-0.5 truncate">
            https://arjundev.cinema
          </div>
          <h4 className="text-base text-[#1a0dab] hover:underline font-normal truncate cursor-pointer leading-snug">
            {seo.site_title || 'ARJUN DEV | Filmmaker · Actor · Writer · Lyricist'}
          </h4>
          <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
            {seo.meta_description || 'Official portfolio of Arjun Dev: Award-winning filmmaker, actor, story writer, and lyricist.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Meta Tags */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Core Search Engine Metadata
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Global Browser Title Tag
            </label>
            <input
              type="text"
              required
              value={seo.site_title}
              onChange={(e) => handleChange('site_title', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Meta Description (Optimal length 150-160 characters)
            </label>
            <textarea
              rows={3}
              required
              value={seo.meta_description}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={seo.keywords || ''}
              onChange={(e) => handleChange('keywords', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>
        </div>

        {/* Social Graph Meta */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            OpenGraph & Twitter Card Preview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                OpenGraph Share Title
              </label>
              <input
                type="text"
                value={seo.og_title || ''}
                onChange={(e) => handleChange('og_title', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Twitter/X Creator Handle
              </label>
              <input
                type="text"
                value={seo.twitter_handle || ''}
                onChange={(e) => handleChange('twitter_handle', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              OpenGraph Preview Image URL
            </label>
            <input
              type="url"
              value={seo.og_image || ''}
              onChange={(e) => handleChange('og_image', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6A66A] hover:bg-[#DFC38A] text-[#090B0E] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save SEO Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
