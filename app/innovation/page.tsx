"use client";

import Link from 'next/link';
import { Lightbulb, Wrench, Download, Play, FileText, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InnovationPage() {
    const mockTechnologies = [
        {
            title: "Eco-Ramps",
            description: "Low-cost, durable ramps made from recycled materials. Tested for safe gradients and weather resistance.",
            image: "https://images.unsplash.com/photo-1579407364450-481fe19bcbe8?auto=format&fit=crop&q=80",
            features: ["Recycled Materials", "Weather Resistant", "Easy Installation"]
        },
        {
            title: "QR Code Signage",
            description: "Audio-descriptive QR codes that can be placed on doors and menus to assist guests with visual impairments.",
            image: "https://images.unsplash.com/photo-1596526131083-e8c638c9c6c7?auto=format&fit=crop&q=80",
            features: ["Audio Descriptions", "Multi-language", "Low Maintenance"]
        },
        {
            title: "Sensory-Friendly Lighting",
            description: "Adjustable warm lighting setups designed to reduce glare and accommodate guests with sensory sensitivities.",
            image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?auto=format&fit=crop&q=80",
            features: ["Dimmable", "Warm Tones", "Anti-Glare"]
        }
    ];

    const [technologies, setTechnologies] = useState(mockTechnologies);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const { data, error } = await supabase.from('innovation_tools').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    setTechnologies(data.map(d => ({
                        title: d.title,
                        description: d.description,
                        image: d.image_url || d.image,
                        features: d.features || []
                    })));
                }
            } catch (err) {
                console.log("Using mock data due to DB error or missing tables (Expected if not seeded):", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTech();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans selection:bg-stone-800 selection:text-white pb-32">

            {/* HERO SECTION */}
            <section className="bg-hotel-black text-white pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900">
                    <Image src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80" alt="Innovation" fill className="object-cover opacity-50" priority />
                </div>
                <div className="relative z-10 text-center px-4 mt-16 max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <Lightbulb className="text-[#C6A87C]" size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-tight">
                        Innovation & <span className="italic text-[#C6A87C]">Tools</span>
                    </h1>
                    <p className="text-stone-300 text-lg md:text-xl font-light tracking-wide">
                        Empowering businesses with low-cost assistive technologies.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">

                {/* Technologies Grid */}
                <div className="bg-white p-10 md:p-16 shadow-2xl rounded-sm mb-24 border-t-4 border-[#C6A87C]">
                    <div className="text-center mb-16">
                        <span className="text-[#C6A87C] text-xs font-bold uppercase tracking-[0.2em]">Accessible Tech</span>
                        <h2 className="font-serif text-4xl text-stone-900 mt-4">Low-Cost Solutions</h2>
                        <div className="w-16 h-[1px] bg-[#C6A87C] mx-auto mt-6"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {technologies.map((tech, idx) => (
                            <div key={idx} className="group border border-stone-100 hover:border-[#C6A87C] transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <Image src={tech.image} alt={tech.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-serif text-2xl text-stone-900 mb-3">{tech.title}</h3>
                                    <p className="text-stone-500 font-light text-sm mb-6 leading-relaxed">{tech.description}</p>

                                    <ul className="space-y-2 mb-8">
                                        {tech.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-center text-xs text-stone-600 font-medium">
                                                <Check size={14} className="text-[#C6A87C] mr-2" /> {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="flex items-center text-xs uppercase tracking-widest font-bold text-stone-400 group-hover:text-[#C6A87C] transition-colors">
                                        Learn More <ChevronRight size={14} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tutorials Section */}
                <section className="mb-24">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                        <div>
                            <span className="text-[#C6A87C] text-xs font-bold uppercase tracking-[0.2em] block mb-2">Guides & Resources</span>
                            <h2 className="font-serif text-4xl text-stone-900">Implementation Tutorials</h2>
                        </div>
                        <Link href="/training" className="hidden md:flex border border-stone-300 px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-stone-900 hover:text-white transition-colors duration-300">
                            View All Resources
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Video Tutorial Card */}
                        <div className="bg-stone-900 text-white p-8 md:p-12 shadow-xl flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Play size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-[#C6A87C] w-12 h-12 flex items-center justify-center mb-8">
                                    <Play size={20} className="text-white" />
                                </div>
                                <h3 className="font-serif text-3xl mb-4">How to install an Eco-Ramp</h3>
                                <p className="font-light text-stone-400 mb-8 max-w-sm">A 5-minute video guide on measuring, assembling, and securing recycled ramps for your venue entrance.</p>
                            </div>
                            <div className="relative z-10 flex items-center text-xs uppercase tracking-widest font-bold text-[#C6A87C]">
                                Watch Video <ChevronRight size={14} className="ml-2" />
                            </div>
                        </div>

                        {/* PDF Resource Card */}
                        <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-stone-900">
                                <FileText size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-stone-100 text-stone-900 w-12 h-12 flex items-center justify-center mb-8 border border-stone-200 group-hover:border-[#C6A87C] transition-colors">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-serif text-3xl mb-4 text-stone-900">Audio QR Setup Guide</h3>
                                <p className="font-light text-stone-500 mb-8 max-w-sm">A comprehensive PDF manual on generating and printing audio-descriptive QR codes for visually impaired guests.</p>
                            </div>
                            <div className="relative z-10 flex items-center text-xs uppercase tracking-widest font-bold text-stone-500 group-hover:text-[#C6A87C] transition-colors">
                                Download PDF <Download size={14} className="ml-2" />
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer CTA */}
            <div className="bg-[#1C1B1A] py-20 text-center">
                <h2 className="font-serif text-3xl text-white mb-6">Need tailored technical support?</h2>
                <p className="text-stone-400 font-light mb-10 max-w-xl mx-auto">Get in touch with our accessibility engineering partners to help fit your business.</p>
                <Link href="/contact" className="bg-[#C6A87C] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#1C1B1A] transition-colors duration-300">
                    Contact Experts
                </Link>
            </div>

        </div>
    );
}
