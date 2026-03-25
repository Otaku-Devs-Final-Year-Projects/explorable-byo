"use client";

import Link from 'next/link';
import { MapPin, ArrowRight, Star, Coffee, Wifi, ShieldCheck, ChevronDown, Activity, Map, UserPlus, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-hotel-cream selection:bg-hotel-bronze selection:text-white font-sans pt-0">

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pb-32 pt-20 md:pt-24">

          <div className="absolute inset-0 animate-slow-pan">
            <Image src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" alt="Luxury Accessible Hotel Room" fill className="object-cover" priority />
          </div>

          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">

            <div className="flex justify-center gap-6 mb-6 items-center opacity-100">
              <div className="h-[1px] w-12 md:w-24 bg-hotel-bronze"></div>
              <div className="flex gap-2 text-hotel-bronze">
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
              </div>
              <div className="h-[1px] w-12 md:w-24 bg-hotel-bronze"></div>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1] drop-shadow-2xl tracking-tight">
              Experience <span className="italic text-hotel-bronze font-light">Accessibility</span> <br />
              Without Compromise
            </h1>

            <p className="font-sans text-gray-200 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed mb-10 font-light tracking-wide drop-shadow-lg">
              Bulawayo's finest collection of verified accessible venues. <br className="hidden md:block" /> Luxury, dignity, and adventure.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/explore"
                className="bg-hotel-bronze text-white font-serif uppercase tracking-[0.2em] text-sm px-10 py-5 hover:bg-white hover:text-hotel-black transition-all duration-300 min-w-[220px] shadow-lg"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="absolute bottom-32 md:bottom-24 animate-bounce text-white/50">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* SEARCH BAR */}
        <div className="relative z-30 px-4 -mt-20 sm:-mt-24">
          <div className="max-w-6xl mx-auto bg-hotel-black text-white p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-t-4 border-hotel-bronze rounded-sm">
            <div className="flex-1 w-full border-b border-white/10 pb-4 md:border-none md:pb-0">
              <label className="text-hotel-bronze text-[10px] uppercase tracking-[0.2em] block mb-2">Destination</label>
              <div className="flex items-center gap-3">
                <MapPin className="text-white opacity-50" size={20} />
                <span className="font-serif text-2xl tracking-wide">Bulawayo</span>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-12 bg-white/10"></div>
            <div className="flex-1 w-full border-b border-white/10 pb-4 md:border-none md:pb-0">
              <label className="text-hotel-bronze text-[10px] uppercase tracking-[0.2em] block mb-2">Requirement</label>
              <select className="bg-transparent text-xl font-serif w-full outline-none cursor-pointer border-none focus:ring-0 text-white placeholder-white p-0">
                <option className="text-black">Wheelchair Access</option>
                <option className="text-black">Visual Aid Support</option>
                <option className="text-black">Sensory Quiet Zones</option>
              </select>
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-0">
              <Link href="/explore" className="block w-full bg-white text-hotel-black text-center px-10 py-5 font-serif uppercase tracking-[0.15em] text-xs font-bold hover:bg-hotel-bronze hover:text-white transition-colors duration-300">
                Check Availability
              </Link>
            </div>
          </div>
        </div>

        {/* WELCOME SECTION */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center md:text-left">
              <span className="text-hotel-bronze text-xs font-bold uppercase tracking-[0.2em] block mb-6">Welcome to ExplorAble</span>
              <h2 className="font-serif text-4xl md:text-5xl text-hotel-black mb-8 leading-[1.1]">
                Exceptional Hospitality <br /> Unmatched <span className="italic text-hotel-bronze">Access</span>
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed text-lg font-light">
                We believe that luxury and accessibility should go hand in hand. Our curated collection of venues ensures that every guest, regardless of ability, experiences the dignity and adventure they deserve.
              </p>
              <div className="grid grid-cols-2 gap-12 border-t border-gray-200 pt-8">
                <div>
                  <h3 className="font-serif text-4xl text-hotel-black mb-1">50+</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Verified Venues</p>
                </div>
                <div>
                  <h3 className="font-serif text-4xl text-hotel-black mb-1">4.9</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Guest Rating</p>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6 w-full">
              <div className="mt-12 md:mt-24">
                <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" alt="Lobby" width={400} height={500} className="rounded-t-full object-cover w-full h-[350px] md:h-[450px] shadow-xl" />
              </div>
              <div>
                <Image src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80" alt="Dining" width={400} height={500} className="rounded-t-full object-cover w-full h-[350px] md:h-[450px] shadow-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section className="bg-hotel-cream py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-hotel-bronze font-bold tracking-widest uppercase text-xs">Why We Exist</span>
              <h2 className="font-serif text-4xl text-hotel-black mt-3 mb-6">Built for Dignity & Adventure</h2>
              <div className="w-16 h-1 bg-hotel-bronze mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white p-10 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-hotel-bronze">
                <div className="w-16 h-16 bg-gray-50 text-hotel-bronze rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-hotel-black">Physically Verified</h3>
                <p className="text-gray-500 leading-relaxed font-light">
                  We don't rely on user submission. Our team visits every location with tape measures and gradients tools.
                </p>
              </div>

              <div className="group bg-hotel-black text-white p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-white/10 text-hotel-bronze rounded-full flex items-center justify-center mb-6">
                  <Map size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Intelligent Routing</h3>
                <p className="text-gray-300 leading-relaxed font-light mb-6">
                  Filter by your specific needs. Whether you need sensory quiet zones or wheelchair accessible bathrooms.
                </p>
                <Link href="/explore" className="text-hotel-bronze font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">
                  Try it now <ChevronRight size={16} />
                </Link>
              </div>

              <div className="group bg-white p-10 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-hotel-bronze">
                <div className="w-16 h-16 bg-gray-50 text-hotel-bronze rounded-full flex items-center justify-center mb-6">
                  <UserPlus size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-hotel-black">Business Growth</h3>
                <p className="text-gray-500 leading-relaxed font-light">
                  Don't leave money on the table. Accessible tourism is a billion-dollar market. List your venue today.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FACILITIES */}
        <section className="bg-white py-32 px-6 border-t border-hotel-sand/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl text-hotel-black mb-4">Our Facilities</h2>
              <div className="w-24 h-[1px] bg-hotel-bronze mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { title: "Verified Ramps", icon: ShieldCheck, text: "Every ramp gradient measured and verified for safety compliance." },
                { title: "Sensory Spaces", icon: Wifi, text: "Dedicated quiet zones and acoustic-friendly environments for comfort." },
                { title: "Accessible Dining", icon: Coffee, text: "Spacious layouts and adaptive menus available upon request." }
              ].map((feature, idx) => (
                <div key={idx} className="group text-center p-10 border border-hotel-sand/30 hover:border-hotel-bronze hover:shadow-xl transition-all duration-500 bg-hotel-cream/30 rounded-t-[100px] rounded-b-lg">
                  <div className="mb-6 inline-block p-4 rounded-full bg-white group-hover:bg-hotel-black transition-colors duration-500 shadow-sm">
                    <feature.icon className="text-hotel-bronze group-hover:text-white transition-colors" size={24} />
                  </div>
                  <h3 className="font-serif text-2xl text-hotel-black mb-4">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-light">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="relative h-[60vh] flex items-center justify-center bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80")' }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 p-8 max-w-4xl text-center">
            <div className="text-hotel-bronze text-6xl font-serif mb-6 opacity-80">"</div>
            <h3 className="font-serif text-3xl md:text-5xl text-white mb-10 leading-tight drop-shadow-lg">
              Where every stay is a journey into sophistication, comfort, and inclusivity.
            </h3>
            <p className="text-white/80 uppercase tracking-[0.3em] text-xs font-bold">— The ExplorAble Promise</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-hotel-black text-white pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
            <div className="md:col-span-2">
              <h4 className="font-serif text-3xl mb-8 tracking-tight">ExplorAble <span className="text-hotel-bronze">.</span></h4>
              <p className="text-gray-400 leading-relaxed font-light">
                742 Evergreen Terrace <br /> Bulawayo, Zimbabwe
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-xl mb-4 text-hotel-bronze">Community</h4>
              <nav className="flex flex-col gap-3 text-sm text-gray-400 font-light">
                <Link href="/innovation" className="hover:text-hotel-bronze transition-colors">Innovation & Tools</Link>
                <Link href="/training" className="hover:text-hotel-bronze transition-colors">Training Academy</Link>
                <Link href="/community" className="hover:text-hotel-bronze transition-colors">Community Forum</Link>
                <Link href="/news" className="hover:text-hotel-bronze transition-colors">News & Updates</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="font-serif text-xl mb-4 text-hotel-bronze">Accounts</h4>
              <div className="flex flex-col gap-2">
                <Link href="/signup" className="inline-block text-white border border-white/20 py-3 px-6 hover:bg-hotel-bronze hover:border-hotel-bronze transition-colors text-center mt-2 uppercase tracking-widest text-xs">Guest Sign Up</Link>
                <Link href="/login" className="inline-block text-white border border-white/20 py-3 px-6 hover:bg-white hover:text-black transition-colors text-center uppercase tracking-widest text-xs">Partner Login</Link>
              </div>
            </div>
          </div>
          <div className="text-center border-t border-white/5 pt-8 text-gray-600 text-xs uppercase tracking-widest">
            <p>© 2025 ExplorAble BYO.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
