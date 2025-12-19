"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Loader2 } from 'lucide-react';
// FIX: Path is one level up
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Attempt Real Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      // 2. Success? Go to Dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-hotel-black">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover" 
          alt="Luxury Hotel Lobby"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-2xl animate-fade-in-up">
        
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">Partner Access</h1>
          <p className="text-white/40 text-sm">Manage your venue profile and bookings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@venue.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 pl-12 pr-4 py-4 focus:outline-none focus:border-hotel-bronze focus:bg-white/10 transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 pl-12 pr-4 py-4 focus:outline-none focus:border-hotel-bronze focus:bg-white/10 transition-all text-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-hotel-bronze hover:bg-white hover:text-hotel-black text-white font-bold uppercase tracking-[0.2em] text-xs py-4 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Secure Login"}
          </button>

        </form>
        
        <div className="mt-8 text-center">
           <p className="text-white/20 text-xs">Protected by ExplorAble Secure Gate</p>
        </div>

      </div>
    </div>
  );
}
