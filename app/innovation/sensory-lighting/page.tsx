"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import LoginGate from '../../components/ui/LoginGate';

export default function SensoryLightingPage() {
    const [authState, setAuthState] = useState<'loading' | 'ok' | 'login' | 'blocked'>('loading');

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session?.user) { setAuthState('login'); return; }
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            setAuthState(profile?.role === 'partner' || profile?.role === 'admin' ? 'ok' : 'blocked');
        });
    }, []);

    if (authState === 'loading') return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading...</div>;
    if (authState === 'login') return <LoginGate message="Please log in to access the Innovation Hub." subMessage="This section is available to Hotel Partners." />;
    if (authState === 'blocked') return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center px-6">
            <div className="bg-white border border-hotel-sand shadow-md p-10 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-hotel-black rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={28} className="text-hotel-bronze" /></div>
                <h2 className="font-serif text-2xl text-hotel-black mb-3">Partner Access Only</h2>
                <p className="text-gray-500 text-sm font-light mb-6">The Innovation Hub is designed for hotel and venue partners.</p>
                <a href="/explore" className="inline-block bg-hotel-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors">Explore Venues Instead</a>
                <div className="mt-4"><a href="/signup" className="text-xs text-gray-400 hover:text-hotel-bronze font-bold underline">Upgrade to Partner Account</a></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans pb-32">

            {/* Hero */}
            <div className="relative h-72 w-full">
                <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
                    alt="Sensory Lighting"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-stone-900/70" />
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:px-16">
                    <Link href="/innovation" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold transition">
                        <ArrowLeft size={14} /> Innovation Hub
                    </Link>
                    <div>
                        <p className="text-[#C6A87C] text-xs uppercase tracking-widest font-bold mb-2">Sensory Accessibility</p>
                        <h1 className="font-serif text-4xl md:text-5xl text-white">Sensory-Responsive Lighting Kits</h1>
                        <p className="text-white/50 mt-2 text-sm font-light">Dimmable · Warm tones · Smartphone controlled</p>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-14 space-y-14">

                {/* Overview */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-4 pb-2 border-b border-stone-200">Overview</h2>
                    <p className="text-stone-600 font-light leading-relaxed mb-4">
                        Sensory-Responsive Lighting Kits are adjustable warm-tone LED lighting systems designed to create a calming, low-stimulation environment for guests with sensory sensitivities — including autism spectrum conditions, migraines, chronic fatigue, and post-traumatic stress.
                    </p>
                    <p className="text-stone-600 font-light leading-relaxed">
                        Harsh fluorescent lighting is one of the most commonly cited accessibility barriers in hospitality environments. This kit replaces standard fittings with dimmable, flicker-free, warm-white LED panels that can be tuned from 2700K (soft candlelight) to 4000K (neutral daylight) — all controlled from a smartphone or a simple bedside panel.
                    </p>
                </section>

                {/* Who Benefits */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Who Benefits</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { group: 'Autism Spectrum Conditions', detail: 'Reduces sensory overload from flickering or high-intensity lights. Calmer environments reduce anxiety and meltdowns.' },
                            { group: 'Migraine Sufferers', detail: 'Direct glare and blue-spectrum light are key migraine triggers. Warm-tone dimmable lighting significantly reduces risk.' },
                            { group: 'Photosensitive Epilepsy', detail: 'Flicker-free LED technology (PWM-free drivers) eliminates the stroboscopic effect that can trigger seizures.' },
                            { group: 'Visual Impairments', detail: 'High contrast between warm ambient light and task lighting helps guests with low vision navigate and read menus.' },
                            { group: 'Chronic Fatigue / Fibromyalgia', detail: 'Bright overhead lighting worsens fatigue symptoms. Adjustable dimming allows guests to personalise their environment.' },
                            { group: 'General Comfort', detail: 'Warm, dimmable lighting improves the atmosphere for all guests — not just those with disabilities.' },
                        ].map((f, i) => (
                            <div key={i} className="flex gap-3 bg-white border border-stone-100 p-5">
                                <Check size={16} className="text-[#C6A87C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-stone-800 mb-1">{f.group}</p>
                                    <p className="text-xs text-stone-500 font-light leading-relaxed">{f.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Kit contents */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Kit Contents</h2>
                    <div className="bg-white border border-stone-200 divide-y divide-stone-100">
                        {[
                            ['LED Panel (main room)', '1× 600×600 mm warm-white LED panel, 40W, 2700K–4000K tunable, dimmable'],
                            ['Bedside Dimmer Strip', '1× 50 cm warm LED strip (3000K), adhesive-backed, USB powered'],
                            ['Smart Controller', '1× Wifi-enabled controller (compatible with iOS, Android, Google Home, Alexa)'],
                            ['Dimmer Switch', '1× Wall-mounted soft-touch rotary dimmer (hardwired or plug-in option)'],
                            ['Diffuser Panels', '2× anti-glare frosted acrylic diffuser panels for existing ceiling fixtures'],
                            ['Colour Temperature', '2700K (warm) to 4000K (neutral) — adjustable in-app or via dimmer'],
                            ['Flicker Rating', 'Flicker-free (PWM-free LED driver) — safe for photosensitive conditions'],
                            ['Installation', 'Plug-and-play bedside strip; ceiling panel requires licensed electrician'],
                            ['App Control', 'Free app (iOS + Android); set scenes, schedules, and colour temperature'],
                            ['Approximate Kit Cost', 'USD $80–$150 per room depending on room size'],
                        ].map(([label, value], i) => (
                            <div key={i} className="flex px-6 py-3 text-sm">
                                <span className="w-48 shrink-0 font-bold text-stone-700">{label}</span>
                                <span className="text-stone-500 font-light">{value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended scenes */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Recommended Lighting Scenes</h2>
                    <div className="space-y-4">
                        {[
                            { scene: 'Arrival Mode', temp: '3000K · 60% brightness', detail: 'Welcoming warm glow when a guest enters. Reduces shock from transition between outdoor daylight and interior.' },
                            { scene: 'Rest Mode', temp: '2700K · 20% brightness', detail: 'Very low, candle-warm light for guests who need to rest during the day, or for nighttime relaxation.' },
                            { scene: 'Task Mode', temp: '4000K · 80% brightness', detail: 'Neutral daylight tone for reading, work, or meal times. High enough contrast for guests with low vision.' },
                            { scene: 'Sensory Break', temp: '2700K · 10% brightness', detail: 'Minimum stimulation setting. Used during sensory overload events — activated by staff or by the guest via the bedside controller.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 border border-stone-100 bg-white p-5">
                                <div className="w-3 h-3 rounded-full bg-[#C6A87C] shrink-0 mt-1.5" />
                                <div>
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                        <p className="font-bold text-stone-800 text-sm">{item.scene}</p>
                                        <span className="text-[10px] uppercase tracking-widest font-bold bg-stone-100 text-stone-500 px-2 py-0.5">{item.temp}</span>
                                    </div>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-stone-900 text-white p-10 text-center">
                    <h3 className="font-serif text-2xl mb-3">Upgrade your venue&apos;s lighting?</h3>
                    <p className="text-stone-400 font-light mb-6 text-sm">Contact our accessibility partners for a lighting audit and room-by-room kit recommendation.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="bg-[#C6A87C] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-stone-900 transition-colors">
                            Contact Us
                        </Link>
                        <Link href="/innovation" className="border border-white/20 text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:border-[#C6A87C] hover:text-[#C6A87C] transition-colors">
                            ← Back to Innovation
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}
