import React, { useEffect, useState } from 'react';
import { Save, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Profile } from '../../types';

export const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setFeedback(null);
    try {
      await api.updateProfile(profile);
      setFeedback({ type: 'success', message: 'Identity details and profile updated successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 rounded-full border border-[#C6A66A]/40 border-t-[#C6A66A] animate-spin mx-auto mb-4" />
        <span className="text-xs uppercase tracking-widest text-[#C6A66A]">
          Loading Profile Details...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A66A] font-semibold block mb-1">
            Identity Configuration
          </span>
          <h1 className="text-3xl font-serif text-white">
            Profile Management
          </h1>
        </div>
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
        {/* Core Identity */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Primary Artist Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Professional Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Professional Title & Disciplines
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Hero Tagline
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Profile Photo URL (Square / Close Headshot)
              </label>
              <input
                type="url"
                value={profile.photo_url}
                onChange={(e) => handleChange('photo_url', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Portrait URL (Full Cinematic Banner)
              </label>
              <input
                type="url"
                value={profile.portrait_url}
                onChange={(e) => handleChange('portrait_url', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Philosophy */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Biographical Texts & Philosophy
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Short Introduction Snippet
            </label>
            <textarea
              rows={3}
              value={profile.short_bio}
              onChange={(e) => handleChange('short_bio', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Extended Editorial Biography
            </label>
            <textarea
              rows={6}
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Creative Philosophy & Manifesto
            </label>
            <textarea
              rows={3}
              value={profile.philosophy}
              onChange={(e) => handleChange('philosophy', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Representation & Contact Information */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Representation & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Official Agency / Production House
              </label>
              <input
                type="text"
                value={profile.agency || ''}
                onChange={(e) => handleChange('agency', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Operating Locations
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Office Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Office Telephone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-8 bg-[#11151B] border border-white/5 rounded-sm space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-3">
            Industry & Social Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                IMDb URL
              </label>
              <input
                type="url"
                value={profile.imdb || ''}
                onChange={(e) => handleChange('imdb', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={profile.twitter || ''}
                onChange={(e) => handleChange('twitter', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                YouTube URL
              </label>
              <input
                type="url"
                value={profile.youtube || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Vimeo URL
              </label>
              <input
                type="url"
                value={profile.vimeo || ''}
                onChange={(e) => handleChange('vimeo', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#090B0E] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#C6A66A] transition-colors"
              />
            </div>
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
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
