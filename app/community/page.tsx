"use client";

import Image from 'next/image';
import { MessageSquare, Star, ThumbsUp, ChevronDown, User, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CommunityPage() {
 const mockDiscussions = [
 {
 id: '1',
 author:"Sarah Jenkins",
 avatar:"SJ",
 title:"Best wheelchair accessible dining with power outlets?",
 content:"Hi everyone, I use a power chair and need places where I can easily maneuver and optionally plug in if needed during long work lunches in CBD.",
 replies: 14,
 likes: 32,
 time:"2 hours ago",
 tag:"Dining"
 },
 {
 id: '2',
 author:"David M.",
 avatar:"DM",
 title:"Review: The Nesbitt Castle accessibility updates",
 content:"Just wanted to share that they recently added a new portable ramp for the lower gardens. The staff was incredibly trained and asked before assisting. 5/5 experience.",
 replies: 8,
 likes: 45,
 time:"1 day ago",
 tag:"Review"
 },
 {
 id: '3',
 author:"Elena R.",
 avatar:"ER",
 title:"Sensory-friendly hours at local museums?",
 content:"Does anyone know if the Natural History Museum still does the low-light/low-noise hours on Tuesday mornings?",
 replies: 5,
 likes: 12,
 time:"2 days ago",
 tag:"Question"
 }
 ];

 const [discussions, setDiscussions] = useState(mockDiscussions);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchPosts = async () => {
 try {
 const { data, error } = await supabase
 .from('community_posts')
 .select('*')
 .order('created_at', { ascending: false });

 if (error) throw error;
 if (data && data.length > 0) {
 setDiscussions(data.map(d => ({
 id: d.id,
 author: d.author_name,
 avatar: d.author_avatar || d.author_name.charAt(0).toUpperCase(),
 title: d.title,
 content: d.content,
 replies: 0,
 likes: d.likes || 0,
 time: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
 tag: d.tag ||"General"
 })));
 }
 } catch (err) {
 console.log("Using mock data for community:", err);
 } finally {
 setLoading(false);
 }
 };
 fetchPosts();
 }, []);

 if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading Community...</div>;

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
 <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-hotel-black">
 Sort by: Newest <ChevronDown size={14} />
 </button>
 </div>

 {/* New Post Box */}
 <div className="bg-white p-6 shadow-sm border border-hotel-sand mb-8 flex gap-4 items-start">
 <div className="w-10 h-10 bg-hotel-bronze rounded-full flex items-center justify-center text-white font-serif shrink-0">
 <User size={18} />
 </div>
 <div className="flex-1">
 <input type="text" placeholder="Start a discussion or share a review..." className="w-full bg-hotel-cream border-none p-4 text-sm font-light focus:outline-none focus:ring-1 focus:ring-hotel-bronze mb-3" />
 <div className="flex justify-between items-center">
 <div className="flex gap-2">
 <button className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-bronze px-2 py-1">Add Tag</button>
 <button className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-bronze px-2 py-1">Attach Image</button>
 </div>
 <button className="bg-hotel-black text-white px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors">
 Post
 </button>
 </div>
 </div>
 </div>

 {/* Discussion Threads */}
 <div className="space-y-6">
 {discussions.map((post) => (
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

 {/* Post Content */}
 <h3 className="font-serif text-xl mb-3">{post.title}</h3>
 <p className="text-gray-600 font-light text-sm leading-relaxed mb-6">
 {post.content}
 </p>

 {/* Post Footer */}
 <div className="flex items-center justify-between border-t border-hotel-sand pt-4">
 <div className="flex gap-6">
 <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-black transition-colors">
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

 <div className="mt-8 text-center">
 <button className="border border-hotel-black px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-black hover:text-white transition-colors">
 Load More Threads
 </button>
 </div>

 </div>

 {/* Right Column: Sidebar */}
 <div className="space-y-8 lg:mt-16">

 {/* Top Rated Venues Snippet */}
 <div className="bg-hotel-black text-white p-8 shadow-xl">
 <h3 className="font-serif text-2xl mb-6">Top Rated This Week</h3>
 <div className="space-y-6">
 {[
 { name:"Coffee Pod CBD", rating: 4.9, reviews: 124 },
 { name:"Matobo Hills Lodge", rating: 4.8, reviews: 89 },
 { name:"Bulawayo Club", rating: 4.7, reviews: 201 }
 ].map((venue, i) => (
 <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
 <div>
 <h4 className="font-bold text-sm">{venue.name}</h4>
 <div className="flex text-hotel-bronze mt-1">
 <Star size={12} fill="currentColor" />
 <Star size={12} fill="currentColor" />
 <Star size={12} fill="currentColor" />
 <Star size={12} fill="currentColor" />
 <Star size={12} fill="currentColor" />
 </div>
 </div>
 <div className="text-xs text-gray-400">{venue.reviews} refs</div>
 </div>
 ))}
 </div>
 <button className="w-full mt-6 bg-white/10 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors text-center block">
 View Leaderboard
 </button>
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
