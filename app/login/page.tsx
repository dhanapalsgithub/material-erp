'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('admin@buildmart.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!r.ok) {
      const form = document.getElementById('login-form');
      form?.classList.add('animate-shake');
      setTimeout(() => form?.classList.remove('animate-shake'), 500);
      
      setError('Invalid email or password');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 w-full bg-slate-950 overflow-hidden">
      
      {/* Background Ambient Glowing Liquid Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Left Side: Construction Image & Zoom-in Zoom-out Blinking Title */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden z-10">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.35] scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent z-0" />
        
        {/* Top Branding */}
        <div className="relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
            R I Billing Pro Solution
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">BuildMart ERP</h1>
        </div>

        {/* Middle Description with Zoom-in Zoom-out and Blink Animation */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="overflow-hidden py-2">
            <h2 className="text-3xl font-black tracking-wide leading-tight inline-block animate-zoom-blink bg-gradient-to-r from-teal-300 via-sky-200 to-white bg-clip-text text-transparent">
              R I Billing Pro Solution
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-2xl border border-white/10">
            Crafted with precision by <strong className="text-teal-300">R I Billing Pro</strong>, this advanced suite streamlines your construction workflow, inventory tracking, labor management, and billing processes under one robust platform.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} R I Billing Pro. All rights reserved.
        </div>
      </div>

      {/* Right Side: Liquid Glassmorphism Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        <form 
          id="login-form"
          onSubmit={submit} 
          className="w-full max-w-md rounded-3xl bg-white/15 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 animate-slide-in-up transition-all duration-500 relative overflow-hidden"
        >
          {/* Internal Glass Highlight Shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="mb-6 lg:hidden">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">R I Billing Pro</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome Back!
          </h2>
          <p className="mb-8 mt-1.5 text-sm text-slate-300">Sign in to continue to BuildMart ERP</p>
          
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Email Address</label>
              <input 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-teal-400 focus:bg-white/10 focus:ring-2 focus:ring-teal-400/20 outline-none backdrop-blur-md transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                required 
                placeholder="admin@buildmart.local"
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Password</label>
              <input 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-400 focus:border-teal-400 focus:bg-white/10 focus:ring-2 focus:ring-teal-400/20 outline-none backdrop-blur-md transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                required 
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {error && <p className="mt-4 text-sm text-center text-red-300 bg-red-950/50 border border-red-500/30 py-2 rounded-xl backdrop-blur-md animate-fade-in">{error}</p>}
          
          <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-600 text-white font-semibold py-3.5 hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]">
            Sign in to Dashboard
          </button>
          
          <p className="mt-6 text-xs text-center text-slate-400 border-t border-white/10 pt-4">
            Seed login: <code className='bg-white/10 px-1.5 py-0.5 rounded text-teal-300'>admin@buildmart.local</code> / <code className='bg-white/10 px-1.5 py-0.5 rounded text-teal-300'>ChangeMe123!</code>
          </p>
        </form>
      </div>

      <style jsx global>{`
        @keyframes slide-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes zoomBlink {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.7; }
        }
        .animate-slide-in-up { animation: slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-zoom-blink { animation: zoomBlink 3s ease-in-out infinite; }
      `}</style>
    </main>
  );
}