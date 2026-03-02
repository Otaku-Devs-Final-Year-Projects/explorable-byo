"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, User, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Bypassing Supabase Auth completely to avoid Email Rate Limits for the showcase
      // We will simulate a logged in user by storing their "session" in localStorage
      const mockSession = {
        user: {
          email: `${username.toLowerCase().replace(/\s+/g, '')}@explorable.local`,
          user_metadata: {
            full_name: fullName || username
          }
        }
      };

      localStorage.setItem('explorable_mock_session', JSON.stringify(mockSession));

      // Success? Go to Profile
      router.push('/profile');
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-hotel-cream">

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80')] bg-cover"></div>

      <div className="relative z-10 w-full max-w-md bg-white border border-hotel-sand/50 p-8 rounded-sm shadow-2xl animate-fade-in-up">

        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-hotel-black mb-6 text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-serif text-3xl text-hotel-black mb-2">Guest Account</h1>
          <p className="text-gray-500 text-sm">Create an account to save favorite accessible venues.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 text-center rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 text-hotel-black placeholder:text-gray-400 pl-12 pr-4 py-4 focus:outline-none focus:border-hotel-bronze transition-all text-sm rounded-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="guest123"
                className="w-full bg-gray-50 border border-gray-200 text-hotel-black placeholder:text-gray-400 pl-12 pr-4 py-4 focus:outline-none focus:border-hotel-bronze transition-all text-sm rounded-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-hotel-black placeholder:text-gray-400 pl-12 pr-4 py-4 focus:outline-none focus:border-hotel-bronze transition-all text-sm rounded-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hotel-bronze hover:bg-hotel-black text-white font-bold uppercase tracking-[0.2em] text-xs py-4 transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Account"}
          </button>

        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-xs">
            Already have an account? <Link href="/login" className="text-hotel-bronze font-bold hover:underline">Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
