"use client";

import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';

export default function VoiceController() {
    const router = useRouter();
    const [commandTriggered, setCommandTriggered] = useState("");
    const [isClient, setIsClient] = useState(false);
    // Set on mount — UA-based detection runs only client-side
    const [unsupportedMsg, setUnsupportedMsg] = useState("");

    useEffect(() => {
        setIsClient(true);
        const ua = navigator.userAgent;
        // Vivaldi and plain Chromium on Linux ship without Google's speech API keys.
        // They expose the API but it fails with "network" on every call.
        if (ua.includes('Vivaldi')) {
            setUnsupportedMsg('Voice requires Google Chrome — not supported in Vivaldi');
        } else if (ua.includes('Firefox') && !ua.includes('Chrome')) {
            setUnsupportedMsg('Voice requires Google Chrome — not supported in Firefox');
        }
    }, []);

    const triggerVisual = (msg: string) => {
        setCommandTriggered(msg);
        setTimeout(() => setCommandTriggered(""), 2500);
    };

    const nav = (path: string, label: string) => {
        triggerVisual(label);
        router.push(path);
    };

    // react-speech-recognition command list — isFuzzyMatch means partial phrase matching
    const commands = [
        { command: ['scroll down', 'go down', 'move down'], callback: () => { triggerVisual('Scrolling Down'); window.scrollBy({ top: 600, behavior: 'smooth' }); }, isFuzzyMatch: true },
        { command: ['scroll up', 'go up', 'move up'],       callback: () => { triggerVisual('Scrolling Up');   window.scrollBy({ top: -600, behavior: 'smooth' }); }, isFuzzyMatch: true },
        { command: ['go home', 'home page', 'go to home', 'home'],    callback: () => nav('/', 'Opening Home'),         isFuzzyMatch: true },
        { command: ['explore', 'explore venues', 'venues'],            callback: () => nav('/explore', 'Opening Explore'), isFuzzyMatch: true },
        { command: ['training', 'training academy', 'academy'],        callback: () => nav('/training', 'Opening Training'), isFuzzyMatch: true },
        { command: ['innovation', 'innovation hub', 'tools'],          callback: () => nav('/innovation', 'Opening Innovation'), isFuzzyMatch: true },
        { command: ['community', 'community forum', 'forum'],          callback: () => nav('/community', 'Opening Community'), isFuzzyMatch: true },
        { command: ['news', 'latest news', 'updates'],                 callback: () => nav('/news', 'Opening News'),     isFuzzyMatch: true },
        { command: ['contact', 'contact us'],                          callback: () => nav('/contact', 'Opening Contact'), isFuzzyMatch: true },
        { command: ['login', 'sign in', 'log in'],                     callback: () => nav('/login', 'Opening Login'),   isFuzzyMatch: true },
        { command: ['dashboard', 'my dashboard'],                      callback: () => nav('/dashboard', 'Opening Dashboard'), isFuzzyMatch: true },
    ];

    const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

    // Don't render anything server-side (Speech API is browser-only)
    if (!isClient) return null;

    const errorMsg = unsupportedMsg || (!browserSupportsSpeechRecognition ? 'Voice requires Google Chrome' : '');
    const isDisabled = !!errorMsg;

    const toggle = () => {
        if (isDisabled) return;
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
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
                onClick={toggle}
                disabled={isDisabled}
                className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 border border-white/10 text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-2xl
                    ${isDisabled ? 'bg-stone-900 cursor-not-allowed opacity-80' : listening ? 'bg-hotel-black hover:scale-105 cursor-pointer' : 'bg-stone-800 hover:scale-105 cursor-pointer'}`}
                aria-label="Voice Commands"
            >
                {/* Status dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0
                    ${isDisabled ? 'bg-gray-600' : listening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                />

                {/* Text panel — desktop only */}
                <div className="hidden sm:flex flex-col items-start w-44">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                        {isDisabled ? 'Not Available' : listening ? 'Voice Active' : 'Voice Off'}
                    </span>
                    {errorMsg ? (
                        <span className="text-[10px] text-yellow-400 leading-tight">{errorMsg}</span>
                    ) : (
                        <span className={`text-xs font-serif truncate w-full ${listening ? 'text-hotel-bronze' : 'text-gray-400'}`}>
                            {listening ? (transcript || 'Listening…') : 'Click mic to start'}
                        </span>
                    )}
                </div>

                {/* Icon */}
                {isDisabled
                    ? <AlertCircle size={18} className="text-yellow-400 hidden sm:block" />
                    : listening
                        ? <Activity size={18} className="text-hotel-bronze hidden sm:block" />
                        : <MicOff size={18} className="text-gray-500 hidden sm:block" />
                }
                <Mic size={20} className="sm:hidden text-white" />
            </button>
        </>
    );
}
