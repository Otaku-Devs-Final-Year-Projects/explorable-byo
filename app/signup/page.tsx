"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, User, Loader2, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("guest");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (signUpError) throw signUpError;

      router.push('/dashboard');
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-hotel-cream py-12">

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80')] bg-cover"></div>

      <div className="relative z-10 w-full max-w-md bg-white border border-hotel-sand/50 p-8 rounded-sm shadow-2xl animate-fade-in-up mt-8 md:mt-0">

        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-hotel-black mb-6 text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-serif text-3xl text-hotel-black mb-2">Join ExplorAble</h1>
          <p className="text-gray-500 text-sm">Create an account to explore or list venues.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 text-center rounded-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-colors ${role === 'guest' ? 'border-hotel-bronze bg-hotel-bronze/10 text-hotel-bronze' : 'border-gray-200 text-gray-400 hover:border-hotel-bronze/50'}`}
            >
              <User size={20} />
              <span className="text-[10px] uppercase font-bold tracking-widest">I am a Guest</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-colors ${role === 'partner' ? 'border-hotel-black bg-hotel-black text-white' : 'border-gray-200 text-gray-400 hover:border-hotel-black/50'}`}
            >
              <Building size={20} />
              <span className="text-[10px] uppercase font-bold tracking-widest">I am a Partner</span>
            </button>
          </div>

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
            <label className="text-[10px] uppercase font-bold text-hotel-bronze tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-hotel-bronze transition-colors" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
