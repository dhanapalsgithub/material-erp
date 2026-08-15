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
      setError('Invalid email or password');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-teal-800 to-slate-900 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-bold">BuildMart ERP</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Construction materials business management</p>
        
        <label className="mb-1 block text-sm">Email</label>
        <input 
          className="mb-4 w-full" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          type="email" 
          required 
        />
        
        <label className="mb-1 block text-sm">Password</label>
        <input 
          className="w-full" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          type="password" 
          required 
        />
        
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        
        <button className="btn mt-6 w-full">Sign in</button>
        
        <p className="mt-4 text-xs text-slate-500">
          Seed login: admin@buildmart.local / ChangeMe123!
        </p>
      </form>
    </main>
  );
}