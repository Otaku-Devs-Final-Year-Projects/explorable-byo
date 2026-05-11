"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check } from 'lucide-react';

export default function AudioQRPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans pb-32">

            {/* Hero */}
            <div className="relative h-72 w-full">
                <Image
                    src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80"
                    alt="Audio QR Signage"
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
                        <p className="text-[#C6A87C] text-xs uppercase tracking-widest font-bold mb-2">Digital Accessibility</p>
                        <h1 className="font-serif text-4xl md:text-5xl text-white">Audio QR Signage Hub</h1>
                        <p className="text-white/50 mt-2 text-sm font-light">Free to generate · Multi-language · No hardware required</p>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-14 space-y-14">

                {/* Overview */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-4 pb-2 border-b border-stone-200">Overview</h2>
                    <p className="text-stone-600 font-light leading-relaxed mb-4">
                        The Audio QR Signage Hub enables hospitality venues to provide spoken descriptions of rooms, menus, facilities, and wayfinding — all through a printed QR code that any smartphone can scan for free. No dedicated app, no specialist hardware, and no recurring costs.
                    </p>
                    <p className="text-stone-600 font-light leading-relaxed">
                        A guest who is visually impaired, navigating in an unfamiliar space, or reading in a second language simply points their phone camera at a sign — and hears a clear, professional audio description. This technology aligns with the WCAG 2.1 AA standard for non-text content and the UN Convention on the Rights of Persons with Disabilities.
                    </p>
                </section>

                {/* How It Works */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { num: '01', title: 'Record', detail: 'Staff record a short audio description using any smartphone. Recordings are uploaded to free cloud storage (Google Drive or Dropbox).' },
                            { num: '02', title: 'Generate', detail: 'A QR code is generated (for free at qr-code-generator.com) that links directly to the audio file. The code is downloaded as a high-res image.' },
                            { num: '03', title: 'Scan & Hear', detail: 'Guests scan the printed code with any smartphone camera — no app needed — and the audio description plays immediately in their browser.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-stone-100 p-6">
                                <p className="font-serif text-4xl text-[#C6A87C] mb-3">{item.num}</p>
                                <p className="font-bold text-stone-800 mb-2">{item.title}</p>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Key Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'No App Required', detail: 'Works with any modern smartphone camera app — iOS, Android, and Vivaldi/Chrome on mobile.' },
                            { title: 'Free to Implement', detail: 'Zero software cost. Uses free QR generators, free cloud storage, and any standard printer.' },
                            { title: 'Multi-Language Support', detail: 'Record separate audio tracks in Shona, Ndebele, English, or any language. Use different QR codes per language or link to a menu page.' },
                            { title: 'Audio Descriptions', detail: 'Rich verbal descriptions for menus, room amenities, wayfinding, emergency procedures, and more.' },
                            { title: 'No Recurring Costs', detail: 'Google Drive (free up to 15 GB) and Dropbox (free up to 2 GB) host all audio files indefinitely.' },
                            { title: 'Easy to Update', detail: 'Record a new audio file, swap the link in the QR generator, re-download and reprint. Takes under 10 minutes.' },
                        ].map((f, i) => (
                            <div key={i} className="flex gap-3 bg-white border border-stone-100 p-5">
                                <Check size={16} className="text-[#C6A87C] shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-stone-800 mb-1">{f.title}</p>
                                    <p className="text-xs text-stone-500 font-light leading-relaxed">{f.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Placements */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Recommended Placements</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {[
                            'Main entrance door (at wheelchair height — 90–110 cm)',
                            'Reception desk front panel',
                            'Restaurant tables and menus',
                            'Accessible bathroom entrances',
                            'Lift call button panels',
                            'Accessible guest room doors',
                            'Conference room entrances',
                            'Pool and leisure facility entrances',
                            'Fire exit signage near accessible routes',
                            'Accessible parking bay signs',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-stone-600 font-light">
                                <Check size={12} className="text-[#C6A87C] shrink-0" /> {item}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Full Guide CTA */}
                <div className="bg-stone-100 border border-stone-200 p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div>
                        <p className="font-bold text-stone-800 mb-1">Ready to implement?</p>
                        <p className="text-stone-500 text-sm font-light">Download the complete step-by-step setup guide including troubleshooting and a printable placement checklist.</p>
                    </div>
                    <Link href="/innovation/guide" target="_blank" className="shrink-0 bg-[#C6A87C] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-stone-900 transition-colors whitespace-nowrap">
                        Full Setup Guide →
                    </Link>
                </div>

                {/* CTA */}
                <div className="bg-stone-900 text-white p-10 text-center">
                    <h3 className="font-serif text-2xl mb-3">Need help setting this up?</h3>
                    <p className="text-stone-400 font-light mb-6 text-sm">Our team can assist with recording, QR generation, and signage design for your venue.</p>
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
