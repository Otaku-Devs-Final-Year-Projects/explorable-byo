"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, Send, Loader2 } from 'lucide-react';
import LoginGate from '../../components/ui/LoginGate';

export default function ThreadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<any>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [replyContent, setReplyContent] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);
            await fetchPost();
            await fetchReplies();
            setLoading(false);
        };

        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('id', postId)
                .single();
            if (error || !data) { router.push('/community'); return; }
            setPost({
                id: data.id,
                author: data.author_name,
                avatar: data.author_avatar || data.author_name?.charAt(0),
                title: data.title,
                content: data.content,
                tag: data.tag || 'General',
                likes: data.likes || 0,
                time: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            });
        };

        const fetchReplies = async () => {
            const { data } = await supabase
                .from('community_replies')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            setReplies((data || []).map((r: any) => ({
                id: r.id,
                author: r.author_name,
                avatar: r.author_name?.charAt(0).toUpperCase() || '?',
                content: r.content,
                time: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            })));
        };

        init();

        // Realtime subscription for new replies
        const channel = supabase.channel(`thread-${postId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'community_replies',
                filter: `post_id=eq.${postId}`,
            }, payload => {
                setReplies(prev => {
                    if (prev.find(r => r.id === payload.new.id)) return prev;
                    return [...prev, {
                        id: payload.new.id,
                        author: payload.new.author_name,
                        avatar: payload.new.author_name?.charAt(0).toUpperCase() || '?',
                        content: payload.new.content,
                        time: 'Just now',
                    }];
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [postId]);

    const handleLike = async () => {
        if (!post) return;
        const newLikes = post.likes + 1;
        setPost((prev: any) => ({ ...prev, likes: newLikes }));
        await supabase.from('community_posts').update({ likes: newLikes }).eq('id', postId);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !currentUser) return;
        setSendingReply(true);
        const content = replyContent.trim();
        const authorName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Anonymous';
        const tempId = `optimistic-${Date.now()}`;
        setReplies(prev => [...prev, {
            id: tempId,
            author: authorName,
            avatar: authorName.charAt(0).toUpperCase(),
            content,
            time: 'Just now',
        }]);
        setReplyContent('');
        const { error } = await supabase.from('community_replies').insert({
            post_id: postId,
            author_name: authorName,
            content,
        });
        setSendingReply(false);
        if (error) {
            console.error('Reply failed:', error);
            setReplies(prev => prev.filter(r => r.id !== tempId));
            setReplyContent(content); // restore so user can try again
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Loading Discussion...
        </div>
    );

    if (!post) return null;

    return (
        <div className="min-h-screen bg-hotel-cream font-sans text-hotel-black pb-24">

            {/* Header */}
            <header className="bg-hotel-black text-white pt-10 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link href="/community" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-widest font-bold transition mb-6">
                        <ArrowLeft size={14} /> Community
                    </Link>
                    <span className="inline-block text-[10px] uppercase tracking-widest font-bold bg-hotel-bronze/20 text-hotel-bronze px-3 py-1 mb-4">{post.tag}</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-white leading-snug">{post.title}</h1>
                    <div className="flex items-center gap-3 mt-4 text-white/50 text-xs">
                        <div className="w-7 h-7 bg-hotel-bronze rounded-full flex items-center justify-center text-white font-serif text-sm">{post.avatar}</div>
                        <span>{post.author}</span>
                        <span>·</span>
                        <span>{post.time}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 -mt-4">

                {/* Original Post */}
                <div className="bg-white shadow-md border border-hotel-sand/50 rounded-sm p-8 mb-8">
                    <p className="text-gray-700 font-light leading-relaxed text-base whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-hotel-sand">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-hotel-bronze transition-colors">
                            <ThumbsUp size={16} /> {post.likes} Helpful
                        </button>
                    </div>
                </div>

                {/* Replies */}
                <h2 className="font-serif text-xl text-hotel-black mb-4">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h2>
                <div className="space-y-4 mb-8">
                    {replies.map(reply => (
                        <div key={reply.id} className="bg-white border border-hotel-sand/50 rounded-sm p-6 flex gap-4">
                            <div className="w-9 h-9 bg-hotel-black text-white rounded-full flex items-center justify-center font-serif text-sm shrink-0">
                                {reply.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-400">· {reply.time}</span>
                                </div>
                                <p className="text-gray-600 text-sm font-light leading-relaxed">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                    {replies.length === 0 && (
                        <div className="text-center py-8 text-gray-400 italic text-sm">
                            No replies yet. Be the first to respond.
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                {currentUser ? (
                    <div className="bg-white border border-hotel-sand/50 rounded-sm p-6">
                        <h3 className="font-serif text-lg text-hotel-black mb-4">Add Your Reply</h3>
                        <form onSubmit={handleReply} className="flex gap-4 items-start">
                            <div className="w-9 h-9 bg-hotel-bronze rounded-full flex items-center justify-center text-white font-serif text-sm shrink-0">
                                {(currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    placeholder="Share your knowledge or experience..."
                                    rows={3}
                                    className="w-full border border-gray-200 bg-hotel-cream px-4 py-3 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm resize-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={sendingReply || !replyContent.trim()}
                                        className="flex items-center gap-2 bg-hotel-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50">
                                        {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        {sendingReply ? 'Posting...' : 'Post Reply'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white border border-hotel-sand/50 rounded-sm p-6 text-center">
                        <p className="text-sm text-gray-500">
                            <Link href="/login" className="text-hotel-bronze font-bold hover:underline">Log in</Link> to join the discussion.
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
}
