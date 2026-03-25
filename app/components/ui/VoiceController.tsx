"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Mic, MicOff, Activity } from 'lucide-react';

export default function VoiceController() {
    const router = useRouter();
    const pathname = usePathname();

    const [isListening, setIsListening] = useState(false);
    const [transcriptDisplay, setTranscriptDisplay] = useState("Click mic to start");
    const [commandTriggered, setCommandTriggered] = useState("");
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setTranscriptDisplay("Speech API Not Supported");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscriptDisplay("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
            setTranscriptDisplay("Click mic to start");
        };

        recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const text = result[0].transcript.toLowerCase().trim();

            setTranscriptDisplay(text);

            if (result.isFinal) {
                processCommand(text);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [pathname]); // Re-bind on route change just to be safe with router context

    // Command Logic (Expanded for Phase 3)
    const processCommand = (text: string) => {
        // Scrolling
        if (text.includes('scroll') && text.includes('down')) {
            triggerVisual('Scrolling Down');
            window.scrollBy({ top: 600, behavior: 'smooth' });
        }
        else if (text.includes('scroll') && text.includes('up')) {
            triggerVisual('Scrolling Up');
            window.scrollBy({ top: -600, behavior: 'smooth' });
        }
        // Navigation Base
        else if (text.includes('go home') || text.includes('home page')) {
            triggerVisual('Opening Home');
            router.push('/');
        }
        else if (text.includes('explore') || text.includes('venues')) {
            triggerVisual('Opening Explore');
            router.push('/explore');
        }
        else if (text.includes('login') || text.includes('partner')) {
            triggerVisual('Opening Login');
            router.push('/login');
        }
        // Navigation Phase 2 Pages
        else if (text.includes('training') || text.includes('academy')) {
            triggerVisual('Opening Training');
            router.push('/training');
        }
        else if (text.includes('innovation') || text.includes('tools')) {
            triggerVisual('Opening Innovation');
            router.push('/innovation');
        }
        else if (text.includes('community') || text.includes('forum')) {
            triggerVisual('Opening Community');
            router.push('/community');
        }
        else if (text.includes('news') || text.includes('updates')) {
            triggerVisual('Opening News');
            router.push('/news');
        }
    };

    const triggerVisual = (msg: string) => {
        setCommandTriggered(msg);
        setTimeout(() => setCommandTriggered(""), 2500);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <>
            {/* FLASH FEEDBACK UI */}
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none transition-all duration-300 ${commandTriggered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-hotel-bronze text-white px-10 py-6 rounded-sm shadow-2xl border border-white/20 flex flex-col items-center gap-3">
                    <Activity size={32} className="animate-pulse" />
                    <div className="text-xl font-serif font-bold uppercase tracking-widest text-center">{commandTriggered}</div>
                </div>
            </div>

            {/* MIC BUTTON TOGGLE UI */}
            <button
                onClick={toggleListening}
                className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 hover:scale-105 border border-white/10 text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl cursor-pointer
          ${isListening ? 'bg-hotel-black' : 'bg-stone-800'}`}
                aria-label="Voice Commands"
            >
                <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex flex-col items-start w-32 hidden sm:flex">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                        {isListening ? "Voice Active" : "Voice Off"}
                    </span>
                    <div className="h-4 overflow-hidden w-full relative">
                        <span className={`text-xs font-serif whitespace-nowrap absolute ${isListening ? 'text-hotel-bronze' : 'text-gray-400'}`}>
                            {transcriptDisplay}
                        </span>
                    </div>
                </div>
                {isListening ? <Activity size={18} className="text-hotel-bronze hidden sm:block" /> : <MicOff size={18} className="text-gray-500 hidden sm:block" />}
                <Mic size={20} className="sm:hidden text-white" />
            </button>
        </>
    );
}
