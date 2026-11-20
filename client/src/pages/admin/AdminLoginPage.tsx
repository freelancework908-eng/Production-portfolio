import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, KeyRound, ArrowRight, Sparkles, Film } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('admin@superway.com');
  const [password, setPassword] = useState('cinematic2025!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090C] flex flex-col justify-center items-center p-6 relative selection:bg-[#7952D9]/40">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7952D9]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#C6A04A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0F1218] border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4263EB] to-[#7952D9] flex items-center justify-center text-white shadow-xl shadow-[#7952D9]/30 mx-auto mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-cinzel font-bold text-white tracking-wide mb-1">
            Superway
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#A78BFA] font-medium">
            Centralized Management CMS
          </p>
        </div>

        {/* Credentials Prompt */}
        <div className="p-3.5 bg-black/50 border border-white/10 rounded-lg mb-6 text-xs text-zinc-300">
          <span className="text-zinc-200 font-semibold block mb-1">
            System Administrator Credentials:
          </span>
          <div className="flex flex-col gap-1 text-[11px] font-mono text-zinc-400">
            <span>Email: <strong className="text-white">admin@superway.com</strong> (or <strong className="text-white">admin@arjun-dev.com</strong>)</span>
            <span>Pass: <strong className="text-white">cinematic2025!</strong></span>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 leading-snug">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@superway.com"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
              Security Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#7952D9] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-[#4263EB] to-[#7952D9] hover:from-[#3b5bdb] hover:to-[#7048e8] text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#7952D9]/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Access CMS Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-4">
          <Link to="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};
