"use client";

import Link from 'next/link';
import { BookOpen, Award, PlayCircle, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TrainingPortal() {
 const staticModules = [
 {
 id: '1',
 title:"Module 1: Foundations of Awareness",
 duration:"45 mins",
 description:"Understanding different types of disabilities and basic etiquette in hospitality.",
 image:"https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80"
 },
 {
 id: '2',
 title:"Module 2: Communicating with Care",
 duration:"60 mins",
 description:"Best practices for respectful and effective communication with diverse guests.",
 image:"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80"
 },
 {
 id: '3',
 title:"Module 3: Assisting with Mobility",
 duration:"45 mins",
 description:"Practical scenarios: guiding, using equipment safely, and spatial awareness.",
 image:"https://images.unsplash.com/photo-1587370560942-1e5b121fb65a?auto=format&fit=crop&q=80"
 }
 ];

 const [loading, setLoading] = useState(true);
 const [userProgress, setUserProgress] = useState<Record<string, string>>({});
 const [currentUser, setCurrentUser] = useState<any>(null);

 useEffect(() => {
   const init = async () => {
     const { data: { session } } = await supabase.auth.getSession();
     setCurrentUser(session?.user || null);

     if (session?.user) {
       // Load from localStorage immediately (works without DB table)
       const localKey = `training_progress_${session.user.id}`;
       const localData: Record<string, string> = JSON.parse(localStorage.getItem(localKey) || '{}');
       setUserProgress(localData);

       // Supplement from Supabase if the table exists
       const { data } = await supabase
         .from('user_training_progress')
         .select('module_id, status')
         .eq('user_id', session.user.id);
       if (data && data.length > 0) {
         const merged: Record<string, string> = { ...localData };
         data.forEach((p: any) => { merged[p.module_id] = p.status; });
         localStorage.setItem(localKey, JSON.stringify(merged));
         setUserProgress(merged);
       }
     }
     setLoading(false);
   };
   init();
 }, []);

 const getStatus = (id: string) => {
   if (userProgress[id] === 'completed') return 'completed';
   const idx = parseInt(id);
   if (idx === 1) return 'in-progress';
   if (userProgress[String(idx - 1)] === 'completed') return 'in-progress';
   return 'locked';
 };

 const completedCount = Object.values(userProgress).filter(v => v === 'completed').length;
 const totalModules = staticModules.length;
 const progressPct = Math.round((completedCount / totalModules) * 100);
 const allComplete = completedCount === totalModules;

 if (loading) return <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze">Loading Training...</div>;

 return (
 <div className="min-h-screen bg-hotel-cream text-hotel-black font-sans selection:bg-hotel-black selection:text-white pb-32">

 {/* Hero Section */}
 <section className="relative bg-hotel-black text-white pt-12 pb-40 px-6 border-b-8 border-hotel-bronze overflow-hidden">
 <div className="absolute inset-0 opacity-20">
 <Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" alt="Training" fill className="object-cover" priority />
 </div>
 <div className="relative z-10 max-w-5xl mx-auto text-center">
 <div className="inline-flex items-center justify-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-white/10">
 <BookOpen size={16} className="text-hotel-bronze" />
 <span className="text-[10px] uppercase tracking-widest font-bold">ExplorAble Academy</span>
 </div>
 <h1 className="font-serif text-5xl md:text-7xl mb-6">Inclusive Hospitality <br /><span className="italic text-hotel-bronze font-light">Training</span></h1>
 <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
 Equipping your staff with the knowledge and empathy to deliver world-class service to every guest.
 </p>
 </div>
 </section>

 {/* Main Content Area */}
 <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">

 {/* Certification Highlight */}
 <div className="bg-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10 mb-20">
 <div className="flex-shrink-0 relative">
 <div className="w-32 h-32 bg-hotel-sand/30 rounded-full flex items-center justify-center ring-8 ring-hotel-cream">
 <Award size={64} className="text-hotel-bronze" />
 </div>
 <div className="absolute -bottom-4 -right-4 bg-hotel-black text-white px-4 py-1 text-xs uppercase tracking-widest font-bold rotate-[-10deg] shadow-lg">
 Official
 </div>
 </div>
 <div className="flex-1 text-center md:text-left">
 <h2 className="font-serif text-3xl mb-3">Earn the ExplorAble Certificate</h2>
 <p className="text-gray-500 font-light mb-6">Complete all modules and pass the final assessment to earn a verifiable digital badge for your establishment.</p>
 <div className="w-full bg-hotel-sand h-2 rounded-full overflow-hidden">
 <div className="bg-hotel-bronze h-full transition-all duration-700" style={{ width: `${progressPct}%` }}></div>
 </div>
 <div className="flex justify-between items-center mt-3">
   <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{completedCount} of {totalModules} Modules Complete</p>
   <p className="text-xs text-hotel-bronze uppercase tracking-widest font-bold">{progressPct}%</p>
 </div>
 {allComplete && (
   <Link href="/training/certificate" className="mt-4 inline-block bg-hotel-bronze text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-black transition-colors rounded-sm">
     View Certificate →
   </Link>
 )}
 {!currentUser && (
   <p className="mt-4 text-xs text-gray-400"><Link href="/login" className="text-hotel-bronze font-bold hover:underline">Log in</Link> to track your progress.</p>
 )}
 </div>
 </div>

 {/* Modules List */}
 <div className="mb-16">
 <h2 className="font-serif text-3xl text-hotel-black mb-10 flex items-center">
 Course Curriculum
 <span className="ml-4 h-px flex-1 bg-hotel-sand"></span>
 </h2>

 <div className="space-y-6">
 {staticModules.map((module) => {
   const status = getStatus(module.id);
   return (
 <div key={module.id} className={`flex flex-col md:flex-row bg-white border ${status === 'in-progress' ? 'border-hotel-bronze shadow-lg' : 'border-hotel-sand shadow-sm'} transition-all duration-300`}>

 {/* Image Area */}
 <div className="w-full md:w-64 h-48 md:h-auto relative">
 <Image src={module.image} alt={module.title} fill className={`object-cover ${status === 'locked' ? 'grayscale opacity-50' : ''}`} />
 {status === 'completed' && (
 <div className="absolute inset-0 bg-hotel-black/40 flex items-center justify-center">
 <CheckCircle2 size={48} className="text-white" />
 </div>
 )}
 </div>

 {/* Content Area */}
 <div className="flex-1 p-8 flex flex-col justify-between">
 <div>
 <div className="flex justify-between items-start mb-2">
 <h3 className={`font-serif text-2xl ${status === 'locked' ? 'text-gray-400' : 'text-hotel-black'}`}>
 {module.title}
 </h3>
 <span className="text-xs uppercase tracking-widest text-hotel-bronze font-bold bg-hotel-cream px-3 py-1 rounded-sm">
 {module.duration}
 </span>
 </div>
 <p className={`font-light mb-6 ${status === 'locked' ? 'text-gray-300' : 'text-gray-500'}`}>
 {module.description}
 </p>
 </div>

 {/* Action Button */}
 <div>
 {status === 'completed' && (
 <Link href={`/training/${module.id}`} className="flex items-center text-xs uppercase tracking-widest text-gray-400 font-bold hover:text-hotel-black transition-colors">
   Review Material <ChevronRight size={14} className="ml-1" />
 </Link>
 )}
 {status === 'in-progress' && (
 <Link href={`/training/${module.id}`} className="inline-flex items-center bg-hotel-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors">
 <PlayCircle size={16} className="mr-2" /> {completedCount === 0 && module.id === '1' ? 'Start Course' : 'Continue Course'}
 </Link>
 )}
 {status === 'locked' && (
 <div className="flex items-center text-xs uppercase tracking-widest text-gray-300 font-bold">
 <Lock size={14} className="mr-2" /> Locked — Complete previous module first
 </div>
 )}
 </div>
 </div>
 </div>
   );
 })}
 </div>
 </div>

 </main>
 </div>
 );
}
