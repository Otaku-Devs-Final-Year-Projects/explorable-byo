"use client";

import Image from 'next/image';
import { MessageSquare, Star, ThumbsUp, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

const TAGS = ['General', 'Review', 'Question', 'Dining', 'Accommodation', 'Transport', 'Activities'];

export default function CommunityPage() {
    const mockDiscussions = [
        {
            id: '1',
            author: "Sarah Jenkins",
            avatar: "SJ",
            title: "Best wheelchair accessible dining with power outlets?",
            content: "Hi everyone, I use a power chair and need places where I can easily maneuver and optionally plug in if needed during long work lunches in CBD.",
            replies: 14,
            likes: 32,
            time: "2 hours ago",
            tag: "Dining"
        },
        {
            id: '2',
            author: "David M.",
            avatar: "DM",
            title: "Review: The Nesbitt Castle accessibility updates",
            content: "Just wanted to share that they recently added a new portable ramp for the lower gardens. The staff was incredibly trained and asked before assisting. 5/5 experience.",
            replies: 8,
            likes: 45,
            time: "1 day ago",
            tag: "Review"
        },
        {
            id: '3',
            author: "Elena R.",
            avatar: "ER",
            title: "Sensory-friendly hours at local museums?",
            content: "Does anyone know if the Natural History Museum still does the low-light/low-noise hours on Tuesday mornings?",
            replies: 5,
            likes: 12,
            time: "2 days ago",
            tag: "Question"
        }
    ];

    // ── ALL STATE DECLARATIONS FIRST (Rules of Hooks: no hooks after conditional returns) ──
    const [discussions, setDiscussions] = useState<any[]>(mockDiscussions);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [topVenues, setTopVenues] = useState<{ name: string; rating: number; id: string }[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newTag, setNewTag] = useState('General');
    const [showTagMenu, setShowTagMenu] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);

    // ── FETCH POSTS + REALTIME ──
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('community_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data && data.length > 0) {
                    setDiscussions(data.map((d: any) => ({
                        id: d.id,
                        author: d.author_name,
                        avatar: d.author_avatar || d.author_name.charAt(0).toUpperCase(),
                        title: d.title,
                        content: d.content,
                        replies: 0,
                        likes: d.likes || 0,
                        time: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        tag: d.tag || "General"
                    })));
                }
            } catch (err) {
                console.log("Using mock data for community:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

        const channel = supabase.channel('community-feed')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, payload => {
                const d = payload.new as any;
                setDiscussions(prev => {
                    if (prev.find((p: any) => p.id === d.id)) return prev;
                    return [{
                        id: d.id,
                        author: d.author_name,
                        avatar: d.author_avatar || d.author_name?.charAt(0),
                        title: d.title,
                        content: d.content,
                        replies: 0,
                        likes: d.likes || 0,
                        time: 'Just now',
                        tag: d.tag || 'General',
                    }, ...prev];
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // ── GET CURRENT USER + TOP VENUES ──
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);
        };
        getUser();

        const fetchTopVenues = async () => {
            try {
                const { data } = await supabase
                    .from('venues')
                    .select('id, name, rating')
                    .order('rating', { ascending: false })
                    .limit(3);
                if (data && data.length > 0) setTopVenues(data);
            } catch (_) { }
        };
        fetchTopVenues();
    }, []);

    // ── HANDLERS ──
    const handlePost = async () => {
        if (!newTitle.trim() || !newContent.trim()) {
            setPostError('Please add a title and some content before posting.');
            return;
        }
        if (!currentUser) {
            setPostError('You must be logged in to post.');
            return;
        }
        setPostLoading(true);
        setPostError(null);
        try {
            const authorName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Anonymous';
            const { data, error } = await supabase
                .from('community_posts')
                .insert({
                    author_name: authorName,
                    author_avatar: authorName.charAt(0).toUpperCase(),
                    title: newTitle.trim(),
                    content: newContent.trim(),
                    tag: newTag,
                    likes: 0,
                })
                .select()
                .single();

            if (error) throw error;

            setDiscussions(prev => [{
                id: data.id,
                author: data.author_name,
                avatar: data.author_avatar,
                title: data.title,
                content: data.content,
                replies: 0,
                likes: 0,
                time: 'Just now',
                tag: data.tag,
            }, ...prev]);
            setNewTitle('');
            setNewContent('');
            setNewTag('General');
        } catch (err: any) {
            setPostError(err.message || 'Failed to post. Please try again.');
        } finally {
            setPostLoading(false);
        }
    };

    const handleLike = async (postId: string) => {
        setDiscussions(prev => prev.map((p: any) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
        try {
            const post = discussions.find((p: any) => p.id === postId);
            if (!post) return;
            await supabase
                .from('community_posts')
                .update({ likes: post.likes + 1 })
                .eq('id', postId);
        } catch (_) {
            setDiscussions(prev => prev.map((p: any) => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
        }
    };

    // ── CONDITIONAL RETURNS (after all hooks) ──
    if (loading) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Loading Community...
        </div>
    );

    return (
        <div className="min-h-screen bg-hotel-cream text-hotel-black font-sans selection:bg-hotel-black selection:text-white pb-32">

            {/* Header */}
            <header className="bg-hotel-black text-white pt-12 pb-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-serif text-5xl mb-4">Community Voices</h1>
                    <p className="text-gray-400 font-light text-lg">Real experiences, honest reviews, and shared knowledge.</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12 flex flex-col-reverse lg:grid lg:grid-cols-3 gap-12">

                {/* Left Column: Discussions */}
                <div className="lg:col-span-2">

                    <div className="flex justify-between items-center mb-8 border-b border-hotel-sand pb-4">
                        <h2 className="font-serif text-2xl">Recent Discussions</h2>
                    </div>

                    {/* New Post Box */}
                    <div className="bg-white p-6 shadow-sm border border-hotel-sand mb-8">
                        {!currentUser ? (
                            <p className="text-sm text-gray-400 text-center py-2">
                                <Link href="/login" className="text-hotel-bronze font-bold hover:underline">Log in</Link> to start a discussion.
                            </p>
                        ) : (
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 bg-hotel-bronze rounded-full flex items-center justify-center text-white font-serif shrink-0">
                                    {(currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="Title — What's this about?"
                                        className="w-full bg-hotel-cream border border-hotel-sand p-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-hotel-bronze"
                                    />
                                    <textarea
                                        value={newContent}
                                        onChange={e => setNewContent(e.target.value)}
                                        placeholder="Share your experience or ask a question..."
                                        rows={3}
                                        className="w-full bg-hotel-cream border-none p-3 text-sm font-light focus:outline-none focus:ring-1 focus:ring-hotel-bronze resize-none"
                                    />
                                    {postError && <p className="text-xs text-red-500">{postError}</p>}
                                    <div className="flex justify-between items-center">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowTagMenu(!showTagMenu)}
                                                className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-bronze px-2 py-1 border border-gray-200"
                                            >
                                                Tag: {newTag}
                                            </button>
                                            {showTagMenu && (
                                                <div className="absolute top-full left-0 mt-1 bg-white border border-hotel-sand shadow-lg z-10 min-w-[140px]">
                                                    {TAGS.map(t => (
                                                        <button key={t} onClick={() => { setNewTag(t); setShowTagMenu(false); }}
                                                            className="block w-full text-left px-4 py-2 text-xs hover:bg-hotel-cream font-bold uppercase tracking-wider">
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handlePost}
                                            disabled={postLoading}
                                            className="bg-hotel-black text-white px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors disabled:opacity-50"
                                        >
                                            {postLoading ? 'Posting...' : 'Post'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Discussion Threads */}
                    <div className="space-y-6">
                        {discussions.map((post: any) => (
                            <div key={post.id} className="bg-white p-6 md:p-8 shadow-sm border border-hotel-sand hover:border-hotel-bronze transition-colors">

                                {/* Post Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-hotel-black text-white rounded-full flex items-center justify-center font-serif text-sm">
                                            {post.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-wide">{post.author}</h4>
                                            <p className="text-xs text-gray-400">{post.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold bg-hotel-cream text-hotel-bronze px-3 py-1">
                                        {post.tag}
                                    </span>
                                </div>

                                {/* Post Title + Content */}
                                <Link href={`/community/${post.id}`}>
                                    <h3 className="font-serif text-xl mb-3 hover:text-hotel-bronze transition-colors cursor-pointer">{post.title}</h3>
                                </Link>
                                <p className="text-gray-600 text-sm font-light leading-relaxed line-clamp-3 mb-4">
                                    {post.content}
                                </p>

                                {/* Post Footer */}
                                <div className="flex items-center justify-between border-t border-hotel-sand pt-4">
                                    <div className="flex gap-6">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-bronze transition-colors"
                                        >
                                            <ThumbsUp size={16} /> {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-black transition-colors">
                                            <MessageSquare size={16} /> {post.replies}
                                        </button>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Flag size={16} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8 lg:mt-16">

                    {/* Top Rated Venues */}
                    <div className="bg-hotel-black text-white p-8 shadow-xl">
                        <h3 className="font-serif text-2xl mb-6">Top Rated This Week</h3>
                        <div className="space-y-6">
                            {(topVenues.length > 0
                                ? topVenues
                                : [
                                    { name: 'Coffee Pod CBD', rating: 4.9, id: '' },
                                    { name: 'Matobo Hills Lodge', rating: 4.8, id: '' },
                                    { name: 'Bulawayo Club', rating: 4.7, id: '' },
                                ]
                            ).map((venue, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-bold text-sm">{venue.name}</h4>
                                        <div className="flex text-hotel-bronze mt-1">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">{venue.rating}</div>
                                </div>
                            ))}
                        </div>
                        <a href="/explore" className="w-full mt-6 bg-white/10 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors text-center block">
                            View Directory
                        </a>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-white p-8 border border-hotel-sand shadow-sm">
                        <h3 className="font-serif text-xl mb-4">Community Guidelines</h3>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            <li className="flex gap-2"><div className="w-1 h-1 bg-hotel-bronze rounded-full mt-2 shrink-0"></div> Be respectful and constructive.</li>
                            <li className="flex gap-2"><div className="w-1 h-1 bg-hotel-bronze rounded-full mt-2 shrink-0"></div> Share specific accessibility details when reviewing.</li>
                            <li className="flex gap-2"><div className="w-1 h-1 bg-hotel-bronze rounded-full mt-2 shrink-0"></div> Do not post unverified negative claims.</li>
                        </ul>
                    </div>

                </div>

            </main>
        </div>
    );
}
