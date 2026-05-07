"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, LogOut, Users, Building, Newspaper, Lightbulb, CheckCircle, XCircle, TrendingUp, Loader2, Plus, Trash2 } from 'lucide-react';

type Tab = 'overview' | 'venues' | 'news' | 'innovation';

export default function AdminPortal() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [user, setUser] = useState<any>(null);

    // Data
    const [stats, setStats] = useState({ users: 0, venues: 0, pendingVenues: 0, posts: 0 });
    const [pendingVenues, setPendingVenues] = useState<any[]>([]);
    const [allVenues, setAllVenues] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [innovationTools, setInnovationTools] = useState<any[]>([]);

    // News form
    const [newsForm, setNewsForm] = useState({ title: '', excerpt: '', category: 'General', image_url: '', is_featured: false });
    const [savingNews, setSavingNews] = useState(false);
    const [newsMsg, setNewsMsg] = useState('');

    // Innovation form
    const [innovForm, setInnovForm] = useState({ title: '', description: '', image_url: '', features: '' });
    const [savingInnov, setSavingInnov] = useState(false);
    const [innovMsg, setInnovMsg] = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { router.push('/login'); return; }

            // Check admin role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile?.role !== 'admin') {
                router.push('/explore');
                return;
            }

            setUser(session.user);
            await fetchAllData();
            setLoading(false);
        };
        init();
    }, []);

    const fetchAllData = async () => {
        const [
            { count: userCount },
            { data: venues },
            { count: postCount },
            { data: news },
            { data: tools },
        ] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('venues').select('*').order('created_at', { ascending: false }),
            supabase.from('community_posts').select('id', { count: 'exact', head: true }),
            supabase.from('news_articles').select('*').order('created_at', { ascending: false }),
            supabase.from('innovation_tools').select('*').order('created_at', { ascending: false }),
        ]);

        const pending = (venues || []).filter(v => !v.is_verified);
        setPendingVenues(pending);
        setAllVenues(venues || []);
        setArticles(news || []);
        setInnovationTools(tools || []);
        setStats({
            users: userCount || 0,
            venues: (venues || []).length,
            pendingVenues: pending.length,
            posts: postCount || 0,
        });
    };

    const approveVenue = async (id: string) => {
        await supabase.from('venues').update({ is_verified: true }).eq('id', id);
        setPendingVenues(prev => prev.filter(v => v.id !== id));
        setAllVenues(prev => prev.map(v => v.id === id ? { ...v, is_verified: true } : v));
        setStats(s => ({ ...s, pendingVenues: s.pendingVenues - 1 }));
    };

    const rejectVenue = async (id: string) => {
        if (!confirm('Are you sure you want to remove this venue listing?')) return;
        await supabase.from('venues').delete().eq('id', id);
        setPendingVenues(prev => prev.filter(v => v.id !== id));
        setAllVenues(prev => prev.filter(v => v.id !== id));
        setStats(s => ({ ...s, venues: s.venues - 1, pendingVenues: s.pendingVenues - 1 }));
    };

    const submitNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingNews(true);
        setNewsMsg('');
        try {
            const { error } = await supabase.from('news_articles').insert({
                title: newsForm.title,
                excerpt: newsForm.excerpt,
                category: newsForm.category,
                image_url: newsForm.image_url,
                is_featured: newsForm.is_featured,
            });
            if (error) throw error;
            setNewsMsg('Article published successfully!');
            setNewsForm({ title: '', excerpt: '', category: 'General', image_url: '', is_featured: false });
            await fetchAllData();
        } catch (err: any) {
            setNewsMsg(`Error: ${err.message}`);
        } finally {
            setSavingNews(false);
        }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm('Delete this article?')) return;
        await supabase.from('news_articles').delete().eq('id', id);
        setArticles(prev => prev.filter(a => a.id !== id));
    };

    const submitInnov = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingInnov(true);
        setInnovMsg('');
        try {
            const features = innovForm.features.split(',').map(f => f.trim()).filter(Boolean);
            const { error } = await supabase.from('innovation_tools').insert({
                title: innovForm.title,
                description: innovForm.description,
                image_url: innovForm.image_url,
                features,
            });
            if (error) throw error;
            setInnovMsg('Innovation tool added!');
            setInnovForm({ title: '', description: '', image_url: '', features: '' });
            await fetchAllData();
        } catch (err: any) {
            setInnovMsg(`Error: ${err.message}`);
        } finally {
            setSavingInnov(false);
        }
    };

    const deleteInnov = async (id: string) => {
        if (!confirm('Delete this tool?')) return;
        await supabase.from('innovation_tools').delete().eq('id', id);
        setInnovationTools(prev => prev.filter(t => t.id !== id));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) return (
        <div className="min-h-screen bg-hotel-black flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Loading Admin Portal...
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-stone-800">
            {/* Sidebar */}
            <aside className="w-64 bg-hotel-black text-white flex flex-col sticky top-0 h-screen shrink-0">
                <div className="p-8 border-b border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-hotel-bronze font-bold mb-1">Admin</p>
                    <h2 className="font-serif text-xl text-white">Control Panel</h2>
                    <p className="text-white/30 text-xs mt-1 break-all">{user?.email}</p>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {([
                        { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
                        { id: 'venues', label: 'Venue Verification', icon: <Building size={18} /> },
                        { id: 'news', label: 'News CMS', icon: <Newspaper size={18} /> },
                        { id: 'innovation', label: 'Innovation CMS', icon: <Lightbulb size={18} /> },
                    ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === item.id ? 'bg-hotel-bronze text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            {item.icon} {item.label}
                            {item.id === 'venues' && stats.pendingVenues > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pendingVenues}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-8 border-t border-white/10 space-y-3">
                    <Link href="/explore" className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition">
                        <ArrowLeft size={14} /> Public Site
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <h1 className="font-serif text-3xl text-hotel-black border-b border-gray-200 pb-4">Platform Overview</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <StatCard label="Total Users" value={stats.users} icon={<Users className="text-blue-400" />} />
                            <StatCard label="Total Venues" value={stats.venues} icon={<Building className="text-hotel-bronze" />} />
                            <StatCard label="Pending Approval" value={stats.pendingVenues} icon={<Building className="text-orange-400" />} />
                            <StatCard label="Community Posts" value={stats.posts} icon={<Newspaper className="text-green-500" />} />
                        </div>
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-hotel-black mb-4">Quick Actions</h2>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => setActiveTab('venues')} className="bg-hotel-black text-white px-5 py-2 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm">
                                    Review Venues ({stats.pendingVenues} pending)
                                </button>
                                <button onClick={() => setActiveTab('news')} className="bg-hotel-black text-white px-5 py-2 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm">
                                    Publish News Article
                                </button>
                                <button onClick={() => setActiveTab('innovation')} className="bg-hotel-black text-white px-5 py-2 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm">
                                    Add Innovation Tool
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* VENUE VERIFICATION */}
                {activeTab === 'venues' && (
                    <div className="space-y-8">
                        <h1 className="font-serif text-3xl text-hotel-black border-b border-gray-200 pb-4">Venue Verification</h1>

                        {pendingVenues.length > 0 && (
                            <div>
                                <h2 className="font-bold text-hotel-black mb-4 flex items-center gap-2">
                                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{pendingVenues.length} Pending</span>
                                    Awaiting Approval
                                </h2>
                                <div className="space-y-4">
                                    {pendingVenues.map(venue => (
                                        <div key={venue.id} className="bg-white border border-orange-200 rounded-sm p-5 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                {venue.image_url && <img src={venue.image_url} className="w-16 h-16 object-cover rounded-sm" alt={venue.name} />}
                                                <div>
                                                    <h3 className="font-bold text-hotel-black">{venue.name}</h3>
                                                    <p className="text-xs text-gray-400">{venue.address || venue.location}</p>
                                                    <Link href={`/explore/${venue.id}`} className="text-[10px] text-hotel-bronze hover:underline" target="_blank">Preview listing →</Link>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => approveVenue(venue.id)}
                                                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-green-700 transition-colors rounded-sm">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button onClick={() => rejectVenue(venue.id)}
                                                    className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-red-600 transition-colors rounded-sm">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="font-bold text-hotel-black mb-4">All Venues ({allVenues.length})</h2>
                            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-5 py-3">Name</th>
                                            <th className="px-5 py-3">Location</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allVenues.map(venue => (
                                            <tr key={venue.id} className="hover:bg-gray-50">
                                                <td className="px-5 py-3 font-bold text-hotel-black">{venue.name}</td>
                                                <td className="px-5 py-3 text-gray-500 text-xs">{venue.address || venue.location}</td>
                                                <td className="px-5 py-3">
                                                    {venue.is_verified
                                                        ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Verified</span>
                                                        : <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pending</span>
                                                    }
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/explore/${venue.id}`} className="text-[10px] text-hotel-bronze uppercase font-bold hover:underline" target="_blank">View</Link>
                                                        {!venue.is_verified && (
                                                            <button onClick={() => approveVenue(venue.id)} className="text-[10px] text-green-600 uppercase font-bold hover:underline">Approve</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* NEWS CMS */}
                {activeTab === 'news' && (
                    <div className="space-y-8">
                        <h1 className="font-serif text-3xl text-hotel-black border-b border-gray-200 pb-4">News & Articles CMS</h1>

                        {/* Publish Form */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-hotel-black mb-5 flex items-center gap-2"><Plus size={16} /> Publish New Article</h2>
                            <form onSubmit={submitNews} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Title *</label>
                                        <input required value={newsForm.title} onChange={e => setNewsForm(p => ({ ...p, title: e.target.value }))}
                                            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Category</label>
                                        <select value={newsForm.category} onChange={e => setNewsForm(p => ({ ...p, category: e.target.value }))}
                                            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm">
                                            {['General', 'Partnership', 'Platform Update', 'Community', 'Research'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Excerpt / Summary *</label>
                                    <textarea required value={newsForm.excerpt} onChange={e => setNewsForm(p => ({ ...p, excerpt: e.target.value }))} rows={3}
                                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm resize-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Image URL</label>
                                    <input value={newsForm.image_url} onChange={e => setNewsForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..."
                                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newsForm.is_featured} onChange={e => setNewsForm(p => ({ ...p, is_featured: e.target.checked }))} />
                                    <span className="text-sm text-gray-600">Feature this article on the News homepage</span>
                                </label>
                                {newsMsg && <p className={`text-sm font-bold ${newsMsg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{newsMsg}</p>}
                                <button type="submit" disabled={savingNews}
                                    className="flex items-center gap-2 bg-hotel-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50">
                                    {savingNews ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Publish Article
                                </button>
                            </form>
                        </div>

                        {/* Existing articles */}
                        <div>
                            <h2 className="font-bold text-hotel-black mb-4">Published Articles ({articles.length})</h2>
                            <div className="space-y-3">
                                {articles.map(a => (
                                    <div key={a.id} className="bg-white border border-gray-100 rounded-sm p-4 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-bold text-hotel-black text-sm">{a.title}</p>
                                            <p className="text-xs text-gray-400">{a.category} · {new Date(a.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => deleteArticle(a.id)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {articles.length === 0 && <p className="text-gray-400 text-sm italic">No articles published yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* INNOVATION CMS */}
                {activeTab === 'innovation' && (
                    <div className="space-y-8">
                        <h1 className="font-serif text-3xl text-hotel-black border-b border-gray-200 pb-4">Innovation Tools CMS</h1>

                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-hotel-black mb-5 flex items-center gap-2"><Plus size={16} /> Add New Tool</h2>
                            <form onSubmit={submitInnov} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Tool Name *</label>
                                        <input required value={innovForm.title} onChange={e => setInnovForm(p => ({ ...p, title: e.target.value }))}
                                            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Image URL</label>
                                        <input value={innovForm.image_url} onChange={e => setInnovForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..."
                                            className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Description *</label>
                                    <textarea required value={innovForm.description} onChange={e => setInnovForm(p => ({ ...p, description: e.target.value }))} rows={3}
                                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm resize-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Features (comma-separated)</label>
                                    <input value={innovForm.features} onChange={e => setInnovForm(p => ({ ...p, features: e.target.value }))} placeholder="Recycled Materials, Weather Resistant, Easy Installation"
                                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-hotel-bronze rounded-sm" />
                                </div>
                                {innovMsg && <p className={`text-sm font-bold ${innovMsg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{innovMsg}</p>}
                                <button type="submit" disabled={savingInnov}
                                    className="flex items-center gap-2 bg-hotel-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50">
                                    {savingInnov ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Add Tool
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="font-bold text-hotel-black mb-4">Published Tools ({innovationTools.length})</h2>
                            <div className="space-y-3">
                                {innovationTools.map(t => (
                                    <div key={t.id} className="bg-white border border-gray-100 rounded-sm p-4 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-bold text-hotel-black text-sm">{t.title}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-md">{t.description}</p>
                                        </div>
                                        <button onClick={() => deleteInnov(t.id)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {innovationTools.length === 0 && <p className="text-gray-400 text-sm italic">No tools added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
            <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">{label}</div>
                <div className="text-3xl font-serif text-hotel-black mt-1">{value}</div>
            </div>
        </div>
    );
}
