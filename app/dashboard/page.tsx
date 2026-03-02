"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, Calendar, Star, TrendingUp, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bookings: 0, views: 0, rating: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [partnerVenues, setPartnerVenues] = useState<any[]>([]);
  const [partnerName, setPartnerName] = useState("Partner");

  useEffect(() => {
    checkUser();
    fetchDashboardData();
  }, []);

  const checkUser = async () => {
    const mockSessionStr = localStorage.getItem('explorable_mock_session');
    if (!mockSessionStr) {
      router.push('/login');
    } else {
      const mockSession = JSON.parse(mockSessionStr);
      setPartnerName(mockSession.user.user_metadata.full_name || mockSession.user.email?.split('@')[0] || "Partner");
    }
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Get Booking Count
      const { count, error: countError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // 2. Get Recent Bookings
      const { data: bookings, error: listError } = await supabase
        .from('bookings')
        .select(`
          *,
          venues (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // 3. Get Partner's Venues (Fallback to all for demo if no specific owner column exists)
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .limit(3);

      if (countError || listError) throw countError || listError;

      setStats({
        bookings: count || 0,
        views: 124, // Placeholder until we track page views
        rating: 4.8 // Placeholder until we aggregate reviews
      });

      setRecentBookings(bookings || []);
      setPartnerVenues(venues || []);

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('explorable_mock_session');
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-hotel-black flex items-center justify-center text-hotel-bronze">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-stone-800 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-hotel-black text-white hidden md:flex flex-col">
        <div className="p-8">
          <h1 className="font-serif text-xl tracking-tight">ExplorAble <span className="text-hotel-bronze">Partner</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<TrendingUp size={18} />} label="Overview" active />
          <NavItem icon={<Calendar size={18} />} label="Bookings" />
          <NavItem icon={<Star size={18} />} label="Reviews" />
          <NavItem icon={<Users size={18} />} label="Profile" />
        </nav>
        <div className="p-8 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-serif text-2xl text-hotel-black capitalize">Welcome back, {partnerName}</h2>
          <div className="w-10 h-10 bg-hotel-bronze text-white rounded-full flex items-center justify-center font-bold">
            {partnerName.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Enquiries" value={stats.bookings} icon={<Calendar className="text-hotel-bronze" />} />
            <StatCard label="Profile Views" value={stats.views} icon={<Users className="text-blue-400" />} />
            <StatCard label="Average Rating" value={stats.rating} icon={<Star className="text-yellow-400" />} />
          </div>

          {/* RECENT BOOKINGS TABLE */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-hotel-black">Recent Requests</h3>
              <Link href="#" className="text-xs text-hotel-bronze font-bold uppercase hover:underline">View All</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Guest</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
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
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                          <Clock size={10} /> Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(booking.created_at).toLocaleDateString()}
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

          {/* VENUE VERIFICATION STATUS */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-hotel-black">My Venues & Verification</h3>
              <Link href="#" className="text-xs text-hotel-bronze font-bold uppercase hover:underline">Add New Venue</Link>
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
                        <p className="text-xs text-gray-400">{venue.address}</p>
                      </div>
                    </div>
                    {/* If we had a verified column, we'd check it. Assuming verified for demo */}
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

        </div>
      </main>
    </div>
  );
}

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

function NavItem({ icon, label, active }: any) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${active ? 'bg-hotel-bronze text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      {label}
    </a>
  );
}
