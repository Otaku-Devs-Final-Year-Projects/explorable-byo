"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Calendar, Star, TrendingUp, LogOut, Heart, Search, CheckCircle, Settings, MapPin } from 'lucide-react';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';

export default function GuestDashboardView({ user, profile, onLogout }: { user: any, profile: any, onLogout: () => void }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Data States
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [savedVenues, setSavedVenues] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();

        const channel = supabase.channel('dashboard-bookings-guest')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // 1. Fetch Bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`*, venues (name, id, image_url)`)
                .eq('guest_email', user.email)
                .order('created_at', { ascending: false });

            // 2. Fetch Saved Venues
            const { data: saved, error: savedError } = await supabase
                .from('saved_venues')
                .select(`id, venues (id, name, image_url, address)`)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            setMyBookings(bookings || []);
            setSavedVenues(saved || []);

        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 flex items-center justify-center text-hotel-bronze">Loading Guest Data...</div>;

    const guestName = profile?.full_name || user?.email?.split('@')[0] || "Guest";

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-gray-50 w-full">
            {/* SIDEBAR (Mirrors Partner Sidebar exactly) */}
            <aside className="w-full md:w-64 bg-hotel-black text-white flex md:flex-col overflow-y-auto flex-shrink-0 z-20 sticky top-0 h-[calc(100vh-5rem)] border-r border-white/10">
                <div className="p-4 md:p-8 hidden md:block border-b border-white/10 mb-4">
                    <div className="w-12 h-12 bg-hotel-sand text-hotel-black rounded-full flex items-center justify-center font-serif text-2xl mb-4">
                        {guestName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="font-serif text-xl tracking-tight capitalize break-all">{guestName}</h2>
                    <p className="text-white/40 text-xs">Guest Explorer</p>
                </div>
                <nav className="flex md:flex-col flex-1 px-2 md:px-4 py-2 md:space-y-2 space-x-2 md:space-x-0">
                    <NavItem icon={<TrendingUp size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<Calendar size={18} />} label="Bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <NavItem icon={<Heart size={18} />} label="Saved Venues" active={activeTab === 'venues'} onClick={() => setActiveTab('venues')} />
                    <NavItem icon={<Star size={18} />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                    <NavItem icon={<Settings size={18} />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>
                <div className="p-4 md:p-8 border-t border-white/10 hidden md:block mt-auto">
                    <button onClick={onLogout} className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <header className="flex justify-end mb-6">
                    <NotificationsDropdown user={user} />
                </header>
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                    
                    {/* TAB: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Welcome Back, {guestName}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard label="My Requests" value={myBookings.length} icon={<Calendar className="text-hotel-bronze" />} />
                                <StatCard label="Saved Locations" value={savedVenues.length} icon={<Heart className="text-red-400" />} />
                                <StatCard label="Contributions" value={0} icon={<Star className="text-yellow-400" />} />
                            </div>
                            
                            {/* CTA block */}
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mt-8 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-serif text-2xl text-hotel-black mb-2">Ready to explore?</h3>
                                    <p className="text-gray-500 text-sm">Discover new accessible venues verified by our community.</p>
                                </div>
                                <Link href="/explore" className="bg-hotel-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-hotel-bronze transition-colors flex items-center gap-2">
                                    <Search size={16} /> Explore Directory
                                </Link>
                            </div>
                        </>
                    )}

                    {/* TAB: BOOKINGS */}
                    {activeTab === 'bookings' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">My Inquiries & Bookings</h2>
                            <div className="space-y-4">
                                {myBookings.length > 0 ? myBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-full md:w-32 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative">
                                            {booking.venues?.image_url ? (
                                                <img src={booking.venues.image_url} alt={booking.venues.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Calendar /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif text-xl border-b border-hotel-sand/30 pb-2 inline-block text-hotel-black">
                                                    {booking.venues?.name || "Venue"}
                                                </h3>
                                                {booking.status === 'pending' && <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-700 bg-yellow-100 px-3 py-1 rounded-sm border border-yellow-200">Pending</span>}
                                                {booking.status === 'approved' && <span className="text-[10px] font-bold tracking-widest uppercase text-green-700 bg-green-100 px-3 py-1 rounded-sm border border-green-200">Approved</span>}
                                                {booking.status === 'declined' && <span className="text-[10px] font-bold tracking-widest uppercase text-red-700 bg-red-100 px-3 py-1 rounded-sm border border-red-200">Declined</span>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <p className="text-[10px] uppercase text-gray-400 tracking-widest">Requested Dates</p>
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {booking.check_in_date ? (
                                                            booking.check_in_date === booking.check_out_date 
                                                                ? new Date(booking.check_in_date).toLocaleDateString()
                                                                : `${new Date(booking.check_in_date).toLocaleDateString()} - ${new Date(booking.check_out_date).toLocaleDateString()}`
                                                        ) : "Open / TBD"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-gray-400 tracking-widest">Party Size</p>
                                                    <p className="text-sm font-bold text-gray-700">{booking.guest_count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white border border-gray-100 p-12 text-center rounded-sm text-gray-500">
                                        <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                                        <p>You haven't made any booking inquiries yet.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* TAB: SAVED VENUES */}
                    {activeTab === 'venues' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Saved Locations</h2>
                            {savedVenues.length > 0 ? (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {savedVenues.map((item) => (
                                        <Link key={item.id} href={`/explore/${item.venues?.id}`} className="group relative h-48 rounded-sm overflow-hidden flex items-end p-4 border border-hotel-sand/50 shadow-sm cursor-pointer">
                                            {item.venues?.image_url ? (
                                                <>
                                                    <img src={item.venues.image_url} alt={item.venues.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200"></div>
                                            )}
                                            <div className="relative z-10 w-full flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-serif text-xl text-white shadow-black drop-shadow-md">{item.venues?.name}</h3>
                                                    <p className="text-xs text-white/80">{item.venues?.address}</p>
                                                </div>
                                                <Heart size={16} className="text-hotel-bronze" fill="currentColor" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-100 p-12 text-center rounded-sm text-gray-500">
                                    <Heart className="mx-auto mb-4 text-gray-300" size={48} />
                                    <p>Find your favorites in the explore page and save them here.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB: REVIEWS */}
                    {activeTab === 'reviews' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">My Reviews</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                                <Star size={48} className="text-gray-200 mb-4" />
                                <h3 className="text-xl font-serif text-gray-400 mb-2">No Reviews Yet</h3>
                                <p className="text-sm text-gray-400 max-w-sm">Help the community by reviewing locations you visit through ExplorAble.</p>
                            </div>
                        </>
                    )}

                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Profile Settings</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 max-w-2xl">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Name</label>
                                        <input type="text" readOnly value={profile?.full_name || ""} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 text-sm rounded-sm text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address</label>
                                        <input type="email" readOnly value={user?.email || ""} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 text-sm rounded-sm text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Account Role</label>
                                        <div className="inline-block bg-hotel-sand text-hotel-black px-3 py-1 text-xs uppercase tracking-widest font-bold rounded-sm mt-1">Guest</div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 text-right">
                                        <button className="bg-hotel-bronze text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-black transition-colors rounded-sm opacity-50 cursor-not-allowed" disabled>Update Profile</button>
                                        <p className="text-[10px] text-gray-400 mt-2">Profile editing coming soon.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}

// Subcomponents

function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
            <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">{label}</div>
                <div className="text-3xl font-serif text-hotel-black mt-1">{value}</div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${active ? 'bg-hotel-bronze text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="hidden md:block">{label}</span>
        </button>
    );
}
