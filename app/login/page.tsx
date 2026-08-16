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
      // அனிமேஷன்: பிழை ஏற்பட்டால் படிவத்தை சிறிது அதிரச் செய்தல் (Shaking animation)
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
    <main className="relative grid min-h-screen place-items-center p-4 overflow-hidden">
      
      {/* அனிமேஷன் பின்னணி: மங்கலான கன்ஸ்ட்ரக்ஷன் படம் + கிரேடியன்ட் */}
      <div 
        className="absolute inset-0 z-0 scale-105"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/37636256/pexels-photo-37636256.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px) brightness(0.3)',
        }}
      />

      {/* அனிமேஷன்: படிவம் கீழிருந்து மெதுவாக வருதல் (Slide-in-up) */}
      <form 
        id="login-form"
        onSubmit={submit} 
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-sm p-10 shadow-2xl border border-white/20 animate-slide-in-up transition-all duration-500"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-900 to-slate-700 bg-clip-text text-transparent">
          BuildMart ERP
        </h1>
        <p className="mb-8 mt-2 text-sm text-slate-600">Construction materials business management</p>
        
        {/* உள்ளீட்டு புலங்கள் (Input fields) - நேர்த்தியான ஸ்டைலிங் */}
        <div className="space-y-5">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
                <input 
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                required 
                placeholder="admin@buildmart.local"
                />
            </div>
            
            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <input 
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                required 
                placeholder="••••••••"
                />
            </div>
        </div>
        
        {/* பிழை செய்தி */}
        {error && <p className="mt-4 text-sm text-center text-red-600 bg-red-50 py-2 rounded-lg animate-fade-in">{error}</p>}
        
        {/* சமர்ப்பி பொத்தான் (Submit Button) - நேரியல் சாய்வு மற்றும் ஹோவர் விளைவு */}
        <button className="btn mt-8 w-full rounded-xl bg-gradient-to-r from-teal-700 to-slate-900 text-white font-semibold py-3 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg">
          Sign in to Dashboard
        </button>
        
        <p className="mt-6 text-xs text-center text-slate-400 border-t border-slate-200 pt-4">
          Seed login: <code className='bg-slate-100 px-1.5 py-0.5 rounded'>admin@buildmart.local</code> / <code className='bg-slate-100 px-1.5 py-0.5 rounded'>ChangeMe123!</code>
        </p>
      </form>

      {/* கூடுதல் அலங்காரம்: நேரியல் இயக்க அனிமேஷன் (கீழே இருந்து மேலே செல்லும் வரிகள்) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-30 z-0">
        <div className="absolute -bottom-full left-1/4 w-px h-[300vh] bg-gradient-to-b from-transparent via-white to-transparent animate-linear-rise delay-100"></div>
        <div className="absolute -bottom-full left-3/4 w-px h-[300vh] bg-gradient-to-b from-transparent via-white to-transparent animate-linear-rise delay-300"></div>
      </div>
      
      {/* CSS அனிமேஷன்களைச் சேர்ப்பதற்கான ஸ்டைல் டேக் */}
      <style jsx global>{`
        @keyframes slide-in-up {
          from { transform: translateY(50px); opacity: 0; }
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
        @keyframes linear-rise {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.7s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-linear-rise { animation: linear-rise 10s linear infinite; }
      `}</style>
    </main>
  );
}