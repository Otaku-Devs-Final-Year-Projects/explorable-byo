"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Heart, Calendar, ArrowLeft, Settings } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [myBookings, setMyBookings] = useState<any[]>([]);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const mockSessionStr = localStorage.getItem('explorable_mock_session');

            if (!mockSessionStr) {
                router.push('/signup');
                return;
            }

            const mockSession = JSON.parse(mockSessionStr);
            setUser(mockSession.user);

            // Fetch bookings linked to this user's email
            if (mockSession.user.email) {
                const { data: bookings, error: bookingsError } = await supabase
                    .from('bookings')
                    .select(`*, venues (name, id, image_url)`)
                    .eq('guest_email', mockSession.user.email)
                    .order('created_at', { ascending: false });

                if (!bookingsError && bookings) {
                    setMyBookings(bookings);
                }
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('explorable_mock_session');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-hotel-cream font-sans text-stone-800 pb-24">

            <header className="bg-hotel-black text-white h-20 flex items-center shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    <Link href="/explore" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold">
                        <ArrowLeft size={16} /> Explore
                    </Link>
                    <h1 className="font-serif text-xl tracking-tight hidden md:block">Guest <span className="text-hotel-bronze">Profile</span></h1>
                    <button onClick={handleLogout} className="text-white/60 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-12">

                {/* SIDEBAR PROFILE INFO */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 border border-hotel-sand/50 rounded-sm shadow-sm text-center">
                        <div className="w-20 h-20 mx-auto bg-hotel-bronze rounded-full text-white flex items-center justify-center font-serif text-4xl mb-4">
                            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-serif text-xl text-hotel-black mb-1">{user?.user_metadata?.full_name || "Guest User"}</h2>
                        <p className="text-stone-500 text-sm mb-6">{user?.email}</p>
                        <button className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold text-hotel-black border border-hotel-black py-2 hover:bg-hotel-black hover:text-white transition-colors">
                            <Settings size={14} /> Account Settings
                        </button>
                    </div>
                </aside>

                {/* MAIN TABS (Inquiries & Bookings) */}
                <div className="lg:col-span-3">
                    <h2 className="font-serif text-3xl text-hotel-black mb-8 border-b border-hotel-sand/50 pb-4">My Requests & Inquiries</h2>

                    {myBookings.length > 0 ? (
                        <div className="space-y-6">
                            {myBookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-6 border border-hotel-sand/50 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                    {booking.venues?.image_url ? (
                                        <div className="w-full md:w-48 h-32 relative hidden md:block rounded-sm overflow-hidden">
                                            <img src={booking.venues.image_url} alt="Venue" className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="w-full md:w-48 h-32 bg-gray-100 flex items-center justify-center text-gray-400 hidden md:flex rounded-sm">
                                            No Image
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-serif text-xl text-hotel-black">
                                                {booking.venues?.name || "Unknown Venue"}
                                            </h3>
                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-stone-600 mb-4">
                                            <div className="flex items-center gap-2"><Calendar size={14} className="text-hotel-bronze" /> Check In: {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : 'N/A'}</div>
                                            <div className="flex items-center gap-2"><Heart size={14} className="text-hotel-bronze" /> Needs: {booking.special_requests || "None"}</div>
                                        </div>
                                        <Link href={`/explore/${booking.venues?.id}`} className="text-xs font-bold uppercase tracking-widest text-hotel-bronze hover:underline">
                                            View Venue Profile
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 border border-hotel-sand/50 rounded-sm shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-hotel-bronze">
                                <Calendar size={24} />
                            </div>
                            <h3 className="font-serif text-xl text-hotel-black mb-2">No Requests Yet</h3>
                            <p className="text-stone-500 mb-6">You haven't enquired about any venues yet. Explore Bulawayo's finest accessible locations.</p>
                            <Link href="/explore" className="bg-hotel-black text-white px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-hotel-bronze transition-colors rounded-sm inline-block">
                                Explore Venues
                            </Link>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
