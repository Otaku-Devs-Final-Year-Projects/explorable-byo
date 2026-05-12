"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Activity } from 'lucide-react';

// Works in: Google Chrome, Microsoft Edge, Brave (shields down)
// Network errors on: Vivaldi/Chromium Linux (no Google API keys bundled)
export default function VoiceController() {
    const router = useRouter();

    const [isListening, setIsListening] = useState(false);
    const [label, setLabel] = useState("Click mic to start");
    const [commandFired, setCommandFired] = useState("");

    const recRef = useRef<any>(null);
    const wantsOnRef = useRef(false);
    const restartRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
            setLabel("Not supported — use Chrome or Edge");
            return;
        }

        const r = new SR();
        r.continuous = true;
        r.interimResults = true;
        r.lang = 'en-US';

        r.onstart = () => {
            setIsListening(true);
            setLabel("Listening…");
        };

        r.onend = () => {
            // Auto-restart if user still wants it on (handles Chrome's silent timeouts)
            if (wantsOnRef.current) {
                restartRef.current = setTimeout(() => {
                    if (wantsOnRef.current) try { r.start(); } catch (_) {}
                }, 200);
            }
        };

        r.onerror = (e: any) => {
            const friendly: Record<string, string> = {
                'not-allowed':         'Mic permission denied — check browser settings',
                'audio-capture':       'No microphone found',
                'service-not-allowed': 'Speech service blocked — try Google Chrome',
                'network':             'Network error — try Google Chrome or lower Brave Shields',
            };
            setLabel(friendly[e.error] || `Error: ${e.error}`);
            // Only hard-stop on unrecoverable errors
            if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(e.error)) {
                wantsOnRef.current = false;
                setIsListening(false);
            }
            // network errors: leave wantsOnRef true — onend will keep retrying
        };

        r.onresult = (e: any) => {
            const res = e.results[e.results.length - 1];
            const txt = res[0].transcript.toLowerCase().trim();
            setLabel(txt); // Show live transcript so user can see what was heard
            if (res.isFinal) handleCommand(txt);
        };

        recRef.current = r;
        return () => {
            wantsOnRef.current = false;
            if (restartRef.current) clearTimeout(restartRef.current);
            try { r.abort(); } catch (_) {}
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCommand = (txt: string) => {
        const fire = (msg: string, fn: () => void) => {
            setCommandFired(msg);
            setTimeout(() => setCommandFired(""), 2500);
            fn();
        };
        if (txt.includes('scroll down') || txt.includes('go down'))           return fire('Scrolling Down',      () => window.scrollBy({ top: 600, behavior: 'smooth' }));
        if (txt.includes('scroll up')   || txt.includes('go up'))             return fire('Scrolling Up',        () => window.scrollBy({ top: -600, behavior: 'smooth' }));
        if (txt.includes('go home')     || txt.includes('home page') || txt.includes('go to home')) return fire('Going Home',  () => router.push('/'));
        if (txt.includes('explore')     || txt.includes('venues'))            return fire('Opening Explore',     () => router.push('/explore'));
        if (txt.includes('community')   || txt.includes('forum'))             return fire('Opening Community',   () => router.push('/community'));
        if (txt.includes('training')    || txt.includes('academy'))           return fire('Opening Training',    () => router.push('/training'));
        if (txt.includes('innovation')  || txt.includes('tools'))             return fire('Opening Innovation',  () => router.push('/innovation'));
        if (txt.includes('news')        || txt.includes('updates'))           return fire('Opening News',        () => router.push('/news'));
        if (txt.includes('contact'))                                           return fire('Opening Contact',     () => router.push('/contact'));
        if (txt.includes('login')       || txt.includes('sign in'))           return fire('Opening Login',       () => router.push('/login'));
        if (txt.includes('dashboard'))                                         return fire('Opening Dashboard',   () => router.push('/dashboard'));
    };

    const toggle = () => {
        if (!recRef.current) return;
        if (wantsOnRef.current) {
            wantsOnRef.current = false;
            if (restartRef.current) clearTimeout(restartRef.current);
            setIsListening(false);
            setLabel("Click mic to start");
            try { recRef.current.abort(); } catch (_) {}
        } else {
            wantsOnRef.current = true;
            setIsListening(true);
            setLabel("Starting…");
            try { recRef.current.start(); } catch (_) {}
        }
    };

    return (
        <>
            {/* COMMAND FLASH OVERLAY */}
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none transition-all duration-300 ${commandFired ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-hotel-bronze text-white px-10 py-6 rounded-sm shadow-2xl border border-white/20 flex flex-col items-center gap-3">
                    <Activity size={32} className="animate-pulse" />
                    <div className="text-xl font-serif font-bold uppercase tracking-widest text-center">{commandFired}</div>
                </div>
            </div>

            {/* MIC BUTTON */}
            <button
                onClick={toggle}
                className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 hover:scale-105 border border-white/10 text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl cursor-pointer ${isListening ? 'bg-hotel-black' : 'bg-stone-800'}`}
                aria-label="Voice Commands"
            >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />

                <div className="hidden sm:flex flex-col items-start w-44">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                        {isListening ? 'Voice Active' : 'Voice Off'}
                    </span>
                    <span className={`text-xs font-serif truncate w-full ${isListening ? 'text-hotel-bronze' : 'text-gray-400'}`}>
                        {label}
                    </span>
                </div>

                {isListening
                    ? <Activity size={18} className="text-hotel-bronze hidden sm:block" />
                    : <MicOff size={18} className="text-gray-500 hidden sm:block" />
                }
                <Mic size={20} className="sm:hidden text-white" />
            </button>
        </>
    );
}
