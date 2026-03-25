"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';
import GuestDashboardView from '../components/dashboard/GuestDashboardView';
import PartnerDashboardView from '../components/dashboard/PartnerDashboardView';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        checkAuthAndRole();
    }, []);

    const checkAuthAndRole = async () => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !session?.user) {
                router.push('/login');
                return;
            }

            const currentUser = session.user;
            setUser(currentUser);

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
               console.error("Profile fetch error:", profileError);
            }

            // Fallback to guest if no profile found (maybe trigger hasn't fired yet)
            const userProfile = profileData || {
                full_name: currentUser.user_metadata?.full_name,
                role: currentUser.user_metadata?.role || 'guest'
            };
            
            setProfile(userProfile);

        } catch (error) {
            console.error("Auth check failed:", error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-hotel-cream text-hotel-bronze font-serif text-xl">Loading Dashboard...</div>;

    const isGuest = profile?.role === 'guest';

    return (
        <div className="min-h-screen bg-hotel-cream font-sans text-stone-800">
            <header className="bg-hotel-black text-white h-20 flex items-center shadow-md relative z-30">
                <div className="w-full px-6 flex justify-between items-center">
                    <Link href="/explore" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold">
                        <ArrowLeft size={16} /> Explore
                    </Link>
                    <h1 className="font-serif text-xl tracking-tight hidden md:block">
                        {isGuest ? 'Guest' : 'Partner'} <span className="text-hotel-bronze">Dashboard</span>
                    </h1>
                    {isGuest && (
                        <button onClick={handleLogout} className="text-white/60 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                            <LogOut size={16} /> Sign Out
                        </button>
                    )}
                </div>
            </header>

            <div className="w-full">
                {isGuest ? (
                    <GuestDashboardView user={user} profile={profile} onLogout={handleLogout} />
                ) : (
                    <PartnerDashboardView user={user} profile={profile} onLogout={handleLogout} />
                )}
            </div>
        </div>
    );
}
