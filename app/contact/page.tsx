"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate network request
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-hotel-cream text-hotel-black font-sans selection:bg-hotel-black selection:text-white pb-32">

            {/* Header */}
            <header className="bg-hotel-black text-white pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image src="https://images.unsplash.com/photo-1577563908411-50cb98976fea?auto=format&fit=crop&q=80" alt="Contact Us" fill className="object-cover" priority />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto text-center mt-12">
                    <h1 className="font-serif text-5xl md:text-6xl mb-6">Get in <span className="italic text-hotel-bronze font-light">Touch</span></h1>
                    <p className="text-gray-400 font-light text-lg max-w-2xl mx-auto">
                        Whether you're a venue looking to partner, or an explorer needing support, we're here to help.
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid md:grid-cols-5 gap-0 shadow-2xl">

                    {/* Contact Info Sidebar */}
                    <div className="md:col-span-2 bg-hotel-black text-white p-12 flex flex-col justify-between">
                        <div>
                            <h2 className="font-serif text-3xl mb-8">Contact Information</h2>
                            <p className="text-gray-400 font-light mb-12">
                                Fill up the form and our Team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <Phone className="text-hotel-bronze shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Phone</p>
                                        <p className="font-light">+263 292 274 111</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="text-hotel-bronze shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Email</p>
                                        <p className="font-light">support@explorablebyo.org</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-hotel-bronze shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Office</p>
                                        <p className="font-light leading-relaxed">
                                            12th Ave & Fife Street<br />
                                            Bulawayo, Zimbabwe
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <h3 className="text-xs uppercase tracking-widest text-hotel-bronze font-bold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="https://twitter.com/explorablebyo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-hotel-bronze hover:border-hotel-bronze transition-colors">
                                    <span className="text-sm font-bold">X</span>
                                </a>
                                <a href="https://linkedin.com/company/explorablebyo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-hotel-bronze hover:border-hotel-bronze transition-colors">
                                    <span className="text-sm font-bold block">In</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-3 bg-white p-12 md:p-16">
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <Send size={32} />
                                </div>
                                <h2 className="font-serif text-3xl text-hotel-black mb-4">Message Sent!</h2>
                                <p className="text-gray-500 font-light mb-8 max-w-md mx-auto">
                                    Thank you for reaching out to ExplorAble. We have received your message and will respond shortly.
                                </p>
                                <button onClick={() => setStatus('idle')} className="text-xs uppercase tracking-widest font-bold border-b-2 border-hotel-bronze pb-1 hover:text-hotel-bronze transition-colors">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-8">
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</label>
                                            <input type="text" required className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-hotel-black transition-colors" placeholder="Jane" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                                            <input type="text" required className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-hotel-black transition-colors" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                            <input type="email" required className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-hotel-black transition-colors" placeholder="jane@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</label>
                                            <input type="tel" className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-hotel-black transition-colors" placeholder="+263..." />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Partnership', 'Support', 'Feedback', 'Other'].map(subj => (
                                                <label key={subj} className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="radio" name="subject" className="accent-hotel-bronze cursor-pointer" defaultChecked={subj === 'Support'} />
                                                    <span className="text-sm font-light text-gray-600 group-hover:text-hotel-black">{subj}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                                        <textarea required rows={4} className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-hotel-black transition-colors resize-none" placeholder="Write your message here..."></textarea>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        disabled={status === 'submitting'}
                                        type="submit"
                                        className="bg-hotel-black text-white px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
