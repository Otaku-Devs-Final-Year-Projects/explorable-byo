"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';

export default function VoiceController() {
    const router = useRouter();

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [commandTriggered, setCommandTriggered] = useState("");

    const recognitionRef = useRef<any>(null);
    const isActiveRef = useRef(false);
    const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const networkErrorCountRef = useRef(0);

    // Detect browsers that lack Google's bundled speech API keys
    const getBrowserWarning = (): string => {
        if (typeof navigator === 'undefined') return '';
        const ua = navigator.userAgent;
        if (ua.includes('Vivaldi')) return 'Vivaldi does not support speech recognition — open in Google Chrome';
        if (ua.includes('Firefox')) return 'Firefox does not support speech recognition — open in Google Chrome';
        if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera does not support speech recognition — open in Google Chrome';
        return '';
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        const browserWarning = getBrowserWarning();
        if (browserWarning) {
            setErrorMsg(browserWarning);
            return;
        }

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setErrorMsg("Speech API not supported — use Google Chrome");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setErrorMsg("");
            setTranscript("Listening…");
        };

        recognition.onend = () => {
            if (isActiveRef.current) {
                restartTimerRef.current = setTimeout(() => {
                    if (!isActiveRef.current) return;
                    try { recognition.start(); } catch (_) {}
                }, 150);
            }
        };

        recognition.onerror = (event: any) => {
            const err: string = event.error;
            const messages: Record<string, string> = {
                'not-allowed':            'Mic permission denied — allow mic in browser settings',
                'service-not-allowed':    'Speech service blocked — try Chrome browser',
                'audio-capture':          'No microphone found',
                'network':                '',
                'no-speech':              '',
                'aborted':                '',
                'bad-grammar':            'Grammar error',
                'language-not-supported': 'Language not supported',
            };
            const display = messages[err] ?? `Error: ${err}`;
            if (display) setErrorMsg(display);

            // Hard stop only for unrecoverable errors
            if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
                isActiveRef.current = false;
                setIsListening(false);
                setTranscript("");
                return;
            }

            // Network errors: count them. After 5 with no results, it's likely
            // a browser API keys issue (Chromium without Google keys) — stop and advise.
            if (err === 'network') {
                networkErrorCountRef.current += 1;
                if (networkErrorCountRef.current >= 5) {
                    isActiveRef.current = false;
                    setIsListening(false);
                    setTranscript("");
                    setErrorMsg('Requires Google Chrome — open site in Chrome to use voice');
                }
            }
            // no-speech and aborted are truly transient — onend restarts silently
        };

        recognition.onresult = (event: any) => {
            networkErrorCountRef.current = 0;
            setErrorMsg("");
            const result = event.results[event.results.length - 1];
            const text = result[0].transcript.toLowerCase().trim();
            setTranscript(text);
            if (result.isFinal) {
                processCommand(text);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            isActiveRef.current = false;
            if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
            try { recognition.abort(); } catch (_) {}
        };
    }, []);

    const stopListening = () => {
        isActiveRef.current = false;
        networkErrorCountRef.current = 0;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        setIsListening(false);
        setTranscript("");
        setErrorMsg("");
        try { recognitionRef.current?.abort(); } catch (_) {}
    };

    const processCommand = (text: string) => {
        if (text.includes('scroll') && text.includes('down')) {
            triggerVisual('Scrolling Down');
            window.scrollBy({ top: 600, behavior: 'smooth' });
        } else if (text.includes('scroll') && text.includes('up')) {
            triggerVisual('Scrolling Up');
            window.scrollBy({ top: -600, behavior: 'smooth' });
        } else if (text.includes('go home') || text.includes('home page') || text.includes('go to home')) {
            triggerVisual('Opening Home');
            router.push('/');
        } else if (text.includes('explore') || text.includes('venues')) {
            triggerVisual('Opening Explore');
            router.push('/explore');
        } else if (text.includes('training') || text.includes('academy')) {
            triggerVisual('Opening Training');
            router.push('/training');
        } else if (text.includes('innovation') || text.includes('tools')) {
            triggerVisual('Opening Innovation');
            router.push('/innovation');
        } else if (text.includes('community') || text.includes('forum')) {
            triggerVisual('Opening Community');
            router.push('/community');
        } else if (text.includes('news') || text.includes('updates')) {
            triggerVisual('Opening News');
            router.push('/news');
        } else if (text.includes('contact')) {
            triggerVisual('Opening Contact');
            router.push('/contact');
        } else if (text.includes('login') || text.includes('sign in')) {
            triggerVisual('Opening Login');
            router.push('/login');
        } else if (text.includes('dashboard')) {
            triggerVisual('Opening Dashboard');
            router.push('/dashboard');
        }
    };

    const triggerVisual = (msg: string) => {
        setCommandTriggered(msg);
        setTimeout(() => setCommandTriggered(""), 2500);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isActiveRef.current) {
            stopListening();
        } else {
            networkErrorCountRef.current = 0;
            isActiveRef.current = true;
            setIsListening(true);
            setTranscript("Starting…");
            setErrorMsg("");
            try { recognitionRef.current.start(); } catch (_) {}
        }
    };

    return (
        <>
            {/* COMMAND FLASH OVERLAY */}
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none transition-all duration-300 ${commandTriggered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-hotel-bronze text-white px-10 py-6 rounded-sm shadow-2xl border border-white/20 flex flex-col items-center gap-3">
                    <Activity size={32} className="animate-pulse" />
                    <div className="text-xl font-serif font-bold uppercase tracking-widest text-center">{commandTriggered}</div>
                </div>
            </div>

            {/* MIC BUTTON */}
            <button
                onClick={toggleListening}
                className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 hover:scale-105 border border-white/10 text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl cursor-pointer ${isListening ? 'bg-hotel-black' : 'bg-stone-800'}`}
                aria-label="Voice Commands"
            >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isListening ? 'bg-green-500 animate-pulse' : errorMsg ? 'bg-yellow-400' : 'bg-red-500'}`} />

                <div className="hidden sm:flex flex-col items-start w-40">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                        {isListening ? 'Voice Active' : 'Voice Off'}
                    </span>
                    {errorMsg ? (
                        <span className="text-[10px] text-yellow-400 leading-tight">{errorMsg}</span>
                    ) : (
                        <span className={`text-xs font-serif truncate w-full ${isListening ? 'text-hotel-bronze' : 'text-gray-400'}`}>
                            {isListening ? (transcript || 'Listening…') : 'Click mic to start'}
                        </span>
                    )}
                </div>

                {isListening
                    ? <Activity size={18} className="text-hotel-bronze hidden sm:block" />
                    : errorMsg
                        ? <AlertCircle size={18} className="text-yellow-400 hidden sm:block" />
                        : <MicOff size={18} className="text-gray-500 hidden sm:block" />
                }
                <Mic size={20} className="sm:hidden text-white" />
            </button>
        </>
    );
}
