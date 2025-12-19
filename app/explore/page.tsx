"use client";

import Link from 'next/link';
import { ArrowLeft, Search, Filter, Star, MapPin, Wifi, VolumeX, Eye, UserCheck, Heart, Map as MapIcon, Grid } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
// FIX: Path is one level up
import { supabase } from '../lib/supabase';
import dynamic from 'next/dynamic';

// Dynamic Import for Map (Disable SSR)
const VenueMap = dynamic(() => import('../components/map/VenueMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 flex items-center justify-center text-gray-400">Loading Map Engine...</div>
});

export default function ExplorePage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select(`*, venue_features (*)`);

      if (error) throw error;

      if (data) {
        const formattedVenues = data.map((v: any) => {
          const f = v.venue_features?.[0] || {}; 
          const tags = [];
          if (f.wheelchair_accessible) tags.push("Wheelchair Access");
          if (f.quiet_space) tags.push("Sensory Quiet");
          if (f.accessible_bathroom) tags.push("Accessible Bathroom");

          return {
            id: v.id,
            name: v.name,
            location: v.address,
            lat: v.latitude,  // Captured from DB
            lng: v.longitude, // Captured from DB
            rating: v.rating,
            reviews: "Verified",
            image: v.image_url,
            price: "Enquire",
            tags: tags
          };
        });
        setVenues(formattedVenues);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = activeFilter === "All" 
    ? venues 
    : venues.filter(v => v.tags.some((t: string) => t.includes(activeFilter)));

  return (
    <div className="min-h-screen bg-hotel-cream font-sans text-stone-800">
      
      {/* HEADER */}
      <header className="bg-hotel-black text-white sticky top-0 z-50 border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
          <h1 className="font-serif text-xl tracking-tight hidden md:block">ExplorAble <span className="text-hotel-bronze">Collection</span></h1>
          
          <div className="flex items-center gap-4">
             {/* VIEW TOGGLE */}
             <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
               <button 
                 onClick={() => setViewMode("grid")}
                 className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-hotel-black' : 'text-white/50 hover:text-white'}`}
               >
                 <Grid size={16} />
               </button>
               <button 
                 onClick={() => setViewMode("map")}
                 className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-white text-hotel-black' : 'text-white/50 hover:text-white'}`}
               >
                 <MapIcon size={16} />
               </button>
             </div>

             <Link href="/login" className="bg-hotel-bronze text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-hotel-black transition-colors hidden sm:block">
               Partner Login
             </Link>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white text-hotel-black border-b border-hotel-sand/30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4 overflow-x-auto no-scrollbar">
             <FilterBtn label="All Venues" active={activeFilter === "All"} onClick={() => setActiveFilter("All")} />
             <div className="w-[1px] h-6 bg-gray-200 mx-2 self-center"></div>
             <FilterBtn icon={<UserCheck size={14}/>} label="Wheelchair" active={activeFilter === "Wheelchair"} onClick={() => setActiveFilter("Wheelchair")} />
             <FilterBtn icon={<VolumeX size={14}/>} label="Sensory" active={activeFilter === "Sensory"} onClick={() => setActiveFilter("Sensory")} />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
           <div className="text-center py-20 text-gray-400 animate-pulse">Loading Collection...</div>
        ) : (
          <>
            {/* GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVenues.map((venue) => (
                  <article key={venue.id} className="group bg-white rounded-sm border border-hotel-sand/30 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <Link href={`/explore/${venue.id}`} className="block relative h-64 overflow-hidden cursor-pointer">
                      {venue.image ? (
                        <Image src={venue.image} alt={venue.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700"/>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-hotel-black shadow-sm">{venue.price}</div>
                    </Link>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-serif text-2xl text-hotel-black">{venue.name}</h3>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1"><MapPin size={12} /> {venue.location}</div>
                        </div>
                        <div className="flex items-center gap-1 text-hotel-bronze text-sm font-bold"><Star fill="currentColor" size={14} /> {venue.rating}</div>
                      </div>
                      <div className="h-[1px] w-full bg-hotel-sand/30 my-4"></div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {venue.tags.map((tag: string, i: number) => (
                          <span key={i} className="bg-hotel-cream text-hotel-brown text-[10px] uppercase tracking-wider font-bold px-2 py-1 border border-hotel-bronze/20">{tag}</span>
                        ))}
                      </div>
                      <Link href={`/explore/${venue.id}`} className="block w-full text-center py-3 border border-hotel-black text-hotel-black text-xs font-bold uppercase tracking-widest hover:bg-hotel-black hover:text-white transition-colors duration-300">View Details</Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* MAP VIEW */}
            {viewMode === "map" && (
              <div className="animate-fade-in-up">
                 <VenueMap venues={filteredVenues} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function FilterBtn({ label, icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${active ? 'bg-hotel-black text-white shadow-lg' : 'bg-white text-gray-400 hover:text-hotel-black hover:bg-gray-50 border border-gray-100'}`}>
      {icon}{label}
    </button>
  );
}
