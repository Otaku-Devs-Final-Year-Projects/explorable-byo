"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Calendar, Star, TrendingUp, LogOut, Clock, CheckCircle, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';

export default function PartnerDashboardView({ user, profile, onLogout }: { user: any, profile: any, onLogout: () => void }) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Data States
    const [stats, setStats] = useState({ bookings: 0, views: 0, rating: 0 });
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [partnerVenues, setPartnerVenues] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();

        const channel = supabase.channel('dashboard-bookings-partner')
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
            // 1. Fetch Partner's Venues securely
            const { data: venues, error: venuesError } = await supabase
                .from('venues')
                .select('*')
                .eq('owner_id', user.id);

            if (venuesError) throw venuesError;
            setPartnerVenues(venues || []);

            // 2. Fetch Bookings for these venues
            const venueIds = venues?.map(v => v.id) || [];
            let bookings: any[] = [];
            
            if (venueIds.length > 0) {
                const { data: b, error: listError } = await supabase
                    .from('bookings')
                    .select(`*, venues (name)`)
                    .in('venue_id', venueIds)
                    .order('created_at', { ascending: false });
                
                if (listError) throw listError;
                bookings = b || [];
            }

            setStats({
                bookings: bookings.length,
                views: 124, // Mock
                rating: 4.8 // Mock
            });

            setRecentBookings(bookings);

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);
            if (error) throw error;

            // Notify Guest
            const booking = recentBookings.find(b => b.id === bookingId);
            if (booking && booking.guest_id) {
                await supabase.from('notifications').insert({
                    user_id: booking.guest_id,
                    title: `Booking ${newStatus === 'approved' ? 'Approved' : 'Declined'}`,
                    message: `Your booking at ${booking.venues?.name || 'the venue'} was ${newStatus}.`
                });
            }

            setRecentBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div className="py-20 flex items-center justify-center text-hotel-bronze">Loading Partner Data...</div>;

    const partnerName = profile?.full_name || user?.email?.split('@')[0] || "Partner";

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-gray-50 w-full">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-hotel-black text-white flex md:flex-col overflow-y-auto flex-shrink-0 z-20 sticky top-0 h-[calc(100vh-5rem)] border-r border-white/10">
                <div className="p-4 md:p-8 hidden md:block border-b border-white/10 mb-4">
                    <div className="w-12 h-12 bg-hotel-bronze text-white rounded-full flex items-center justify-center font-serif text-2xl mb-4">
                        {partnerName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="font-serif text-xl tracking-tight capitalize break-all">{partnerName}</h2>
                    <p className="text-white/40 text-xs">Partner Account</p>
                </div>
                <nav className="flex md:flex-col flex-1 px-2 md:px-4 py-2 md:space-y-2 space-x-2 md:space-x-0">
                    <NavItem icon={<TrendingUp size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<Calendar size={18} />} label="Bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <NavItem icon={<MapPin size={18} />} label="My Venues" active={activeTab === 'venues'} onClick={() => setActiveTab('venues')} />
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
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Dashboard Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard label="Total Enquiries" value={stats.bookings} icon={<Calendar className="text-hotel-bronze" />} />
                                <StatCard label="Profile Views" value={stats.views} icon={<Users className="text-blue-400" />} />
                                <StatCard label="Average Rating" value={stats.rating} icon={<Star className="text-yellow-400" />} />
                            </div>
                            
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mt-8">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-hotel-black">Latest Requests</h3>
                                    <button onClick={() => setActiveTab('bookings')} className="text-xs text-hotel-bronze font-bold uppercase hover:underline">View All</button>
                                </div>
                                <div className="p-6 text-center text-gray-500">
                                    {recentBookings.slice(0,3).map(b => (
                                        <div key={b.id} className="flex justify-between py-3 border-b border-gray-100 last:border-0 text-left">
                                            <div>
                                                <p className="font-bold text-sm text-hotel-black">{b.guest_email}</p>
                                                <p className="text-xs text-gray-500">Requested {b.venues?.name}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 text-right">
                                                {b.check_in_date ? (
                                                    b.check_in_date === b.check_out_date 
                                                        ? new Date(b.check_in_date).toLocaleDateString() 
                                                        : `${new Date(b.check_in_date).toLocaleDateString()} to\n${new Date(b.check_out_date).toLocaleDateString()}`
                                                ) : "TBD"}
                                            </span>
                                        </div>
                                    ))}
                                    {recentBookings.length === 0 && <p className="italic text-sm py-4">No recent activity.</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* TAB: BOOKINGS */}
                    {activeTab === 'bookings' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Incoming Bookings</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3">Guest</th>
                                                <th className="px-6 py-3">Details</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentBookings.length > 0 ? recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{booking.guest_email}</div>
                                        <div className="text-xs text-gray-400">{booking.guest_count}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">{booking.special_requests || "None"}</div>
                                        <div className="text-[10px] text-gray-400 uppercase">{booking.venues?.name || "Venue"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.status === 'pending' && <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase"><Clock size={10} /> Pending</span>}
                                        {booking.status === 'approved' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase"><CheckCircle size={10} /> Approved</span>}
                                        {booking.status === 'declined' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase"><LogOut size={10} /> Declined</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {booking.check_in_date ? (
                                            booking.check_in_date === booking.check_out_date 
                                                ? new Date(booking.check_in_date).toLocaleDateString()
                                                : `${new Date(booking.check_in_date).toLocaleDateString()} - ${new Date(booking.check_out_date).toLocaleDateString()}`
                                        ) : "TBD"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => updateBookingStatus(booking.id, 'approved')} className="bg-hotel-bronze text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-hotel-black transition-colors">Approve</button>
                                                <button onClick={() => updateBookingStatus(booking.id, 'declined')} className="bg-gray-200 text-gray-500 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-gray-300 transition-colors">Decline</button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-300 uppercase tracking-widest">Processed</span>
                                        )}
                                    </td>
                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                                                        No bookings received yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* TAB: VENUES */}
                    {activeTab === 'venues' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">My Venues</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="font-bold text-hotel-black">Linked Listings</h3>
                                    <Link href="/contact" className="text-xs text-hotel-bronze font-bold uppercase hover:underline">Request New Venue</Link>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {partnerVenues.map((venue) => (
                                            <div key={venue.id} className="border border-gray-100 p-4 rounded-sm flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {venue.image_url ? (
                                                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden">
                                                            <img src={venue.image_url} alt={venue.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded-sm"></div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-serif text-hotel-black">{venue.name}</h4>
                                                        <p className="text-xs text-gray-400 truncate max-w-[150px] mb-2">{venue.address}</p>
                                                        <button 
                                                            onClick={async () => {
                                                                const newCap = window.prompt("Enter new max capacity (concurrent rooms/slots):", venue.capacity || "1");
                                                                if (newCap && !isNaN(Number(newCap))) {
                                                                    await supabase.from('venues').update({ capacity: parseInt(newCap) }).eq('id', venue.id);
                                                                    setPartnerVenues(prev => prev.map(v => v.id === venue.id ? { ...v, capacity: parseInt(newCap) } : v));
                                                                }
                                                            }}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-hotel-bronze bg-hotel-sand/50 px-2 py-1 rounded-sm border border-hotel-bronze/20 hover:bg-hotel-sand transition-colors"
                                                        >
                                                            Daily Capacity: {venue.capacity || 1} ✎
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                        <CheckCircle size={10} /> Verified
                                                    </span>
                                                    <Link href={`/explore/${venue.id}`} className="text-[10px] text-hotel-bronze uppercase font-bold mt-1 hover:underline">View Live</Link>
                                                </div>
                                            </div>
                                        ))}
                                        {partnerVenues.length === 0 && (
                                            <p className="text-gray-400 text-sm italic">No venues linked to your account.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* TAB: REVIEWS */}
                    {activeTab === 'reviews' && (
                        <>
                            <h2 className="font-serif text-3xl text-hotel-black mb-6 border-b border-gray-200 pb-4">Guest Reviews</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                                <Star size={48} className="text-gray-200 mb-4" />
                                <h3 className="text-xl font-serif text-gray-400 mb-2">No Reviews Yet</h3>
                                <p className="text-sm text-gray-400 max-w-sm">Once guests have stayed at your venues, their feedback and ratings will appear here.</p>
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
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Name (Public)</label>
                                        <input type="text" readOnly value={profile?.full_name || ""} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 text-sm rounded-sm text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address</label>
                                        <input type="email" readOnly value={user?.email || ""} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 text-sm rounded-sm text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Account Role</label>
                                        <div className="inline-block bg-hotel-black text-white px-3 py-1 text-xs uppercase tracking-widest font-bold rounded-sm mt-1">Partner</div>
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
