"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export default function EcoRampsPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans pb-32">

            {/* Hero */}
            <div className="relative h-72 w-full">
                <Image
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80"
                    alt="Eco-Ramps"
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
                        <p className="text-[#C6A87C] text-xs uppercase tracking-widest font-bold mb-2">Accessible Infrastructure</p>
                        <h1 className="font-serif text-4xl md:text-5xl text-white">Eco-Ramps</h1>
                        <p className="text-white/50 mt-2 text-sm font-light">Low-cost · Sustainable · Weather-resistant</p>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-14 space-y-14">

                {/* Overview */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-4 pb-2 border-b border-stone-200">Overview</h2>
                    <p className="text-stone-600 font-light leading-relaxed mb-4">
                        Eco-Ramps are a pioneering low-cost accessibility solution developed for the Zimbabwean hospitality market. Fabricated from recycled high-density polyethylene (HDPE) plastic and reclaimed timber, each ramp is engineered to meet the 1:12 gradient standard recommended by the World Health Organisation for wheelchair access.
                    </p>
                    <p className="text-stone-600 font-light leading-relaxed">
                        Unlike traditional concrete ramps — which can cost thousands of dollars and require weeks of construction — an Eco-Ramp can be installed at a venue entrance in under two hours, at a fraction of the cost. Modular panel design means ramps can be reconfigured to fit doorways of different widths.
                    </p>
                </section>

                {/* Key Features */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Key Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Recycled Materials', detail: 'Made from post-consumer HDPE plastic and reclaimed hardwood — diverts waste from landfill.' },
                            { title: '1:12 Safe Gradient', detail: 'Tested to WHO and ADA standards. Suitable for manual and power wheelchairs, walkers, and prams.' },
                            { title: 'Weather Resistant', detail: 'UV-stabilised surface coating prevents cracking or warping in direct sunlight or heavy rainfall.' },
                            { title: 'Non-slip Surface', detail: 'Embossed grip texture provides traction in wet conditions. Tested at 30° of tilt without slip.' },
                            { title: 'Modular & Portable', detail: 'Individual panels connect with stainless steel bolts — no concrete, no permanent fixings required.' },
                            { title: 'High Weight Capacity', detail: 'Panels rated to 300 kg evenly distributed. Suitable for heavy electric wheelchair models.' },
                            { title: 'Easy Installation', detail: 'Two-person installation in under 2 hours. No specialist tools or contractor required.' },
                            { title: 'Low Maintenance', detail: 'Wipe-clean surface. Annual inspection for bolt tightness is the only maintenance required.' },
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

                {/* Specifications */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Technical Specifications</h2>
                    <div className="bg-white border border-stone-200 divide-y divide-stone-100">
                        {[
                            ['Gradient', '1:12 (4.8°)'],
                            ['Panel Width Options', '800 mm · 900 mm · 1000 mm · 1200 mm'],
                            ['Standard Rise Heights', '100 mm · 150 mm · 200 mm'],
                            ['Weight Capacity', '300 kg (distributed)'],
                            ['Surface Texture', 'Embossed non-slip grid pattern'],
                            ['Material', 'Recycled HDPE + Reclaimed hardwood edge rails'],
                            ['Fixing Method', 'M10 stainless steel bolt-and-nut system'],
                            ['Colour Options', 'Charcoal Grey · Sand · Terracotta'],
                            ['Approximate Cost (per unit)', 'USD $120–$200 depending on width/height'],
                            ['Assembly Time', '1–2 hours (two-person installation)'],
                        ].map(([label, value], i) => (
                            <div key={i} className="flex px-6 py-3 text-sm">
                                <span className="w-48 shrink-0 font-bold text-stone-700">{label}</span>
                                <span className="text-stone-500 font-light">{value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Installation Guide */}
                <section>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6 pb-2 border-b border-stone-200">Quick Installation Guide</h2>
                    <div className="space-y-5">
                        {[
                            { step: '1. Measure your entrance', detail: 'Measure the door width and the height of the step or threshold being ramped. Select the correct panel width and rise height from the order form.' },
                            { step: '2. Prepare the surface', detail: 'Ensure the ground surface at the base of the ramp is clean, level, and stable. Remove loose gravel or debris. A concrete or compacted gravel base is ideal.' },
                            { step: '3. Assemble the panels', detail: 'Lay the base panels flat and connect the side edge rails using the supplied M10 stainless steel bolts. Hand-tighten, then use a 17 mm spanner to lock firmly.' },
                            { step: '4. Secure to the step', detail: 'Position the assembled ramp against the step. Use the supplied rawl bolts to anchor the top lip to the step face (if permanent installation is desired) — or use the rubber anti-slip foot pads for a non-permanent placement.' },
                            { step: '5. Test before use', detail: 'Walk across the ramp and test with a wheeled item (trolley or wheelchair) before opening to guests. Check for any flex or movement in the joints and tighten if necessary.' },
                        ].map((item, i) => (
                            <div key={i} className="pl-5 border-l-2 border-[#C6A87C]">
                                <p className="font-bold text-stone-800 text-sm mb-1">{item.step}</p>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-stone-900 text-white p-10 text-center">
                    <h3 className="font-serif text-2xl mb-3">Interested in Eco-Ramps for your venue?</h3>
                    <p className="text-stone-400 font-light mb-6 text-sm">Get in touch with our accessibility infrastructure partners for a site assessment and quote.</p>
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
