"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Lock, ChevronRight, Award, Loader2 } from 'lucide-react';
import LoginGate from '../../components/ui/LoginGate';

// Inline static content for the 3 modules
const MODULE_CONTENT: Record<string, { title: string; duration: string; content: string[]; image: string }> = {
    '1': {
        title: 'Module 1: Foundations of Awareness',
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80',
        content: [
            'Accessible tourism begins with awareness. More than 1.3 billion people globally live with some form of disability — making them one of the most significant and historically underserved market segments in the tourism industry.',
            'Types of disabilities in hospitality contexts include: **Mobility impairments** (wheelchair users, people with limited strength or dexterity), **Visual impairments** (ranging from low vision to full blindness), **Hearing impairments** (deaf or hard of hearing guests), **Cognitive or neurological differences** (autism, dementia, ADHD), and **Invisible disabilities** (chronic pain, anxiety, chronic fatigue).',
            'The social model of disability: Modern accessibility thinking has moved from the "medical model" (the person is broken) to the "social model" (barriers in society are the problem). Your role as hospitality staff is to remove barriers, not to manage a condition.',
            'Key etiquette principles: Always ask before assisting. Use person-first language (e.g., "person who uses a wheelchair" rather than "wheelchair-bound"). Never touch a person\'s mobility aid without permission — it is an extension of their personal space. Make eye contact and speak directly to the guest, not their companion.',
            'Why it matters for business: Accessible tourism is not just an ethical imperative — it is a significant commercial opportunity. Guests with disabilities are highly loyal customers who actively recommend businesses that accommodate them well. This includes the "purple pound" — the spending power of disabled people and their travel companions, which is estimated in the billions globally.',
        ],
    },
    '2': {
        title: 'Module 2: Communicating with Care',
        duration: '60 mins',
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80',
        content: [
            'Effective communication is the cornerstone of inclusive hospitality. How your staff communicates can make a guest feel fully welcomed — or deeply excluded — within the first 30 seconds of an interaction.',
            'Verbal communication: Speak clearly and at a moderate pace. Avoid talking over background noise when possible. Do not shout at a guest with a hearing impairment — instead, face them directly so they can lip-read, or use written notes. Never finish sentences for a guest who stutters or has a speech impairment — wait patiently.',
            'Non-verbal communication: Maintain natural eye contact. Get to the same eye level when speaking to a wheelchair user for extended conversations (crouch or sit). A relaxed, open posture signals that you are approachable and not rushing the interaction.',
            'The CARER framework for communicating with diverse guests: **C**heck (ask what the guest needs, never assume); **A**dapt (adjust your communication style to them); **R**espect (honour their independence and choices); **E**ngage (actively include them in the conversation); **R**eview (follow up to ensure their needs were met).',
            'Communicating with guests with cognitive disabilities: Use simple, clear language. Break information into small steps. Avoid jargon. Be patient with slow responses. Offer written instructions or visual guides where possible. Never express impatience — even non-verbally.',
            'Digital accessibility reminders for your business: Ensure your website, booking forms, and menus are available in accessible formats. Offer large-print menus on request. Consider QR-code based audio descriptions for menus and signage.',
        ],
    },
    '3': {
        title: 'Module 3: Assisting with Mobility',
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1587370560942-1e5b121fb65a?auto=format&fit=crop&q=80',
        content: [
            'Mobility assistance, when done correctly and respectfully, can transform a guest\'s experience from stressful to seamless. This module covers practical techniques and important safety considerations.',
            'Understanding mobility aids: A wheelchair, walking frame, cane, or crutch is a personal and functional extension of the person using it. Never move, lean on, or hold onto any mobility aid without explicit permission. Always store mobility aids where the user can see and reach them.',
            'Guiding a wheelchair user: Position yourself *beside* the user (not behind, unless pushing). Always ask "Would you like assistance?" before taking any action. When pushing, warn the user before any movement — especially on ramps, kerbs, or uneven ground. Tilt backwards slightly to navigate kerbs; do not tip forward. Slow down before and after inclines.',
            'Accessible routes — your venue knowledge: Every staff member should know the step-free routes through your venue. Know where ramps, lifts, and accessible bathrooms are. Know the widths of key doorways. This information should be second nature — guests should never have to search for it.',
            'Practical drills for your team: Conduct a "mobility audit" of your venue. Identify any pinch points or inaccessible areas and report them. Practice guiding a colleague in a wheelchair through your space. Simulate the experience from the seated perspective to build empathy and spatial awareness.',
            'Emergency procedures: Know your venue\'s accessible evacuation plan. In a fire or emergency, mobility aid users may need dedicated assistance. Identify refuge areas (safe waiting spaces near fire exits). Never use a lift during a fire evacuation — use designated evacuation chairs if available.',
        ],
    },
};

