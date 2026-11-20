import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Home } from 'lucide-react';
import { api } from '../../services/api';
import { HomepageConfig, Project } from '../../types';

export const AdminHomepagePage: React.FC = () => {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [home, projs] = await Promise.all([
          api.getHomepage(),
          api.getAllProjectsAdmin()
        ]);
        setConfig(home);
        setAllProjects(projs);
      } catch (err) {
        console.error('Failed to load homepage config', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field: keyof HomepageConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setFeedback(null);
    try {
      await api.updateHomepage(config);
      setFeedback({ type: 'success', message: 'Homepage content updated successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update homepage settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
          Loading Homepage Settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
          Front Page Configuration
        </span>
        <h1 className="text-3xl font-serif text-white">
          Homepage Management
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section Configuration */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Cinematic Hero Banner
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Hero Main Headline (Editorial Serif)
            </label>
            <input
              type="text"
              required
              value={config.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Hero Introduction / Subtitle
            </label>
            <textarea
              rows={3}
              required
              value={config.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Hero Full-Screen Background Image URL
            </label>
            <input
              type="url"
              required
              value={config.hero_image}
              onChange={(e) => handleChange('hero_image', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Primary Call-To-Action Label
              </label>
              <input
                type="text"
                value={config.hero_cta_primary}
                onChange={(e) => handleChange('hero_cta_primary', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Secondary Call-To-Action Label
              </label>
              <input
                type="text"
                value={config.hero_cta_secondary}
                onChange={(e) => handleChange('hero_cta_secondary', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Video & About Snippet */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Showreel & Manifesto Snippet
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Featured Showreel URL (YouTube / Vimeo / MP4)
            </label>
            <input
              type="url"
              value={config.showreel_url}
              onChange={(e) => handleChange('showreel_url', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Homepage About Introduction Quote
            </label>
            <textarea
              rows={4}
              value={config.about_snippet}
              onChange={(e) => handleChange('about_snippet', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
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
            <span>{saving ? 'Saving...' : 'Update Homepage'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
