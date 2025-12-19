"use client";

import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Check, Ruler, DoorOpen, Bath, ArrowUpRight, ShieldCheck, Share2, Heart, X, Calendar, User, Info, Mail } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function VenueDetails() {
  const params = useParams();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle | sending | success | error
  
  // Form State
  const [checkIn, setCheckIn] = useState("");
  const [guestCount, setGuestCount] = useState("2 Adults");
  const [guestEmail, setGuestEmail] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchVenueDetails(params.id as string);
    }
  }, [params.id]);

  const fetchVenueDetails = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select(`*, venue_features (*), venue_specs (*)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Handle Features
        const rawFeatures = Array.isArray(data.venue_features) ? data.venue_features[0] : (data.venue_features || {});
        const featuresList = [];
        if (rawFeatures?.wheelchair_accessible) featuresList.push("Wheelchair Accessible");
        if (rawFeatures?.accessible_bathroom) featuresList.push("Accessible Bathroom");
        if (rawFeatures?.step_free_access) featuresList.push("Step-Free Access");
        if (rawFeatures?.braille_signage) featuresList.push("Braille Signage");
        if (rawFeatures?.sign_language_staff) featuresList.push("Sign Language Staff");
        if (rawFeatures?.quiet_space) featuresList.push("Sensory Quiet Space");
        if (rawFeatures?.parking) featuresList.push("Accessible Parking");

        // Handle Specs
        const rawSpecs = Array.isArray(data.venue_specs) ? data.venue_specs[0] : (data.venue_specs || {});
        const specsList = [];
        if (rawSpecs?.door_width) specsList.push({ label: "Door Width", value: rawSpecs.door_width, icon: DoorOpen });
        if (rawSpecs?.ramp_gradient) specsList.push({ label: "Ramp", value: rawSpecs.ramp_gradient, icon: Ruler });
        if (rawSpecs?.flooring) specsList.push({ label: "Flooring", value: rawSpecs.flooring, icon: Bath });

        setVenue({
          id: data.id, // Important for booking linkage
          name: data.name,
          location: data.address,
          rating: data.rating,
          reviews: "Verified",
          price: "Enquire", 
          description: data.description,
          image: data.image_url,
          features: featuresList,
          specs: specsList
        });
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNeed = (need: string) => {
    if (needs.includes(need)) {
      setNeeds(needs.filter(n => n !== need));
    } else {
      setNeeds([...needs, need]);
    }
  };

  const handleBooking = async (e: any) => {
    e.preventDefault();
    setBookingStatus("sending");

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          venue_id: venue.id,
          guest_email: guestEmail,
          check_in_date: checkIn || null, // Handle empty date
          guest_count: guestCount,
          special_requests: needs.join(', ') // Convert array to string
        });

      if (error) throw error;

      setBookingStatus("success");
      // Reset form
      setTimeout(() => {
          setIsModalOpen(false);
          setBookingStatus("idle");
          setCheckIn("");
          setGuestEmail("");
          setNeeds([]);
      }, 3000);

    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStatus("error");
    }
  };

  if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze animate-pulse">Loading Venue...</div>;
  if (!venue) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-stone-500">Venue not found.</div>;

  return (
    <div className="min-h-screen bg-hotel-cream font-sans text-stone-800 pb-24 relative">
      
      {/* HERO HEADER */}
      <div className="relative h-[50vh] w-full">
        <Image 
          src={venue.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"} 
          alt={venue.name} 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        <div className="absolute top-6 left-6 z-10">
          <Link href="/explore" className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-hotel-black transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
          <div className="max-w-7xl mx-auto">
             <div className="flex items-center gap-2 text-hotel-bronze text-sm font-bold mb-2">
               <Star fill="currentColor" size={16} /> {venue.rating}
               <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase ml-2 border border-green-500/30">Verified Accessible</span>
             </div>
             <h1 className="font-serif text-4xl md:text-6xl mb-4">{venue.name}</h1>
             <div className="flex items-center gap-2 text-white/80 text-sm">
               <MapPin size={16} /> {venue.location}
             </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <section>
             <h2 className="font-serif text-2xl text-hotel-black mb-4">About the Venue</h2>
             <p className="text-stone-600 leading-relaxed font-light text-lg">{venue.description}</p>
           </section>
           <section>
             <h2 className="font-serif text-2xl text-hotel-black mb-6 flex items-center gap-3">
               <Ruler className="text-hotel-bronze" /> Technical Specifications
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {venue.specs && venue.specs.length > 0 ? venue.specs.map((spec: any, i: number) => (
                 <div key={i} className="bg-white p-4 rounded-sm border border-hotel-sand/50 text-center">
                    <spec.icon className="mx-auto text-hotel-bronze mb-2" size={24} />
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{spec.label}</p>
                    <p className="font-serif text-xl font-bold text-hotel-black">{spec.value}</p>
                 </div>
               )) : <div className="col-span-4 text-gray-400 text-sm italic">No specs listed.</div>}
             </div>
           </section>
           <section>
             <h2 className="font-serif text-2xl text-hotel-black mb-6">Accessibility Features</h2>
             <div className="grid md:grid-cols-2 gap-4">
               {venue.features.map((feature: string, i: number) => (
                 <div key={i} className="flex items-center gap-3 bg-white px-5 py-3 border border-hotel-sand/30 rounded-sm">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0"><Check size={14} strokeWidth={3} /></div>
                   <span className="text-stone-600 text-sm">{feature}</span>
                 </div>
               ))}
             </div>
           </section>
        </div>

        {/* BOOKING CARD */}
        <div className="relative">
          <div className="sticky top-24 bg-white p-8 rounded-sm shadow-xl border-t-4 border-hotel-bronze">
             <div className="flex justify-between items-end mb-6">
                <div><span className="text-gray-400 text-xs uppercase tracking-widest">Average Rate</span><div className="font-serif text-4xl text-hotel-black">{venue.price}</div></div>
             </div>
             <button onClick={() => setIsModalOpen(true)} className="w-full bg-hotel-black text-white py-4 font-serif uppercase tracking-[0.2em] text-xs font-bold hover:bg-hotel-bronze transition-colors duration-300 mb-3">Check Availability</button>
             <p className="text-center text-xs text-gray-400">No payment required to enquire</p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="bg-hotel-black text-white p-6 flex justify-between items-center">
              <h3 className="font-serif text-xl">Request Availability</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-8">
               {bookingStatus === 'success' ? (
                 <div className="text-center py-10">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
                   <h4 className="font-serif text-2xl text-hotel-black mb-2">Request Sent!</h4>
                   <p className="text-gray-500 text-sm">We have sent the details to {venue.name}.</p>
                 </div>
               ) : (
                 <form onSubmit={handleBooking} className="space-y-6">
                   
                   {/* EMAIL INPUT (NEW) */}
                   <div className="space-y-1">
                     <label className="text-[10px] uppercase font-bold text-gray-500">Your Email</label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                       <input 
                         type="email" 
                         required
                         value={guestEmail}
                         onChange={(e) => setGuestEmail(e.target.value)}
                         placeholder="you@example.com"
                         className="w-full bg-gray-50 border border-gray-200 pl-10 py-2 text-sm rounded-sm focus:border-hotel-bronze focus:outline-none" 
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-gray-500">Check In</label>
                       <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                         <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-gray-50 border border-gray-200 pl-10 py-2 text-sm rounded-sm" />
                       </div>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] uppercase font-bold text-gray-500">Guests</label>
                       <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                         <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full bg-gray-50 border border-gray-200 pl-10 py-2 text-sm rounded-sm">
                           <option>1 Adult</option>
                           <option>2 Adults</option>
                           <option>Family</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-hotel-bronze">Special Requirements</label>
                     <div className="space-y-2">
                       {["Wheelchair Accessible Room", "Dietary Requirements", "Service Animal"].map((req) => (
                         <label key={req} className="flex items-center gap-3 p-3 border border-gray-100 rounded-sm hover:bg-gray-50 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={needs.includes(req)}
                             onChange={() => toggleNeed(req)}
                             className="accent-hotel-bronze" 
                           />
                           <span className="text-sm text-gray-700">{req}</span>
                         </label>
                       ))}
                     </div>
                   </div>

                   {bookingStatus === 'error' && <p className="text-red-500 text-xs text-center">Failed to send request. Please try again.</p>}

                   <button type="submit" disabled={bookingStatus === 'sending'} className="w-full bg-hotel-bronze text-white py-4 font-serif uppercase tracking-widest text-xs font-bold hover:bg-hotel-black transition-colors">
                     {bookingStatus === 'sending' ? 'Sending Request...' : 'Confirm Request'}
                   </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
