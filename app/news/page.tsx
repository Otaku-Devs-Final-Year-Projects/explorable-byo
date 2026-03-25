"use client";

import Image from 'next/image';
import { Calendar, ArrowRight, Rss } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function NewsPage() {
    const mockArticles = [
        {
            id: '1',
            title: "ExplorAble Partners with Zimbabwe Tourism Authority",
            excerpt: "A landmark agreement to integrate our verified accessibility data directly into the national tourism planning dashboard.",
            category: "Partnership",
            date: "Nov 12, 2025",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80",
            featured: true
        },
        {
            id: '2',
            title: "New Feature: AI-Powered Audio Navigation",
            excerpt: "Our web app now supports full voice navigation for visually impaired users. Learn how to use 'Peace of Mind' mode.",
            category: "Platform Update",
            date: "Oct 28, 2025",
            image: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&q=80",
            featured: false
        },
        {
            id: '3',
            title: "Call for Volunteers: Bulawayo Mapping Drive",
            excerpt: "We are looking for local volunteers to help us verify 50 new venues in the CBD this coming weekend.",
            category: "Community",
            date: "Oct 15, 2025",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
            featured: false
        }
    ];

    const [articles, setArticles] = useState(mockArticles);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setArticles(data.map(d => ({
                        id: d.id,
                        title: d.title,
                        excerpt: d.excerpt,
                        category: d.category,
                        date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        image: d.image_url,
                        featured: d.is_featured
                    })));
                }
            } catch (err) {
                console.log("Using mock data for news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading News...</div>;

    return (
        <div className="min-h-screen bg-hotel-cream text-hotel-black font-sans selection:bg-hotel-black selection:text-white pb-32">

            {/* Header */}
            <header className="bg-hotel-black text-white pt-12 pb-16 px-6">
                <div className="flex justify-center mb-4">
                    <Rss size={32} className="text-hotel-bronze" />
                </div>
                <h1 className="font-serif text-5xl md:text-6xl mb-6 text-hotel-black">News & <span className="italic text-hotel-bronze font-light">Updates</span></h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg font-light tracking-wide">
                    Stay informed about platform improvements, new partnerships, and community initiatives.
                </p>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">

                {/* Featured Article */}
                <Link href={`/news/${articles[0].id}`} className="mb-20 group cursor-pointer block">
                    <span className="text-xs font-bold uppercase tracking-widest text-hotel-bronze block mb-6">Featured Story</span>
                    <div className="grid md:grid-cols-2 gap-0 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-500">
                        <div className="relative h-64 md:h-auto overflow-hidden">
                            <Image src={articles[0].image} alt={articles[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-10 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                                <span>{articles[0].category}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center"><Calendar size={12} className="mr-2" /> {articles[0].date}</span>
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl text-hotel-black mb-6 leading-tight group-hover:text-hotel-bronze transition-colors">
                                {articles[0].title}
                            </h2>
                            <p className="text-gray-500 font-light text-lg mb-8 leading-relaxed">
                                {articles[0].excerpt}
                            </p>
                            <div className="flex items-center text-xs uppercase tracking-widest font-bold text-hotel-black group-hover:text-hotel-bronze transition-colors">
                                Read Full Article <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.slice(1).map((article) => (
                        <Link href={`/news/${article.id}`} key={article.id} className="bg-white border border-hotel-sand hover:border-hotel-bronze transition-colors duration-300 group cursor-pointer flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                                    <span className="text-hotel-bronze">{article.category}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{article.date}</span>
                                </div>
                                <h3 className="font-serif text-2xl text-hotel-black mb-4 group-hover:text-hotel-bronze transition-colors list-none">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 font-light text-sm leading-relaxed mb-6 flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center text-xs uppercase tracking-widest font-bold text-hotel-black">
                                    Read More <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Sponsorship Banner */}
                <div className="mt-24 bg-hotel-black text-white p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-hotel-bronze/10 pattern-dots" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl mb-6">Become a Partner</h2>
                        <p className="text-gray-400 font-light text-lg mb-10">
                            ExplorAble is a non-profit initiative driven by community volunteers. We are actively seeking corporate sponsorships and grants to expand our reach.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact" className="bg-hotel-bronze text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-hotel-black transition-colors">
                                View Sponsorship Deck
                            </Link>
                            <Link href="/contact" className="border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
                                Volunteer Program
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