export default function TrainingModulePage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProgress, setUserProgress] = useState<Record<string, string>>({});
    const [completing, setCompleting] = useState(false);
    const [allComplete, setAllComplete] = useState(false);

    const moduleData = MODULE_CONTENT[moduleId];

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { setNotLoggedIn(true); setLoading(false); return; }
            setCurrentUser(session.user);

            // Fetch all progress for this user
            const { data } = await supabase
                .from('user_training_progress')
                .select('module_id, status')
                .eq('user_id', session.user.id);

            const progressMap: Record<string, string> = {};
            (data || []).forEach((p: any) => { progressMap[p.module_id] = p.status; });
            setUserProgress(progressMap);
            setAllComplete(Object.keys(MODULE_CONTENT).every(id => progressMap[id] === 'completed'));
            setLoading(false);
        };
        init();
    }, [moduleId]);

    const handleMarkComplete = async () => {
        if (!currentUser || !moduleData) return;
        setCompleting(true);
        try {
            await supabase.from('user_training_progress').upsert({
                user_id: currentUser.id,
                module_id: moduleId,
                status: 'completed',
            }, { onConflict: 'user_id,module_id' });

            const newProgress = { ...userProgress, [moduleId]: 'completed' };
            setUserProgress(newProgress);
            const nowAllComplete = Object.keys(MODULE_CONTENT).every(id => newProgress[id] === 'completed');
            setAllComplete(nowAllComplete);
        } catch (err) {
            console.error('Failed to mark complete:', err);
        } finally {
            setCompleting(false);
        }
    };

    const isCompleted = userProgress[moduleId] === 'completed';
    const totalModules = Object.keys(MODULE_CONTENT).length;
    const completedCount = Object.values(userProgress).filter(v => v === 'completed').length;

    // Check if this module is locked (previous module not complete)
    const moduleIndex = parseInt(moduleId);
    const previousId = String(moduleIndex - 1);
    const isLocked = moduleIndex > 1 && userProgress[previousId] !== 'completed';

    const nextModuleId = String(moduleIndex + 1);
    const hasNext = !!MODULE_CONTENT[nextModuleId];

    if (notLoggedIn) return (
        <LoginGate
            message="Please log in to access the Training Academy."
            subMessage="Track your progress, complete modules, and earn your certificate."
        />
    );

    if (loading) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Loading Module...
        </div>
    );

    if (!moduleData) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500 mb-4">Module not found.</p>
                <Link href="/training" className="text-hotel-bronze font-bold hover:underline">← Back to Training</Link>
            </div>
        </div>
    );

    if (isLocked) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center">
            <div className="text-center px-6">
                <Lock size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-hotel-black mb-3">Module Locked</h2>
                <p className="text-gray-500 mb-6">Complete the previous module to unlock this one.</p>
                <Link href="/training" className="text-hotel-bronze font-bold hover:underline">← Back to Training</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-hotel-cream font-sans text-hotel-black pb-24">
            {/* Header */}
            <div className="relative h-64 w-full">
                <img src={moduleData.image} alt={moduleData.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-hotel-black/70" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:px-12">
                    <Link href="/training" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold transition">
                        <ArrowLeft size={14} /> Training Portal
                    </Link>
                    <div>
                        <p className="text-hotel-bronze text-xs uppercase tracking-widest font-bold mb-2">Module {moduleId} of {totalModules}</p>
                        <h1 className="font-serif text-3xl md:text-4xl text-white">{moduleData.title}</h1>
                        <p className="text-white/50 text-sm mt-1">{moduleData.duration} read</p>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-hotel-black px-6 md:px-12 py-3 flex items-center gap-4">
                <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-hotel-bronze h-full rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / totalModules) * 100}%` }}
                    />
                </div>
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest shrink-0">{completedCount}/{totalModules} Complete</span>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 md:px-0 py-12 space-y-8">

                {isCompleted && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-sm text-sm font-bold">
                        <CheckCircle2 size={18} /> You have completed this module.
                    </div>
                )}

                {moduleData.content.map((paragraph, i) => (
                    <div key={i} className="bg-white border border-hotel-sand/50 rounded-sm p-6 md:p-8">
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                    </div>
                ))}

                {/* Certificate display if all done */}
                {allComplete && (
                    <div className="bg-hotel-black text-white p-10 rounded-sm text-center shadow-xl border-4 border-hotel-bronze">
                        <Award size={64} className="text-hotel-bronze mx-auto mb-4" />
                        <h2 className="font-serif text-3xl mb-3">Congratulations!</h2>
                        <p className="text-white/60 mb-6">You have completed all modules in the ExplorAble Inclusive Hospitality Training Programme.</p>
                        <Link href="/training/certificate" className="inline-block bg-hotel-bronze text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-hotel-black transition-colors rounded-sm">
                            View & Download Certificate
                        </Link>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {!isCompleted && (
                        <button
                            onClick={handleMarkComplete}
                            disabled={completing}
                            className="flex items-center justify-center gap-3 bg-hotel-black text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm disabled:opacity-50"
                        >
                            {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            {completing ? 'Saving...' : 'Mark as Complete'}
                        </button>
                    )}
                    {hasNext && isCompleted && (
                        <Link href={`/training/${nextModuleId}`}
                            className="flex items-center justify-center gap-2 bg-hotel-bronze text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-hotel-black transition-colors rounded-sm">
                            Next Module <ChevronRight size={16} />
                        </Link>
                    )}
                    <Link href="/training"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-500 px-8 py-4 text-xs uppercase tracking-widest font-bold hover:border-hotel-black hover:text-hotel-black transition-colors rounded-sm">
                        Back to All Modules
                    </Link>
                </div>
            </main>
        </div>
    );
}
