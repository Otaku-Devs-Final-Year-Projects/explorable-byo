"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    setArticle(data);
                } else {
                    // Search in mocks if not in DB (for demo purposes)
                    const mockArticles = [
                        { id: '1', title: "ExplorAble Partners with Zimbabwe Tourism Authority", excerpt: "A landmark agreement to integrate our verified accessibility data directly into the national tourism planning dashboard.", content: "A landmark agreement to integrate our verified accessibility data directly into the national tourism planning dashboard. This partnership signifies a major step towards making Bulawayo the most accessible tourism destination in Southern Africa. Through this agreement, the Zimbabwe Tourism Authority will leverage ExplorAble's comprehensive data to identify areas for infrastructure improvement and better market accessible venues to international travelers.", category: "Partnership", created_at: "2025-11-12T00:00:00Z", image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80" },
                        { id: '2', title: "New Feature: AI-Powered Audio Navigation", excerpt: "Our web app now supports full voice navigation for visually impaired users. Learn how to use 'Peace of Mind' mode.", content: "Our web app now supports full voice navigation for visually impaired users. Experience a whole new way to navigate ExplorAble with our cutting-edge AI. Simply say 'Locate nearest wheelchair accessible dining' and let our sophisticated audio interface guide you. This feature was developed in consultation with over 50 visually impaired testers in the Bulawayo region, ensuring it meets real-world needs.", category: "Platform Update", created_at: "2025-10-28T00:00:00Z", image_url: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&q=80" },
                        { id: '3', title: "Call for Volunteers: Bulawayo Mapping Drive", excerpt: "We are looking for local volunteers to help us verify 50 new venues in the CBD this coming weekend.", content: "We are looking for local volunteers to help us verify 50 new venues in the CBD this coming weekend. Community mapping is the lifeblood of ExplorAble. If you are passionate about accessibility, join us this Saturday at 9 AM at the Bulawayo Public Library. We will provide training, verification tools, and lunch as we fan out across the CBD to add more accessible venues to our platform.", category: "Community", created_at: "2025-10-15T00:00:00Z", image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" }
                    ];
                    const mock = mockArticles.find(a => a.id === id);
                    if (mock) setArticle(mock);
                }
            } catch (err) {
                console.log("Using mock data for article:", err);
                const mockArticles = [
                    { id: '1', title: "ExplorAble Partners with Zimbabwe Tourism Authority", excerpt: "A landmark agreement...", content: "Full mock content...", category: "Partnership", created_at: "2025-11-12T00:00:00Z", image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80" },
                    { id: '2', title: "New Feature: AI-Powered Audio Navigation", excerpt: "Our web app now supports full voice navigation...", content: "Full mock content...", category: "Platform Update", created_at: "2025-10-28T00:00:00Z", image_url: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&q=80" },
                    { id: '3', title: "Call for Volunteers: Bulawayo Mapping Drive", excerpt: "We are looking for local volunteers...", content: "Full mock content...", category: "Community", created_at: "2025-10-15T00:00:00Z", image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" }
                ];
                setArticle(mockArticles.find(a => a.id === id));
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading Article...</div>;
    if (!article) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-black">Article not found.</div>;

    return (
        <div className="min-h-screen bg-hotel-cream text-hotel-black font-sans pb-32">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link href="/news" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-hotel-bronze hover:text-hotel-black transition-colors mb-10">
                    <ArrowLeft size={16} className="mr-2" /> Back to News
                </Link>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
                    <span className="text-hotel-bronze">{article.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center"><Calendar size={12} className="mr-2" /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hotel-black mb-8 leading-tight">
                    {article.title}
                </h1>

                {article.image_url && (
                    <div className="relative w-full h-[400px] md:h-[500px] mb-12">
                        <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed">
                    <p className="text-xl font-medium text-hotel-black mb-8">{article.excerpt}</p>
                    <div dangerouslySetInnerHTML={{ __html: article.content ? article.content.replace(/\n/g, '<br/>') : article.excerpt }} />
                </div>

                <hr className="my-16 border-t border-hotel-sand" />

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-hotel-bronze rounded-full text-white flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Written By</div>
                        <div className="font-serif text-xl">ExplorAble Editorial Team</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
