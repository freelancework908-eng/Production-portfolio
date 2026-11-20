import React, { useEffect, useState } from 'react';
import { Settings, Save, KeyRound, CheckCircle2, Globe, Shield } from 'lucide-react';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('SUPERWAY');
  const [tagline, setTagline] = useState('Two Creative Divisions. One Relentless Standard.');
  const [studioName, setStudioName] = useState('SUPERWAY STUDIO');
  const [studioTagline, setStudioTagline] = useState('Creative Design, Branding, Digital Solutions & Software Engineering');
  const [productionName, setProductionName] = useState('SUPERWAY PRODUCTION');
  const [productionTagline, setProductionTagline] = useState('Cinematic Film, Commercials, Visual Storytelling & Video Production');
  const [email, setEmail] = useState('contact@superway.com');
  const [phone, setPhone] = useState('+91 (0) 98200 45678');
  const [location, setLocation] = useState('Mumbai · Bengaluru · London');
  const [aboutCompany, setAboutCompany] = useState('');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [youtube, setYoutube] = useState('https://youtube.com');
  const [vimeo, setVimeo] = useState('https://vimeo.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await api.getSettings();
        setSettings(data);
        if (data) {
          setCompanyName(data.company_name || 'SUPERWAY');
          setTagline(data.tagline || '');
          setStudioName(data.studio_name || 'SUPERWAY STUDIO');
          setStudioTagline(data.studio_tagline || '');
          setProductionName(data.production_name || 'SUPERWAY PRODUCTION');
          setProductionTagline(data.production_tagline || '');
          setEmail(data.email || 'contact@superway.com');
          setPhone(data.phone || '+91 (0) 98200 45678');
          setLocation(data.location || 'Mumbai · Bengaluru · London');
          setAboutCompany(data.about_company || '');
          if (data.social) {
            setInstagram(data.social.instagram || '');
            setYoutube(data.social.youtube || '');
            setVimeo(data.social.vimeo || '');
            setLinkedin(data.social.linkedin || '');
          }
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSettings({
        company_name: companyName,
        tagline,
        studio_name: studioName,
        studio_tagline: studioTagline,
        production_name: productionName,
        production_tagline: productionTagline,
        email,
        phone,
        location,
        about_company: aboutCompany,
        social: {
          instagram,
          youtube,
          vimeo,
          linkedin
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword) {
      setPasswordError('Please provide both current and new passwords.');
      return;
    }

    try {
      await api.updatePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-zinc-500">Loading site settings...</div>;
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] font-semibold block mb-1">
          Configuration
        </span>
        <h1 className="text-3xl font-serif text-white">Basic Site Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage brand names, division identities, company contact channels, and admin security.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Site settings saved and synchronized across both divisions.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Company Identity */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 className="text-base font-serif font-bold text-white">Unified Corporate Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9]"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1.5">
                Company Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#7952D9]"
              />
            </div>
          </div>
        </div>

        {/* Division Identities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Studio Division Settings */}
          <div className="p-6 rounded-2xl bg-[#10152D]/60 border border-[#7952D9]/30 space-y-4">
            <h3 className="text-sm font-bold text-[#A78BFA] uppercase tracking-wider">Studio Division Branding</h3>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Studio Brand Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Studio Tagline
              </label>
              <textarea
                rows={2}
                value={studioTagline}
                onChange={(e) => setStudioTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs resize-none"
              />
            </div>
          </div>

          {/* Production Division Settings */}
          <div className="p-6 rounded-2xl bg-[#171717] border border-[#C6A04A]/30 space-y-4">
            <h3 className="text-sm font-bold text-[#D9B96E] uppercase tracking-wider">Production Division Branding</h3>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Production Brand Name
              </label>
              <input
                type="text"
                value={productionName}
                onChange={(e) => setProductionName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Production Tagline
              </label>
              <textarea
                rows={2}
                value={productionTagline}
                onChange={(e) => setProductionTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 className="text-base font-serif font-bold text-white">Contact & Office Locations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Public Inquiries Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Direct Phone Line
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Office Locations
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Channels */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 className="text-base font-serif font-bold text-white">Social Media Links</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Vimeo URL
              </label>
              <input
                type="text"
                value={vimeo}
                onChange={(e) => setVimeo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4263EB] to-[#7952D9] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md shadow-[#7952D9]/20 transition-all hover:scale-105"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Site Settings'}</span>
        </button>
      </form>

      {/* Admin Password Security Form */}
      <div className="pt-8 border-t border-white/5">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
            <Shield size={18} className="text-[#A78BFA]" />
            <h3>Update Administrator Password</h3>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              Password updated successfully.
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
